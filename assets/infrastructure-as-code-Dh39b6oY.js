const e=`---
id: infrastructure-as-code
title: Infrastructure as Code mit Terraform & Ansible
area: devops
difficulty: fortgeschritten
minutes: 14
order: 23
summary: Server, Netzwerke und Cloud-Dienste als versionierten Code beschreiben – deklarativ mit Terraform, konfigurierend mit Ansible – und warum der State das Herzstück ist.
tags: [IaC, Terraform, OpenTofu, Ansible, Cloud, Automatisierung]
related: [cloud-grundlagen, ci-cd, linux-server-nginx]
---

## Was ist Infrastructure as Code?

[[Infrastructure as Code]] (IaC) bedeutet: Infrastruktur wird nicht von Hand in Web-Konsolen zusammengeklickt, sondern in **Dateien beschrieben**, im Git-Repository versioniert, per Pull Request geprüft und automatisch angewendet.

> [!BEGINNER]
> Statt jedes Mal neu zu erklären, wie die Möbel stehen sollen, gibst du einen Grundriss ab. Wer ihn umsetzt, kommt immer zum gleichen Ergebnis – und Änderungen am Grundriss kann man vorher prüfen.

## Welche Probleme löst IaC?

- **„Snowflake“-Server:** Niemand weiß mehr, was auf dem Server von Hand geändert wurde.
- **Reproduzierbarkeit:** Test-, Staging- und Produktionsumgebung sind identisch aufgebaut.
- **Nachvollziehbarkeit:** Jede Änderung hat einen Commit, einen Autor und ein Review.
- **Disaster Recovery:** Eine komplette Umgebung lässt sich neu aufbauen.
- **Drift-Erkennung:** Abweichungen zwischen Code und Realität werden sichtbar.

## Zwei Werkzeugarten

| | Provisionierung | Konfigurationsmanagement |
|---|---|---|
| Frage | *Welche* Ressourcen gibt es? | *Wie* sind Server eingerichtet? |
| Beispiele | [[Terraform]]/OpenTofu, Pulumi, CloudFormation, Bicep | [[Ansible]], Chef, Puppet, Salt |
| Ergebnis | VMs, Netze, Datenbanken, DNS, Buckets | Pakete, Dateien, Dienste, Benutzer |

Viele Teams kombinieren beides – oder ersetzen Konfigurationsmanagement weitgehend durch Container-Images, die bereits alles enthalten.

## Terraform: deklarativ

Du beschreibst den **Zielzustand**, Terraform berechnet die nötigen Schritte ([[Deklarative Programmierung|deklarativ]]):

\`\`\`widget
annotated:terraform-basic
\`\`\`

Der Arbeitsablauf:

\`\`\`bash
terraform init      # Provider herunterladen, Backend initialisieren
terraform fmt       # formatieren
terraform validate  # Syntax und Referenzen prüfen
terraform plan      # Diff: was würde sich ändern?
terraform apply     # umsetzen (nach Bestätigung)
\`\`\`

> [!EXPERT] Der State
> Terraform speichert in einer **State-Datei**, welche reale Ressource (z. B. Bucket-ID) zu welcher Ressource im Code gehört. Ohne State wüsste Terraform nicht, was es schon angelegt hat. Der State muss deshalb in einem **Remote-Backend mit Sperre** liegen (z. B. S3 mit Locking, Azure Storage, Terraform Cloud), darf nicht verloren gehen und enthält oft Secrets im Klartext – also verschlüsselt speichern und Zugriff einschränken.

### Module und Variablen

\`\`\`hcl title="Wiederverwendbar durch Variablen und Module"
variable "umgebung" {
  type    = string
  default = "staging"
}

module "netz" {
  source     = "./modules/netz"
  cidr_block = "10.0.0.0/16"
  name       = "shop-\${var.umgebung}"
}
\`\`\`

## Ansible: Server konfigurieren

Ansible verbindet sich per [[SSH]] mit den Servern (kein Agent nötig) und führt **idempotente** Aufgaben aus – zweimaliges Ausführen ändert nichts, wenn der Zielzustand schon erreicht ist ([[Idempotenz]]).

\`\`\`ini title="inventory.ini"
[web]
web1.example.de
web2.example.de
\`\`\`

\`\`\`yaml title="site.yml"
- name: Webserver einrichten
  hosts: web
  become: true
  tasks:
    - name: Nginx installieren
      ansible.builtin.apt:
        name: nginx
        state: present
        update_cache: true
    - name: Konfiguration ausrollen
      ansible.builtin.template:
        src: templates/app.conf.j2
        dest: /etc/nginx/conf.d/app.conf
      notify: Nginx neu laden
  handlers:
    - name: Nginx neu laden
      ansible.builtin.service:
        name: nginx
        state: reloaded
\`\`\`

\`\`\`bash
ansible-playbook -i inventory.ini site.yml --check --diff   # Trockenlauf
ansible-playbook -i inventory.ini site.yml
\`\`\`

## Best Practices

- **Alles per Pull Request** – \`terraform plan\` als Kommentar in der CI anzeigen lassen.
- **Kleine, getrennte States** (z. B. pro Umgebung oder Domäne) statt eines riesigen.
- **Keine manuellen Änderungen** in der Konsole – sonst entsteht Drift.
- **Versionen pinnen** (Provider, Module), Lockfile committen.
- **Secrets** nicht im Code, sondern aus einem Secret-Store beziehen.
- **Tagging**: Jede Ressource mit Umgebung, Team und Kostenstelle versehen.

## Typische Fehler

> [!MISTAKE] \`terraform apply\` ohne Plan-Review
> Eine umbenannte Ressource kann bedeuten: „Löschen und neu anlegen“ – bei einer Datenbank fatal. Lies den Plan genau; \`prevent_destroy\` und \`moved\`-Blöcke schützen.

> [!MISTAKE] Lokaler State im Team
> Zwei Personen mit eigenem lokalen State überschreiben sich gegenseitig die Infrastruktur. Immer ein gemeinsames Remote-Backend mit Locking verwenden.

## Wie geht es weiter?

Die Grundlagen der Cloud-Modelle und Dienste findest du in [Cloud-Grundlagen](#/artikel/cloud-grundlagen).
`;export{e as default};
