"use client";

import { useEffect, useRef } from "react";
import { guide } from "./content";
import { aktiverAbschnitt, dokTop } from "@/lib/aktiv";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Avatar und Sprechblase leben in einem Container. Die Blase kann deshalb nie ohne Avatar sichtbar sein.
 * Der aktive Abschnitt wird bei jedem Scroll neu berechnet (letzter Abschnitt über der Leselinie),
 * es gibt keine Lücken zwischen Triggern. Die Zustände wechseln nur über CSS-Klassen.
 */
export default function Guide() {
  const root = useRef<HTMLDivElement>(null);
  const blase = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const b = blase.current;
    if (!el || !b) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let aktuell = "";
    let timer: number | undefined;
    let ruhe: number | undefined;

    const zeige = (key: string) => {
      const g = guide[key];
      if (!g) return;
      el.dataset.k = key;
      el.dataset.groesse = g.groesse;
      window.clearTimeout(timer);
      window.clearTimeout(ruhe);
      const sprach = el.classList.contains("spricht");
      el.classList.remove("spricht");
      if (!g.say) return;
      // Alte Blase ausblenden, dann Text tauschen und wieder einblenden
      timer = window.setTimeout(() => {
        b.textContent = g.say;
        el.classList.add("spricht");
        // Die Blase bleibt nur kurz stehen und verdeckt danach keinen Inhalt
        ruhe = window.setTimeout(() => el.classList.remove("spricht"), 7000);
      }, sprach && !still ? 240 : 0);
    };

    const update = () => {
      const abschnitte = Array.from(document.querySelectorAll<HTMLElement>("[data-guide]"));
      if (!abschnitte.length) return;
      const tops = abschnitte.map(dokTop);
      const i = aktiverAbschnitt(tops, window.scrollY + window.innerHeight * 0.55);
      const key = abschnitte[i].dataset.guide ?? "hero";
      if (key !== aktuell) {
        aktuell = key;
        zeige(key);
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    // Nach Schriften und Bildern ändern sich die Positionen
    window.addEventListener("load", update);
    // Erst nach dem Namens-Intro einblenden
    const bereit = window.setTimeout(() => el.classList.add("bereit"), still ? 0 : 1300);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(ruhe);
      window.clearTimeout(bereit);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("load", update);
    };
  }, []);

  return (
    <div className="guide" ref={root} data-groesse="gross" aria-hidden="true">
      <div className="guide-fig">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${BASE}/guide/luca-1.webp`} alt="" width={600} height={998} />
      </div>
      <div className="bubble" ref={blase} />
    </div>
  );
}
