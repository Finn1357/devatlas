const e=`---
id: testing
title: Softwaretests: Unit, Integration, E2E & TDD
area: tools
difficulty: fortgeschritten
minutes: 20
order: 12
summary: Warum automatisierte Tests das Fundament für sichere Änderungen sind, welche Testarten es gibt, wie gute Tests aussehen, wie man Abhängigkeiten ersetzt und was Test-Driven Development bedeutet – mit Beispielen in pytest und Vitest.
tags: [Testing, Unit Test, Integrationstest, E2E, TDD, Mocking, pytest, Vitest]
related: [debugging, ci-cd, clean-code-solid, git-grundlagen, refactoring-code-smells]
---

## Warum testen?

Automatisierte Tests beantworten bei jeder Änderung in Sekunden die Frage: **Funktioniert noch alles?** Sie sind kein Selbstzweck, sondern ermöglichen:

- **Mutige Änderungen** – Refactoring ohne Angst, unbemerkt etwas kaputt zu machen.
- **Schnelles Feedback** – Fehler fallen auf, solange der Code noch frisch im Kopf ist.
- **Lebende Dokumentation** – Tests zeigen, wie Code gedacht ist.
- **Bessere Struktur** – schwer testbarer Code ist meist auch schwer verständlicher Code.

## Die Testpyramide

\`\`\`widget
layers:testpyramide
\`\`\`

| Testart | Prüft | Geschwindigkeit | Beispiel |
|---|---|---|---|
| **[[Unit Test]]** | eine Funktion/Klasse isoliert | Millisekunden | Berechnet \`preis_mit_rabatt\` korrekt? |
| **[[Integrationstest]]** | Zusammenspiel mit echter Datenbank, API, Dateisystem | Sekunden | Speichert der Endpunkt die Bestellung in der DB? |
| **E2E-Test** | die gesamte Anwendung aus Nutzersicht im Browser | Sekunden bis Minuten | Kann sich ein Nutzer registrieren und bestellen? |

Daneben gibt es u. a. **Contract-Tests** (halten sich Dienste an vereinbarte API-Formate?), **Lasttests** und **Sicherheitstests**.

## Ein guter Unit Test

Das **AAA-Muster** strukturiert Tests klar: **Arrange** (vorbereiten), **Act** (ausführen), **Assert** (prüfen).

\`\`\`python title="preise.py"
def preis_mit_rabatt(preis: float, rabatt_prozent: float) -> float:
    if not 0 <= rabatt_prozent <= 100:
        raise ValueError("Rabatt muss zwischen 0 und 100 liegen")
    return round(preis * (1 - rabatt_prozent / 100), 2)
\`\`\`

\`\`\`python title="test_preise.py (pytest)"
import pytest
from preise import preis_mit_rabatt

def test_rabatt_wird_abgezogen():
    # Arrange
    preis, rabatt = 100.0, 20
    # Act
    ergebnis = preis_mit_rabatt(preis, rabatt)
    # Assert
    assert ergebnis == 80.0

@pytest.mark.parametrize("preis, rabatt, erwartet", [
    (100.0, 0, 100.0),      # kein Rabatt
    (100.0, 100, 0.0),      # Grenzfall: alles gratis
    (19.99, 10, 17.99),     # Rundung
])
def test_rabatt_grenzfaelle(preis, rabatt, erwartet):
    assert preis_mit_rabatt(preis, rabatt) == erwartet

def test_ungueltiger_rabatt_wirft_fehler():
    with pytest.raises(ValueError, match="zwischen 0 und 100"):
        preis_mit_rabatt(100.0, 120)
\`\`\`

\`\`\`bash
pytest -v              # alle Tests ausführen, ausführliche Ausgabe
pytest -k rabatt       # nur Tests, deren Name "rabatt" enthält
pytest -x              # beim ersten Fehler abbrechen
\`\`\`

Dasselbe in TypeScript mit [Vitest](#/tech/vitest) (API kompatibel zu [Jest](#/tech/jest)):

\`\`\`typescript title="preise.test.ts"
import { describe, it, expect } from 'vitest';
import { preisMitRabatt } from './preise';

describe('preisMitRabatt', () => {
  it('zieht den Rabatt ab', () => {
    expect(preisMitRabatt(100, 20)).toBe(80);
  });

  it.each([
    [100, 0, 100],
    [100, 100, 0],
    [19.99, 10, 17.99],
  ])('preisMitRabatt(%d, %d) = %d', (preis, rabatt, erwartet) => {
    expect(preisMitRabatt(preis, rabatt)).toBe(erwartet);
  });

  it('wirft bei ungültigem Rabatt', () => {
    expect(() => preisMitRabatt(100, 120)).toThrow(/zwischen 0 und 100/);
  });
});
\`\`\`

### Eigenschaften guter Tests

- **Schnell** – sonst führt sie niemand aus.
- **Unabhängig** – jeder Test funktioniert allein und in beliebiger Reihenfolge.
- **Deterministisch** – gleiches Ergebnis bei jedem Lauf (keine echte Uhrzeit, kein Zufall ohne Seed, kein Netz).
- **Aussagekräftig benannt** – der Name sagt, was erwartet wird.
- **Verhalten testen, nicht Implementierung** – Tests sollten ein Refactoring überstehen.
- **Ein Grund zu scheitern** – ein Test prüft einen Sachverhalt.

> [!MISTAKE] Flaky Tests
> Tests, die mal grün, mal rot sind, ohne dass sich Code ändert, zerstören Vertrauen – irgendwann ignoriert das Team rote Builds. Typische Ursachen: feste Wartezeiten (\`sleep\`), Abhängigkeit von Reihenfolge, Uhrzeit oder externen Diensten. Ursache beheben statt „nochmal laufen lassen“.

## Abhängigkeiten ersetzen: Mocking

Wenn Code eine E-Mail sendet, eine Zahlungs-API aufruft oder die aktuelle Uhrzeit nutzt, ersetzt man diese Abhängigkeiten im Unit Test durch **Testdoubles** ([[Mocking]]):

| Art | Zweck |
|---|---|
| **Stub** | liefert vorgegebene Antworten |
| **Mock** | prüft zusätzlich, *wie* er aufgerufen wurde |
| **Fake** | vereinfachte, funktionierende Implementierung (z. B. In-Memory-Repository) |

\`\`\`python title="Abhängigkeit per Parameter übergeben – leicht testbar"
from unittest.mock import Mock

def registriere(email: str, repo, mailer) -> None:
    repo.speichere(email)
    mailer.sende(email, "Willkommen!")

def test_registrierung_sendet_willkommensmail():
    repo, mailer = Mock(), Mock()
    registriere("ada@example.com", repo, mailer)
    repo.speichere.assert_called_once_with("ada@example.com")
    mailer.sende.assert_called_once_with("ada@example.com", "Willkommen!")
\`\`\`

> [!WARNING] Nicht zu viel mocken
> Wer alles mockt, testet am Ende nur die Mocks. Mocke Grenzen nach außen (Netz, Zeit, Zahlungsanbieter), nicht deine eigene Logik. Für Datenbanken sind Integrationstests mit einer echten Datenbank – z. B. per Testcontainers in Docker – oft aussagekräftiger als ein Mock.

## Integrationstests

\`\`\`python title="FastAPI-Endpunkt mit TestClient testen"
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_produkt_anlegen_und_abrufen():
    antwort = client.post("/produkte", json={"name": "Tastatur", "preis": 49.9})
    assert antwort.status_code == 201
    produkt_id = antwort.json()["id"]

    antwort = client.get(f"/produkte/{produkt_id}")
    assert antwort.status_code == 200
    assert antwort.json()["name"] == "Tastatur"

def test_ungueltiger_preis_wird_abgelehnt():
    antwort = client.post("/produkte", json={"name": "Maus", "preis": -5})
    assert antwort.status_code == 422
\`\`\`

## E2E-Tests

\`\`\`typescript title="Playwright: Login aus Nutzersicht"
import { test, expect } from '@playwright/test';

test('Nutzer kann sich anmelden', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.getByLabel('E-Mail').fill('test@example.com');
  await page.getByLabel('Passwort').fill('ein-sicheres-testpasswort');
  await page.getByRole('button', { name: 'Anmelden' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
\`\`\`

[Playwright](#/tech/playwright) wartet automatisch, bis Elemente sichtbar und bedienbar sind – feste Wartezeiten sind nicht nötig. Selektoren über Rollen und Beschriftungen (\`getByRole\`, \`getByLabel\`) sind robuster als CSS-Klassen und prüfen nebenbei die Barrierefreiheit.

## Test-Driven Development

Bei [[TDD]] schreibt man den Test **vor** dem Code, in kurzen Zyklen:

1. **Red** – einen kleinen Test schreiben, der scheitert.
2. **Green** – gerade so viel Code schreiben, dass er besteht.
3. **Refactor** – aufräumen, während die Tests grün bleiben.

TDD erzwingt testbares Design und klare Anforderungen. Es ist kein Muss, aber besonders wertvoll bei Geschäftslogik und beim Beheben von Fehlern: **Erst einen Test schreiben, der den Bug reproduziert**, dann beheben – so kommt er nie unbemerkt zurück (Regressionstest).

## Code Coverage

[[Code Coverage]] misst, welcher Anteil des Codes bei den Tests ausgeführt wurde (\`pytest --cov\`, \`vitest --coverage\`). Nützlich, um **ungetestete Bereiche zu finden** – aber kein Qualitätsbeweis: 100 % Coverage mit Tests ohne sinnvolle Assertions sagt nichts aus. Ein feste Quote als Ziel führt oft zu wertlosen Tests.

## Tests in der Pipeline

Tests entfalten ihren Wert, wenn sie **bei jedem Push automatisch** laufen und ein roter Test das Mergen verhindert – siehe [CI/CD](#/artikel/ci-cd). Wenn ein Test scheitert, hilft [Debugging](#/artikel/debugging) beim Finden der Ursache.
`;export{e as default};
