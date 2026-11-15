const e=`---
id: https-security-header
title: HTTPS, TLS & Security-Header richtig konfigurieren
area: security
difficulty: fortgeschritten
minutes: 20
order: 14
summary: Was TLS schützt und wie Zertifikate funktionieren, automatische Zertifikate mit ACME, HSTS, Content Security Policy, weitere Security-Header und sichere Cookie-Attribute – mit Konfigurationen für Nginx und Express sowie Prüfwerkzeugen.
tags: [HTTPS, TLS, Zertifikat, HSTS, CSP, Security-Header, Cookies]
related: [xss-csrf-cors, linux-server-nginx, owasp-top-10, http-grundlagen]
---

## Was TLS leistet

**[[TLS]]** (Transport Layer Security, Nachfolger von SSL) sichert die Verbindung zwischen Browser und Server. **HTTPS** ist HTTP über TLS. TLS garantiert drei Dinge:

1. **Vertraulichkeit:** Niemand auf dem Weg (WLAN-Betreiber, Provider) kann mitlesen.
2. **Integrität:** Niemand kann Daten unbemerkt verändern (z. B. Werbung oder Schadcode einschleusen).
3. **Authentizität:** Der Server beweist mit einem **Zertifikat**, dass er wirklich \`example.com\` ist.

TLS schützt **nicht** vor Schwachstellen in der Anwendung selbst (Injection, XSS) und nicht vor einem kompromittierten Server – nur den Transportweg.

## Der Handshake (TLS 1.3, vereinfacht)

\`\`\`text
Browser                                                     Server
  │── ClientHello: unterstützte Verfahren, Schlüsselanteil ──►│
  │◄─ ServerHello: gewähltes Verfahren, Schlüsselanteil ──────│
  │◄─ Zertifikat + Signatur + Finished (bereits verschlüsselt)│
  │   Browser prüft Zertifikatskette, Name, Gültigkeit        │
  │── Finished ──────────────────────────────────────────────►│
  │◄════════════ verschlüsselte HTTP-Daten ══════════════════►│
\`\`\`

Beide Seiten leiten per **Diffie-Hellman-Schlüsselaustausch** einen gemeinsamen Sitzungsschlüssel ab, ohne ihn je zu übertragen. Weil für jede Verbindung neue Schlüssel entstehen (**Forward Secrecy**), kann selbst ein später gestohlener Serverschlüssel aufgezeichnete Verbindungen nicht entschlüsseln. TLS 1.3 braucht nur einen Roundtrip und hat unsichere Altverfahren gestrichen. **TLS 1.0 und 1.1 sind veraltet** und sollten deaktiviert sein; TLS 1.2 mit modernen Cipher Suites ist noch in Ordnung.

## Zertifikate und Vertrauen

Ein **[[Zertifikat]]** bindet einen öffentlichen Schlüssel an einen Domainnamen und ist von einer **Zertifizierungsstelle** (CA) signiert. Browser und Betriebssysteme bringen eine Liste vertrauenswürdiger Wurzel-CAs mit; das Serverzertifikat wird über Zwischenzertifikate bis zu einer davon zurückverfolgt (**Zertifikatskette**).

\`\`\`bash title="Zertifikat eines Servers prüfen"
openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null \\
  | openssl x509 -noout -subject -issuer -dates
\`\`\`

### Automatisch mit ACME

**Let's Encrypt** und andere CAs stellen über das **ACME-Protokoll** kostenlose Zertifikate automatisch aus und erneuern sie. Werkzeuge: Certbot, acme.sh, eingebaut in Caddy und Traefik, cert-manager in Kubernetes.

\`\`\`bash title="Certbot mit Nginx"
sudo certbot --nginx -d example.com -d www.example.com
sudo certbot renew --dry-run          # Erneuerung testen (läuft danach automatisch per Timer)
\`\`\`

> [!WARNING] Zertifikatslaufzeiten werden kürzer
> Die CA/Browser-Forum-Regeln verkürzen die maximale Laufzeit öffentlicher TLS-Zertifikate schrittweise – bis 2029 auf 47 Tage. Manuelle Zertifikatserneuerung ist damit praktisch keine Option mehr: **automatisieren** und den Ablauf überwachen.

## HSTS: Nur noch HTTPS

Selbst mit Weiterleitung von HTTP auf HTTPS ist die **erste** Anfrage per HTTP angreifbar (ein Angreifer im WLAN kann die Weiterleitung unterdrücken – „SSL Stripping“). **HTTP Strict Transport Security** sagt dem Browser: „Verbinde dich mit dieser Domain künftig nur noch per HTTPS.“

\`\`\`http
Strict-Transport-Security: max-age=31536000; includeSubDomains
\`\`\`

> [!DANGER] Vorsicht mit includeSubDomains und preload
> \`includeSubDomains\` erzwingt HTTPS auch für alle Subdomains – auch solche, die (noch) kein Zertifikat haben. Mit \`preload\` und Eintrag in die Preload-Liste der Browser gilt das fest eingebaut und ist nur langsam rückgängig zu machen. Erst mit kurzem \`max-age\` testen.

## Content Security Policy

Die **[[Content Security Policy]]** (CSP) legt fest, von wo eine Seite Skripte, Styles, Bilder und Verbindungen laden darf. Sie ist die wirksamste zweite Verteidigungslinie gegen [XSS](#/artikel/xss-csrf-cors): Selbst wenn ein Angreifer HTML einschleust, führt der Browser das Skript nicht aus.

\`\`\`http title="Strikte CSP mit Nonces (empfohlener Ansatz)"
Content-Security-Policy:
  default-src 'self';
  script-src 'nonce-R4nd0mW3rt' 'strict-dynamic';
  style-src 'self';
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
  object-src 'none';
  base-uri 'none';
  frame-ancestors 'none';
  form-action 'self'
\`\`\`

\`\`\`html
<!-- Nur Skripte mit dem pro Antwort zufällig erzeugten Nonce werden ausgeführt -->
<script nonce="R4nd0mW3rt" src="/app.js"><\/script>
\`\`\`

| Direktive | Wirkung |
|---|---|
| \`default-src\` | Standard für alle nicht einzeln genannten Typen |
| \`script-src\` | erlaubte Skriptquellen; \`'strict-dynamic'\` erlaubt von vertrauenswürdigen Skripten nachgeladene Skripte |
| \`object-src 'none'\` | keine Plugins (Flash, Java-Applets) |
| \`base-uri 'none'\` | verhindert das Umbiegen relativer URLs per \`<base>\`-Tag |
| \`frame-ancestors\` | wer die Seite einbetten darf – Schutz vor **Clickjacking** (ersetzt \`X-Frame-Options\`) |
| \`upgrade-insecure-requests\` | lädt eingebettete HTTP-Ressourcen per HTTPS |

> [!TIP] CSP schrittweise einführen
> Mit \`Content-Security-Policy-Report-Only\` meldet der Browser Verstöße, ohne etwas zu blockieren. So findet man heraus, was die Seite tatsächlich lädt, bevor man die Richtlinie scharf schaltet. \`'unsafe-inline'\` und \`'unsafe-eval'\` in \`script-src\` heben den XSS-Schutz weitgehend auf.

## Weitere Security-Header

| Header | Empfohlener Wert | Zweck |
|---|---|---|
| \`X-Content-Type-Options\` | \`nosniff\` | Browser rät keinen anderen Dateityp als den angegebenen (verhindert z. B., dass ein Upload als Skript ausgeführt wird) |
| \`Referrer-Policy\` | \`strict-origin-when-cross-origin\` | gibt an fremde Seiten nur die Herkunft weiter, nicht die volle URL mit Parametern |
| \`Permissions-Policy\` | \`camera=(), microphone=(), geolocation=()\` | Browserfunktionen abschalten, die die Seite nicht braucht |
| \`Cross-Origin-Opener-Policy\` | \`same-origin\` | isoliert das Fenster von fremden Popups/Openern |
| \`Cross-Origin-Resource-Policy\` | \`same-origin\` | verhindert, dass fremde Seiten deine Ressourcen einbetten |
| \`X-Frame-Options\` | \`DENY\` | ältere Alternative zu \`frame-ancestors\` (für alte Browser zusätzlich setzen) |

Veraltet und nicht mehr setzen (oder auf \`0\`): \`X-XSS-Protection\` – der zugehörige Browserfilter wurde entfernt und konnte selbst Schwachstellen verursachen.

## Sichere Cookies

\`\`\`http
Set-Cookie: __Host-session=a8f3…; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=3600
\`\`\`

| Attribut | Wirkung |
|---|---|
| \`Secure\` | nur über HTTPS senden |
| \`HttpOnly\` | kein Zugriff per JavaScript (\`document.cookie\`) – begrenzt den Schaden bei XSS |
| \`SameSite=Lax\` | bei Anfragen von fremden Seiten nur bei Top-Level-Navigation mitsenden – Schutz vor CSRF |
| \`SameSite=Strict\` | nie bei Anfragen von fremden Seiten (auch nicht beim Klick auf einen Link) |
| \`__Host-\`-Präfix | Browser erzwingt \`Secure\`, \`Path=/\` und keine \`Domain\`-Angabe – Subdomains können das Cookie nicht überschreiben |

## Konfiguration in der Praxis

\`\`\`nginx title="Nginx"
server {
    listen 443 ssl;
    http2 on;
    server_name example.com;

    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    add_header Content-Security-Policy "default-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'" always;
}

server {                                   # HTTP → HTTPS
    listen 80;
    server_name example.com;
    return 301 https://$host$request_uri;
}
\`\`\`

> [!MISTAKE] add_header in verschachtelten Blöcken
> Nginx vererbt \`add_header\` nur, wenn der innere Block (z. B. \`location\`) **selbst keine** \`add_header\`-Anweisung enthält. Ein einziges \`add_header\` in einer \`location\` lässt alle Security-Header des \`server\`-Blocks dort verschwinden.

\`\`\`javascript title="Express mit helmet"
import express from 'express';
import helmet from 'helmet';

const app = express();
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", 'https://api.example.com'],
      objectSrc: ["'none'"],
    },
  },
}));   // setzt außerdem HSTS, nosniff, Referrer-Policy u. a. mit sinnvollen Standardwerten
\`\`\`

## Prüfen

- \`curl -sI https://example.com\` zeigt die tatsächlich gesendeten Header.
- **Mozilla HTTP Observatory** bewertet Security-Header, **SSL Labs Server Test** die TLS-Konfiguration.
- Die **Browser-DevTools** melden CSP-Verstöße in der Konsole.
- Mozillas **SSL Configuration Generator** liefert geprüfte Konfigurationen für Nginx, Apache, HAProxy und andere.

## Wie geht es weiter?

Gegen welche Angriffe CSP und Cookie-Attribute schützen, zeigt [XSS, CSRF & CORS](#/artikel/xss-csrf-cors); den Webserver selbst einrichten erklärt [Linux-Server & Nginx](#/artikel/linux-server-nginx).

\`\`\`widget
quiz:Netzwerk 3
\`\`\`
`;export{e as default};
