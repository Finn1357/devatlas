const e=`---
id: node-express-api
title: Tutorial: REST-API mit Node.js, Express & TypeScript
area: backend
difficulty: fortgeschritten
minutes: 22
order: 14
summary: Schritt für Schritt eine produktionsnahe API bauen – Projektstruktur, Routen, Validierung mit Zod, Fehlerbehandlung, Datenbank, Tests und Docker.
tags: [Node.js, Express, TypeScript, REST, Tutorial, Zod]
related: [rest-api-design, http-grundlagen, testing, dockerfile]
---

## Ziel

Wir bauen eine kleine **Aufgaben-API** (Todos) mit [[Node.js]], [Express](#/tech/express) und [[TypeScript]]:

- \`GET /api/aufgaben\` – alle Aufgaben (optional gefiltert)
- \`POST /api/aufgaben\` – neue Aufgabe mit Validierung
- \`PATCH /api/aufgaben/:id\` – Aufgabe ändern
- \`DELETE /api/aufgaben/:id\` – löschen
- saubere Fehler, Logging, Tests und ein Dockerfile

## 1. Projekt aufsetzen

\`\`\`bash
mkdir aufgaben-api && cd aufgaben-api
npm init -y
npm install express zod
npm install -D typescript @types/express @types/node tsx vitest supertest @types/supertest
npx tsc --init
\`\`\`

\`\`\`json title="package.json (Ausschnitt)"
{
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "vitest run"
  }
}
\`\`\`

\`tsx\` führt TypeScript direkt aus und startet bei Änderungen neu. Für den Produktionsbuild kompiliert \`tsc\` nach \`dist/\`.

## 2. Projektstruktur

\`\`\`text
src/
├── app.ts            # Express-App (ohne listen) – gut testbar
├── server.ts         # startet den Server
├── aufgaben/
│   ├── router.ts     # Routen
│   ├── schema.ts     # Validierung
│   └── repository.ts # Datenzugriff
└── fehler.ts         # zentrale Fehlerbehandlung
\`\`\`

Die Trennung von \`app\` und \`server\` erlaubt Tests ohne echten Port; Router, Validierung und Datenzugriff sind getrennte Verantwortlichkeiten ([[Separation of Concerns]]).

## 3. Validierung mit Zod

Eingaben von außen sind **nie** vertrauenswürdig ([[Eingabevalidierung]]). Zod prüft zur Laufzeit und liefert gleichzeitig TypeScript-Typen.

\`\`\`typescript title="src/aufgaben/schema.ts"
import { z } from 'zod';

export const NeueAufgabe = z.object({
  titel: z.string().trim().min(1, 'Titel fehlt').max(200),
  faellig: z.coerce.date().optional(),
  prioritaet: z.enum(['niedrig', 'normal', 'hoch']).default('normal'),
});

export const AufgabeAendern = NeueAufgabe.partial().extend({
  erledigt: z.boolean().optional(),
});

export type NeueAufgabe = z.infer<typeof NeueAufgabe>;
export type Aufgabe = NeueAufgabe & { id: number; erledigt: boolean; erstellt: Date };
\`\`\`

## 4. Datenzugriff

Zunächst im Speicher – das Repository kapselt den Zugriff, sodass später eine echte Datenbank eingesetzt werden kann, ohne die Routen zu ändern ([[Dependency Injection]]).

\`\`\`typescript title="src/aufgaben/repository.ts"
import type { Aufgabe, NeueAufgabe } from './schema.js';

export interface AufgabenRepository {
  alle(filter?: { erledigt?: boolean }): Promise<Aufgabe[]>;
  finde(id: number): Promise<Aufgabe | undefined>;
  anlegen(daten: NeueAufgabe): Promise<Aufgabe>;
  aendern(id: number, daten: Partial<Aufgabe>): Promise<Aufgabe | undefined>;
  loeschen(id: number): Promise<boolean>;
}

export function speicherRepository(): AufgabenRepository {
  const daten = new Map<number, Aufgabe>();
  let naechsteId = 1;
  return {
    async alle(filter) {
      const liste = [...daten.values()];
      return filter?.erledigt === undefined ? liste : liste.filter((a) => a.erledigt === filter.erledigt);
    },
    async finde(id) { return daten.get(id); },
    async anlegen(eingabe) {
      const a: Aufgabe = { ...eingabe, id: naechsteId++, erledigt: false, erstellt: new Date() };
      daten.set(a.id, a);
      return a;
    },
    async aendern(id, aenderung) {
      const alt = daten.get(id);
      if (!alt) return undefined;
      const neu = { ...alt, ...aenderung, id };
      daten.set(id, neu);
      return neu;
    },
    async loeschen(id) { return daten.delete(id); },
  };
}
\`\`\`

## 5. Router

\`\`\`typescript title="src/aufgaben/router.ts"
import { Router } from 'express';
import { AufgabeAendern, NeueAufgabe } from './schema.js';
import type { AufgabenRepository } from './repository.js';
import { HttpFehler } from '../fehler.js';

export function aufgabenRouter(repo: AufgabenRepository) {
  const r = Router();

  r.get('/', async (req, res) => {
    const erledigt = req.query.erledigt === undefined ? undefined : req.query.erledigt === 'true';
    res.json(await repo.alle({ erledigt }));
  });

  r.post('/', async (req, res) => {
    const daten = NeueAufgabe.parse(req.body);          // wirft ZodError bei ungültigen Daten
    const neu = await repo.anlegen(daten);
    res.status(201).location(\`/api/aufgaben/\${neu.id}\`).json(neu);
  });

  r.patch('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const aenderung = AufgabeAendern.parse(req.body);
    const a = await repo.aendern(id, aenderung);
    if (!a) throw new HttpFehler(404, 'Aufgabe nicht gefunden');
    res.json(a);
  });

  r.delete('/:id', async (req, res) => {
    if (!(await repo.loeschen(Number(req.params.id)))) throw new HttpFehler(404, 'Aufgabe nicht gefunden');
    res.status(204).end();
  });

  return r;
}
\`\`\`

> [!INFO] Express 5
> Seit Express 5 werden Fehler aus \`async\`-Handlern automatisch an die Fehler-Middleware weitergereicht. In Express 4 musste man sie per \`try/catch\` und \`next(err)\` weitergeben.

## 6. Zentrale Fehlerbehandlung

\`\`\`typescript title="src/fehler.ts"
import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

export class HttpFehler extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export const fehlerHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(422).json({ title: 'Eingabe ungültig', status: 422, fehler: err.issues.map((i) => ({ feld: i.path.join('.'), meldung: i.message })) });
  }
  if (err instanceof HttpFehler) {
    return res.status(err.status).json({ title: err.message, status: err.status });
  }
  console.error({ msg: 'Unerwarteter Fehler', pfad: req.path, err });   // intern loggen
  res.status(500).json({ title: 'Interner Fehler', status: 500 });       // nach außen neutral
};
\`\`\`

## 7. App und Server

\`\`\`typescript title="src/app.ts"
import express from 'express';
import { aufgabenRouter } from './aufgaben/router.js';
import { speicherRepository, type AufgabenRepository } from './aufgaben/repository.js';
import { fehlerHandler } from './fehler.js';

export function createApp(repo: AufgabenRepository = speicherRepository()) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '100kb' }));          // Body-Größe begrenzen
  app.get('/health', (_req, res) => res.json({ ok: true }));
  app.use('/api/aufgaben', aufgabenRouter(repo));
  app.use(fehlerHandler);                              // muss nach den Routen kommen
  return app;
}
\`\`\`

\`\`\`typescript title="src/server.ts"
import { createApp } from './app.js';

const port = Number(process.env.PORT ?? 3000);
const server = createApp().listen(port, () => console.log(\`API läuft auf http://localhost:\${port}\`));

process.on('SIGTERM', () => server.close(() => process.exit(0)));   // sauberes Herunterfahren
\`\`\`

\`\`\`bash
npm run dev
curl -X POST localhost:3000/api/aufgaben -H "Content-Type: application/json" -d '{"titel":"Artikel lesen"}'
curl localhost:3000/api/aufgaben
\`\`\`

So durchläuft eine Anfrage die [[Middleware]]-Kette:

\`\`\`widget
pipeline:middleware
\`\`\`

## 8. Tests

\`\`\`typescript title="src/app.test.ts"
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from './app.js';

describe('Aufgaben-API', () => {
  it('legt eine Aufgabe an und listet sie', async () => {
    const app = createApp();
    const neu = await request(app).post('/api/aufgaben').send({ titel: 'Testen' });
    expect(neu.status).toBe(201);
    const liste = await request(app).get('/api/aufgaben');
    expect(liste.body).toHaveLength(1);
  });

  it('lehnt leere Titel mit 422 ab', async () => {
    const res = await request(createApp()).post('/api/aufgaben').send({ titel: '' });
    expect(res.status).toBe(422);
  });
});
\`\`\`

## 9. Produktionsreif machen

- **Datenbank:** Repository durch eine PostgreSQL-Implementierung ersetzen (z. B. mit \`pg\`, Drizzle oder Prisma) – mit [parametrisierten Abfragen](#/artikel/injection).
- **Sicherheit:** Authentifizierung ([Artikel](#/artikel/authentifizierung)), [[Rate Limiting]] (z. B. \`express-rate-limit\`), Sicherheitsheader (z. B. \`helmet\`), [[CORS]] gezielt konfigurieren.
- **Logging:** strukturiert mit \`pino\`, Request-IDs.
- **Container:** ein [Multi-Stage-Dockerfile](#/artikel/dockerfile) und Auslieferung per [CI/CD](#/artikel/ci-cd).

## Wie geht es weiter?

Dasselbe in Python zeigt das [FastAPI-Tutorial](#/artikel/fastapi-tutorial). Die Designprinzipien hinter den Endpunkten erklärt [REST-API-Design](#/artikel/rest-api-design).
`;export{e as default};
