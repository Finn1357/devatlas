const e=`---
id: gradientenverfahren
title: Gradienten und Gradientenabstieg
module: optimierung
order: 2
difficulty: profi
minutes: 50
summary: Partielle Ableitungen und Gradient, die Richtung des steilsten Abstiegs, Gradientenabstieg mit Lernrate und Konvergenzbedingungen, stochastischer Gradientenabstieg, Momentum und Backpropagation als Kettenregel.
tags: [Gradient, Gradientenabstieg, Lernrate, SGD, Momentum, Backpropagation, Kettenregel]
requires: [konvexitaet, differentialrechnung]
---

## Partielle Ableitungen und Gradient

Für eine Funktion $f\\colon \\R^n \\to \\R$ mehrerer Variablen fragt man, wie sie sich ändert, wenn man **eine** Variable bewegt und die anderen festhält.

> [!DEFINITION] Partielle Ableitung und Gradient
> Die **partielle Ableitung** nach $x_i$ ist
> $$
> \\frac{\\partial f}{\\partial x_i}(\\vec x) = \\lim_{h \\to 0} \\frac{f(\\vec x + h\\vec e_i) - f(\\vec x)}{h} .
> $$
> Der **[[Gradient]]** ist der Vektor aller partiellen Ableitungen:
> $$
> \\nabla f(\\vec x) = \\left(\\frac{\\partial f}{\\partial x_1}(\\vec x), \\dots, \\frac{\\partial f}{\\partial x_n}(\\vec x)\\right)^T .
> $$

Man rechnet wie gewohnt und behandelt die übrigen Variablen als Konstanten.

> [!BEISPIEL] Gradient berechnen
> $f(x, y) = x^2 y + 3y^2 - \\e^{x}$:
> $$
> \\frac{\\partial f}{\\partial x} = 2xy - \\e^x, \\qquad \\frac{\\partial f}{\\partial y} = x^2 + 6y, \\qquad \\nabla f(0, 1) = \\begin{pmatrix} -1 \\\\ 6 \\end{pmatrix}.
> $$

## Die Richtung des steilsten Anstiegs

Für eine differenzierbare Funktion gilt die lineare Näherung (vgl. [Differentialrechnung](#/mathe/analysis-1/differentialrechnung))
$$
f(\\vec x + \\vec h) \\approx f(\\vec x) + \\nabla f(\\vec x) \\cdot \\vec h .
$$
Die Änderung in Richtung eines Einheitsvektors $\\vec u$ ist die **Richtungsableitung** $\\nabla f \\cdot \\vec u$.

> [!SATZ] Steilster Anstieg
> Ist $\\nabla f(\\vec x) \\neq \\vec 0$, so ist die Richtungsableitung unter allen Einheitsvektoren $\\vec u$ maximal für $\\vec u = \\frac{\\nabla f}{\\norm{\\nabla f}}$ und minimal für $\\vec u = -\\frac{\\nabla f}{\\norm{\\nabla f}}$. Der Gradient zeigt in die Richtung des **steilsten Anstiegs**, seine Länge ist die Steigung in dieser Richtung.

> [!BEWEIS]
> Nach Cauchy-Schwarz ([Vektoren](#/mathe/lineare-algebra/vektoren)) ist $\\abs{\\nabla f \\cdot \\vec u} \\le \\norm{\\nabla f}\\,\\norm{\\vec u} = \\norm{\\nabla f}$, mit Gleichheit genau dann, wenn $\\vec u$ ein positives bzw. negatives Vielfaches von $\\nabla f$ ist.

Außerdem steht der Gradient senkrecht auf den **Höhenlinien** $\\set{\\vec x \\mid f(\\vec x) = c}$ – wie auf einer Wanderkarte, wo der steilste Weg die Höhenlinien rechtwinklig kreuzt.

## Gradientenabstieg

Die Idee liegt nahe: Um ein Minimum zu finden, geht man wiederholt ein Stück in Richtung des steilsten Abstiegs.

> [!DEFINITION] Gradientenabstieg
> Ausgehend von $\\vec x_0$ und einer **Lernrate** (Schrittweite) $\\eta > 0$:
> $$
> \\vec x_{k+1} = \\vec x_k - \\eta\\, \\nabla f(\\vec x_k) .
> $$

\`\`\`python title="Gradientenabstieg für f(x, y) = (x − 3)² + 10 (y + 1)²"
import numpy as np

def grad(p):
    x, y = p
    return np.array([2 * (x - 3), 20 * (y + 1)])

p = np.array([0.0, 0.0])
eta = 0.09
for k in range(200):
    g = grad(p)
    if np.linalg.norm(g) < 1e-8:
        break
    p = p - eta * g

print(k, p)   # konvergiert gegen das Minimum (3, -1)
\`\`\`

### Die Wahl der Lernrate

Die Lernrate entscheidet über Erfolg oder Misserfolg. Für die eindimensionale Funktion $f(x) = \\frac a2 x^2$ (mit $a > 0$) ist $\\nabla f = ax$ und
$$
x_{k+1} = x_k - \\eta a x_k = (1 - \\eta a)\\, x_k \\quad\\Longrightarrow\\quad x_k = (1 - \\eta a)^k x_0 .
$$
- Für $0 < \\eta < \\frac{2}{a}$ ist $\\abs{1 - \\eta a} < 1$: Konvergenz gegen $0$.
- Für $\\eta = \\frac1a$ ist man nach einem Schritt am Ziel.
- Für $\\eta > \\frac2a$ **divergiert** das Verfahren: Die Iterierten springen mit wachsender Amplitude hin und her.

In mehreren Dimensionen bestimmt die **stärkste Krümmung** (der größte Eigenwert $L$ der Hesse-Matrix) die erlaubte Lernrate $\\eta < \\frac2L$, die **schwächste Krümmung** $\\mu$ dagegen die Geschwindigkeit. Im Beispiel oben ist $L = 20$ und $\\mu = 2$: Mit $\\eta = 0{,}09 < 0{,}1$ konvergiert das Verfahren, in $x$-Richtung aber nur mit Faktor $\\abs{1 - 0{,}18} = 0{,}82$ pro Schritt. Das Verhältnis $\\kappa = \\frac L\\mu$ – die Kondition des Problems – bestimmt, wie stark die Iterierten im „Tal“ zickzacken.

> [!SATZ] Konvergenz für glatte konvexe Funktionen
> Ist $f$ konvex und $\\nabla f$ Lipschitz-stetig mit Konstante $L$ (die Krümmung ist durch $L$ beschränkt), so gilt für $\\eta = \\frac1L$
> $$
> f(\\vec x_k) - f(\\vec x^*) \\le \\frac{L\\,\\norm{\\vec x_0 - \\vec x^*}^2}{2k} .
> $$
> Ist $f$ zusätzlich stark konvex mit Konstante $\\mu > 0$, konvergiert das Verfahren linear: der Abstand zum Minimum schrumpft pro Schritt mindestens um den Faktor $1 - \\frac{\\mu}{L}$.

> [!WARNING] Lernrate in der Praxis
> Zu groß: Der Verlust explodiert oder wird \`NaN\`. Zu klein: Das Training dauert ewig oder bleibt auf Plateaus hängen. Übliche Strategien sind ein Lernraten-Test über mehrere Größenordnungen ($10^{-1}, 10^{-2}, \\dots$), Lernraten-Zeitpläne (Warm-up, Abklingen) und adaptive Verfahren wie Adam.

## Stochastischer Gradientenabstieg

Im Machine Learning ist die Verlustfunktion ein Mittelwert über $N$ Trainingsbeispiele:
$$
L(\\vec w) = \\frac1N \\sum_{i=1}^{N} \\ell_i(\\vec w), \\qquad \\nabla L(\\vec w) = \\frac1N \\sum_{i=1}^{N} \\nabla \\ell_i(\\vec w).
$$
Bei Millionen Beispielen ist schon ein einziger Gradient teuer. **Stochastischer Gradientenabstieg (SGD)** schätzt ihn aus einem zufälligen **Mini-Batch** $B$ von etwa 32 bis 1024 Beispielen:
$$
\\vec w_{k+1} = \\vec w_k - \\eta\\, \\frac{1}{\\abs B}\\sum_{i \\in B} \\nabla \\ell_i(\\vec w_k) .
$$
Der Schätzer ist **erwartungstreu** – sein [Erwartungswert](#/mathe/stochastik/zufallsvariablen) ist der echte Gradient –, und seine Varianz sinkt mit $\\frac{1}{\\abs B}$. Das Rauschen ist sogar nützlich: Es hilft, flachen Regionen und Sattelpunkten zu entkommen.

### Momentum und Adam

**Momentum** glättet die Richtung, indem es frühere Gradienten mit einem Faktor $\\beta \\approx 0{,}9$ nachwirken lässt:
$$
\\vec v_{k+1} = \\beta\\vec v_k + \\nabla f(\\vec x_k), \\qquad \\vec x_{k+1} = \\vec x_k - \\eta\\, \\vec v_{k+1} .
$$
Wie eine rollende Kugel beschleunigt das Verfahren in gleichbleibender Richtung und dämpft das Zickzack in schmalen Tälern. **Adam** kombiniert Momentum mit einer Lernrate pro Parameter, die durch eine laufende Schätzung der Gradientengröße geteilt wird – der heutige Standard beim Training neuronaler Netze.

## Backpropagation: die Kettenregel im großen Stil

Ein neuronales Netz ist eine Verkettung vieler einfacher Funktionen. Für eine Schicht gilt $\\vec a = \\sigma(W\\vec x + \\vec b)$ mit Gewichtsmatrix $W$ und Aktivierungsfunktion $\\sigma$. Den Gradienten der Verlustfunktion nach **allen** Gewichten berechnet man mit der mehrdimensionalen Kettenregel – rückwärts von der Ausgabe zur Eingabe.

> [!BEISPIEL] Ein Neuron von Hand
> Ein Neuron mit Eingabe $x$, Gewicht $w$, Bias $b$, Aktivierung $\\sigma(z) = \\frac{1}{1 + \\e^{-z}}$ und quadratischem Fehler zum Zielwert $y$:
> $$
> z = wx + b, \\qquad a = \\sigma(z), \\qquad \\ell = \\tfrac12 (a - y)^2 .
> $$
> Kettenregel, von hinten nach vorn:
> $$
> \\frac{\\partial \\ell}{\\partial a} = a - y, \\qquad \\frac{\\partial a}{\\partial z} = \\sigma(z)\\big(1 - \\sigma(z)\\big) = a(1 - a), \\qquad \\frac{\\partial z}{\\partial w} = x,
> $$
> also
> $$
> \\frac{\\partial \\ell}{\\partial w} = (a - y)\\, a (1 - a)\\, x, \\qquad \\frac{\\partial \\ell}{\\partial b} = (a - y)\\, a(1 - a) .
> $$
> Mit $x = 1$, $w = 0$, $b = 0$, $y = 1$: $a = \\sigma(0) = \\frac12$, $\\frac{\\partial \\ell}{\\partial w} = -\\frac12 \\cdot \\frac14 = -\\frac18$. Der Gradientenschritt erhöht $w$ – die Ausgabe wandert Richtung Ziel.

Backpropagation speichert beim Vorwärtsrechnen die Zwischenwerte ($z$, $a$) und berechnet beim Rückwärtsrechnen jede partielle Ableitung genau einmal. Der Aufwand für den kompletten Gradienten ist deshalb nur ein kleines Vielfaches einer Auswertung der Funktion – egal wie viele Millionen Parameter das Netz hat. Bibliotheken wie PyTorch und JAX automatisieren das als **automatisches Differenzieren** (Reverse Mode).

> [!MISTAKE] Verschwindende Gradienten
> Die Ableitung der Sigmoid-Funktion ist höchstens $\\frac14$. In einem Netz mit 20 Schichten wird der Gradient für die ersten Schichten mit bis zu $\\left(\\frac14\\right)^{20} \\approx 10^{-12}$ multipliziert – sie lernen praktisch nichts. Deshalb verwenden tiefe Netze ReLU-Aktivierungen ($\\max(0, z)$, Ableitung 0 oder 1), Normalisierungsschichten und Residualverbindungen.

## Zusammenfassung

- $\\nabla f$ sammelt die partiellen Ableitungen, zeigt in Richtung des steilsten Anstiegs und steht senkrecht auf Höhenlinien.
- Gradientenabstieg $\\vec x_{k+1} = \\vec x_k - \\eta\\nabla f(\\vec x_k)$ konvergiert bei konvexen, glatten $f$ für $\\eta < \\frac2L$; die Kondition $\\frac L\\mu$ bestimmt das Tempo.
- SGD schätzt den Gradienten aus Mini-Batches; Momentum und Adam beschleunigen und stabilisieren.
- Backpropagation ist die Kettenregel, rückwärts organisiert – Grundlage des Deep Learning.
`;export{e as default};
