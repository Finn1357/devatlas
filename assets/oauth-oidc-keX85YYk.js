const e=`---
id: oauth-oidc
title: OAuth 2.0 & OpenID Connect
area: backend
difficulty: profi
minutes: 16
order: 13
summary: Wie Apps im Namen eines Nutzers auf Daten zugreifen, ohne sein Passwort zu kennen, wie „Mit … anmelden“ funktioniert und warum der Authorization Code Flow mit PKCE der Standard ist.
tags: [OAuth, OpenID Connect, OIDC, SSO, PKCE, Security]
related: [authentifizierung, passwoerter-kryptografie, owasp-top-10]
---

## Das Problem

Eine Kalender-App möchte deine Termine aus einem anderen Dienst lesen. Früher hätte man der App einfach Benutzername und Passwort gegeben – damit hätte sie **vollen Zugriff auf alles**, für immer, und du könntest ihr den Zugriff nicht entziehen, ohne dein Passwort zu ändern.

**[[OAuth 2.0]]** löst das: Die App bekommt ein **Access Token** mit begrenzten Rechten (Scopes) und begrenzter Laufzeit – ausgestellt von dem Dienst, dem du vertraust, nachdem *du* zugestimmt hast.

## Die Rollen

| Rolle | Beispiel |
|---|---|
| **Resource Owner** | Du – der Nutzer, dem die Daten gehören |
| **Client** | Die Kalender-App, die Zugriff möchte |
| **Authorization Server** | Der Identitätsanbieter, der Tokens ausstellt (z. B. Keycloak, Entra ID, Google) |
| **Resource Server** | Die API mit den Daten |

## Authorization Code Flow mit PKCE

Dies ist der empfohlene Flow für Web-, Single-Page- und Mobile-Apps (OAuth 2.1 macht PKCE für alle Clients verpflichtend):

\`\`\`widget
flow:oauth-pkce
\`\`\`

> [!EXPERT] Warum PKCE?
> Der Authorization Code reist über eine Browser-Weiterleitung und kann abgefangen werden (z. B. durch eine bösartige App, die dieselbe Redirect-URI registriert). Mit PKCE kann nur der Client, der den ursprünglichen \`code_verifier\` kennt, den Code gegen Tokens eintauschen. Der \`state\`-Parameter verhindert zusätzlich CSRF-Angriffe auf den Callback.

## Die Tokens

| Token | Zweck | Typische Laufzeit |
|---|---|---|
| **Access Token** | Zugriff auf die API (\`Authorization: Bearer …\`) | Minuten |
| **Refresh Token** | Neue Access Tokens holen, ohne erneuten Login | Stunden bis Tage, mit Rotation |
| **ID Token** (nur OIDC) | Information über den angemeldeten Nutzer, für den Client | Minuten |

Die API (Resource Server) prüft ein Access Token im JWT-Format anhand der öffentlichen Schlüssel des Authorization Servers (JWKS) sowie \`exp\`, \`iss\`, \`aud\` und Scopes.

## OpenID Connect: Login auf OAuth-Basis

OAuth regelt nur **Autorisierung** („diese App darf deinen Kalender lesen“). Für **Login** („diese Person ist Ada“) gibt es **[[OpenID Connect]]** (OIDC) als Schicht darüber: Mit dem Scope \`openid\` erhält der Client zusätzlich ein **ID Token** (ein [[JWT]]) mit Claims wie \`sub\` (eindeutige Nutzer-ID), \`email\`, \`name\`.

\`\`\`json title="Payload eines ID Tokens (gekürzt)"
{
  "iss": "https://login.example.de/realms/shop",
  "sub": "f3a9c2e1-…",
  "aud": "shop-web",
  "exp": 1767229200,
  "iat": 1767225600,
  "email": "ada@example.org",
  "email_verified": true,
  "nonce": "n-0S6_WzA2Mj"
}
\`\`\`

Damit funktionieren „Mit Google anmelden“ und **[[Single Sign-On]]** im Unternehmen: Ein zentraler Identity Provider (z. B. [Keycloak](#/tech/keycloak)) übernimmt Login, MFA und Passwortrichtlinien für alle Anwendungen.

## Andere Flows

| Flow | Einsatz |
|---|---|
| **Client Credentials** | Maschine-zu-Maschine ohne Nutzer (Backend ruft Backend) |
| **Device Authorization** | Geräte ohne Browser/Tastatur (Smart-TV, CLI: „Gehe zu … und gib Code ABCD ein“) |
| ~~Implicit~~ | veraltet – Tokens in der URL, nicht mehr verwenden |
| ~~Password Grant~~ | veraltet – App sieht das Passwort und hebelt die Idee aus |

## Architektur für Single-Page-Apps

Tokens in JavaScript (z. B. \`localStorage\`) sind bei [[XSS]] auslesbar. Empfohlen ist daher oft ein **Backend-for-Frontend (BFF)**: Ein kleines Backend führt den OAuth-Flow aus, verwahrt die Tokens serverseitig und gibt dem Browser nur ein \`HttpOnly\`-Session-Cookie. API-Aufrufe laufen über das BFF.

## Implementieren – aber nicht selbst bauen

Nutze bewährte Bibliotheken bzw. Framework-Integrationen (z. B. Spring Security, ASP.NET Core Authentication, Auth.js, Authlib, oidc-client-ts) und einen etablierten Identity Provider. Eigene Implementierungen scheitern häufig an Details: Signaturprüfung, \`aud\`-Prüfung, Nonce, Redirect-URI-Validierung.

## Typische Fehler

> [!MISTAKE] ID Token als API-Zugangsschlüssel
> Das ID Token ist für den Client bestimmt (\`aud\` = Client-ID), nicht für APIs. APIs akzeptieren Access Tokens mit passender Audience.

> [!MISTAKE] Offene Redirect-URIs
> Erlaubt der Authorization Server beliebige oder per Wildcard passende Redirect-URIs, können Angreifer Codes auf eigene Seiten umleiten. Redirect-URIs immer exakt registrieren.

> [!MISTAKE] Zu breite Scopes
> Fordere nur an, was die App wirklich braucht ([[Least Privilege]]). Nutzer sehen bei der Einwilligung, welche Rechte verlangt werden.

## Wie geht es weiter?

Grundlagen zu Sessions, Cookies und Passwort-Hashing findest du im Artikel [Authentifizierung](#/artikel/authentifizierung), die Kryptografie dahinter in [Passwörter & Kryptografie](#/artikel/passwoerter-kryptografie).
`;export{e as default};
