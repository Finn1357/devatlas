const e=`---
id: ki-grundlagen
title: KI-Grundlagen: Machine Learning, Deep Learning & neuronale Netze
area: ki
difficulty: einsteiger
minutes: 16
order: 10
summary: Was künstliche Intelligenz ist und was nicht, wie Maschinen aus Daten lernen, wie neuronale Netze funktionieren und welche Rolle Daten, Training und Evaluation spielen.
tags: [KI, Machine Learning, Deep Learning, Neuronale Netze, Training]
related: [llm-grundlagen, embeddings-rag, automatisierung]
---

## Begriffe sortieren

Die Begriffe werden oft durcheinandergeworfen. Sie sind ineinander verschachtelt:

\`\`\`text
Künstliche Intelligenz   – Systeme, die Aufgaben lösen, die „Intelligenz“ erfordern
└── Machine Learning     – Systeme, die Muster aus Daten lernen statt aus festen Regeln
    └── Deep Learning    – Machine Learning mit tiefen neuronalen Netzen
        └── Generative KI / LLMs – Deep-Learning-Modelle, die Text, Bilder, Code erzeugen
\`\`\`

- **[[Künstliche Intelligenz]]** umfasst auch regelbasierte Systeme (Expertensysteme, Schachprogramme mit Suchbäumen).
- **[[Machine Learning]]** dreht die klassische Programmierung um: Statt Regeln zu schreiben, zeigt man Beispiele, und das System findet die Regeln selbst.
- **[[Deep Learning]]** nutzt [[Neuronales Netz|neuronale Netze]] mit vielen Schichten und ist die Grundlage moderner Bild-, Sprach- und Textmodelle.

> [!BEGINNER]
> Klassische Programmierung: Du schreibst „Wenn die E-Mail ‚Gewinnspiel‘ enthält, ist sie Spam.“ Machine Learning: Du zeigst 100.000 E-Mails mit dem Etikett „Spam/kein Spam“ – und das Modell lernt selbst, woran man Spam erkennt, auch an Mustern, an die du nie gedacht hättest.

## Arten des Lernens

| Art | Daten | Ziel | Beispiele |
|---|---|---|---|
| **Überwachtes Lernen** | Eingaben mit bekannten Antworten (Labels) | Vorhersage für neue Eingaben | Spam-Filter, Preisprognose, Bilderkennung |
| **Unüberwachtes Lernen** | nur Eingaben | Strukturen finden | Kundensegmente (Clustering), Anomalieerkennung |
| **Bestärkendes Lernen** | Belohnung für Aktionen | Strategie lernen | Spiele, Robotik, Feintuning von Sprachmodellen |
| **Selbstüberwachtes Lernen** | Labels entstehen aus den Daten selbst | Repräsentationen lernen | Sprachmodelle: „nächstes Wort vorhersagen“ |

Bei überwachtem Lernen unterscheidet man **Klassifikation** (Kategorie vorhersagen: Spam ja/nein) und **Regression** (Zahl vorhersagen: Hauspreis).

## Wie ein Modell lernt

Ein Modell ist im Kern eine mathematische Funktion mit vielen einstellbaren Zahlen, den **Parametern** (Gewichten). Das [[Training]] läuft in einer Schleife:

1. **Vorhersage** für ein Trainingsbeispiel berechnen.
2. **Fehler messen** mit einer Verlustfunktion (Loss): Wie weit liegt die Vorhersage daneben?
3. **Gradient berechnen:** In welche Richtung muss jedes Gewicht verändert werden, damit der Fehler kleiner wird? (Backpropagation)
4. **Gewichte anpassen** – ein kleiner Schritt in diese Richtung (Gradientenabstieg).
5. Wiederholen – über Millionen Beispiele und viele Durchläufe (Epochen).

\`\`\`python title="Ein Mini-Modell mit scikit-learn"
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

X, y = load_iris(return_X_y=True)                       # Blütenmaße → Irisart
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

modell = RandomForestClassifier(n_estimators=100, random_state=42)
modell.fit(X_train, y_train)                             # Training
vorhersage = modell.predict(X_test)                      # Inferenz auf ungesehenen Daten
print(f"Genauigkeit: {accuracy_score(y_test, vorhersage):.2%}")
\`\`\`

Wie ein neuronales Netz in PyTorch trainiert wird, zeigt das Beispiel auf der [PyTorch-Seite](#/tech/pytorch).

## Neuronale Netze

Ein künstliches Neuron berechnet eine **gewichtete Summe** seiner Eingaben, addiert einen Bias und schickt das Ergebnis durch eine **nichtlineare Aktivierungsfunktion** (z. B. ReLU). Viele Neuronen bilden eine Schicht, viele Schichten ein tiefes Netz. Frühe Schichten erkennen einfache Muster (Kanten, Buchstabenfolgen), spätere immer abstraktere (Gesichter, Bedeutungen).

| Architektur | Stark bei |
|---|---|
| Feed-Forward (MLP) | tabellarische Daten, einfache Klassifikation |
| CNN (Convolutional) | Bilder |
| RNN / LSTM | Sequenzen (heute weitgehend abgelöst) |
| **[[Transformer]]** | Sprache, Code, zunehmend auch Bilder, Audio – Grundlage aller [LLMs](#/artikel/llm-grundlagen) |

## Daten sind das Fundament

> [!WARNING] Garbage in, garbage out
> Ein Modell kann nur lernen, was in den Daten steckt – inklusive ihrer Fehler und Verzerrungen. Sind in den Trainingsdaten bestimmte Gruppen unterrepräsentiert, funktioniert das Modell für sie schlechter (Bias).

Daten werden aufgeteilt in **Training** (lernen), **Validierung** (Einstellungen wählen) und **Test** (abschließend ehrlich messen). Der Testdatensatz darf das Modell vorher nie gesehen haben.

## Overfitting

[[Overfitting]] heißt: Das Modell lernt die Trainingsdaten auswendig – inklusive Rauschen – und versagt bei neuen Daten. Erkennbar an sehr guter Trainings- und schlechter Testleistung. Gegenmittel: mehr Daten, einfachere Modelle, Regularisierung, Dropout, frühzeitiges Stoppen.

## Den Erfolg messen

| Metrik | Bedeutung |
|---|---|
| Accuracy | Anteil richtiger Vorhersagen – irreführend bei unausgewogenen Klassen |
| Precision | Von allen als „Spam“ markierten: wie viele waren wirklich Spam? |
| Recall | Von allen echten Spam-Mails: wie viele wurden gefunden? |
| F1 | Harmonisches Mittel aus Precision und Recall |
| MAE / RMSE | mittlerer Fehler bei Regression |

> [!EXPERT] Warum Accuracy täuschen kann
> Bei einer Betrugserkennung mit 0,1 % Betrugsfällen erreicht ein Modell, das *immer* „kein Betrug“ sagt, 99,9 % Accuracy – und ist völlig nutzlos. Hier zählen Recall und Precision.

## Der Lebenszyklus

\`\`\`widget
pipeline:ml-pipeline
\`\`\`

## Verantwortung

- **Datenschutz:** Personenbezogene Trainingsdaten unterliegen der DSGVO.
- **Fairness:** Modelle auf Verzerrungen gegenüber Gruppen prüfen.
- **Transparenz:** Nachvollziehbar machen, wie Entscheidungen zustande kommen – besonders bei Kredit, Bewerbung, Medizin.
- **Regulierung:** Der EU AI Act stellt Anforderungen je nach Risikoklasse eines KI-Systems.

## Wie geht es weiter?

Wie große Sprachmodelle funktionieren, erklärt [LLMs, Tokens & Prompting](#/artikel/llm-grundlagen).
`;export{e as default};
