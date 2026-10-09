"use client";

import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import type Lenis from "lenis";
import { kapitel } from "./content";
import { dokTop, kapitelStand } from "@/lib/aktiv";

/** Kapitel-Leiste am rechten Rand. Zeigt das aktive Kapitel und den Fortschritt, Klick springt weich zum Kapitel. */
export default function Rail({ lenis }: { lenis: MutableRefObject<Lenis | null> }) {
  const nav = useRef<HTMLElement>(null);
  const balken = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = nav.current;
    if (!el) return;
    const punkte = Array.from(el.querySelectorAll<HTMLLIElement>("li"));

    const update = () => {
      const starts = kapitel
        .map((k) => document.getElementById(k.id))
        .filter((x): x is HTMLElement => !!x)
        .map(dokTop);
      if (starts.length !== kapitel.length) return;
      const linie = window.scrollY + window.innerHeight * 0.55;
      const doc = document.documentElement.scrollHeight;
      const s = kapitelStand(starts, linie, doc);
      el.style.setProperty("--fill", String(s.fuell));
      punkte.forEach((li, k) => {
        li.classList.toggle("on", k === s.index);
        li.classList.toggle("done", k < s.index);
        const a = li.querySelector("a");
        if (a) {
          if (k === s.index) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        }
      });
      el.classList.toggle("sichtbar", window.scrollY > window.innerHeight * 0.4);
      if (balken.current) {
        const max = Math.max(1, doc - window.innerHeight);
        balken.current.style.setProperty("--p", String(Math.min(1, window.scrollY / max)));
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("load", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("load", update);
    };
  }, []);

  const springe = (id: string) => (e: React.MouseEvent) => {
    const ziel = document.getElementById(id);
    if (!ziel) return;
    e.preventDefault();
    const y = dokTop(ziel);
    if (lenis.current) lenis.current.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <>
      <nav className="rail" ref={nav} aria-label="Kapitel">
        <ol>
          {kapitel.map((k) => (
            <li key={k.id}>
              <a href={`#${k.id}`} onClick={springe(k.id)}>
                <span className="lab">{k.label}</span>
                <span className="dot" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="progress" ref={balken} aria-hidden="true" />
    </>
  );
}
