"""Erzeugt das Erklärvideo "Vom Spiel zur Spielerin" (nur gezeichnete Figuren, keine echten Personen).

Aufruf:  py tools/explainer/make_video.py <schrift-regular.ttf> <schrift-bold.ttf> <ausgabe.mp4>
Die Schrift (Bricolage Grotesque) liegt als woff2 in node_modules/@fontsource-variable und muss vorher mit
fontTools (instantiateVariableFont, wght 400 und 700) zu TTF umgewandelt werden.
"""
import math, subprocess, sys
from PIL import Image, ImageDraw, ImageFont

REG, BOLD, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
W, H, FPS, S = 1280, 720, 30, 2
DUR = 26.0

BG = (12, 13, 16); INK = (236, 234, 228); MUTE = (141, 146, 156); LINE = (38, 42, 51)
COURT = (74, 80, 94); BLUE = (74, 123, 208); SOFT = (157, 184, 234); CARD = (22, 25, 31)
GREEN = (91, 209, 138); AMBER = (240, 176, 60)

_fonts = {}


def font(bold, size):
    k = (bold, size)
    if k not in _fonts:
        _fonts[k] = ImageFont.truetype(BOLD if bold else REG, int(size * S))
    return _fonts[k]


def clamp(x):
    return max(0.0, min(1.0, x))


def seg(t, a, b):
    return clamp((t - a) / (b - a))


def out(t):
    t = clamp(t)
    return 1 - (1 - t) ** 3


def inout(t):
    t = clamp(t)
    return t * t * (3 - 2 * t)


def lerp(a, b, t):
    return a + (b - a) * t


class Pen:
    """Zeichnet in 1x-Koordinaten auf eine 2x-Fläche (Kantenglättung per Verkleinern)."""

    def __init__(self):
        self.im = Image.new("RGB", (W * S, H * S), BG)
        self.d = ImageDraw.Draw(self.im)

    def rect(self, x, y, w, h, fill=None, outline=None, width=2, r=0):
        box = [x * S, y * S, (x + w) * S, (y + h) * S]
        if r:
            self.d.rounded_rectangle(box, r * S, fill=fill, outline=outline, width=int(width * S))
        else:
            self.d.rectangle(box, fill=fill, outline=outline, width=int(width * S))

    def circle(self, cx, cy, r, fill=None, outline=None, width=2):
        self.d.ellipse([(cx - r) * S, (cy - r) * S, (cx + r) * S, (cy + r) * S],
                       fill=fill, outline=outline, width=int(width * S))

    def line(self, x1, y1, x2, y2, fill, width=3):
        self.d.line([x1 * S, y1 * S, x2 * S, y2 * S], fill=fill, width=int(width * S))

    def arc(self, box, a0, a1, fill, width=3):
        x0, y0, x1, y1 = box
        self.d.arc([x0 * S, y0 * S, x1 * S, y1 * S], a0, a1, fill=fill, width=int(width * S))

    def poly(self, pts, fill):
        self.d.polygon([(x * S, y * S) for x, y in pts], fill=fill)

    def text(self, x, y, s, size, fill=INK, bold=False, anchor="la"):
        self.d.text((x * S, y * S), s, font=font(bold, size), fill=fill, anchor=anchor)

    def done(self):
        return self.im.resize((W, H), Image.LANCZOS)


CX0, CY0, CW, CH = 240, 105, 800, 360


def court(p, t, act=1.0, dots=True):
    p.rect(CX0, CY0, CW, CH, outline=COURT, width=3, r=6)
    p.line(CX0 + CW / 2, CY0, CX0 + CW / 2, CY0 + CH, COURT, 3)
    for side in (0, 1):
        gx = CX0 if side == 0 else CX0 + CW
        a0, a1 = (-90, 90) if side == 0 else (90, 270)
        p.arc((gx - 120, CY0 + CH / 2 - 120, gx + 120, CY0 + CH / 2 + 120), a0, a1, COURT, 3)
        p.rect(gx - (0 if side == 0 else 8), CY0 + CH / 2 - 34, 8, 68, fill=COURT)
    if dots:
        for i in range(10):
            col = BLUE if i < 5 else SOFT
            x = CX0 + CW / 2 + (250 + 40 * (i % 5) / 4) * math.sin(t * 0.7 + i * 0.95)
            y = CY0 + CH / 2 + (130 + 10 * (i % 3)) * math.cos(t * 0.55 + i * 1.3)
            p.circle(x, y, 9, fill=col)


def caption(p, title, sub, g):
    y = 570 + (1 - out(g)) * 14
    p.text(240, y, title, 38, INK, True)
    p.text(240, y + 54, sub, 22, MUTE)


def scene1(p, t):  # 0..6
    court(p, t)
    # Kamera mit REC-Punkt
    p.rect(150, 118, 64, 40, fill=CARD, outline=MUTE, width=2, r=8)
    p.circle(182, 138, 11, outline=MUTE, width=2)
    pulse = 0.5 + 0.5 * math.sin(t * 5)
    p.circle(200, 128, 5, fill=(int(lerp(70, 229, pulse)), int(lerp(30, 57, pulse)), int(lerp(30, 53, pulse))))
    p.text(182, 168, "REC", 15, MUTE, True, "ma")
    caption(p, "Eine Kamera filmt das Spiel.", "Danach liegt eine lange Aufnahme auf dem PC.", seg(t, 0.2, 1.0))


def scene2(p, t):  # 0..6 lokal
    court(p, t + 2, dots=True)
    # Pfeil und Kreis werden gezeichnet
    a = out(seg(t, 0.8, 2.2))
    x1, y1, x2, y2 = 470, 330, 760, 255
    ex, ey = lerp(x1, x2, a), lerp(y1, y2, a)
    p.line(x1, y1, ex, ey, AMBER, 5)
    if a > 0.97:
        ang = math.atan2(y2 - y1, x2 - x1)
        p.poly([(x2, y2), (x2 - 18 * math.cos(ang - 0.45), y2 - 18 * math.sin(ang - 0.45)),
                (x2 - 18 * math.cos(ang + 0.45), y2 - 18 * math.sin(ang + 0.45))], AMBER)
    c = out(seg(t, 2.2, 3.4))
    if c > 0:
        p.arc((790 - 70, 245 - 48, 790 + 70, 245 + 48), -90, -90 + 360 * c, AMBER, 5)
    # Zeitleiste: kurzer Abschnitt wird markiert
    bx, by, bw = CX0, 495, CW
    p.rect(bx, by, bw, 14, fill=LINE, r=7)
    f0, f1 = 0.52, 0.52 + 0.06 * out(seg(t, 0.2, 1.2))
    p.rect(bx + bw * f0, by - 5, bw * (f1 - f0), 24, fill=BLUE, r=5)
    p.rect(bx + bw * f0 - 3, by - 10, 6, 34, fill=INK, r=3)
    p.rect(bx + bw * f1 - 3, by - 10, 6, 34, fill=INK, r=3)
    p.text(bx, by + 32, "Aufnahme: 30 Minuten", 16, MUTE)
    p.text(bx + bw * (f0 + f1) / 2, by + 32, "Szene: 30 Sekunden", 16, SOFT, True, "ma")
    caption(p, "Nur die Szene wird ausgeschnitten.", "Pfeile und Kreise zeigen, worauf es ankommt.", seg(t, 0.2, 1.0))


def scene3(p, t):  # 0..6 lokal
    names = ["M", "L", "E", "I", "N", "P", "T", "R"]
    chosen = {0, 2, 5}
    sx, gap, y = 245, 110, 250
    card_t = inout(seg(t, 0.3, 1.8))
    cx = lerp(120, 585, card_t)
    cy = 400
    # Verbindungslinien
    spread = out(seg(t, 2.0, 3.2))
    for i in chosen:
        ax = sx + i * gap + 34 if False else sx + i * gap
        p.line(cx + 55, cy, lerp(cx + 55, ax, spread), lerp(cy, y + 38, spread), BLUE, 3)
    for i, n in enumerate(names):
        ax = sx + i * gap
        on = i in chosen and spread > 0.9
        p.circle(ax, y, 34, fill=BLUE if on else CARD, outline=BLUE if on else LINE, width=3)
        p.text(ax, y + 1, n, 28, INK if on else MUTE, True, "mm")
        if on:
            p.text(ax, y + 56, "bekommt ihn", 15, SOFT, False, "ma")
    # Clip-Karte
    p.rect(cx - 55, cy - 38, 110, 76, fill=CARD, outline=SOFT, width=3, r=12)
    p.poly([(cx - 9, cy - 16), (cx - 9, cy + 16), (cx + 17, cy)], SOFT)
    caption(p, "Der Clip geht nur an die Beteiligten.", "Wer in der Szene nicht vorkommt, sieht ihn nicht.", seg(t, 0.2, 1.0))


def scene4(p, t):  # 0..6 lokal
    px, py, pw, ph = 800, 70, 300, 580
    p.rect(px, py, pw, ph, fill=CARD, outline=MUTE, width=3, r=34)
    p.rect(px + 12, py + 12, pw - 24, ph - 24, fill=BG, r=24)
    p.rect(px + 12, py + 12, pw - 24, 54, fill=(20, 48, 100), r=24)
    p.rect(px + 12, py + 40, pw - 24, 26, fill=(20, 48, 100))
    p.text(px + 32, py + 28, "BALU", 18, INK, True)
    p.text(px + 32, py + 92, "Videos", 26, INK, True)
    a = out(seg(t, 0.6, 1.6))
    oy = py + 140 + (1 - a) * 60
    if a > 0.02:
        p.rect(px + 32, oy, pw - 64, 150, fill=CARD, outline=LINE, width=2, r=14)
        p.rect(px + 44, oy + 12, pw - 88, 76, fill=(26, 30, 38), r=8)
        p.line(px + 56, oy + 50, px + pw - 56, oy + 50, COURT, 2)
        k = 0.5 + 0.5 * math.sin(t * 4)
        p.circle(px + pw / 2, oy + 50, 20 + 2 * k, fill=BLUE)
        p.poly([(px + pw / 2 - 5, oy + 40), (px + pw / 2 - 5, oy + 60), (px + pw / 2 + 11, oy + 50)], INK)
        p.text(px + 44, oy + 100, "Szene aus dem Testspiel", 17, INK, True)
        p.text(px + 44, oy + 124, "30 s", 15, MUTE)
    p.text(140, 270, "Auf dem Handy", 44, INK, True)
    p.text(140, 336, "sehen sie ihre Szene in der App.", 26, MUTE)
    p.text(140, 376, "Jederzeit, ohne große Dateien zu verschicken.", 26, MUTE)


def endcard(p, t):
    p.text(W / 2, 300, "Vom Spiel zur Spielerin", 52, INK, True, "mm")
    p.text(W / 2, 372, "Balu-Videoschnitt und Balu's Training", 26, SOFT, False, "mm")
    p.text(W / 2, 560, "Gezeichnete Figuren, erfundene Daten.", 18, MUTE, False, "mm")


# (Start, Ende, Funktion)
SCENES = [(0, 6, scene1), (6, 12, scene2), (12, 18, scene3), (18, 24, scene4), (24, 26, endcard)]


def frame(t):
    for i, (a, b, fn) in enumerate(SCENES):
        if a <= t < b or (t >= DUR - 1e-6 and i == len(SCENES) - 1):
            lt = t - a
            p = Pen()
            fn(p, lt)
            # Fortschrittsbalken oben (4 Schritte)
            if i < 4:
                for k in range(4):
                    done = 1.0 if k < i else (lt / (b - a) if k == i else 0.0)
                    p.rect(240 + k * 205, 52, 190, 5, fill=LINE, r=2)
                    if done > 0:
                        p.rect(240 + k * 205, 52, 190 * done, 5, fill=BLUE, r=2)
                p.text(240, 70, f"Schritt {i + 1} von 4", 17, MUTE)
            img = p.done()
            fade = min(seg(lt, 0, 0.35), 1 - seg(lt, (b - a) - 0.3, b - a) if i < len(SCENES) - 1 else 1.0)
            if fade < 1:
                img = Image.blend(Image.new("RGB", (W, H), BG), img, clamp(fade))
            return img
    return Image.new("RGB", (W, H), BG)


def main():
    ff = subprocess.Popen([
        "ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
        "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "slow", "-crf", "22",
        "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", OUT,
    ], stdin=subprocess.PIPE)
    n = int(DUR * FPS)
    for k in range(n):
        ff.stdin.write(frame(k / FPS).tobytes())
    ff.stdin.close()
    ff.wait()
    print("Video:", OUT, n, "Bilder")


if __name__ == "__main__":
    main()
