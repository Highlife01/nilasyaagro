from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).parent / 'public' / 'icons'
root.mkdir(parents=True, exist_ok=True)

for size, name in [(192, 'icon-192.png'), (512, 'icon-512.png'), (512, 'icon-maskable-512.png')]:
    image = Image.new('RGBA', (size, size), '#0b3b2f')
    draw = ImageDraw.Draw(image)
    pad = int(size * 0.085)
    draw.rounded_rectangle((pad, pad, size - pad, size - pad), radius=int(size * 0.2), fill='#0c6b52')
    inner = int(size * 0.14)
    draw.ellipse((inner, inner, size - inner, size - inner), fill='#0f765a')
    font_candidates = [
        'C:/Windows/Fonts/arialbd.ttf',
        'C:/Windows/Fonts/calibrib.ttf',
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
    ]
    font = None
    for candidate in font_candidates:
        if Path(candidate).exists():
            font = ImageFont.truetype(candidate, int(size * 0.47))
            break
    if font is None:
        font = ImageFont.load_default()
    letter = 'N'
    box = draw.textbbox((0, 0), letter, font=font)
    x = (size - (box[2] - box[0])) / 2 - box[0]
    y = (size - (box[3] - box[1])) / 2 - box[1] - int(size * 0.025)
    draw.text((x, y), letter, font=font, fill='#ffffff')
    leaf = [(size * 0.66, size * 0.72), (size * 0.82, size * 0.60), (size * 0.77, size * 0.78)]
    draw.polygon(leaf, fill='#e2b867')
    draw.line((size * 0.68, size * 0.76, size * 0.79, size * 0.63), fill='#fff1c9', width=max(2, int(size * 0.012)))
    image.save(root / name, 'PNG', optimize=True)

print(f'Created PWA icons in {root}')
