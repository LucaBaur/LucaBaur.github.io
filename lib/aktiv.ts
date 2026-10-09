/** Position eines Elements im Dokument. Gepinnte Abschnitte stehen in einem `.pin-spacer`, dessen Lage dem Fluss entspricht. */
export function dokTop(el: HTMLElement): number {
  const sp = el.parentElement;
  const ref = sp && sp.classList.contains("pin-spacer") ? sp : el;
  return ref.getBoundingClientRect().top + window.scrollY;
}

/**
 * Index des aktiven Abschnitts: der letzte, dessen Oberkante auf oder über der Leselinie liegt.
 * `tops` sind Dokumentpositionen in Reihenfolge der Abschnitte. Davor ist der erste aktiv.
 */
export function aktiverAbschnitt(tops: number[], linie: number): number {
  let aktiv = 0;
  for (let i = 0; i < tops.length; i++) {
    if (tops[i] <= linie) aktiv = i;
  }
  return aktiv;
}

/** Kapitelstand für die Leiste: Index des Kapitels, Anteil darin (0..1) und Füllung der Leiste (0..1). */
export function kapitelStand(starts: number[], linie: number, dokHoehe: number) {
  const n = starts.length;
  const i = aktiverAbschnitt(starts, linie);
  const ende = i < n - 1 ? starts[i + 1] : dokHoehe;
  const anteil = Math.max(0, Math.min(1, (linie - starts[i]) / Math.max(1, ende - starts[i])));
  const fuell = n > 1 ? Math.min(1, (i + (i < n - 1 ? anteil : 0)) / (n - 1)) : 0;
  return { index: i, anteil, fuell };
}
