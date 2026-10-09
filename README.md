# Luca-Max Baur – Portfolio

Meine persönliche Seite: Werdegang, Projekte und wie sie zusammenhängen. Online unter
**https://lucabaur.github.io/**

Gebaut mit Next.js (statischer Export), React, TypeScript, GSAP/ScrollTrigger und Lenis. Schriften liegen lokal im Projekt, es gibt
kein Tracking und keine Cookies.

## Lokal starten

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # statischer Export nach out/
```

## Aufbau

| Pfad | Inhalt |
|---|---|
| `app/` | Seitenrahmen, Metadaten, Datenschutz, Styles (`globals.css`) |
| `components/Site.tsx` | Seitenaufbau und Animationen |
| `components/content.ts` | Texte, Repos, Werdegang, App-Rundgang |
| `components/` | Guide, Kapitel-Leiste, Systemkarte, ELO-Grafik, Spielzug-Animation |
| `lib/aktiv.ts` | Berechnung des aktiven Abschnitts |
| `public/` | Bilder, Screenshots, Erklärvideo |
| `tools/` | Skripte für Erklärvideo und Vorschaubild |

## Hinweise

- Alle Screenshots und Grafiken zu meinen Projekten zeigen erfundene Namen und Beispielwerte.
- Die Veröffentlichung läuft über den Workflow in `.github/workflows/deploy.yml` (GitHub Pages).
- Texte, Fotos und Grafiken sind nicht zur Wiederverwendung freigegeben.
