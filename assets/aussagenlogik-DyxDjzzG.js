const e=`---
id: aussagenlogik
title: Aussagenlogik
module: grundlagen
order: 1
difficulty: einsteiger
minutes: 35
summary: Aussagen, Junktoren und Wahrheitstafeln – wie man logische Zusammenhänge präzise formuliert und Äquivalenzen nachweist.
tags: [Junktoren, Wahrheitstafel, Tautologie, De Morgan, Implikation]
---

## Worum es geht

Mathematik ist eine Sprache, in der jeder Satz entweder wahr oder falsch ist – ohne „ein bisschen“. Die **Aussagenlogik** ist die Grammatik dieser Sprache: Sie legt fest, wie man aus einfachen Aussagen zusammengesetzte bildet und wie sich deren Wahrheitswert ergibt. Wer programmiert, kennt die Bausteine bereits aus \`if\`-Bedingungen (\`&&\`, \`||\`, \`!\`). Neu ist vor allem die **Implikation** „wenn …, dann …“, die in Beweisen ständig vorkommt und anders funktioniert, als die Alltagssprache vermuten lässt.

> [!DEFINITION] Aussage
> Eine **Aussage** ist ein sprachliches Gebilde, das entweder **wahr** ($w$, 1) oder **falsch** ($f$, 0) ist – nie beides und nie keins von beiden.

Beispiele für Aussagen: „7 ist eine Primzahl“ (wahr), „$2 + 2 = 5$“ (falsch), „Jede gerade Zahl größer als 2 ist Summe zweier Primzahlen“ (die Goldbach-Vermutung – eine Aussage, auch wenn ihr Wahrheitswert bis heute unbekannt ist).

Keine Aussagen sind dagegen „Ist 7 prim?“ (Frage), „Schließe die Tür!“ (Aufforderung) oder „$x > 3$“, solange $x$ nicht festgelegt ist – Letzteres ist eine **Aussageform**, die erst durch Einsetzen eines Wertes zur Aussage wird (siehe [Prädikatenlogik](#/mathe/grundlagen/praedikatenlogik)).

## Junktoren

Aus Aussagen $A$ und $B$ entstehen mit **Junktoren** (Verknüpfungen) neue Aussagen. Ihr Wahrheitswert hängt nur von den Wahrheitswerten von $A$ und $B$ ab und wird durch eine **Wahrheitstafel** festgelegt.

| $A$ | $B$ | $\\lnot A$ | $A \\land B$ | $A \\lor B$ | $A \\to B$ | $A \\leftrightarrow B$ | $A \\oplus B$ |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 0 | 0 | 1 | 0 | 0 | 1 | 1 | 0 |
| 0 | 1 | 1 | 0 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 0 | 1 | 0 | 0 | 1 |
| 1 | 1 | 0 | 1 | 1 | 1 | 1 | 0 |

- **Negation** $\\lnot A$ („nicht $A$“) kehrt den Wahrheitswert um.
- **Konjunktion** $A \\land B$ („$A$ und $B$“) ist nur wahr, wenn beide wahr sind.
- **Disjunktion** $A \\lor B$ („$A$ oder $B$“) ist wahr, wenn *mindestens eine* wahr ist – das mathematische „oder“ ist immer **einschließend**.
- **Implikation** $A \\to B$ („wenn $A$, dann $B$“; „aus $A$ folgt $B$“) ist nur falsch, wenn $A$ wahr und $B$ falsch ist.
- **Äquivalenz** $A \\leftrightarrow B$ („$A$ genau dann, wenn $B$“) ist wahr, wenn beide denselben Wahrheitswert haben.
- **Exklusives Oder** $A \\oplus B$ (XOR, „entweder … oder“) ist wahr, wenn genau eine wahr ist; es gilt $A \\oplus B \\equiv \\lnot(A \\leftrightarrow B)$.

> [!TIP] Vom Code zur Logik
> In JavaScript, Java, C oder Python entsprechen \`!a\`, \`a && b\` und \`a || b\` genau $\\lnot A$, $A \\land B$ und $A \\lor B$. XOR auf Wahrheitswerten ist \`a !== b\` bzw. \`a != b\`. Eine eingebaute Implikation gibt es nicht – man schreibt \`!a || b\`, und warum das stimmt, zeigt der nächste Abschnitt.

### Bindungsstärke

Damit man nicht jede Formel voll klammern muss, gilt die Konvention: $\\lnot$ bindet am stärksten, dann $\\land$, dann $\\lor$, dann $\\to$, dann $\\leftrightarrow$. Also bedeutet $\\lnot A \\land B \\to C$ dasselbe wie $((\\lnot A) \\land B) \\to C$. Im Zweifel – und in jeder Klausur – lieber Klammern setzen.

## Die Implikation richtig verstehen

Die Zeilen mit $A = 0$ verwirren am Anfang: Warum ist „wenn $A$, dann $B$“ wahr, wenn $A$ falsch ist? Die Implikation ist ein **Versprechen**: „Immer wenn $A$ eintritt, tritt auch $B$ ein.“ Gebrochen ist das Versprechen nur, wenn $A$ eintritt und $B$ nicht. Tritt $A$ gar nicht ein, wurde nichts gebrochen.

> [!BEISPIEL] Ein Versprechen
> „Wenn es morgen regnet, nehme ich einen Schirm mit.“ Regnet es nicht, ist die Aussage nicht widerlegt – egal ob ich einen Schirm mitnehme oder nicht. Nur „es regnet und ich habe keinen Schirm“ macht sie falsch.

Aus der Wahrheitstafel liest man die wichtige Umformung ab:

$$
A \\to B \\;\\equiv\\; \\lnot A \\lor B
$$

Daraus folgen drei Begriffe, die man sicher unterscheiden muss:

| Bezeichnung | Formel | gleichwertig zu $A \\to B$? |
|---|---|---|
| Implikation | $A \\to B$ | – |
| **Kontraposition** | $\\lnot B \\to \\lnot A$ | **ja** |
| Umkehrung (Konverse) | $B \\to A$ | nein |
| Inversion | $\\lnot A \\to \\lnot B$ | nein |

> [!MISTAKE] Umkehrschluss
> „Wenn eine Zahl durch 4 teilbar ist, ist sie gerade“ ist wahr. Die Umkehrung „Wenn eine Zahl gerade ist, ist sie durch 4 teilbar“ ist falsch (Gegenbeispiel 6). Die Kontraposition „Wenn eine Zahl ungerade ist, ist sie nicht durch 4 teilbar“ ist dagegen wieder wahr – sie sagt dasselbe wie die Ausgangsaussage.

**Sprechweisen:** Für $A \\to B$ sagt man auch „$A$ ist **hinreichend** für $B$“ und „$B$ ist **notwendig** für $A$“. Bei $A \\leftrightarrow B$ ist $A$ notwendig *und* hinreichend für $B$.

## Tautologie, Kontradiktion und Äquivalenz

> [!DEFINITION] Tautologie, Kontradiktion, erfüllbar
> Eine zusammengesetzte Aussage heißt **Tautologie** (allgemeingültig), wenn sie bei *jeder* Belegung der Variablen wahr ist, und **Kontradiktion** (unerfüllbar), wenn sie bei jeder Belegung falsch ist. Sie heißt **erfüllbar**, wenn es mindestens eine Belegung gibt, die sie wahr macht.

Die einfachsten Beispiele: $A \\lor \\lnot A$ (Satz vom ausgeschlossenen Dritten) ist eine Tautologie, $A \\land \\lnot A$ eine Kontradiktion.

> [!DEFINITION] Logische Äquivalenz
> Zwei Formeln $\\varphi$ und $\\psi$ heißen **logisch äquivalent**, geschrieben $\\varphi \\equiv \\psi$, wenn sie bei jeder Belegung denselben Wahrheitswert haben – also genau dann, wenn $\\varphi \\leftrightarrow \\psi$ eine Tautologie ist.

Achtung: $\\leftrightarrow$ ist ein Junktor *innerhalb* einer Formel, $\\equiv$ ist eine Aussage *über* zwei Formeln.

### Wahrheitstafel als Beweismethode

Mit $n$ Variablen gibt es $2^n$ Belegungen. Für kleine $n$ ist das Aufstellen der vollständigen Wahrheitstafel ein sicherer Beweis.

> [!BEISPIEL] Kontraposition nachweisen
> Zu zeigen: $A \\to B \\equiv \\lnot B \\to \\lnot A$.
>
> | $A$ | $B$ | $A \\to B$ | $\\lnot B$ | $\\lnot A$ | $\\lnot B \\to \\lnot A$ |
> |:-:|:-:|:-:|:-:|:-:|:-:|
> | 0 | 0 | 1 | 1 | 1 | 1 |
> | 0 | 1 | 1 | 0 | 1 | 1 |
> | 1 | 0 | 0 | 1 | 0 | 0 |
> | 1 | 1 | 1 | 0 | 0 | 1 |
>
> Die Spalten 3 und 6 stimmen in jeder Zeile überein, also sind die Formeln äquivalent.

## Die wichtigsten Gesetze

Für beliebige Aussagen $A, B, C$ gelten die folgenden Äquivalenzen. Jede lässt sich mit einer Wahrheitstafel nachprüfen; zusammen erlauben sie das **Umformen** von Formeln ohne Tafel – ähnlich wie Rechengesetze beim Vereinfachen von Termen.

| Name | Gesetz |
|---|---|
| Doppelte Negation | $\\lnot\\lnot A \\equiv A$ |
| Kommutativität | $A \\land B \\equiv B \\land A$, $\\quad A \\lor B \\equiv B \\lor A$ |
| Assoziativität | $(A \\land B) \\land C \\equiv A \\land (B \\land C)$, ebenso für $\\lor$ |
| Distributivität | $A \\land (B \\lor C) \\equiv (A \\land B) \\lor (A \\land C)$ |
| | $A \\lor (B \\land C) \\equiv (A \\lor B) \\land (A \\lor C)$ |
| De Morgan | $\\lnot(A \\land B) \\equiv \\lnot A \\lor \\lnot B$, $\\quad \\lnot(A \\lor B) \\equiv \\lnot A \\land \\lnot B$ |
| Idempotenz | $A \\land A \\equiv A$, $\\quad A \\lor A \\equiv A$ |
| Absorption | $A \\land (A \\lor B) \\equiv A$, $\\quad A \\lor (A \\land B) \\equiv A$ |
| Implikation | $A \\to B \\equiv \\lnot A \\lor B$ |
| Äquivalenz | $A \\leftrightarrow B \\equiv (A \\to B) \\land (B \\to A)$ |

> [!SATZ] Regeln von De Morgan
> Für alle Aussagen $A$ und $B$ gilt
> $$
> \\lnot(A \\land B) \\equiv \\lnot A \\lor \\lnot B \\qquad\\text{und}\\qquad \\lnot(A \\lor B) \\equiv \\lnot A \\land \\lnot B .
> $$

> [!BEWEIS]
> Wir prüfen die erste Regel mit allen vier Belegungen. $\\lnot(A \\land B)$ ist genau dann falsch, wenn $A \\land B$ wahr ist, also nur bei $A = B = 1$. Ebenso ist $\\lnot A \\lor \\lnot B$ genau dann falsch, wenn $\\lnot A$ und $\\lnot B$ beide falsch sind, also nur bei $A = B = 1$. Beide Formeln sind somit in genau derselben Zeile falsch und in allen anderen wahr. Die zweite Regel folgt, indem man die erste auf $\\lnot A$ und $\\lnot B$ anwendet und beide Seiten negiert: $\\lnot(\\lnot A \\land \\lnot B) \\equiv A \\lor B$, also $\\lnot(A \\lor B) \\equiv \\lnot A \\land \\lnot B$.

> [!BEISPIEL] Umformen statt Tafel
> Zu zeigen: $(A \\to B) \\land (A \\to C) \\equiv A \\to (B \\land C)$.
> $$
> \\begin{aligned}
> (A \\to B) \\land (A \\to C) &\\equiv (\\lnot A \\lor B) \\land (\\lnot A \\lor C) && \\text{(Implikation)}\\\\
> &\\equiv \\lnot A \\lor (B \\land C) && \\text{(Distributivität)}\\\\
> &\\equiv A \\to (B \\land C) && \\text{(Implikation)}
> \\end{aligned}
> $$

> [!TIP] De Morgan im Code
> \`!(user != null && user.isAdmin)\` ist dasselbe wie \`user == null || !user.isAdmin\`. Solche Umformungen machen Bedingungen lesbarer – und helfen beim Verneinen von Schleifenbedingungen: Die Schleife \`while (i < n && !gefunden)\` endet, wenn \`i >= n || gefunden\` gilt.

## Funktional vollständige Junktoren

Jede Wahrheitstafel mit $n$ Eingängen lässt sich allein mit $\\lnot$, $\\land$ und $\\lor$ ausdrücken: Man nimmt für jede Zeile mit Ergebnis 1 eine Konjunktion der passenden (ggf. negierten) Variablen und verknüpft alle diese Konjunktionen mit $\\lor$. Das Ergebnis heißt **disjunktive Normalform** (DNF).

> [!BEISPIEL] XOR als DNF
> $A \\oplus B$ ist in den Zeilen $(0,1)$ und $(1,0)$ wahr. Also
> $$
> A \\oplus B \\equiv (\\lnot A \\land B) \\lor (A \\land \\lnot B).
> $$

Weil man mit De Morgan $\\lor$ durch $\\lnot$ und $\\land$ ersetzen kann, genügen sogar $\\{\\lnot, \\land\\}$. Noch sparsamer ist der **NAND**-Junktor $A \\barwedge B :\\equiv \\lnot(A \\land B)$ allein: $\\lnot A \\equiv A \\barwedge A$ und $A \\land B \\equiv \\lnot(A \\barwedge B)$. Deshalb lassen sich ganze Prozessoren aus NAND-Gattern bauen. Normalformen und ihre Vereinfachung behandelt das Modul [Diskrete Mathematik](#/mathe/diskrete-mathematik).

## Logisches Schließen

Beweise bestehen aus Schlussregeln. Die wichtigste ist der **Modus ponens**: Wenn $A$ wahr ist und $A \\to B$ wahr ist, dann ist $B$ wahr. Formal ist $(A \\land (A \\to B)) \\to B$ eine Tautologie.

Weitere gültige Schlussformen (jeweils als Tautologie nachprüfbar):

- **Modus tollens:** aus $A \\to B$ und $\\lnot B$ folgt $\\lnot A$ – die Grundlage des Beweises durch Kontraposition.
- **Kettenschluss:** aus $A \\to B$ und $B \\to C$ folgt $A \\to C$.
- **Fallunterscheidung:** aus $A \\lor B$, $A \\to C$ und $B \\to C$ folgt $C$.

> [!MISTAKE] Bejahung des Hinterglieds
> Aus $A \\to B$ und $B$ folgt **nicht** $A$. „Wenn der Server abstürzt, schlägt der Health-Check fehl. Der Health-Check schlägt fehl. Also ist der Server abgestürzt.“ – Der Check kann auch wegen eines Netzwerkproblems fehlschlagen.

Wie diese Regeln in vollständigen Beweisen eingesetzt werden, zeigt die Lektion [Beweistechniken](#/mathe/grundlagen/beweistechniken).

## Zusammenfassung

- Aussagen sind wahr oder falsch; Junktoren verknüpfen sie, Wahrheitstafeln definieren die Verknüpfung.
- $A \\to B$ ist nur bei „$A$ wahr, $B$ falsch“ falsch und äquivalent zu $\\lnot A \\lor B$ und zur Kontraposition $\\lnot B \\to \\lnot A$ – nicht aber zur Umkehrung $B \\to A$.
- Äquivalenzen weist man mit Wahrheitstafeln oder durch Umformen mit den Gesetzen (De Morgan, Distributivität …) nach.
- $\\{\\lnot, \\land, \\lor\\}$ und sogar NAND allein sind funktional vollständig.
`;export{e as default};
