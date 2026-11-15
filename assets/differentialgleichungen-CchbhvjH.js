const e=`---
id: differentialgleichungen
title: Gewöhnliche Differentialgleichungen
module: analysis-2
order: 4
difficulty: fortgeschritten
minutes: 50
summary: Was Differentialgleichungen beschreiben, Anfangswertprobleme, exponentielles und logistisches Wachstum, Trennung der Variablen, lineare Gleichungen erster Ordnung, Schwingungen zweiter Ordnung und das Euler-Verfahren als numerische Lösung.
tags: [Differentialgleichung, Anfangswertproblem, Trennung der Variablen, Exponentielles Wachstum, Logistisches Wachstum, Euler-Verfahren]
requires: [integrationstechniken]
---

## Gleichungen für Funktionen

Viele Gesetze sagen nicht, **wie groß** eine Größe ist, sondern **wie schnell sie sich ändert**: Ein radioaktives Präparat zerfällt proportional zu seiner Menge; ein Körper kühlt proportional zum Temperaturunterschied ab; eine Feder zieht proportional zur Auslenkung zurück. Solche Gesetze sind **[[Differentialgleichung|Differentialgleichungen]]** – Gleichungen, in denen eine unbekannte **Funktion** und ihre Ableitungen vorkommen.

> [!DEFINITION] Gewöhnliche Differentialgleichung
> Eine **gewöhnliche Differentialgleichung** (DGL) $n$-ter Ordnung ist eine Gleichung zwischen $t$, einer unbekannten Funktion $y(t)$ und ihren Ableitungen bis $y^{(n)}$, etwa $y' = f(t, y)$ für die erste Ordnung. Eine **Lösung** ist eine differenzierbare Funktion, die die Gleichung für alle $t$ eines Intervalls erfüllt.
>
> Ein **Anfangswertproblem** (AWP) fordert zusätzlich Startwerte, z. B. $y(t_0) = y_0$.

Eine DGL hat meist **unendlich viele** Lösungen (eine Schar mit Konstanten); erst die Anfangswerte wählen eine aus. Bei erster Ordnung braucht man einen Anfangswert, bei $n$-ter Ordnung $n$ (etwa Ort und Geschwindigkeit).

> [!SATZ] Existenz und Eindeutigkeit (Picard-Lindelöf, vereinfacht)
> Ist $f(t, y)$ stetig und nach $y$ stetig differenzierbar, so hat das Anfangswertproblem $y' = f(t, y)$, $y(t_0) = y_0$ in einer Umgebung von $t_0$ **genau eine** Lösung.

Für Simulationen ist das die Garantie, dass ein Modell mit gegebenem Startzustand eine eindeutige Zukunft hat – und dass numerische Verfahren gegen etwas Bestimmtes konvergieren können.

## Exponentielles Wachstum und Zerfall

> [!SATZ] Die einfachste DGL
> Das Anfangswertproblem $y' = k\\,y$, $y(0) = y_0$ hat die eindeutige Lösung
> $$
> y(t) = y_0\\,\\e^{kt} .
> $$

> [!BEWEIS]
> $y(t) = y_0\\e^{kt}$ erfüllt $y' = k y_0 \\e^{kt} = ky$ und $y(0) = y_0$. Eindeutigkeit: Ist $z$ eine weitere Lösung, so ist $\\big(z(t)\\e^{-kt}\\big)' = z'\\e^{-kt} - kz\\e^{-kt} = (kz - kz)\\e^{-kt} = 0$. Also ist $z\\e^{-kt}$ konstant, gleich dem Wert $z(0) = y_0$ bei $t = 0$.

- $k > 0$: exponentielles Wachstum mit **Verdopplungszeit** $T_2 = \\frac{\\ln 2}{k}$.
- $k < 0$: exponentieller Zerfall mit **Halbwertszeit** $T_{1/2} = \\frac{\\ln 2}{\\abs k}$.

> [!BEISPIEL] Abkühlung nach Newton
> Ein Kaffee mit $90\\,°\\mathrm C$ steht in einem Raum mit $20\\,°\\mathrm C$. Das Abkühlungsgesetz lautet $T' = -k(T - 20)$. Mit $u = T - 20$ wird daraus $u' = -ku$, also $T(t) = 20 + 70\\,\\e^{-kt}$. Hat er nach 10 Minuten $60\\,°\\mathrm C$, folgt $70\\e^{-10k} = 40$, also $k = \\frac{1}{10}\\ln\\frac74 \\approx 0{,}056$ pro Minute. Trinkbare $50\\,°\\mathrm C$ erreicht er bei $t = \\frac{\\ln(70/30)}{k} \\approx 15{,}1$ Minuten.

## Trennung der Variablen

DGLs der Form $y' = g(t)\\,h(y)$ lassen sich durch **Trennen** lösen: alles mit $y$ auf eine Seite, alles mit $t$ auf die andere, dann beide Seiten integrieren.

> [!SATZ] Trennung der Variablen
> Für $y' = g(t)\\,h(y)$ mit $h(y) \\neq 0$ gilt
> $$
> \\int \\frac{\\mathrm dy}{h(y)} = \\int g(t)\\dd t + C .
> $$
> Auflösen nach $y$ liefert die allgemeine Lösung; die Konstante $C$ bestimmt der Anfangswert. Nullstellen $y^*$ von $h$ liefern zusätzlich die konstanten Lösungen $y \\equiv y^*$.

Die Merkregel „$\\frac{\\mathrm dy}{\\mathrm dt} = g(t)h(y) \\Rightarrow \\frac{\\mathrm dy}{h(y)} = g(t)\\dd t$“ ist formal; gerechtfertigt wird sie durch die [Substitutionsregel](#/mathe/analysis-2/integrationstechniken).

> [!BEISPIEL] Trennung durchgerechnet
> $y' = 2t\\,y^2$, $y(0) = 1$.
> $$
> \\int \\frac{\\mathrm dy}{y^2} = \\int 2t \\dd t \\;\\Longrightarrow\\; -\\frac1y = t^2 + C \\;\\Longrightarrow\\; y = -\\frac{1}{t^2 + C} .
> $$
> Aus $y(0) = 1$ folgt $C = -1$, also $y(t) = \\frac{1}{1 - t^2}$. Die Lösung existiert nur für $-1 < t < 1$ und wächst an den Rändern über alle Grenzen – sie „explodiert in endlicher Zeit“, obwohl die rechte Seite harmlos aussieht.

### Logistisches Wachstum

Exponentielles Wachstum ist in der Realität nie dauerhaft: Ressourcen sind begrenzt. Das **logistische Modell** bremst das Wachstum, wenn die Kapazität $K$ erreicht wird:
$$
y' = r\\,y\\left(1 - \\frac yK\\right) .
$$
Trennung der Variablen und Partialbruchzerlegung liefern
$$
y(t) = \\frac{K}{1 + \\left(\\frac{K}{y_0} - 1\\right)\\e^{-rt}} .
$$
Die S-Kurve beschreibt die Ausbreitung von Innovationen, Nutzerwachstum einer Plattform, Epidemien in einfacher Näherung und das Training-Verhalten mancher Lernkurven. Die Sigmoid-Funktion aus neuronalen Netzen ist genau diese Kurve mit $K = r = 1$.

\`\`\`widget
plot: 1/(1 + 9e^(-x)); 0.1e^x | -1 8 -0.2 1.4
\`\`\`

Bis etwa zur Hälfte der Kapazität ähnelt die logistische Lösung (erste Kurve, $K = 1$, $y_0 = 0{,}1$) dem exponentiellen Wachstum (zweite Kurve), danach flacht sie ab.

## Lineare DGL erster Ordnung

> [!SATZ] Lösungsformel
> Die **lineare** DGL $y' + a(t)\\,y = b(t)$ hat mit einer Stammfunktion $A(t)$ von $a(t)$ die allgemeine Lösung
> $$
> y(t) = \\e^{-A(t)}\\left(\\int b(t)\\,\\e^{A(t)}\\dd t + C\\right).
> $$

Der Trick heißt **integrierender Faktor**: Multipliziert man die Gleichung mit $\\e^{A(t)}$, wird die linke Seite zu $\\big(y\\,\\e^{A(t)}\\big)'$ (Produktregel), und man kann direkt integrieren.

> [!BEISPIEL] Konstanter Zufluss
> Ein Speicher erhält $5$ Einheiten pro Sekunde und verliert $10\\,\\%$ seines Inhalts pro Sekunde: $y' = 5 - 0{,}1\\,y$, also $y' + 0{,}1y = 5$. Mit $A(t) = 0{,}1t$:
> $$
> y(t) = \\e^{-0{,}1t}\\left(\\int 5\\,\\e^{0{,}1t}\\dd t + C\\right) = \\e^{-0{,}1t}\\left(50\\,\\e^{0{,}1t} + C\\right) = 50 + C\\e^{-0{,}1t} .
> $$
> Für jeden Startwert nähert sich der Inhalt dem **Gleichgewicht** $y^* = 50$, bei dem Zu- und Abfluss gleich sind. So verhalten sich Warteschlangen mit konstantem Zulauf, Caches mit Verdrängung und viele Regelkreise.

## Zweite Ordnung: Schwingungen

Eine Masse $m$ an einer Feder mit Federkonstante $c$ (ohne Reibung) erfüllt nach Newton $m\\,y'' = -c\\,y$, also
$$
y'' + \\omega^2 y = 0, \\qquad \\omega = \\sqrt{c/m} .
$$
Der Ansatz $y = \\e^{\\lambda t}$ führt auf $\\lambda^2 + \\omega^2 = 0$, also $\\lambda = \\pm\\ii\\omega$ ([komplexe Zahlen](#/mathe/algebra/komplexe-zahlen)). Die reellen Lösungen sind
$$
y(t) = A\\cos(\\omega t) + B\\sin(\\omega t),
$$
eine harmonische Schwingung mit Periode $\\frac{2\\pi}{\\omega}$; $A$ und $B$ bestimmen Anfangsort und Anfangsgeschwindigkeit. Mit Reibung ($y'' + 2\\delta y' + \\omega^2 y = 0$) erhält man gedämpfte Schwingungen – das Modell hinter Stoßdämpfern, Lautsprechern und „Spring“-Animationen in Benutzeroberflächen.

> [!TIP] Höhere Ordnung als System
> Jede DGL $n$-ter Ordnung lässt sich als System erster Ordnung schreiben: Mit $v = y'$ wird $y'' = -\\omega^2 y$ zu $y' = v$, $v' = -\\omega^2 y$. Numerische Löser arbeiten ausschließlich mit solchen Systemen $\\vec y' = \\vec f(t, \\vec y)$.

## Numerisch lösen: das Euler-Verfahren

Die meisten DGLs haben keine Lösungsformel. Simulationen (Physik-Engines, Wettermodelle, Schaltungssimulation) lösen sie numerisch in kleinen Zeitschritten $h$.

> [!DEFINITION] Explizites Euler-Verfahren
> Für $y' = f(t, y)$, $y(t_0) = y_0$:
> $$
> y_{k+1} = y_k + h\\, f(t_k, y_k), \\qquad t_{k+1} = t_k + h .
> $$

Man folgt in jedem Schritt der Tangente – die Ableitung als [lineare Näherung](#/mathe/analysis-1/differentialrechnung). Der Fehler am Ende eines festen Intervalls ist proportional zu $h$ (Verfahren **erster Ordnung**): halbe Schrittweite, halber Fehler.

\`\`\`python title="Euler-Verfahren für y' = y, y(0) = 1"
import math

def euler(f, t0, y0, h, schritte):
    t, y = t0, y0
    for _ in range(schritte):
        y = y + h * f(t, y)
        t = t + h
    return y

for h in [0.1, 0.01, 0.001]:
    n = round(1 / h)
    naeherung = euler(lambda t, y: y, 0.0, 1.0, h, n)
    print(h, naeherung, abs(naeherung - math.e))
# Fehler ≈ 0.125, 0.0135, 0.00136 – proportional zu h
\`\`\`

Für $y' = y$ liefert Euler $y_n = (1 + h)^n$ mit $h = \\frac1n$ – genau die Folge $\\left(1 + \\frac1n\\right)^n \\to \\e$ aus [Folgen und Grenzwerte](#/mathe/analysis-1/folgen-grenzwerte).

> [!WARNING] Instabilität
> Für $y' = -50\\,y$ (schneller Zerfall) und $h = 0{,}1$ ist $y_{k+1} = (1 - 5)\\,y_k = -4y_k$: Die Näherung oszilliert und explodiert, obwohl die exakte Lösung gegen $0$ geht. Explizites Euler ist nur für $\\abs{1 + hk} < 1$ stabil, hier also für $h < 0{,}04$. Für solche **steifen** Probleme nutzt man implizite Verfahren; für genaue Ergebnisse Verfahren höherer Ordnung wie Runge-Kutta 4 (Fehler $\\propto h^4$), wie sie etwa \`scipy.integrate.solve_ivp\` bereitstellt. Ausführlich behandelt das die Numerik-Lektion [Differentialgleichungen numerisch lösen](#/mathe/numerik/ode-verfahren).

## Zusammenfassung

- Eine DGL verknüpft eine Funktion mit ihren Ableitungen; Anfangswerte machen die Lösung eindeutig.
- $y' = ky$ hat die Lösung $y_0\\e^{kt}$; logistisches Wachstum begrenzt sie auf die Kapazität $K$.
- Trennung der Variablen für $y' = g(t)h(y)$; integrierender Faktor $\\e^{A(t)}$ für lineare DGLs erster Ordnung.
- Euler-Verfahren: $y_{k+1} = y_k + hf(t_k, y_k)$, Fehler $\\propto h$, Vorsicht bei steifen Problemen.
`;export{e as default};
