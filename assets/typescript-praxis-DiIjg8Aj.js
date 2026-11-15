const e=`---
id: typescript-praxis
title: TypeScript in der Praxis: Typen, Narrowing, Generics & Utility Types
area: web
difficulty: fortgeschritten
minutes: 22
order: 18
summary: Wie man TypeScript wirklich nutzt – strikte Konfiguration, Union Types und Narrowing, Discriminated Unions, Generics, Utility Types, as const und satisfies, unknown statt any und warum Typen zur Laufzeit verschwinden.
tags: [TypeScript, Typen, Generics, Narrowing, Utility Types, zod]
related: [javascript-dom, react-grundlagen, typsysteme-paradigmen, node-express-api]
---

## Was TypeScript ist – und was nicht

[TypeScript](#/sprachen/typescript) ist JavaScript mit **statischen Typen**. Der Compiler prüft die Typen und erzeugt daraus normales JavaScript – die Typen werden dabei **vollständig entfernt**. Daraus folgen zwei wichtige Dinge:

1. TypeScript findet Fehler **vor** der Ausführung – im Editor, beim Build, in der CI.
2. TypeScript prüft **nichts zur Laufzeit**. Daten von außen (API-Antworten, Formulare, \`JSON.parse\`) können trotz Typannotation etwas ganz anderes enthalten.

## Strikt konfigurieren

\`\`\`json title="tsconfig.json – sinnvolle Grundlage"
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "skipLibCheck": true
  }
}
\`\`\`

\`strict\` aktiviert u. a. \`strictNullChecks\` (null und undefined sind eigene Typen) und \`noImplicitAny\`. \`noUncheckedIndexedAccess\` macht \`liste[5]\` zu \`T | undefined\` – denn der Index könnte fehlen.

> [!WARNING]
> Ohne \`strict\` verliert TypeScript einen großen Teil seines Nutzens. In neuen Projekten immer von Anfang an aktivieren; in bestehenden schrittweise einführen.

## Grundtypen und Inferenz

\`\`\`typescript
let anzahl = 3;                       // number – abgeleitet
const modus = 'dev';                  // Typ: 'dev' (Literal, weil const)
const tags: string[] = ['neu'];
const punkt: [number, number] = [3, 4];   // Tupel

function begruesse(name: string, gruss = 'Hallo'): string {
  return \`\${gruss}, \${name}!\`;
}
\`\`\`

Annotieren lohnt sich vor allem an **Grenzen**: Funktionsparameter, Rückgabetypen öffentlicher Funktionen, exportierte Konstanten. Innerhalb von Funktionen reicht meist die Inferenz.

### type oder interface?

\`\`\`typescript
interface Nutzer {            // erweiterbar, gut für Objektformen und Klassen
  id: number;
  name: string;
  email?: string;             // optional
  readonly erstelltAm: Date;  // nicht änderbar
}

type Id = number | string;    // type kann zusätzlich Unions, Tupel, abgeleitete Typen
type Admin = Nutzer & { rechte: string[] };   // Schnittmenge
\`\`\`

Beide sind für Objektformen fast austauschbar. Eine verbreitete Konvention: \`interface\` für Objektformen, \`type\` für alles andere.

## Union Types und Narrowing

Ein **Union Type** (\`A | B\`) beschreibt „eines von beiden“. Bevor man typspezifische Operationen nutzt, muss man den Typ **eingrenzen** (Narrowing) – TypeScript verfolgt das durch den Kontrollfluss:

\`\`\`typescript
function formatiere(wert: string | number | Date | null): string {
  if (wert === null) return '–';
  if (typeof wert === 'string') return wert.trim();          // hier: string
  if (typeof wert === 'number') return wert.toFixed(2);      // hier: number
  return wert.toLocaleDateString('de-DE');                   // hier bleibt nur: Date
}

function istFehler(x: unknown): x is Error {                 // eigener Type Guard
  return x instanceof Error;
}

if ('email' in nutzer) { /* nutzer hat hier eine email-Eigenschaft */ }
\`\`\`

### Discriminated Unions

Das wichtigste Muster für Zustände: Jede Variante hat ein gemeinsames Feld mit einem eindeutigen Literalwert.

\`\`\`typescript
type Anfrage<T> =
  | { status: 'idle' }
  | { status: 'laden' }
  | { status: 'erfolg'; daten: T }
  | { status: 'fehler'; fehler: string };

function anzeigen(a: Anfrage<string[]>): string {
  switch (a.status) {
    case 'idle':   return '';
    case 'laden':  return 'Lädt …';
    case 'erfolg': return a.daten.join(', ');
    case 'fehler': return \`Fehler: \${a.fehler}\`;
    default: {
      const nie: never = a;      // Compilefehler, falls eine Variante fehlt
      return nie;
    }
  }
}
\`\`\`

So sind unmögliche Zustände (gleichzeitig \`laden\` **und** \`fehler\`, oder \`daten\` ohne Erfolg) gar nicht darstellbar. Kommt eine neue Variante hinzu, meldet der \`never\`-Zweig jede Stelle, die sie noch nicht behandelt.

## Generics

**Generics** sind Typparameter: Funktionen und Typen, die mit beliebigen Typen funktionieren, ohne die Typinformation zu verlieren.

\`\`\`typescript
function erstes<T>(liste: readonly T[]): T | undefined {
  return liste[0];
}
const n = erstes([1, 2, 3]);           // number | undefined
const s = erstes(['a', 'b']);          // string | undefined

// Einschränkung: T muss eine id haben
function nachId<T extends { id: number }>(liste: T[]): Map<number, T> {
  return new Map(liste.map((x) => [x.id, x]));
}

// keyof: nur existierende Eigenschaften erlaubt
function feld<T, K extends keyof T>(obj: T, schluessel: K): T[K] {
  return obj[schluessel];
}
feld({ name: 'Ada', alter: 36 }, 'name');     // string
// feld({ name: 'Ada' }, 'email');            // Compilefehler
\`\`\`

## Utility Types

TypeScript bringt Werkzeuge mit, um neue Typen aus bestehenden abzuleiten – statt sie zu duplizieren:

| Utility Type | Ergebnis | Beispiel |
|---|---|---|
| \`Partial<T>\` | alle Felder optional | Daten für ein PATCH-Update |
| \`Required<T>\` | alle Felder Pflicht | |
| \`Readonly<T>\` | alle Felder schreibgeschützt | |
| \`Pick<T, K>\` | nur ausgewählte Felder | \`Pick<Nutzer, 'id' \\| 'name'>\` |
| \`Omit<T, K>\` | alle außer ausgewählten | \`Omit<Nutzer, 'id'>\` zum Anlegen |
| \`Record<K, V>\` | Objekt mit Schlüsseln K und Werten V | \`Record<Status, string>\` |
| \`ReturnType<F>\` | Rückgabetyp einer Funktion | |
| \`Awaited<T>\` | Typ nach \`await\` | \`Awaited<ReturnType<typeof ladeNutzer>>\` |
| \`NonNullable<T>\` | ohne null und undefined | |

\`\`\`typescript
type NeuerNutzer = Omit<Nutzer, 'id' | 'erstelltAm'>;
type NutzerUpdate = Partial<NeuerNutzer>;

const statusText: Record<'offen' | 'versendet', string> = {
  offen: 'Wird bearbeitet',
  versendet: 'Unterwegs',            // fehlt ein Schlüssel → Compilefehler
};
\`\`\`

## as const und satisfies

\`\`\`typescript
const ROLLEN = ['leser', 'autor', 'admin'] as const;     // readonly ['leser', 'autor', 'admin']
type Rolle = (typeof ROLLEN)[number];                    // 'leser' | 'autor' | 'admin'

const routen = {
  start: '/',
  profil: '/profil',
} satisfies Record<string, \`/\${string}\`>;   // prüft die Form, behält aber die genauen Typen
routen.profil;                              // Typ: string (konkret: '/profil' bleibt bekannt)
\`\`\`

\`satisfies\` (seit TypeScript 4.9) prüft, ob ein Wert zu einem Typ passt, **ohne** ihn auf diesen Typ zu verallgemeinern – im Gegensatz zu einer Annotation (\`const routen: Record<…> = …\`), nach der die konkreten Schlüssel verloren gingen.

## unknown statt any

| | \`any\` | \`unknown\` |
|---|---|---|
| Zuweisen von beliebigen Werten | ja | ja |
| Verwenden ohne Prüfung | **ja – Typprüfung ist aus** | nein – erst eingrenzen |
| Wofür | nur als Notlösung bei Migrationen | Daten unbekannter Herkunft |

\`\`\`typescript
function verarbeite(eingabe: unknown) {
  // eingabe.toUpperCase();                    // Fehler: Object is of type 'unknown'
  if (typeof eingabe === 'string') return eingabe.toUpperCase();
}
\`\`\`

## Laufzeitvalidierung

Weil Typen zur Laufzeit verschwinden, ist diese Annotation eine **Behauptung**, keine Prüfung:

\`\`\`typescript
const nutzer = (await res.json()) as Nutzer;   // ⚠️ TypeScript glaubt das einfach
\`\`\`

Für Daten von außen braucht man eine Validierung zur Laufzeit. Bibliotheken wie **zod**, Valibot oder ArkType definieren ein Schema **und** leiten den Typ daraus ab – eine einzige Quelle der Wahrheit:

\`\`\`typescript
import { z } from 'zod';

const NutzerSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  email: z.string().email().optional(),
});
type Nutzer = z.infer<typeof NutzerSchema>;     // Typ aus dem Schema abgeleitet

const ergebnis = NutzerSchema.safeParse(await res.json());
if (!ergebnis.success) {
  console.error(ergebnis.error.issues);         // genaue Fehlerbeschreibung
} else {
  const nutzer: Nutzer = ergebnis.data;         // jetzt wirklich geprüft
}
\`\`\`

## Typische Fehler

> [!MISTAKE] Typprüfung abschalten
> \`any\`, \`as\` (Type Assertion) und \`!\` (Non-null Assertion) sagen dem Compiler „vertrau mir“. Jedes Vorkommen ist eine Stelle, an der TypeScript nicht mehr hilft. Besser: eingrenzen, validieren oder den Typ korrekt modellieren. Lint-Regeln wie \`@typescript-eslint/no-explicit-any\` helfen.

- **Enums:** TypeScript-\`enum\` erzeugt Laufzeitcode und hat Eigenheiten. Union-Literale (\`'offen' | 'versendet'\`) oder \`as const\`-Objekte sind meist einfacher – und kompatibel mit Node.js, das TypeScript-Dateien inzwischen durch reines Entfernen der Typen ausführen kann (Type Stripping), was Enums nicht unterstützt.
- **Optionale Felder vs. undefined:** \`email?: string\` heißt „darf fehlen“; mit \`exactOptionalPropertyTypes\` ist \`email: undefined\` dann nicht automatisch erlaubt.
- **Bibliotheken ohne Typen:** Typdefinitionen liegen oft in \`@types/paketname\` (DefinitelyTyped); moderne Pakete bringen sie selbst mit.

## Wie geht es weiter?

Wie Typsysteme allgemein funktionieren, erklärt [Typsysteme & Paradigmen](#/artikel/typsysteme-paradigmen); die wichtigsten Befehle stehen im [TypeScript-Cheatsheet](#/cheatsheets/typescript).

\`\`\`widget
quiz:TypeScript 4
\`\`\`
`;export{e as default};
