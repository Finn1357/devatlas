const e=`---
id: frontend-frameworks
title: Frontend-Frameworks im Vergleich: React, Vue, Angular, Svelte – plus State & Formulare
area: web
difficulty: fortgeschritten
minutes: 22
order: 19
summary: Dieselbe Komponente in React, Vue, Angular und Svelte, die Reaktivitätsmodelle dahinter, wann welches Framework passt, Meta-Frameworks – und die Querschnittsthemen State Management und Formulare.
tags: [React, Vue, Angular, Svelte, State Management, Formulare, Signals]
related: [react-grundlagen, rendering-strategien, typescript-praxis, barrierefreiheit]
---

## Wozu Frameworks?

Mit purem JavaScript ([DOM-Manipulation](#/artikel/javascript-dom)) muss man bei jeder Datenänderung selbst wissen, welche Elemente aktualisiert werden müssen. Ab einer gewissen Größe wird das unübersichtlich und fehleranfällig. Frontend-Frameworks drehen das Prinzip um: **Man beschreibt, wie die Oberfläche für einen Zustand aussieht – das Framework hält das DOM synchron.** Dazu kommen Komponenten zur Wiederverwendung, Routing, Werkzeuge und ein Ökosystem.

## Dieselbe Komponente in vier Frameworks

Ein Zähler mit abgeleitetem Wert – das kleinste Beispiel, an dem man Reaktivität sieht.

\`\`\`tsx title="React"
import { useState } from 'react';

export function Zaehler() {
  const [anzahl, setAnzahl] = useState(0);
  const doppelt = anzahl * 2;                       // bei jedem Rendern neu berechnet
  return (
    <button onClick={() => setAnzahl((n) => n + 1)}>
      Klicks: {anzahl} (doppelt: {doppelt})
    </button>
  );
}
\`\`\`

\`\`\`vue title="Vue 3 (Single File Component)"
<script setup lang="ts">
import { computed, ref } from 'vue';

const anzahl = ref(0);
const doppelt = computed(() => anzahl.value * 2);
<\/script>

<template>
  <button @click="anzahl++">Klicks: {{ anzahl }} (doppelt: {{ doppelt }})</button>
</template>
\`\`\`

\`\`\`typescript title="Angular (Signals; ab Version 19 sind Komponenten standardmäßig standalone)"
import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-zaehler',
  template: \`<button (click)="erhoehe()">Klicks: {{ anzahl() }} (doppelt: {{ doppelt() }})</button>\`,
})
export class ZaehlerComponent {
  anzahl = signal(0);
  doppelt = computed(() => this.anzahl() * 2);
  erhoehe() {
    this.anzahl.update((n) => n + 1);
  }
}
\`\`\`

\`\`\`svelte title="Svelte 5 (Runes)"
<script>
  let anzahl = $state(0);
  let doppelt = $derived(anzahl * 2);
<\/script>

<button onclick={() => anzahl++}>Klicks: {anzahl} (doppelt: {doppelt})</button>
\`\`\`

## Reaktivitätsmodelle

| Modell | Funktionsweise | Frameworks |
|---|---|---|
| **Neu rendern + Virtual DOM** | Bei Zustandsänderung läuft die Komponentenfunktion erneut; das Ergebnis wird mit dem vorherigen verglichen und nur die Unterschiede ins DOM übertragen | React |
| **Feingranulare Signals** | Jeder reaktive Wert kennt seine Abhängigen; eine Änderung aktualisiert genau die betroffenen Stellen | Vue (Refs, kombiniert mit Virtual DOM), Angular Signals, Solid, Svelte 5, Preact Signals |
| **Compiler** | Zur Build-Zeit wird Code erzeugt, der das DOM gezielt aktualisiert | Svelte (zusammen mit Runes), React Compiler (automatische Memoisierung) |

> [!INFO] Signals als gemeinsamer Nenner
> Fast alle Frameworks haben sich in den letzten Jahren in Richtung Signals bewegt; es gibt sogar einen TC39-Vorschlag, Signals in JavaScript selbst aufzunehmen. React geht mit dem React Compiler einen anderen Weg und optimiert das Neu-Rendern automatisch.

## Im Vergleich

| | **React** | **Vue** | **Angular** | **Svelte** |
|---|---|---|---|---|
| Typ | UI-Bibliothek + Ökosystem | progressives Framework | vollständiges Framework | Compiler-Framework |
| Herkunft | Meta (2013) | Evan You, Community (2014) | Google (2016, Nachfolger von AngularJS) | Rich Harris, Community (2016) |
| Templates | JSX (JavaScript mit HTML-Syntax) | HTML-Templates (oder JSX) | HTML-Templates mit eigener Syntax | HTML mit Erweiterungen |
| Mitgeliefert | wenig – Routing, State, Formulare aus dem Ökosystem | Router und Pinia offiziell | alles: Router, Formulare, HTTP, DI, Tests | SvelteKit als offizielles App-Framework |
| Lernkurve | mittel | flach | steil | flach |
| Stärken | riesiges Ökosystem, Arbeitsmarkt, React Native | zugänglich, gute Doku, flexibel | Struktur für große Teams, Konsistenz | wenig Boilerplate, kleine Bundles |
| Meta-Framework | Next.js, React Router (früher Remix) | Nuxt | Angular SSR | SvelteKit |

Weitere relevante Optionen: **Solid** (React-ähnliche Syntax mit Signals), **Preact** (React-kompatibel, sehr klein), **Qwik** (Resumability statt Hydration), **Astro** (inhaltsorientierte Seiten mit „Inseln“ aus beliebigen Frameworks), **htmx** und **Alpine.js** (Interaktivität ohne Build-Schritt für serverseitig gerenderte Seiten).

### Welches passt?

- **Großes Team, langlebige Unternehmensanwendung, klare Konventionen gewünscht:** Angular.
- **Größtes Ökosystem, viele Bibliotheken und Entwickler verfügbar, ggf. auch Mobile:** React.
- **Schneller Einstieg, schrittweise Einführung in bestehende Seiten:** Vue.
- **Kleine Bundles, wenig Code, Freude am Schreiben:** Svelte.
- **Überwiegend Inhalte (Blog, Doku, Marketing):** Astro oder ein Meta-Framework mit statischer Generierung – siehe [Rendering-Strategien](#/artikel/rendering-strategien).
- **Serverseitige App, nur etwas Interaktivität:** htmx oder Alpine.js können ein SPA-Framework ersetzen.

> [!TIP]
> Die Unterschiede zwischen den großen Frameworks sind kleiner als ihr Ruf. Komponenten, Props, Zustand, abgeleitete Werte, Effekte – die Konzepte sind übertragbar. Wer eines gut beherrscht, lernt das nächste schnell.

## State Management

„State“ ist alles, was sich ändert und die Oberfläche beeinflusst. Die wichtigste Erkenntnis: **Es gibt verschiedene Arten von State**, und sie brauchen verschiedene Werkzeuge.

| Art | Beispiel | Werkzeug |
|---|---|---|
| **Lokaler UI-State** | Ist das Dropdown offen? Eingabe im Feld | \`useState\`, \`ref\`, \`signal\`, \`$state\` |
| **Geteilter Client-State** | eingeloggter Nutzer, Theme, Warenkorb | Context (React), provide/inject (Vue), Services (Angular) oder Stores: Zustand, Redux Toolkit, Pinia, NgRx |
| **Server-State** | Produktliste von der API | **TanStack Query**, SWR, RTK Query, Apollo – mit Caching, Neuladen, Deduplizierung |
| **URL-State** | Filter, Suche, Seite, ausgewählter Tab | Router: Query-Parameter – teilbar und mit „Zurück“-Taste kompatibel |
| **Formular-State** | Eingaben, Fehler, „berührt“ | Formularbibliotheken (siehe unten) |

> [!MISTAKE] Server-Daten im globalen Store
> Ein häufiger Fehler ist, API-Daten manuell in Redux oder einem globalen Store zu verwalten – inklusive Lade-Flags, Fehlerbehandlung, Neuladen und Cache-Invalidierung. Server-State hat eigene Probleme (veraltete Daten, parallele Anfragen) und ist mit spezialisierten Bibliotheken viel einfacher.

\`\`\`tsx title="Server-State mit TanStack Query (React)"
import { useQuery } from '@tanstack/react-query';

function ProduktListe() {
  const { data, isPending, error } = useQuery({
    queryKey: ['produkte'],
    queryFn: async () => {
      const res = await fetch('/api/produkte');
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
      return (await res.json()) as { id: number; name: string }[];
    },
    staleTime: 60_000,                 // 1 Minute als aktuell betrachten
  });
  if (isPending) return <p>Lädt …</p>;
  if (error) return <p role="alert">Fehler: {error.message}</p>;
  return <ul>{data.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;
}
\`\`\`

Faustregel: State so **lokal** wie möglich halten und erst nach oben verschieben, wenn ihn mehrere Komponenten brauchen. Abgeleitete Werte **berechnen** statt zusätzlich zu speichern.

## Formulare

Formulare sind der Ort, an dem Nutzer am meisten mit einer Anwendung interagieren – und an dem am meisten schiefgehen kann.

### Kontrolliert oder unkontrolliert?

- **Kontrolliert:** Der Wert lebt im Framework-State; jede Eingabe aktualisiert ihn. Volle Kontrolle (z. B. Formatieren während des Tippens), aber viele Re-Renders.
- **Unkontrolliert:** Der Wert lebt im DOM; ausgelesen wird beim Absenden (\`FormData\`). Einfach und performant.

\`\`\`tsx title="Formular mit react-hook-form und zod"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const Schema = z.object({
  email: z.string().email('Bitte eine gültige E-Mail-Adresse eingeben'),
  passwort: z.string().min(12, 'Mindestens 12 Zeichen'),
});
type Daten = z.infer<typeof Schema>;

export function Registrierung() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Daten>({
    resolver: zodResolver(Schema),
  });
  return (
    <form onSubmit={handleSubmit(async (daten) => { await sende(daten); })} noValidate>
      <label htmlFor="email">E-Mail</label>
      <input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email}
             aria-describedby="email-fehler" {...register('email')} />
      {errors.email && <p id="email-fehler" role="alert">{errors.email.message}</p>}

      <label htmlFor="passwort">Passwort</label>
      <input id="passwort" type="password" autoComplete="new-password" {...register('passwort')} />
      {errors.passwort && <p role="alert">{errors.passwort.message}</p>}

      <button type="submit" disabled={isSubmitting}>Konto anlegen</button>
    </form>
  );
}
\`\`\`

Entsprechungen: **VeeValidate** (Vue), **Reactive Forms** (Angular, eingebaut), **Superforms** (SvelteKit), **TanStack Form** (frameworkübergreifend).

### Regeln für gute Formulare

1. **Jedes Feld hat ein sichtbares \`<label>\`** – Platzhalter sind kein Ersatz. Mehr in [Barrierefreiheit](#/artikel/barrierefreiheit).
2. **Passende Eingabetypen** (\`type="email"\`, \`inputmode="numeric"\`) und \`autocomplete\`-Attribute – Passwortmanager und mobile Tastaturen danken es.
3. **Fehler verständlich, konkret und am Feld** anzeigen – und erst nach dem Verlassen des Feldes oder beim Absenden, nicht beim ersten Tastendruck.
4. **Doppeltes Absenden verhindern** (Button während des Sendens deaktivieren) – und serverseitig mit Idempotenz absichern.
5. **Immer serverseitig validieren.** Client-Validierung ist Komfort, keine Sicherheit – jeder kann HTTP-Anfragen direkt senden.

## Wie geht es weiter?

Die Grundlagen von Komponenten und Hooks erklärt [React-Grundlagen](#/artikel/react-grundlagen); wo und wann gerendert wird (CSR, SSR, SSG), [Rendering-Strategien](#/artikel/rendering-strategien).
`;export{e as default};
