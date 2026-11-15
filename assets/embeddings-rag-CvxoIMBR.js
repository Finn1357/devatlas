const e=`---
id: embeddings-rag
title: Embeddings, Vektordatenbanken & RAG
area: ki
difficulty: fortgeschritten
minutes: 18
order: 12
summary: Wie Text zu Vektoren wird, wie semantische Suche funktioniert und wie Retrieval-Augmented Generation Sprachmodelle mit eigenen, aktuellen Dokumenten verbindet – inklusive typischer Fehlerquellen.
tags: [Embeddings, Vektordatenbank, RAG, Semantische Suche, pgvector]
related: [llm-grundlagen, tool-calling-agents-mcp, nosql]
---

## Das Problem

Ein Sprachmodell kennt nur, was in seinen Trainingsdaten stand – bis zu einem Stichtag, und ohne deine internen Dokumente. Alle Unterlagen in jede Anfrage zu kopieren, ist zu teuer und überschreitet schnell das [[Kontextfenster]]. Die Lösung: **Nur die relevanten Abschnitte finden und mitschicken.** Dafür braucht es eine Suche, die nach **Bedeutung** statt nach exakten Wörtern sucht.

## Embeddings

Ein **[[Embedding]]** ist eine Liste von Zahlen (ein Vektor, typischerweise einige Hundert bis wenige Tausend Dimensionen), die die Bedeutung eines Textes repräsentiert. Ein Embedding-Modell ist so trainiert, dass **ähnliche Bedeutungen nahe beieinander** liegen:

\`\`\`text
„Wie setze ich mein Passwort zurück?“     → [0.12, -0.48, 0.33, …]
„Passwort vergessen – was tun?“            → [0.11, -0.45, 0.35, …]   ← sehr nah
„Öffnungszeiten der Kantine“               → [-0.62, 0.20, -0.08, …]  ← weit weg
\`\`\`

Die Nähe misst man meist mit der **[[Kosinus-Ähnlichkeit]]** – dem Winkel zwischen zwei Vektoren:

\`\`\`python
import numpy as np

def kosinus(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))
\`\`\`

> [!BEGINNER]
> Stell dir eine Landkarte vor, auf der jeder Satz einen Ort hat. Sätze über Passwörter liegen alle im selben Viertel, Sätze über die Kantine ganz woanders. Suchen heißt: Den Ort der Frage bestimmen und schauen, welche Sätze in der Nähe wohnen.

## Vektordatenbanken

Bei Millionen Abschnitten kann man nicht jeden Vektor mit der Frage vergleichen. **[[Vektordatenbank|Vektordatenbanken]]** nutzen Indizes für die *ungefähre* nächste-Nachbarn-Suche (ANN, z. B. HNSW), die in Millisekunden die ähnlichsten Vektoren findet.

| Option | Typ |
|---|---|
| **pgvector** | Erweiterung für PostgreSQL – Vektoren neben normalen Daten, mit SQL und Transaktionen |
| Qdrant, Weaviate, Milvus, Chroma | spezialisierte (Open-Source-)Vektordatenbanken |
| Pinecone | verwalteter Cloud-Dienst |
| Elasticsearch / OpenSearch | Vektor- und Volltextsuche kombiniert |

\`\`\`sql title="pgvector: Speichern und Suchen"
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE abschnitte (
  id        bigserial PRIMARY KEY,
  quelle    text NOT NULL,
  inhalt    text NOT NULL,
  embedding vector(1024)                       -- Dimension des Embedding-Modells
);
CREATE INDEX ON abschnitte USING hnsw (embedding vector_cosine_ops);

-- Die 5 ähnlichsten Abschnitte zur Frage ($1 = Embedding der Frage)
SELECT quelle, inhalt, 1 - (embedding <=> $1) AS aehnlichkeit
FROM abschnitte
ORDER BY embedding <=> $1
LIMIT 5;
\`\`\`

## RAG: Retrieval-Augmented Generation

**[[RAG]]** kombiniert Suche und Generierung in zwei Phasen:

\`\`\`widget
flow:rag
\`\`\`

### Phase 1: Indexierung (vorab)

1. Dokumente laden (PDF, Wiki, Tickets …) und bereinigen.
2. In **Chunks** aufteilen – sinnvoll nach Struktur (Abschnitte, Überschriften), mit etwas Überlappung.
3. Jeden Chunk einbetten und mit **Metadaten** (Quelle, Datum, Zugriffsrechte) speichern.

### Phase 2: Beantwortung (zur Laufzeit)

1. Frage einbetten.
2. Ähnlichste Chunks suchen – gefiltert nach den **Berechtigungen** des Nutzers.
3. Prompt aus Anweisung, gefundenen Chunks (mit Quellen-IDs) und Frage zusammenbauen.
4. Antwort generieren und Quellen anzeigen.

\`\`\`python title="RAG-Kern (vereinfacht, anbieterneutral)"
def beantworte(frage: str, nutzer) -> dict:
    frage_vektor = embedding_modell.einbetten(frage)
    treffer = vektordb.suche(frage_vektor, top_k=5, filter={"darf_lesen": nutzer.gruppen})

    quellen = "\\n\\n".join(f"[{i + 1}] ({t.quelle})\\n{t.inhalt}" for i, t in enumerate(treffer))
    prompt = (
        "Beantworte die Frage ausschließlich anhand der Quellen. "
        "Zitiere mit [Nummer]. Wenn die Quellen die Antwort nicht enthalten, sage das.\\n\\n"
        f"<quellen>\\n{quellen}\\n</quellen>\\n\\nFrage: {frage}"
    )
    antwort = sprachmodell.generiere(prompt)
    return {"antwort": antwort, "quellen": [t.quelle for t in treffer]}
\`\`\`

## Was RAG gut macht – und wo es scheitert

**Vorteile gegenüber Fine-Tuning:** aktuelles Wissen ohne neues Training, nachvollziehbare Quellen, Zugriffsrechte durchsetzbar, Wissen jederzeit aktualisierbar.

**Häufigste Fehlerquelle ist das Retrieval**, nicht das Sprachmodell. Findet die Suche die richtige Stelle nicht, kann auch das beste Modell nicht richtig antworten.

| Problem | Verbesserung |
|---|---|
| Chunks zu klein (Kontext fehlt) oder zu groß (Rauschen) | Chunking an Dokumentstruktur ausrichten, Überschriften mitgeben |
| Exakte Begriffe (Produktnummern, Fehlercodes) werden nicht gefunden | **Hybride Suche:** Vektor + Volltext (BM25) kombinieren |
| Ähnlich, aber nicht relevant | **Reranking** der Top-Treffer mit einem spezialisierten Modell |
| Fragen sind anders formuliert als Dokumente | Frage umformulieren oder erweitern lassen; kontextuelle Chunk-Beschreibungen |
| Veraltete Dokumente | Metadaten (Datum, Version) filtern, Index regelmäßig aktualisieren |

> [!DANGER] Berechtigungen im Retrieval durchsetzen
> Findet die Suche ein vertrauliches Dokument, das der Nutzer nicht sehen darf, landet es im Prompt – und eventuell in der Antwort. Zugriffsrechte gehören **in die Suche selbst** (Filter), nicht nachträglich in den Prompt.

> [!WARNING] Dokumente sind Daten, keine Anweisungen
> Ein Dokument kann Text enthalten wie „Ignoriere alle bisherigen Anweisungen …“ ([[Prompt Injection]]). Grenze Quellen im Prompt klar ab und gib dem Modell keine gefährlichen Werkzeuge, wenn es fremde Inhalte verarbeitet.

## Evaluation

Miss beide Stufen getrennt ([[Evals]]):
- **Retrieval:** Ist der relevante Chunk unter den Top-k? (Recall@k)
- **Antwort:** Ist sie korrekt, vollständig und durch die Quellen gedeckt (Faithfulness)?

## Wie geht es weiter?

Statt nur Text zu liefern, kann ein Modell auch selbst suchen und Werkzeuge nutzen – siehe [Tool Calling, Agents & MCP](#/artikel/tool-calling-agents-mcp).
`;export{e as default};
