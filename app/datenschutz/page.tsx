import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutz – Luca-Max Baur",
  robots: { index: false },
};

export default function Datenschutz() {
  return (
    <main className="legal">
      <a href="../">Zurück zur Startseite</a>
      <h1>Datenschutz</h1>

      <p>
        Das ist eine private Seite, auf der ich mich und meine Projekte vorstelle. Sie dient keinem Geschäft und
        enthält keine Werbung.
      </p>

      <h2>Verantwortlich</h2>
      <p>Luca-Max Baur, E-Mail: lucamaxbaur98@gmail.com</p>

      <h2>Was passiert beim Aufruf</h2>
      <p>
        Die Seite setzt keine Cookies, nutzt kein Tracking und lädt keine Schriften oder Skripte von fremden Servern.
        Sie liegt bei GitHub Pages. Beim Aufruf speichert der Hosting-Anbieter technisch notwendige Zugriffsdaten
        (zum Beispiel IP-Adresse und Zeitpunkt) in Server-Logs. Darauf habe ich keinen Einfluss.
      </p>

      <h2>Wenn du mir schreibst</h2>
      <p>
        Ich verarbeite deine E-Mail-Adresse und den Inhalt der Nachricht nur, um dir zu antworten. Du kannst jederzeit
        verlangen, dass ich sie lösche.
      </p>

      <h2>Bilder und Daten in den Beispielen</h2>
      <p>
        Alle Screenshots und Grafiken zu meinen Projekten zeigen erfundene Namen und Beispielwerte, keine echten
        Spielerinnen.
      </p>
    </main>
  );
}
