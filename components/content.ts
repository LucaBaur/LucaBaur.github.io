export const steps = [
  {
    date: "bis 2021",
    title: "Informationstechnik, DHBW Stuttgart",
    text: "Dabei gemerkt: Mich interessiert weniger die Hardware als die Software und die Logik dahinter.",
  },
  {
    date: "Sommer 2020",
    title: "Werkstudent, Steinbeis Interagierende Systeme",
    text: "Test- und Use-Cases automatisiert, im agilen Team mit täglichen Sprint-Meetings.",
  },
  {
    date: "2021",
    title: "Wechsel an die Hochschule der Medien",
    text: "Medieninformatik mit Schwerpunkt Softwareentwicklung und KI.",
  },
  {
    date: "03–08/2023",
    title: "Pflichtpraktikum, Mercedes-Benz AG",
    text: "Chatbot, der Entwickler direkt in Microsoft Teams über das Ergebnis ihrer Jenkins-Builds informiert. Bei mehreren hundert Entwicklern spart das pro Ticket mehrere Minuten.",
  },
  {
    date: "08/2026",
    title: "B.Sc. Medieninformatik",
    text: "Bachelorarbeit zur Latenzoptimierung eines Museumsroboters, Note 2,0.",
  },
];

export const handball = [
  {
    date: "2014–2017",
    title: "Jugendbundesliga",
    text: "2014 Mitteldeutscher Meister in der B-Jugend.",
  },
  {
    date: "2017–2018",
    title: "FSJ und 2. Bundesliga, ThSV Eisenach",
    text: "Jugendtraining und Geschäftsstelle, nebenher Kaderspieler in der 2. Handball-Bundesliga.",
  },
  {
    date: "2019",
    title: "Aufstieg in die 3. Liga, TV Plochingen",
    text: "Ein Mannschaftsziel, für das die eigenen Interessen manchmal zurückstehen.",
  },
  {
    date: "seit 2021",
    title: "Trainer, TV Gerhausen",
    text: "Frauenmannschaft. Viel Vor- und Nachbereitung, damit jede Einheit anders ist und jede Spielerin zu ihrem Stand passt.",
  },
];

export type Shot = { src: string; w: number; h: number; label: string; alt: string };
export type Repo = { name: string; text: string; lang: string; shots: Shot[]; live?: string };

export const repos: Repo[] = [
  {
    name: "balus-training",
    text: "Offline-first PWA für meine Handballmannschaft: Anwesenheit, Trainingspläne, Videoclips, faire Teameinteilung.",
    lang: "Python",
    shots: [
      { src: "/repos/balus-training-1.webp", w: 960, h: 600, label: "Start", alt: "Startseite von Balu's Training mit nächstem Training und Schnellzugriff" },
      { src: "/repos/balus-training-2.webp", w: 680, h: 425, label: "Zusagen", alt: "Terminliste mit Zusagen, Unsicheren und Absagen je Spielerin" },
      { src: "/repos/balus-training-3.webp", w: 960, h: 600, label: "Plan", alt: "Trainingsplan eines Termins mit Blöcken und Übungen" },
    ],
  },
  {
    name: "jarvis",
    text: "Selbst gehostete Job-Warteschlange für lokale LLMs mit Pull-Workern und hardwarebewusster Planung.",
    lang: "Python",
    shots: [
      { src: "/repos/jarvis-1.webp", w: 880, h: 550, label: "Dashboard", alt: "Jarvis-Dashboard mit Worker-Status und Auftragsliste" },
      { src: "/repos/jarvis-2.webp", w: 880, h: 550, label: "Auftrag", alt: "Detailansicht eines erledigten Auftrags mit Antwort und Log" },
    ],
  },
  {
    name: "spielerplus-anytype-sync",
    text: "Überträgt Trainings-Zu- und Absagen aus SpielerPlus nach Anytype, inklusive Positionstabelle.",
    lang: "Python",
    shots: [
      { src: "/repos/anytype-sync-1.webp", w: 520, h: 420, label: "Fenster", alt: "Kleines Fenster mit den Trainings der Woche zur Auswahl" },
    ],
  },
  {
    name: "balu-videoschnitt",
    text: "Desktop-Werkzeug, um Spielszenen zu schneiden, zu beschriften und hochzuladen.",
    lang: "Python",
    shots: [
      { src: "/repos/balu-videoschnitt-1.webp", w: 980, h: 726, label: "Editor", alt: "Videoeditor mit Spielfeld, Pfeil- und Kreis-Markierung und Spielerinnenauswahl" },
    ],
  },
  {
    name: "nebenschirm",
    text: "Dashboard im Vollbild: Home Assistant, Listen, Haushaltsaufgaben und Zustand des Homeservers.",
    lang: "HTML",
    shots: [
      { src: "/repos/nebenschirm-1.webp", w: 1500, h: 662, label: "Tafel", alt: "Dunkles Vollbild-Dashboard mit Wetter, Kalender, Aufgaben, Haushalt und Serverstatus" },
    ],
  },
  {
    name: "Laufchallenge",
    text: "Statische Seite für eine sechswöchige Team-Laufchallenge mit Rangliste, Diagrammen und Countdown.",
    lang: "JavaScript",
    live: "https://lucabaur.github.io/Laufchallenge/",
    shots: [
      { src: "/repos/laufchallenge-1.webp", w: 1100, h: 688, label: "Teams", alt: "Team-Rangliste mit Kilometern, Höhenmetern und Kader" },
      { src: "/repos/laufchallenge-2.webp", w: 1100, h: 688, label: "Endstand", alt: "Endstand mit Podium, Punktetabelle und Punkteverteilung" },
    ],
  },
];

export const skills = [
  "Python",
  "FastAPI",
  "SQL",
  "JavaScript",
  "Docker",
  "Linux",
  "pytest",
  "Ollama",
  "Git",
  "Java",
  "C",
];

export const kapitel = [
  { id: "ueber", label: "Über mich" },
  { id: "weg", label: "Werdegang" },
  { id: "code", label: "Code" },
  { id: "handball", label: "Handball" },
  { id: "kontakt", label: "Kontakt" },
];

// Sprechblase und Größe des Avatars je Abschnitt. Leerer Text = Avatar ohne Blase.
export const guide: Record<string, { say: string; groesse: "gross" | "klein" }> = {
  hero: { groesse: "gross", say: "Hi, ich bin Luca. Ich zeige dir kurz, woran ich arbeite." },
  statement: { groesse: "klein", say: "Schreiben ist die eine Hälfte, Betreiben die andere." },
  facts: { groesse: "klein", say: "Drei Zahlen aus meinen Projekten." },
  skills: { groesse: "klein", say: "Das ist mein Werkzeugkasten." },
  timeline: { groesse: "klein", say: "Mein Weg bis hierher." },
  repos: { groesse: "klein", say: "Das meiste davon läuft im echten Einsatz." },
  baluapp: { groesse: "klein", say: "Das ist die App, die meine Mannschaft nutzt." },
  jugo: { groesse: "klein", say: "Ein Spielzug aus dem Playbook der App." },
  zusammenhang: { groesse: "klein", say: "So greift es ineinander." },
  elo: { groesse: "klein", say: "Warum ich eine ELO baue." },
  bridge: { groesse: "klein", say: "Und jetzt zum Handball." },
  team: { groesse: "klein", say: "Neben dem Code: Handball." },
  contact: { groesse: "gross", say: "Schreib mir einfach." },
};

export const appTour = [
  {
    id: "termine",
    label: "Wer kommt",
    text: "Zu- und Absagen laufen sofort ein. Pro Training sehe ich, wer dabei ist, wer unsicher ist und wer abgesagt hat, und kann die Offenen erinnern.",
    src: "/repos/balus-training-2.webp",
    w: 680,
    h: 425,
    alt: "Terminliste mit Zusagen, Unsicheren und Absagen je Spielerin",
  },
  {
    id: "plan",
    label: "Trainingsplan",
    text: "Ich schreibe den Plan als Text, ein Klick macht daraus Blöcke mit Uhrzeit und Dauer. So steht für jedes Training die Reihenfolge fest.",
    src: "/app/plan.webp",
    w: 910,
    h: 282,
    alt: "Trainingsplan mit vier Blöcken: Aufwärmen, Torwurfserie, 6 gegen 5 und Spielform, jeweils mit Uhrzeit und Dauer",
  },
  {
    id: "uebungen",
    label: "Übungen",
    text: "Meine Übungen sammle ich in einer Bibliothek, mit Ziel und Ablauf, damit ich sie nicht jedes Mal neu aufschreibe.",
    src: "/app/uebungen.webp",
    w: 610,
    h: 300,
    alt: "Liste der Übungen, zum Beispiel Torwurfserie in drei Stationen und 6 gegen 5 Überzahl",
  },
  {
    id: "videos",
    label: "Videos",
    text: "Szenen aus dem Spiel sehen nur die Spielerinnen, die darin vorkommen. Geschnitten und beschriftet wird im Videoschnitt am PC.",
    src: "/app/videos.webp",
    w: 1000,
    h: 300,
    alt: "Videoliste aus Sicht einer Spielerin mit dem Clip Testspiel Ulm",
  },
  {
    id: "ansicht",
    label: "Ansicht als",
    text: "Ich kann die App aus Sicht einer Spielerin ansehen, schreibgeschützt und mit Hinweis oben. So sehe ich, was sie sieht und wie oft sie beim Training war.",
    src: "/app/ansicht.webp",
    w: 1190,
    h: 420,
    alt: "Profil einer Spielerin in der Ansicht als, mit Hinweisband und Trainingsbeteiligung",
  },
  {
    id: "playbook",
    label: "Playbook",
    text: "Meine Spielzüge stehen als Seiten im Playbook, mit Ablauf und Varianten. Hier der Jugo. Direkt darunter erkläre ich ihn als Animation.",
    src: "/app/playbook.webp",
    w: 890,
    h: 510,
    alt: "Playbook-Seite Jugo mit Beschreibung und Ablauf des Spielzugs",
  },
];
