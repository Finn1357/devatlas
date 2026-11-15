const e=`---
id: zugriffskontrolle
title: Autorisierung & Zugriffskontrolle: RBAC, ABAC & IDOR verhindern
area: security
difficulty: fortgeschritten
minutes: 19
order: 15
summary: Der Unterschied zwischen Authentifizierung und Autorisierung, warum fehlerhafte Zugriffskontrolle die häufigste Schwachstelle in Webanwendungen ist, IDOR an einem Beispiel, Rollen- und attributbasierte Modelle, Mandantentrennung mit Row-Level Security und wie man Berechtigungen testet.
tags: [Autorisierung, Zugriffskontrolle, RBAC, ABAC, IDOR, Row-Level Security]
related: [authentifizierung, oauth-oidc, owasp-top-10, rest-api-design]
---

## Wer bist du – und was darfst du?

- **Authentifizierung** (AuthN): *Wer* bist du? → Login, Passkey, Token. Siehe [Authentifizierung](#/artikel/authentifizierung).
- **[[Autorisierung]]** (AuthZ): *Was* darfst du? → Darf Nutzerin 17 Bestellung 4711 sehen? Darf sie sie stornieren?

Eine Anwendung kann perfekt authentifizieren und trotzdem jedem Angemeldeten alle Daten zeigen. **Fehlerhafte Zugriffskontrolle** (Broken Access Control) steht deshalb auf **Platz 1 der OWASP Top 10** – sie wurde in den untersuchten Anwendungen häufiger gefunden als jede andere Schwachstellenkategorie.

## IDOR: Das klassische Beispiel

**[[IDOR]]** (Insecure Direct Object Reference): Die Anwendung nimmt eine ID aus der Anfrage und liefert das Objekt – ohne zu prüfen, ob es dem Anfragenden gehört.

\`\`\`javascript title="❌ Anfällig: Jeder Angemeldete kann jede Rechnung abrufen"
app.get('/api/rechnungen/:id', authentifiziert, async (req, res) => {
  const rechnung = await db.query('SELECT * FROM rechnungen WHERE id = $1', [req.params.id]);
  res.json(rechnung.rows[0]);
});
// GET /api/rechnungen/1001 → eigene Rechnung
// GET /api/rechnungen/1002 → Rechnung einer fremden Person!
\`\`\`

\`\`\`javascript title="✅ Sicher: Die Abfrage ist auf den Besitzer beschränkt"
app.get('/api/rechnungen/:id', authentifiziert, async (req, res) => {
  const { rows } = await db.query(
    'SELECT * FROM rechnungen WHERE id = $1 AND kunde_id = $2',
    [req.params.id, req.nutzer.kundeId],
  );
  if (rows.length === 0) return res.status(404).json({ fehler: 'Nicht gefunden' });
  res.json(rows[0]);
});
\`\`\`

> [!TIP] 404 statt 403?
> Antwortet der Server bei fremden Objekten mit \`403 Forbidden\`, verrät er, dass die ID existiert. \`404 Not Found\` gibt keine Information preis. Beides ist vertretbar – wichtig ist, dass es einheitlich geschieht.

> [!WARNING] Zufällige IDs sind kein Zugriffsschutz
> UUIDs statt fortlaufender Zahlen machen IDOR schwerer auszunutzen, weil man IDs nicht erraten kann. Aber IDs tauchen in Links, Logs, E-Mails und Browser-Verläufen auf. Die **Berechtigungsprüfung** bleibt unverzichtbar.

## Weitere typische Fehler

| Fehler | Beispiel | Gegenmaßnahme |
|---|---|---|
| **Nur die Oberfläche versteckt** | Admin-Button ist ausgeblendet, \`DELETE /api/nutzer/5\` funktioniert aber für jeden | jede Funktion **serverseitig** prüfen |
| **Function-Level fehlt** | \`/admin/export\` prüft nur „angemeldet“, nicht „Admin“ | Rollenprüfung pro Endpunkt |
| **Mass Assignment** | \`PATCH /api/profil\` mit \`{"rolle": "admin"}\` wird ungefiltert gespeichert | erlaubte Felder explizit auflisten (Allowlist) |
| **Pfadmanipulation** | \`GET /dateien?pfad=../../etc/passwd\` | Pfade normalisieren, auf erlaubtes Verzeichnis beschränken |
| **Vertrauen in Client-Daten** | Preis oder \`istAdmin\` im Formular oder im unsignierten Cookie | nur serverseitige Daten verwenden |
| **Veraltete Berechtigungen** | Rolle wurde entzogen, das JWT gilt aber noch 24 Stunden | kurze Token-Laufzeiten, kritische Rechte frisch prüfen |
| **CORS falsch konfiguriert** | \`Access-Control-Allow-Origin\` spiegelt jede Herkunft mit Credentials | feste Allowlist – siehe [CORS](#/artikel/xss-csrf-cors) |

## Modelle für Berechtigungen

### RBAC: Rollenbasiert

Bei **[[RBAC]]** (Role-Based Access Control) erhalten Nutzer **Rollen**, Rollen haben **Berechtigungen**.

\`\`\`text
Nutzer ──► Rollen ──► Berechtigungen
Ada    ──► redakteur ──► artikel:lesen, artikel:schreiben
Linus  ──► admin     ──► artikel:*, nutzer:verwalten
\`\`\`

\`\`\`javascript title="Berechtigungsprüfung als Middleware"
const berechtigungen = {
  leser: ['artikel:lesen'],
  redakteur: ['artikel:lesen', 'artikel:schreiben'],
  admin: ['artikel:lesen', 'artikel:schreiben', 'artikel:loeschen', 'nutzer:verwalten'],
};

function erfordert(recht) {
  return (req, res, next) => {
    const rechte = berechtigungen[req.nutzer?.rolle] ?? [];
    if (!rechte.includes(recht)) return res.status(403).json({ fehler: 'Keine Berechtigung' });
    next();
  };
}

app.delete('/api/artikel/:id', authentifiziert, erfordert('artikel:loeschen'), loescheArtikel);
\`\`\`

> [!TIP] Berechtigungen prüfen, nicht Rollen
> \`if (rolle === 'admin')\` verstreut über den Code macht spätere Änderungen schwer. Prüfe auf **Berechtigungen** (\`artikel:loeschen\`) – welche Rolle welche hat, steht an einer zentralen Stelle.

RBAC reicht nicht, wenn es auf das **konkrete Objekt** ankommt: „Redakteure dürfen Artikel bearbeiten“ – aber nur **ihre eigenen**?

### ABAC: Attributbasiert

**ABAC** (Attribute-Based Access Control) entscheidet anhand von Attributen des Nutzers, der Ressource und des Kontexts:

\`\`\`python title="Richtlinie als Funktion"
def darf_bearbeiten(nutzer, artikel, jetzt) -> bool:
    if "admin" in nutzer.rollen:
        return True
    return (
        artikel.autor_id == nutzer.id            # eigener Artikel
        and artikel.status != "veroeffentlicht"   # nur Entwürfe
        and nutzer.abteilung == artikel.abteilung
    )
\`\`\`

### ReBAC: Beziehungsbasiert

**ReBAC** (Relationship-Based) leitet Rechte aus Beziehungen ab: „Wer Mitglied eines Teams ist, das Eigentümer eines Ordners ist, darf die Dateien darin lesen.“ Das Modell stammt aus Googles **Zanzibar** (Berechtigungssystem für Drive, YouTube u. a.) und ist in Open-Source-Systemen wie **OpenFGA** und **SpiceDB** umgesetzt – sinnvoll bei komplexen Freigabestrukturen.

Für größere Systeme lohnt es sich, Richtlinien aus dem Code herauszulösen: **Open Policy Agent** (Sprache Rego), **Cedar** (AWS), **Casbin** oder die genannten ReBAC-Dienste.

## Mandantentrennung

In SaaS-Anwendungen teilen sich viele Kunden (Mandanten) dieselbe Datenbank. Ein einziges vergessenes \`WHERE mandant_id = …\` legt Daten eines Kunden für einen anderen offen.

**Row-Level Security** in PostgreSQL erzwingt die Trennung in der Datenbank selbst – auch wenn eine Abfrage im Code die Bedingung vergisst:

\`\`\`sql title="PostgreSQL Row-Level Security" norun
ALTER TABLE projekte ENABLE ROW LEVEL SECURITY;

CREATE POLICY mandanten_trennung ON projekte
  USING (mandant_id = current_setting('app.mandant_id')::bigint);

-- Die Anwendung setzt pro Transaktion den Mandanten des angemeldeten Nutzers:
BEGIN;
SET LOCAL app.mandant_id = '42';
SELECT * FROM projekte;      -- liefert nur Zeilen von Mandant 42
COMMIT;
\`\`\`

Wichtig: Die Anwendung muss sich mit einer Datenbankrolle verbinden, die **nicht** Eigentümer der Tabelle ist und kein \`BYPASSRLS\`-Recht hat – sonst greifen die Policies nicht (bzw. nur mit \`FORCE ROW LEVEL SECURITY\`).

## Grundsätze

1. **Deny by default:** Was nicht ausdrücklich erlaubt ist, ist verboten. Neue Endpunkte sind zunächst gesperrt.
2. **Serverseitig, bei jeder Anfrage:** Die Oberfläche darf Aktionen ausblenden – entscheiden darf nur der Server.
3. **Zentral statt verstreut:** Eine Stelle (Middleware, Policy-Funktion, Policy-Engine), die alle Endpunkte nutzen.
4. **Auf Objektebene:** Nicht nur „darf Rechnungen sehen“, sondern „darf *diese* Rechnung sehen“ – am besten direkt in der Datenbankabfrage.
5. **[[Least Privilege]]:** Nutzer, Dienste und Datenbankkonten bekommen nur die Rechte, die sie brauchen.
6. **Protokollieren:** Abgelehnte Zugriffe loggen und auf Häufungen überwachen – sie deuten auf Angriffe hin.

## Berechtigungen testen

Zugriffskontrolle ist ideal für automatisierte Tests: Für jede Rolle und jeden Endpunkt wird geprüft, ob erlaubt oder verboten wird.

\`\`\`python title="Tabellengetriebener Berechtigungstest (pytest)"
import pytest

FAELLE = [
    # (rolle,       methode,  pfad,                    erwarteter Status)
    ("gast",       "GET",    "/api/artikel/1",         200),
    ("gast",       "DELETE", "/api/artikel/1",         401),
    ("leser",      "DELETE", "/api/artikel/1",         403),
    ("admin",      "DELETE", "/api/artikel/1",         204),
    ("kunde_a",    "GET",    "/api/rechnungen/von_b",  404),   # IDOR-Test
]

@pytest.mark.parametrize("rolle, methode, pfad, status", FAELLE)
def test_zugriffskontrolle(client_als, rolle, methode, pfad, status):
    antwort = client_als(rolle).request(methode, pfad)
    assert antwort.status_code == status
\`\`\`

Besonders wichtig sind **Negativtests**: Nutzer A versucht, auf die Daten von Nutzer B zuzugreifen.

## Wie geht es weiter?

Wie Nutzer sich überhaupt anmelden, zeigen [Authentifizierung](#/artikel/authentifizierung) und [OAuth 2.0 & OpenID Connect](#/artikel/oauth-oidc); den Gesamtüberblick über Schwachstellen die [OWASP Top 10](#/artikel/owasp-top-10).

\`\`\`widget
quiz:Security 3
\`\`\`
`;export{e as default};
