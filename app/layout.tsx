import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/newsreader/wght-italic.css";
import "@fontsource-variable/newsreader";
import "./globals.css";

// Im GitHub-Pages-Workflow setzt `configure-pages` Ursprung und Unterpfad. Lokal gelten die Vorgaben.
const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lucabaur.github.io";
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const SITE = `${ORIGIN}${BASE}`;

const TITLE = "Luca-Max Baur – Medieninformatiker";
const BESCHREIBUNG =
  "Luca-Max Baur, B.Sc. Medieninformatik. Python-Backend, lokale LLMs und eigene Projekte, die zu Hause im Dauerbetrieb laufen.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.endsWith("/") ? SITE : `${SITE}/`),
  title: TITLE,
  description: BESCHREIBUNG,
  authors: [{ name: "Luca-Max Baur" }],
  alternates: { canonical: `${SITE}/` },
  openGraph: {
    title: TITLE,
    description: "Software schreiben und selbst betreiben.",
    url: `${SITE}/`,
    locale: "de_DE",
    type: "website",
    images: [{ url: `${SITE}/og.png`, width: 1200, height: 630, alt: "Luca-Max Baur, Medieninformatiker" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: "Software schreiben und selbst betreiben.",
    images: [`${SITE}/og.png`],
  },
};

export const viewport: Viewport = { themeColor: "#0c0d10" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Luca-Max Baur",
  jobTitle: "Medieninformatiker (B.Sc.)",
  email: "mailto:lucamaxbaur98@gmail.com",
  url: `${SITE}/`,
  sameAs: ["https://github.com/LucaBaur"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
