"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import HeroField from "./Hero";
import RepoRow from "./RepoRow";
import Verbund from "./Verbund";
import Elo from "./Elo";
import Jugo from "./Jugo";
import Guide from "./Guide";
import Rail from "./Rail";
import Bridge from "./Bridge";
import BaluApp from "./BaluApp";
import { handball, repos, skills, steps } from "./content";

gsap.registerPlugin(ScrollTrigger, useGSAP);
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const MAIL = "lucamaxbaur98@gmail.com";

function Mask({ children }: { children: React.ReactNode }) {
  return (
    <span className="mask">
      <span>{children}</span>
    </span>
  );
}

export default function Site() {
  const root = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // Weiches Scrollen, gekoppelt an den GSAP-Ticker
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.09 });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  // Nach Schriften und Bildern neu messen, damit Pins und Trigger an den richtigen Stellen sitzen
  useEffect(() => {
    // Kind-Komponenten legen ihre Pins früher an als diese Komponente: erst von oben nach unten sortieren
    const refresh = () => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };
    const first = requestAnimationFrame(refresh);
    document.fonts?.ready.then(refresh).catch(() => {});
    window.addEventListener("load", refresh);
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("load", refresh);
    };
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          wide: "(min-width: 861px)",
        },
        (ctx) => {
          const { motion, wide } = ctx.conditions as { motion: boolean; wide: boolean };
          const q = gsap.utils.selector(root);

          /* Maskierte Zeilen: CSS versteckt per `translate`, GSAP übernimmt per transform */
          function reveal(targets: ArrayLike<Element>, vars: gsap.TweenVars) {
            Array.from(targets).forEach((el) => ((el as HTMLElement).style.translate = "none"));
            return gsap.fromTo(targets, { yPercent: 112, y: 0 }, { yPercent: 0, y: 0, ease: "expo.out", ...vars });
          }

          if (!motion) return;

          /* Intro: Name, dann Unterzeile; danach der Guide */
          const intro = gsap.timeline({ delay: 0.15 });
          intro
            .add(reveal(q(".hero h1 .mask > span"), { duration: 1.25, stagger: 0.12 }), 0)
            .from(q(".hero-meta > *"), { opacity: 0, y: 18, duration: 0.9, ease: "power3.out", stagger: 0.1 }, 0.7);

          /* Überschriften: Zeilen heben sich beim Eintritt aus der Maske */
          q<HTMLElement>(".h2").forEach((h) => {
            reveal(h.querySelectorAll(".mask > span"), {
              duration: 1.1,
              stagger: 0.1,
              scrollTrigger: { trigger: h, start: "top 85%", once: true },
            });
          });

          /* Statement: Wort für Wort sichtbar, an den Scroll gekoppelt */
          gsap.to(q(".statement .w"), {
            opacity: 1,
            stagger: 0.12,
            ease: "none",
            scrollTrigger: {
              trigger: ".statement",
              start: "top 70%",
              end: "bottom 70%",
              scrub: true,
            },
          });

          /* Zahlen */
          q<HTMLElement>(".fact b").forEach((el) => {
            const to = Number(el.dataset.to);
            const o = { v: 0 };
            gsap.to(o, {
              v: to,
              duration: 1.8,
              ease: "power3.out",
              snap: { v: 1 },
              onUpdate: () => {
                el.firstChild!.textContent = String(o.v);
              },
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            });
          });

          /* Werdegang: Linie zeichnet sich, Schritte kommen mit */
          gsap.fromTo(
            q(".tl-draw"),
            { strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              ease: "none",
              scrollTrigger: { trigger: ".tl", start: "top 60%", end: "bottom 70%", scrub: true },
            },
          );
          q(".step").forEach((s) => {
            gsap.from(s, {
              opacity: 0.15,
              duration: 0.8,
              scrollTrigger: { trigger: s, start: "top 80%", toggleActions: "play none none reverse" },
            });
          });

          /* Repo-Vorschauen: Rahmen wird von oben nach unten aufgezogen */
          q<HTMLElement>(".repo-shot").forEach((el) => {
            gsap.fromTo(
              el,
              { clipPath: "inset(0 0 100% 0)" },
              {
                clipPath: "inset(0 0 0% 0)",
                duration: 1.1,
                ease: "expo.out",
                scrollTrigger: { trigger: el, start: "top 85%", once: true },
              },
            );
          });

          /* Skills-Laufband */
          gsap.to(q(".marquee"), { xPercent: -50, duration: 38, ease: "none", repeat: -1 });

          /* Kontakt: Link folgt dem Zeiger leicht */
          const ac = new AbortController();
          const mag = q<HTMLElement>(".big")[0];
          if (mag && wide) {
            const mx = gsap.quickTo(mag, "x", { duration: 0.5, ease: "power3" });
            const my = gsap.quickTo(mag, "y", { duration: 0.5, ease: "power3" });
            const onMove = (e: PointerEvent) => {
              const r = mag.getBoundingClientRect();
              mx((e.clientX - (r.left + r.width / 2)) * 0.06);
              my((e.clientY - (r.top + r.height / 2)) * 0.12);
            };
            const onLeave = () => {
              mx(0);
              my(0);
            };
            mag.addEventListener("pointermove", onMove as EventListener, { signal: ac.signal });
            mag.addEventListener("pointerleave", onLeave, { signal: ac.signal });
          }

          return () => ac.abort();
        },
      );
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <a className="skip" href="#kontakt">Zum Kontakt springen</a>

      {/* Der Guide begleitet durch die Seite; Inhalte stehen zusätzlich als normaler Text im DOM */}
      <Guide />
      <Rail lenis={lenisRef} />

      <main>
        <section className="hero" id="ueber" data-guide="hero" data-kapitel="ueber" aria-label="Vorstellung">
          <HeroField />
          <h1>
            <Mask>Luca-Max</Mask>
            <Mask>Baur</Mask>
          </h1>
          <div className="hero-meta">
            <p className="lead">
              Medieninformatiker. Ich schreibe Software in Python und betreibe sie selbst.
            </p>
            <div className="hero-links">
              <a href={`mailto:${MAIL}`}>E-Mail</a>
              <a href="https://github.com/LucaBaur" target="_blank" rel="noopener noreferrer">GitHub</a>
              <span className="scrollhint">Weiter nach unten</span>
            </div>
          </div>
        </section>

        <section className="sec statement" data-guide="statement" data-kapitel="ueber">
          <div className="wrap">
            <p>
              {"Technische Neugier und echter Teamgeist. Ich baue Dinge, die laufen, und bleibe dran, bis sie es wirklich tun."
                .split(" ")
                .map((w, i) => (
                  <span key={i} className="w">
                    {w}{" "}
                  </span>
                ))}
            </p>
          </div>
        </section>

        <section className="sec" data-guide="facts" data-kapitel="ueber">
          <div className="wrap facts">
            <div className="fact">
              <b data-to="1000">
                <span>0</span>
                <em>×</em>
              </b>
              <span>kürzere Antwortzeit des Museumsroboters, weil zur Laufzeit kein LLM mehr läuft</span>
            </div>
            <div className="fact">
              <b data-to="162">
                <span>0</span>
              </b>
              <span>automatische Tests in Jarvis, vor jedem Deploy mit Lint-Prüfung</span>
            </div>
            <div className="fact">
              <b data-to="5">
                <span>0</span>
                <em> Jahre</em>
              </b>
              <span>Trainer einer Frauenmannschaft, seit 2021 beim TV Gerhausen</span>
            </div>
          </div>
        </section>

        <section data-guide="skills" data-kapitel="ueber" aria-label="Werkzeuge">
          <div className="skills">
            <div className="marquee" aria-hidden="true">
              {[...skills, ...skills].map((s, i) => (
                <span key={i}>{s}</span>
              ))}
              {[...skills, ...skills].map((s, i) => (
                <span key={"b" + i}>{s}</span>
              ))}
            </div>
          </div>
          <div className="skillnote">
            <div>
              <h3>Python und Betrieb</h3>
              <p>
                Am sichersten bin ich in Python (FastAPI, pandas, pydantic, pytest). Dazu Git, Linux, Docker, systemd
                und Cron. Java kenne ich aus dem Studium und dem Praktikum, mein Schwerpunkt liegt woanders.
              </p>
            </div>
            <div>
              <h3>Künstliche Intelligenz</h3>
              <ul className="chips" aria-label="Fächer im Studium">
                <li>Künstliche Intelligenz</li>
                <li>Data Mining</li>
                <li>Natural Language Processing</li>
              </ul>
              <p>
                Diese Fächer habe ich im Studium belegt. In der Bachelorarbeit hat ein LLM aus Dialog-Logs
                Interaktionsregeln erzeugt, die zur Laufzeit ganz ohne LLM-Aufruf auskommen. Privat betreibe ich lokale
                Modelle mit Ollama, habe mit Jarvis eine Warteschlange dafür gebaut und arbeite mit den Anthropic- und
                OpenAI-APIs.
              </p>
            </div>
          </div>
        </section>

        <section className="sec" id="weg" data-guide="timeline" data-kapitel="weg" aria-labelledby="wegh">
          <div className="wrap">
            <h2 className="h2" id="wegh">
              <Mask>Mein Weg</Mask>
              <Mask>bis hier</Mask>
            </h2>
            <div className="tl">
              <div className="tl-line" aria-hidden="true">
                <svg viewBox="0 0 2 1000" preserveAspectRatio="none">
                  <path d="M1 0 V1000" stroke="var(--line)" strokeWidth="2" />
                  <path className="tl-draw" d="M1 0 V1000" pathLength="1" strokeDasharray="1" strokeDashoffset="0" stroke="var(--blue)" strokeWidth="2" />
                </svg>
              </div>
              {steps.map((s) => (
                <div className="step" key={s.title}>
                  <time>{s.date}</time>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="sec" id="code" data-guide="repos" data-kapitel="code" aria-labelledby="repos">
          <div className="wrap">
            <h2 className="h2" id="repos">
              <Mask>Projekte aus</Mask>
              <Mask>meiner Freizeit</Mask>
            </h2>
            <p className="lead repos-lead">
              Alles liegt öffentlich auf GitHub. Das meiste läuft im echten Einsatz, bei meiner Mannschaft oder bei mir
              zu Hause.
            </p>
            <ul className="repos">
              {repos.map((r) => (
                <RepoRow key={r.name} repo={r} />
              ))}
            </ul>
            <a className="all" href="https://github.com/LucaBaur" target="_blank" rel="noopener noreferrer">
              Alle Repos auf github.com/LucaBaur
            </a>
          </div>
        </section>

        <BaluApp />

        <Jugo />

        <Verbund />

        <Elo />

        <Bridge />

        <section className="sec" data-guide="team" data-kapitel="handball" aria-labelledby="team">
          <div className="wrap">
            <h2 className="h2" id="team">
              <Mask>Handball</Mask>
              <Mask>neben dem Code</Mask>
            </h2>
            <p className="lead team-lead">
              Handball spiele und trainiere ich seit meiner Kindheit. In verschiedenen Teams wurde ich zum Kapitän
              oder in den Mannschaftsrat gewählt, weil ich unterschiedliche Meinungen zusammenführen kann.
            </p>
            <div className="tl sport-tl">
              <div className="tl-line" aria-hidden="true">
                <svg viewBox="0 0 2 1000" preserveAspectRatio="none">
                  <path d="M1 0 V1000" stroke="var(--line)" strokeWidth="2" />
                </svg>
              </div>
              {handball.map((s) => (
                <div className="step sport" key={s.title}>
                  <time>{s.date}</time>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <a className="link" href="https://lucabaur.github.io/Laufchallenge/" target="_blank" rel="noopener noreferrer">
              Laufchallenge meiner Mannschaft ansehen
            </a>
          </div>
        </section>

        <section className="sec contact" id="kontakt" data-guide="contact" data-kapitel="kontakt" aria-labelledby="kon">
          <div className="wrap">
            <h2 className="h2" id="kon">
              <Mask>Lass uns</Mask>
              <Mask>reden</Mask>
            </h2>
            <a className="big" href={`mailto:${MAIL}`}>
              {MAIL}
            </a>
            <div className="contact-links">
              <a href="https://github.com/LucaBaur" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <span>© 2026 Luca-Max Baur</span>
        <a href={`${BASE}/datenschutz/`}>Datenschutz</a>
        <a href="https://github.com/LucaBaur" target="_blank" rel="noopener noreferrer">GitHub</a>
      </footer>
    </div>
  );
}

