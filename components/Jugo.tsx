"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Blick auf den Angriff: das Tor liegt oben bei (320, 40).
type Pos = [number, number];
type Name = "LA" | "HL" | "RM" | "HR" | "RA" | "KR";

const GRUND: Record<Name, Pos> = {
  LA: [78, 92], HL: [150, 222], RM: [320, 288], HR: [490, 222], RA: [562, 92], KR: [336, 168],
};

// Stand je Schritt: nur geänderte Spielerinnen und der Ball
const STAND: Array<{ pos: Partial<Record<Name, Pos>>; ball: Pos }> = [
  { pos: {}, ball: [150, 238] },
  { pos: { RM: [292, 284] }, ball: [490, 238] },
  { pos: { HL: [262, 318], RM: [150, 222], KR: [214, 168] }, ball: [490, 238] },
  { pos: { HL: [292, 238], RM: [150, 222], KR: [214, 168] }, ball: [292, 252] },
  { pos: { HL: [304, 196], RM: [150, 222], KR: [214, 168] }, ball: [304, 210] },
];

const TEXTE = [
  {
    t: "Aufstellung",
    d: "Gegen die 6:0-Abwehr stehen zwei Halbspieler, Rückraum Mitte, der Kreis und zwei Außen. Halb links hat den Ball.",
  },
  {
    t: "Der Ball wandert nach rechts",
    d: "Rückraum Mitte bekommt den Ball von Halb links, verlagert leicht nach links und passt weiter auf Halb rechts.",
  },
  {
    t: "Das leere Kreuzen",
    d: "Schon während dieses Passes läuft Halb links einen Bogen Richtung Mitte. Rückraum Mitte wechselt auf die freie Halb-links-Position. Der Kreis zieht nach links und bindet den Innenblock. Beide wechseln ohne Ball, daher der Name.",
  },
  {
    t: "Der Pass in den Anlauf",
    d: "Halb rechts spielt nach kurzer Verzögerung auf Halb links. Der muss rechtzeitig loslaufen, damit er in einer geraden Stoßbewegung ankommt und nicht quer.",
  },
  {
    t: "Die Abwehr muss sich entscheiden",
    d: "Bleibt der 4er passiv, wirft Halb links über den Innenblock. Geht er offensiv raus, entsteht ein 1:1 mit viel Anlauf. Hilft ein Nachbar, bleiben der Pass auf den Kreis oder zum freien Halbspieler.",
  },
];

const ABWEHR: Pos[] = [-72, -42, -14, 14, 42, 72].map((w) => [
  320 + 150 * Math.sin((w * Math.PI) / 180),
  40 + 150 * Math.cos((w * Math.PI) / 180),
]);

export default function Jugo() {
  const root = useRef<HTMLDivElement>(null);
  const stepRef = useRef(0);
  const [step, setStep] = useState(0);

  const gehe = (n: number, schnell = false) => {
    const i = Math.max(0, Math.min(STAND.length - 1, n));
    stepRef.current = i;
    setStep(i);
    const s = STAND[i];
    const q = gsap.utils.selector(root);
    (Object.keys(GRUND) as Name[]).forEach((k) => {
      const [x, y] = s.pos[k] ?? GRUND[k];
      gsap.to(q(`.jg-p[data-n="${k}"]`), { x, y, duration: schnell ? 0 : 1, ease: "power2.inOut", overwrite: "auto" });
    });
    gsap.to(q(".jg-ball"), { x: s.ball[0], y: s.ball[1], duration: schnell ? 0 : 0.9, ease: "power2.inOut", overwrite: "auto" });
    gsap.to(q(".jg-opt"), { opacity: i === 4 ? 1 : 0, duration: 0.5, overwrite: "auto" });
    gsap.to(q(".jg-lauf"), { opacity: i === 2 ? 1 : 0, duration: 0.5, overwrite: "auto" });
  };

  useGSAP(
    () => {
      (Object.keys(GRUND) as Name[]).forEach((k) => gsap.set(`.jg-p[data-n="${k}"]`, { x: GRUND[k][0], y: GRUND[k][1] }));
      gsap.set(".jg-ball", { x: STAND[0].ball[0], y: STAND[0].ball[1] });
      gsap.set([".jg-opt", ".jg-lauf"], { opacity: 0 });

      const mm = gsap.matchMedia();
      // Auf großen Schirmen steuert das Scrollen die Schritte, sonst die Knöpfe
      mm.add("(min-width: 861px) and (prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: "+=2200",
          pin: true,
          onUpdate: (self) => {
            const n = Math.min(STAND.length - 1, Math.floor(self.progress * STAND.length));
            if (n !== stepRef.current) gehe(n);
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section className="sec jugo" data-guide="jugo" data-kapitel="code" aria-labelledby="jugoh" ref={root}>
      <div className="wrap">
        <h2 className="h2" id="jugoh">
          <span className="mask"><span>Aus dem Playbook:</span></span>
          <span className="mask"><span>der Spielzug Jugo</span></span>
        </h2>
        <p className="lead jg-lead">
          In der App stehen meine Spielzüge als Seiten. Das Jugokreuz ist im Leistungshandball eine Standardauslösung:
          Zwei Rückraumspieler tauschen ohne Ball die Plätze, damit ein wurfstarker Halbspieler mit Anlauf auf die Mitte
          der Abwehr stößt.
        </p>

        <div className="jg-grid">
          <svg className="jg-court" viewBox="0 0 640 380" role="img" aria-label="Spielfeldhälfte mit Angriff und 6:0-Abwehr, die Laufwege des Jugokreuzes in fünf Schritten">
            <rect x="2" y="2" width="636" height="376" rx="10" className="jg-line" fill="none" />
            <rect x="290" y="10" width="60" height="30" className="jg-goal" />
            <path d="M170 40 A150 150 0 0 0 470 40" className="jg-line" fill="none" transform="rotate(0)" />
            <path d="M90 40 A230 230 0 0 0 550 40" className="jg-dash" fill="none" />
            {ABWEHR.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="13" className="jg-def" />
            ))}
            <path className="jg-lauf" d="M150 222 C170 300 230 330 292 252" />
            <g className="jg-opt">
              <path d="M304 196 L304 60" />
              <path d="M304 196 L214 168" />
              <path d="M304 196 L490 222" />
            </g>
            {(Object.keys(GRUND) as Name[]).map((k) => (
              <g key={k} className={`jg-p${k === "HL" ? " hl" : ""}`} data-n={k}>
                <circle r="17" />
                <text y="5" textAnchor="middle">{k}</text>
              </g>
            ))}
            <circle className="jg-ball" r="7" />
          </svg>

          <div className="jg-text">
            <ol>
              {TEXTE.map((s, i) => (
                <li key={s.t} className={i === step ? "on" : ""} aria-current={i === step ? "step" : undefined}>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </li>
              ))}
            </ol>
            <div className="jg-nav">
              <button type="button" onClick={() => gehe(step - 1)} disabled={step === 0}>Zurück</button>
              <span>{step + 1} von {TEXTE.length}</span>
              <button type="button" onClick={() => gehe(step + 1)} disabled={step === TEXTE.length - 1}>Weiter</button>
            </div>
            <p className="mute jg-note">
              Beschreibung nach meinem Playbook. LA und RA sind die Außen, HL und HR die Halbspieler, RM ist
              Rückraum Mitte, KR der Kreis. Es gibt eine Variante, den Jugo-Lövgren.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
