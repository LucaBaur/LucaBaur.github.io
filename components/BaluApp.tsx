"use client";

import { useState } from "react";
import { appTour } from "./content";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Rundgang durch Balu's Training: Reiter wechseln Bild und Text. Alle Bilder zeigen erfundene Demo-Daten. */
export default function BaluApp() {
  const [i, setI] = useState(0);
  const t = appTour[i];

  return (
    <section className="sec app-tour" data-guide="baluapp" data-kapitel="code" aria-labelledby="appt">
      <div className="wrap">
        <h2 className="h2" id="appt">
          <span className="mask"><span>Balu&apos;s Training</span></span>
          <span className="mask"><span>kann mehr</span></span>
        </h2>
        <p className="lead at-lead">
          Termine, Pläne, Videos und Spielzüge an einem Ort. Die App läuft auf meinem Homeserver und funktioniert auch
          ohne Netz.
        </p>

        <div className="at-grid">
          <div className="at-nav" role="tablist" aria-label="Funktionen der App">
            {appTour.map((a, k) => (
              <button
                key={a.id}
                type="button"
                role="tab"
                id={`at-${a.id}`}
                aria-selected={k === i}
                aria-controls="at-panel"
                onClick={() => setI(k)}
              >
                {a.label}
              </button>
            ))}
          </div>

          <div className="at-panel" id="at-panel" role="tabpanel" aria-labelledby={`at-${t.id}`}>
            <p className="at-text">{t.text}</p>
            <div className="browser">
              <div className="browser-bar" aria-hidden="true">
                <i /><i /><i />
                <span>Demo-Daten</span>
              </div>
              <div className="at-view">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img key={t.src} src={`${BASE}${t.src}`} alt={t.alt} width={t.w} height={t.h} loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
