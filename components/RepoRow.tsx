"use client";

import { useState } from "react";
import type { Repo } from "./content";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";


export default function RepoRow({ repo }: { repo: Repo }) {
  const [i, setI] = useState(0);
  const shot = repo.shots[i];

  return (
    <li className="repo">
      <div className="repo-info">
        <a
          className="repo-main"
          href={`https://github.com/LucaBaur/${repo.name}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="repo-name">{repo.name}</span>
          <span className="repo-text">{repo.text}</span>
          <span className="repo-lang">{repo.lang}</span>
        </a>
        {repo.live && (
          <a className="repo-live" href={repo.live} target="_blank" rel="noopener noreferrer">
            Live ansehen: {repo.live.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </a>
        )}
      </div>

      <figure className="repo-shot">
        <div className="browser">
          <div className="browser-bar" aria-hidden="true">
            <i />
            <i />
            <i />
            <span>Demo-Daten</span>
          </div>
          <div className="browser-view" style={{ aspectRatio: `${shot.w} / ${shot.h}` }}>
            {repo.shots.map((s, k) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={s.src}
                src={`${BASE}${s.src}`}
                alt={k === i ? s.alt : ""}
                width={s.w}
                height={s.h}
                loading="lazy"
                className={k === i ? "on" : ""}
              />
            ))}
          </div>
        </div>
        {repo.shots.length > 1 && (
          <div className="shot-tabs" role="group" aria-label={`Ansichten von ${repo.name}`}>
            {repo.shots.map((s, k) => (
              <button key={s.src} type="button" aria-pressed={k === i} onClick={() => setI(k)}>
                {s.label}
              </button>
            ))}
          </div>
        )}
      </figure>
    </li>
  );
}
