"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TEXT = "Vieles davon ist für meine Mannschaft entstanden. Also zum Handball.";

/** Übergang von den Code-Projekten zum Handball: Ein Satz leuchtet auf, ein Spielfeld zeichnet sich. */
export default function Bridge() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        const trigger = { trigger: root.current, start: "top 70%", end: "bottom 80%", scrub: 0.6 };
        gsap.fromTo(q(".br-linie"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none", stagger: 0.08, scrollTrigger: trigger });
        gsap.fromTo(q(".bw"), { opacity: 0.16 }, { opacity: 1, ease: "none", stagger: 0.12, scrollTrigger: trigger });
      });
    },
    { scope: root },
  );

  return (
    <section className="bridge" id="handball" data-guide="bridge" data-kapitel="handball" ref={root} aria-label="Übergang zum Handball">
      <div className="br-in">
        <svg className="br-feld" viewBox="0 0 800 400" aria-hidden="true">
          <rect className="br-linie" x="4" y="4" width="792" height="392" rx="10" pathLength={1} />
          <path className="br-linie" d="M400 4 V396" pathLength={1} />
          <path className="br-linie" d="M4 90 A190 190 0 0 1 4 310" pathLength={1} />
          <path className="br-linie" d="M796 90 A190 190 0 0 0 796 310" pathLength={1} />
          <circle className="br-linie" cx="400" cy="200" r="42" pathLength={1} />
        </svg>
        <p className="br-text">
          {TEXT.split(" ").map((w, i) => (
            <span key={i} className="bw">
              {w}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
