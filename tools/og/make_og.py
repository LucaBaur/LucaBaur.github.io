"""Erzeugt das Vorschaubild fürs Teilen (1200x630). Aufruf: py tools/og/make_og.py <bold.ttf> <regular.ttf> <ausgabe.png>"""
import sys
from PIL import Image, ImageDraw, ImageFont

BOLD, REG, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
W, H = 1200, 630
BG = (12, 13, 16); INK = (236, 234, 228); MUTE = (141, 146, 156); BLUE = (74, 123, 208); LINE = (38, 42, 51)

im = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(im)

# Punktraster wie im Hero
for x in range(24, W, 34):
    for y in range(24, H, 34):
        d.ellipse([x - 1.3, y - 1.3, x + 1.3, y + 1.3], fill=(34, 44, 66))

# Porträt rechts
p = Image.open(__file__.replace("tools\\og\\make_og.py", "public\\guide\\luca-1.webp")).convert("RGBA")
ph = 560
pw = round(p.width * ph / p.height)
p = p.resize((pw, ph), Image.LANCZOS)
# Ausblenden zum unteren Rand
mask = Image.new("L", p.size, 255)
md = ImageDraw.Draw(mask)
for i in range(120):
    md.line([(0, ph - 1 - i), (pw, ph - 1 - i)], fill=int(255 * i / 120))
alpha = p.getchannel("A")
from PIL import ImageChops
p.putalpha(ImageChops.multiply(alpha, mask))
im.paste(p, (W - pw - 70, H - ph), p)

f1 = ImageFont.truetype(BOLD, 112)
f2 = ImageFont.truetype(REG, 34)
f3 = ImageFont.truetype(REG, 26)
d.text((70, 140), "Luca-Max", font=f1, fill=INK)
d.text((70, 250), "Baur", font=f1, fill=INK)
d.rectangle([70, 400, 190, 405], fill=BLUE)
d.text((70, 430), "Medieninformatiker.", font=f2, fill=INK)
d.text((70, 478), "Software in Python, selbst betrieben.", font=f2, fill=MUTE)
d.text((70, 560), "github.com/LucaBaur", font=f3, fill=MUTE)
im.save(OUT, optimize=True)
print("OG-Bild:", OUT)
