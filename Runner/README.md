# Runner

## Table of Contents
[Generelle Information](#generelle-information)

[How to](#how-to)

[Links](#links)

[Erfüllte Kriterien](#kriterien)

## Generelle Information
* Title: Runner
* Author: Lara Franke 
* Semester: SoSe23, 6. Semester
* Curriculum: Prototyping Interaktiver Medien-Apps und Games
* Docent: Prof. Jirka Dell´Oro-Friedl

## How to 
Das Spiel basiert auf dem Konzept eines IDLE-Games, welche das Ziel haben, Geld zu sammeln, um Verbesserungen zu erwerben, die einem dabei helfen, schneller Geld zu verdienen. Der Charakter greift an, indem man die Leertaste drückt, während Verbesserungen durch das Klicken auf die Buttons am Rand des Spiels erworben werden können. 
Durch den Reset-Button besteht die Möglichkeit, das Spiel von vorne zu beginnen.


## Links
* [Link zum Code:](https://github.com/larafra99/Prima/tree/main/Runner)
* [Link zur Anwendung:](https://larafra99.github.io/Prima/Runner/index)
* [Link zum Design Dokumen:](https://github.com/larafra99/Prima/blob/main/Runner/DesignDocument/DesignDocument_Runner_LaraFranke.pdf)

## Kriterien

| Nr | Criterion           | Explanation                                                                                                                                     |
|---:|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
|  1 | Units and Positions | Der Charakter hat eine Breite von 1x2, wobei die Null am linken Rand und die Eins am rechten Rand positioniert sind. Das Pet hingegen hat eine Größe von 1x1.                                                              |
|  2 | Hierarchy           | Die einzelnen Noten  sind alle einem Graphen untergeordnet, der auch die ComponentCamera enthält.<br><b>Game:</b><ul><li>Background</li><li>Player</li><li>Opponents</li><li>Pet</li><li>Sun<ul></li><li>Light</li></ul> Im Knoten "Opponents" generiert das Spiel zur Laufzeit Gegner, die dann als Knoten untergeordnet werden. Mit "Opponents" werden auch alle Gegner gleichzeitig und mit derselben Geschwindigkeit bewegt.                                                              |
|  3 | Editor              | Der Editor wurde hauptsächlich für das Erstellen der Hierarchie und das Einsetzen des Hintergrunds sowie das Erstellen der Animationen für das Haustier und den Charakters verwendet.                                                            |
|  4 | Scriptcomponents    | Ich habe ScriptComponents hauptsächlich für die Kollisionsabfrage  zwischen Charakter und Gegner verwendet. Außerdem gibt es eine weitere ScriptComponent, die jedem einzelnen Gegner zugeordnet ist. Diese überprüft, ob der Gegner noch im Sichtfeld befindet. Wenn nicht, wird der Gegner aus dem Opponents-Knoten gelöscht. Dadurch bleibt der Opponents-Knoten  möglichst klein.                                                          |
|  5 | Extend              | Ich habe zwei extended Klassen verwendet, die erste erstellt die einzelne OpponentsNode mit den Attributen( Gegener erstellung). Die zweite definiert die Aktionen des Spielers, also welche Animationen verwendet werden und die aktuelle Bewegungsgeschwindigkeit                        |
|  6 | Sound               | Es wird ein Hintergrundmusik abgespielt, die für den Sound Effekt des Schwertangriffs unterbrochen wird                                              |
|  7 | VUI                 | Die Benutzeroberfläche besteht aus drei Teilen. Oben am Bildschirmrand befinden sich Anzeigen für den Geldbetrag und die aktuelle Bewegungsgeschwindigkeit des Charakters. An der linken Seite befinden sich Buttons, mit denen Verbesserungen erworben werden können, z. B. um mehr Geld von Gegnern zu erhalten. In der unteren linken Ecke befindet sich ein Reset-Button, mit dem das Spiel neu gestartet werden kann.kann.                                           |
|  8 | Event-System        | Das Eventssystem wurde zum Beispiel genutzt, um nach der Kollision von Spieler und Gegener, die Geschwindigkeit des Pets und der Gegner auf die aktuelle Geschwindigkeit des Charakters anzupassen |
|  9 | External Data       |  Die "config.json" bestimmt die Anfangswerte für das Spiel, darunter die Geschwindigkeit des Charakters, die maximale zu erreichende Geschwindigkeit, das Startgeld und die Ausgangswerte für die Multiplikatoren der Geld-Drop-Rate der Gegner und den Wert des Geldes.                        |
|  A | Light               | Es wird ein Ambientes Licht verwendet, welches sich in der Sonne des Hintergrunds befindet                                                                         |
|  B | Physics             | Mithilfe der Physik, werden die Kollisionen von Gegner und Charakter durch deren Rigidbodys erfasst.                                           |
|  C | Net                 | wird nicht verwendet                                                                                                  |
|  D | State Machines      | Das Haustier verfügt über eine State Machines  , die zwischen verschiedenen Zuständen wechselt. Dadurch wird das Tier zum Beispiel dazu gebracht, nach vorne zu laufen.                                   |
|  E | Animation           | Es werden SpriteSheetAnimations verwendet um den Charakter und das Pet zu animieren                                                   |
    
