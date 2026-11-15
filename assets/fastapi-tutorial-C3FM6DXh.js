const e=`---
id: fastapi-tutorial
title: Tutorial: REST-API mit Python & FastAPI
area: backend
difficulty: fortgeschritten
minutes: 20
order: 15
summary: Eine typisierte API mit FastAPI und Pydantic – automatische Validierung und OpenAPI-Doku, Dependency Injection, Datenbank mit SQLAlchemy, Tests mit pytest und Deployment.
tags: [Python, FastAPI, Pydantic, REST, Tutorial, SQLAlchemy]
related: [rest-api-design, node-express-api, orm-migrationen, testing]
---

## Warum FastAPI?

[FastAPI](#/tech/fastapi) nutzt Pythons Type Hints für drei Dinge gleichzeitig: **Validierung** der Eingaben (über Pydantic), **Serialisierung** der Ausgaben und eine **automatisch erzeugte [[OpenAPI]]-Dokumentation** – inklusive interaktiver Testoberfläche unter \`/docs\`.

## 1. Einrichten

\`\`\`bash
uv init aufgaben-api && cd aufgaben-api      # oder: python -m venv .venv
uv add "fastapi[standard]" sqlalchemy
uv add --dev pytest httpx
\`\`\`

## 2. Die erste API

\`\`\`python title="main.py"
from fastapi import FastAPI

app = FastAPI(title="Aufgaben-API", version="1.0.0")

@app.get("/health")
def health() -> dict:
    return {"ok": True}
\`\`\`

\`\`\`bash
uv run fastapi dev main.py
# → http://127.0.0.1:8000/docs  (Swagger UI)
\`\`\`

## 3. Modelle mit Pydantic

\`\`\`python title="schemas.py"
from datetime import date, datetime
from enum import Enum
from pydantic import BaseModel, Field, ConfigDict

class Prioritaet(str, Enum):
    niedrig = "niedrig"
    normal = "normal"
    hoch = "hoch"

class AufgabeNeu(BaseModel):
    titel: str = Field(min_length=1, max_length=200)
    faellig: date | None = None
    prioritaet: Prioritaet = Prioritaet.normal

class AufgabeAendern(BaseModel):
    titel: str | None = Field(default=None, min_length=1, max_length=200)
    erledigt: bool | None = None
    prioritaet: Prioritaet | None = None

class Aufgabe(AufgabeNeu):
    model_config = ConfigDict(from_attributes=True)   # aus ORM-Objekten lesen
    id: int
    erledigt: bool
    erstellt: datetime
\`\`\`

Ungültige Eingaben beantwortet FastAPI automatisch mit **422** und einer genauen Beschreibung, welches Feld warum ungültig ist.

## 4. Datenbank mit SQLAlchemy

\`\`\`python title="db.py"
from datetime import datetime
from sqlalchemy import create_engine, String, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker, Session

engine = create_engine("sqlite:///aufgaben.db", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)

class Base(DeclarativeBase):
    pass

class AufgabeDB(Base):
    __tablename__ = "aufgaben"
    id: Mapped[int] = mapped_column(primary_key=True)
    titel: Mapped[str] = mapped_column(String(200))
    faellig: Mapped[datetime | None]
    prioritaet: Mapped[str] = mapped_column(default="normal")
    erledigt: Mapped[bool] = mapped_column(default=False)
    erstellt: Mapped[datetime] = mapped_column(server_default=func.now())

Base.metadata.create_all(engine)        # in echten Projekten: Migrationen mit Alembic

def get_session():
    with SessionLocal() as session:     # Dependency: eine Session pro Request
        yield session
\`\`\`

## 5. Endpunkte mit Dependency Injection

\`\`\`python title="main.py"
from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException, Query, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from db import AufgabeDB, get_session
from schemas import Aufgabe, AufgabeAendern, AufgabeNeu

app = FastAPI(title="Aufgaben-API")
SessionDep = Annotated[Session, Depends(get_session)]

@app.get("/api/aufgaben", response_model=list[Aufgabe])
def liste(session: SessionDep, erledigt: bool | None = None, limit: Annotated[int, Query(le=100)] = 50):
    abfrage = select(AufgabeDB).limit(limit)
    if erledigt is not None:
        abfrage = abfrage.where(AufgabeDB.erledigt == erledigt)
    return session.scalars(abfrage).all()

@app.post("/api/aufgaben", response_model=Aufgabe, status_code=status.HTTP_201_CREATED)
def anlegen(daten: AufgabeNeu, session: SessionDep):
    aufgabe = AufgabeDB(**daten.model_dump())
    session.add(aufgabe)
    session.commit()
    session.refresh(aufgabe)
    return aufgabe

@app.patch("/api/aufgaben/{aufgabe_id}", response_model=Aufgabe)
def aendern(aufgabe_id: int, daten: AufgabeAendern, session: SessionDep):
    aufgabe = session.get(AufgabeDB, aufgabe_id)
    if aufgabe is None:
        raise HTTPException(status_code=404, detail="Aufgabe nicht gefunden")
    for feld, wert in daten.model_dump(exclude_unset=True).items():   # nur gesendete Felder
        setattr(aufgabe, feld, wert)
    session.commit()
    session.refresh(aufgabe)
    return aufgabe

@app.delete("/api/aufgaben/{aufgabe_id}", status_code=status.HTTP_204_NO_CONTENT)
def loeschen(aufgabe_id: int, session: SessionDep):
    aufgabe = session.get(AufgabeDB, aufgabe_id)
    if aufgabe is None:
        raise HTTPException(status_code=404, detail="Aufgabe nicht gefunden")
    session.delete(aufgabe)
    session.commit()
    return Response(status_code=204)
\`\`\`

> [!EXPERT] Warum \`Depends\`?
> \`Depends(get_session)\` ist [[Dependency Injection]]: Der Endpunkt erzeugt seine Session nicht selbst. Im Test kann man die Abhängigkeit über \`app.dependency_overrides\` durch eine Testdatenbank ersetzen. Dasselbe Muster nutzt man für den angemeldeten Nutzer: \`user: Annotated[User, Depends(aktueller_nutzer)]\`.

> [!INFO] \`def\` oder \`async def\`?
> Synchrone Bibliotheken (wie das hier genutzte SQLAlchemy-Sync) gehören in normale \`def\`-Endpunkte – FastAPI führt sie in einem Thread-Pool aus. \`async def\` nur mit asynchronen Bibliotheken verwenden, sonst blockiert ein langsamer Aufruf die gesamte Event Loop.

## 6. Tests

\`\`\`python title="test_main.py"
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_anlegen_und_lesen():
    res = client.post("/api/aufgaben", json={"titel": "Testen"})
    assert res.status_code == 201
    aufgabe_id = res.json()["id"]
    assert client.patch(f"/api/aufgaben/{aufgabe_id}", json={"erledigt": True}).json()["erledigt"] is True

def test_validierung():
    res = client.post("/api/aufgaben", json={"titel": ""})
    assert res.status_code == 422
\`\`\`

\`\`\`bash
uv run pytest
\`\`\`

## 7. Deployment

\`\`\`docker title="Dockerfile"
FROM python:3.13-slim
WORKDIR /app
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev
COPY . .
RUN useradd -m app && chown -R app /app
USER app
EXPOSE 8000
CMD ["uv", "run", "--no-sync", "fastapi", "run", "main.py", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

Hinweis: Für maximale Reproduzierbarkeit das uv-Image auf eine feste Version pinnen. Für Produktion SQLite durch PostgreSQL ersetzen und Schemaänderungen mit [Migrationen](#/artikel/orm-migrationen) (Alembic) verwalten.

## Wie geht es weiter?

Vergleiche mit dem [Express-Tutorial](#/artikel/node-express-api), sichere die API mit [Authentifizierung](#/artikel/authentifizierung) ab und lerne mehr über [ORMs & Migrationen](#/artikel/orm-migrationen).
`;export{e as default};
