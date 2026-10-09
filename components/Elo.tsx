"use client";

import { useState } from "react";

type P = { name: string; elo: number };
type Modus = "fair" | "zufall";
type Ergebnis = "A" | "B" | "U" | null;

// Erfundene Spielerinnen. Die Spielstärke entspricht den Startwerten der App: stark 1150, mittel 1000, schwach 850.
const TEAMS: Record<Modus, { a: P[]; b: P[] }> = {
  fair: {
    a: [{ name: "Mara", elo: 1150 }, { name: "Jule", elo: 1000 }, { name: "Fenja", elo: 850 }],
    b: [{ name: "Lotte", elo: 1150 }, { name: "Nora", elo: 1000 }, { name: "Kira", elo: 850 }],
  },
  zufall: {
    a: [{ name: "Mara", elo: 1150 }, { name: "Lotte", elo: 1150 }, { name: "Jule", elo: 1000 }],
    b: [{ name: "Nora", elo: 1000 }, { name: "Kira", elo: 850 }, { name: "Fenja", elo: 850 }],
  },
};

const K = 20; // nach den ersten 10 Spielen

const schnitt = (t: P[]) => t.reduce((s, p) => s + p.elo, 0) / t.length;
// Erwarteter Score gegen den Schnitt des Gegnerteams, wie in elo.py
const erwartung = (elo: number, gegner: number) => 1 / (1 + 10 ** ((gegner - elo) / 400));
const breite = (elo: number) => `${((elo - 700) / 600) * 100}%`;

function delta(p: P, gegnerSchnitt: number, score: number) {
  return Math.round(K * (score - erwartung(p.elo, gegnerSchnitt)));
}

export default function Elo() {
  const [modus, setModus] = useState<Modus>("fair");
  const [erg, setErg] = useState<Ergebnis>(null);

  const { a, b } = TEAMS[modus];
  const sa = schnitt(a);
  const sb = schnitt(b);
  const chanceA = Math.round(erwartung(sa, sb) * 100);

  const scoreA = erg === "A" ? 1 : erg === "B" ? 0 : 0.5;
  const scoreB = 1 - scoreA;

  const spalte = (team: P[], eigen: number, gegner: number, score: number, farbe: "a" | "b") => (
    <ul className={`elo-team ${farbe}`}>
      {team.map((p) => {
        const d = erg ? delta(p, gegner, score) : null;
        return (
          <li key={p.name}>
            <span className="elo-name">{p.name}</span>
            <span className="elo-bar" aria-hidden="true">
              <i style={{ width: breite(p.elo + (d ?? 0)) }} />
            </span>
            <span className="elo-val">{p.elo + (d ?? 0)}</span>
            <span className={`elo-d${d === null ? "" : d > 0 ? " plus" : d < 0 ? " minus" : ""}`} aria-live="polite">
              {d === null ? "" : d > 0 ? `+${d}` : d}
            </span>
          </li>
        );
      })}
      <li className="elo-avg">
        <span>Schnitt</span>
        <b>{Math.round(eigen)}</b>
      </li>
    </ul>
  );

  return (
    <section className="sec elo" data-guide="elo" data-kapitel="code" aria-labelledby="eloh">
      <div className="wrap">
        <h2 className="h2" id="eloh">
          <span className="mask"><span>Faire Teams</span></span>
          <span className="mask"><span>per ELO</span></span>
        </h2>

        <div className="elo-grid">
          <div className="elo-text">
            <h3>Warum</h3>
            <p>
              Ein Aufwärmspiel bringt nur etwas, wenn beide Teams eine Chance haben. Per Hand einzuteilen kostet
              Zeit und ist Bauchgefühl. Deshalb bekommt jede Spielerin in Balu&apos;s Training eine Spielstärke, aus der die
              App zwei gleich starke Teams bildet.
            </p>
            <h3>Wie</h3>
            <p>
              Jede Spielerin zählt so, als hätte sie allein gegen den Schnitt des anderen Teams gespielt. Die App
              rechnet aus, wie viel sie erwarten durfte, und vergleicht das mit dem Ergebnis. Wer mehr holt als
              erwartet, steigt. Wer weniger holt, sinkt.
            </p>
            <p className="elo-formel">
              Erwartung E = 1 / (1 + 10^((Gegner − eigene) / 400))
              <br />
              Änderung = K · (Ergebnis − E)
            </p>
            <p className="mute">
              K ist 40 in den ersten zehn Spielen und danach 20. Gestartet wird je nach Einschätzung bei 1150, 1000
              oder 850.
            </p>
            <h3>Was sie nicht ist</h3>
            <p>
              Die Zahl ist ein Werkzeug zum Auslosen. Spielerinnen sehen weder ihre ELO noch eine Rangliste. Das ist
              Absicht.
            </p>
          </div>

          <div className="elo-lab">
            <div className="elo-modus" role="group" aria-label="Wie wurden die Teams gebildet?">
              <button type="button" aria-pressed={modus === "zufall"} onClick={() => { setModus("zufall"); setErg(null); }}>
                Zufällig gelost
              </button>
              <button type="button" aria-pressed={modus === "fair"} onClick={() => { setModus("fair"); setErg(null); }}>
                Fair gelost
              </button>
            </div>

            <div className="elo-teams">
              <div>
                <h4>Team Blau</h4>
                {spalte(a, sa, sb, scoreA, "a")}
              </div>
              <div>
                <h4>Team Weiß</h4>
                {spalte(b, sb, sa, scoreB, "b")}
              </div>
            </div>

            <div className="elo-chance" aria-label={`Siegchance Team Blau ${chanceA} Prozent`}>
              <span className="elo-chance-a" style={{ width: `${chanceA}%` }}>
                {chanceA} %
              </span>
              <span className="elo-chance-b">{100 - chanceA} %</span>
            </div>
            <p className="elo-hint">
              {modus === "fair"
                ? "Beide Teams haben im Schnitt dieselbe Stärke, das Spiel ist offen."
                : "Team Blau ist deutlich stärker. Das Spiel ist früh entschieden."}
            </p>

            <div className="elo-erg" role="group" aria-label="Ergebnis eintragen">
              <span>Ergebnis eintragen:</span>
              <button type="button" aria-pressed={erg === "A"} onClick={() => setErg("A")}>Blau gewinnt</button>
              <button type="button" aria-pressed={erg === "U"} onClick={() => setErg("U")}>Unentschieden</button>
              <button type="button" aria-pressed={erg === "B"} onClick={() => setErg("B")}>Weiß gewinnt</button>
            </div>
            <p className="elo-hint">
              {erg === null
                ? "Probier es aus: Wer überraschend gewinnt, bekommt mehr Punkte."
                : "Die Werte gelten für Spielerinnen nach den ersten zehn Spielen (K = 20). Alle Namen sind erfunden."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
