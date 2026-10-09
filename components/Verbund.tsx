"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Node = { id: string; x: number; y: number; w: number; h: number; title: string; sub: string; main?: boolean };

const NODES: Node[] = [
  { id: "sp", x: 20, y: 30, w: 210, h: 84, title: "SpielerPlus", sub: "Zu- und Absagen" },
  { id: "sync", x: 370, y: 30, w: 210, h: 84, title: "Anytype-Sync", sub: "Cronjob am Homeserver" },
  { id: "any", x: 690, y: 30, w: 300, h: 84, title: "Anytype", sub: "Spieler und Trainings" },
  { id: "balu", x: 690, y: 230, w: 300, h: 110, title: "Balu's Training", sub: "App fürs Handy, Server zu Hause", main: true },
  { id: "vid", x: 270, y: 243, w: 260, h: 84, title: "Balu-Videoschnitt", sub: "Szenen schneiden am PC" },
  { id: "hy", x: 1040, y: 243, w: 150, h: 84, title: "Spielerinnen", sub: "sehen ihre Clips" },
  { id: "ha", x: 290, y: 430, w: 240, h: 84, title: "Home Assistant", sub: "Haushalt und Wetter" },
  { id: "tafel", x: 690, y: 420, w: 300, h: 100, title: "Nebenschirm", sub: "Tafel am iMac" },
];

// Linien in Zeichenreihenfolge; head = Pfeilspitze (x, y, Richtung)
const EDGES = [
  { d: "M230 72 H370", head: [370, 72, "r"], lab: "Zu- und Absagen", lx: 300, ly: 58 },
  { d: "M580 72 H690", head: [690, 72, "r"], lab: "", lx: 635, ly: 58 },
  { d: "M840 114 V230", head: [840, 230, "d"], lab: "Spieler, Termine", lx: 856, ly: 178, anchor: "start" },
  { d: "M530 285 H690", head: [690, 285, "r"], lab: "Clip", lx: 610, ly: 271 },
  { d: "M990 285 H1040", head: [1040, 285, "r"], lab: "", lx: 1015, ly: 271 },
  { d: "M840 340 V420", head: [840, 420, "d"], lab: "Kader, Beteiligung", lx: 856, ly: 386, anchor: "start" },
  { d: "M530 472 H690", head: [690, 472, "r"], lab: "", lx: 610, ly: 458 },
] as const;

function head(h: readonly [number, number, string]) {
  const [x, y, dir] = h;
  return dir === "r"
    ? `${x},${y} ${x - 11},${y - 7} ${x - 11},${y + 7}`
    : `${x},${y} ${x - 7},${y - 11} ${x + 7},${y - 11}`;
}

const SCHRITTE = [
  "Zu- und Absagen laufen bei SpielerPlus ein. Ein Cronjob am Homeserver trägt sie nach Anytype ein, damit ich nichts doppelt pflege.",
  "Balu's Training zeigt der Mannschaft Termine, Trainingsplan und Videos, auch ohne Netz. Dort lose ich auch faire Teams aus.",
  "Nach dem Spiel schneide ich Szenen im Videoschnitt am PC, beschrifte sie und schicke sie nur an die Beteiligten.",
  "Die Tafel am iMac zeigt mir Termine, Zusagen und Haushalt auf einen Blick.",
];

export default function Verbund() {
  const root = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);

  // Video startet stumm, sobald es im Bild ist (nicht bei reduzierter Bewegung)
  useEffect(() => {
    const v = vid.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 861px)" }, (ctx) => {
        const { wide } = ctx.conditions as { wide: boolean };
        const q = gsap.utils.selector(root);
        const nodes = q<SVGGElement>(".vb-node");
        const edges = q<SVGPathElement>(".vb-edge");
        const heads = q<SVGPolygonElement>(".vb-head");
        const labs = q<SVGTextElement>(".vb-lab");

        // Die Karte baut sich beim Hereinscrollen auf und ist fertig, sobald sie ungefähr mittig im Fenster steht.
        // Danach bleibt sie fertig, auch beim Zurückscrollen. Auf kleinen Schirmen läuft die Zeichnung einmal von selbst ab.
        const tl = gsap.timeline({
          scrollTrigger: wide
            ? {
                trigger: ".vb-map",
                start: "top 88%",
                end: "center 62%",
                scrub: 0.4,
                // Ist die Zeichnung einmal fertig (oder beim Laden schon überscrollt), wird die Verknüpfung gelöst
                // `kill(false, true)`: Verknüpfung lösen, aber die Animation im Endzustand behalten
                onLeave: (self) => {
                  tl.progress(1);
                  self.kill(false, true);
                },
                onRefresh: (self) => {
                  if (self.progress >= 1) {
                    tl.progress(1);
                    self.kill(false, true);
                  }
                },
              }
            : { trigger: ".vb-map", start: "top 75%", once: true },
        });
        gsap.set(nodes, { opacity: 0 });
        gsap.set(edges, { strokeDashoffset: 1 });
        gsap.set([...heads, ...labs], { opacity: 0 });
        const seq = [
          { n: 0 }, { e: 0 }, { n: 1 }, { e: 1 }, { n: 2 }, { e: 2 }, { n: 3 }, { n: 4 }, { e: 3 },
          { n: 5 }, { e: 4 }, { n: 7 }, { e: 5 }, { n: 6 }, { e: 6 },
        ] as Array<{ n?: number; e?: number }>;
        seq.forEach((s) => {
          if (s.n !== undefined) tl.to(nodes[s.n], { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
          if (s.e !== undefined) {
            tl.to(edges[s.e], { strokeDashoffset: 0, duration: 0.6, ease: "none" });
            tl.to([heads[s.e], labs[s.e]], { opacity: 1, duration: 0.2 }, ">-0.1");
          }
        });
        if (!wide) tl.timeScale(2.4);
      });
    },
    { scope: root },
  );

  return (
    <section className="sec verbund" data-guide="zusammenhang" data-kapitel="code" aria-labelledby="zus" ref={root}>
      <div className="wrap">
        <h2 className="h2" id="zus">
          <span className="mask"><span>So hängt</span></span>
          <span className="mask"><span>alles zusammen</span></span>
        </h2>
        <p className="lead vb-lead">
          Aus einzelnen Programmen ist über die Jahre ein kleines System für meine Mannschaft geworden. Es läuft
          auf einem Rechner bei mir zu Hause.
        </p>

        <div className="vb-map">
          <svg viewBox="0 0 1200 560" role="img" aria-label="Datenfluss: SpielerPlus über Anytype-Sync und Anytype zu Balu's Training, dazu Videoschnitt, Spielerinnen, Home Assistant und die Tafel Nebenschirm">
            {EDGES.map((e, i) => (
              <g key={i}>
                <path className="vb-edge" d={e.d} pathLength={1} />
                <polygon className="vb-head" points={head(e.head as unknown as [number, number, string])} />
                {e.lab && (
                  <text className="vb-lab" x={e.lx} y={e.ly} textAnchor={"anchor" in e ? (e.anchor as "start") : "middle"}>
                    {e.lab}
                  </text>
                )}
              </g>
            ))}
            {NODES.map((n) => (
              <g key={n.id} className={`vb-node${n.main ? " main" : ""}`}>
                <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={16} />
                <text className="vb-title" x={n.x + 20} y={n.y + n.h / 2 - 4}>{n.title}</text>
                <text className="vb-sub" x={n.x + 20} y={n.y + n.h / 2 + 22}>{n.sub}</text>
              </g>
            ))}
          </svg>
        </div>

        <p className="vb-hinweis">Die Karte lässt sich seitlich wischen.</p>

        <div className="vb-cols">
          <ol className="vb-steps">
            {SCHRITTE.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <figure className="vb-video">
            <h3 className="vb-video-h">Der Weg eines Clips</h3>
            <p className="vb-video-sub">
              Vom Balu-Videoschnitt am PC in die App Balu&apos;s Training: So kommt eine Szene zur Spielerin.
            </p>
            <div className="browser">
              <div className="browser-bar" aria-hidden="true">
                <i /><i /><i />
                <span>Erklärvideo, 26 Sekunden</span>
              </div>
              <video
                ref={vid}
                controls
                muted
                loop
                playsInline
                preload="metadata"
                poster={`${BASE}/video/zusammenhang-poster.webp`}
                aria-label="Erklärvideo: Wie ein Clip vom Spiel zur Spielerin kommt"
              >
                <source src={`${BASE}/video/zusammenhang.mp4`} type="video/mp4" />
              </video>
            </div>
            <figcaption>Gezeichnete Figuren, erfundene Daten.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
