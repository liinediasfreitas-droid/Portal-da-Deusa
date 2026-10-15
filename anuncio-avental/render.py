"""Anúncio animado do avental em brim (15 s, 30 fps).

Gera anuncio-avental-9x16.mp4 (1080x1920) e anuncio-avental-1x1.mp4 (1080x1080).

Regra do briefing: as fotos NÃO são alteradas. Aqui só há recorte, zoom e
pan (reamostragem da foto inteira, sem retoque), escurecimento em degradê
por cima (scrim, para leitura do texto) e texto/molduras sobrepostos.

Uso:  python3 render.py            (gera as duas versões)
      python3 render.py 9x16       (só uma)
"""
import math
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

AQUI = Path(__file__).resolve().parent
FOTOS = AQUI / "fotos"
FPS = 30
DURACAO = 15.0
FADE = 0.35  # transição entre cenas (s)

# Paleta: azul-marinho do brim, off-white das alças, dourado dos ilhoses, rosa do vivo.
MARINHO = (27, 33, 72)
OFF = (246, 241, 230)
DOURADO = (214, 178, 106)
ROSA = (232, 176, 186)

SERIF = str(AQUI / "fonts" / "PlayfairDisplay.ttf")
SERIF_IT = str(AQUI / "fonts" / "PlayfairDisplay-Italic.ttf")
SANS = "/usr/share/fonts/opentype/inter/Inter-SemiBold.otf"


def fonte(caminho, tamanho, peso=None):
    f = ImageFont.truetype(caminho, tamanho)
    if peso is not None:
        try:
            f.set_variation_by_axes([peso])
        except OSError:
            pass
    return f


def ease_out(x):
    x = min(max(x, 0.0), 1.0)
    return 1 - (1 - x) ** 3


def ease_io(x):
    x = min(max(x, 0.0), 1.0)
    return 0.5 - 0.5 * math.cos(math.pi * x)


def lerp(a, b, x):
    return a + (b - a) * x


_cache = {}


def foto(nome):
    if nome not in _cache:
        _cache[nome] = Image.open(FOTOS / nome).convert("RGB")
    return _cache[nome]


def enquadrar(img, W, H, cx, cy, zoom):
    """Recorte 'cover' da foto no quadro W x H, centrado em (cx, cy) normalizados,
    com zoom >= 1. Só reamostra a foto (sem distorcer proporção)."""
    iw, ih = img.size
    escala = max(W / iw, H / ih) * zoom
    bw, bh = W / escala, H / escala
    x0 = min(max(cx * iw - bw / 2, 0), iw - bw)
    y0 = min(max(cy * ih - bh / 2, 0), ih - bh)
    return img.resize((W, H), Image.LANCZOS, box=(x0, y0, x0 + bw, y0 + bh))


def scrim(W, H, inicio, alpha_max=200):
    """Degradê marinho de baixo para cima, a partir de `inicio` (fração da altura)."""
    g = Image.new("L", (1, H), 0)
    for y in range(H):
        f = (y / H - inicio) / (1 - inicio)
        g.putpixel((0, y), int(alpha_max * ease_io(f)) if f > 0 else 0)
    camada = Image.new("RGBA", (W, H), MARINHO + (0,))
    camada.putalpha(g.resize((W, H)))
    return camada


def texto_centro(draw, W, y, txt, f, cor, alpha, espacamento=0):
    if espacamento:
        larguras = [draw.textlength(c, font=f) for c in txt]
        total = sum(larguras) + espacamento * (len(txt) - 1)
        x = (W - total) / 2
        for c, w in zip(txt, larguras):
            draw.text((x, y), c, font=f, fill=cor + (alpha,))
            x += w + espacamento
    else:
        w = draw.textlength(txt, font=f)
        draw.text(((W - w) / 2, y), txt, font=f, fill=cor + (alpha,))


# ---------------------------------------------------------------------------
# Roteiro. Cada cena: foto, intervalo, movimento de câmera (cx, cy, zoom) de
# início -> fim, e o texto da cena. Os enquadramentos podem diferir por formato.

CENAS = [
    dict(  # 0–3 s · gancho: o avental inteiro
        foto="05-flatlay.jpg", t0=0.0, t1=3.2,
        cam={"9x16": ((0.50, 0.50, 1.00), (0.50, 0.47, 1.10)),
             "1x1": ((0.50, 0.50, 1.00), (0.50, 0.47, 1.12))},
        kicker="AVENTAL EM BRIM", titulo="Personalizado", italico="do seu jeito",
    ),
    dict(  # detalhe do ilhós + mosquetão
        foto="04-ilhos-mosquetao.jpg", t0=3.2, t1=5.8,
        cam={"9x16": ((0.52, 0.48, 1.18), (0.50, 0.50, 1.00)),
             "1x1": ((0.50, 0.46, 1.30), (0.50, 0.50, 1.05))},
        kicker="DETALHES", titulo="Ilhoses e", italico="mosquetões dourados",
    ),
    dict(  # alça com ponteira em couro costurada à mão (foto em alta resolução)
        foto="01-alca-couro.jpg", t0=5.8, t1=8.4,
        cam={"9x16": ((0.33, 0.50, 1.00), (0.62, 0.52, 1.00)),
             "1x1": ((0.38, 0.45, 1.10), (0.58, 0.55, 1.10))},
        kicker="ACABAMENTO", titulo="Ponto a ponto,", italico="com cuidado",
    ),
    dict(  # vestido no cabide: das alças até os bolsos
        foto="03-cabide.jpg", t0=8.4, t1=11.0,
        cam={"9x16": ((0.50, 0.30, 1.22), (0.50, 0.62, 1.22)),
             "1x1": ((0.50, 0.30, 1.30), (0.50, 0.66, 1.30))},
        kicker="PRÁTICO", titulo="Três bolsos", italico="com vivo floral",
    ),
    dict(  # personalização com chaveirinhos
        foto="06-flatlay-ursinhos.jpg", t0=11.0, t1=12.8,
        cam={"9x16": ((0.52, 0.60, 1.00), (0.52, 0.64, 1.08)),
             "1x1": ((0.50, 0.72, 1.70), (0.50, 0.73, 1.90))},
        kicker="SEU ESTILO", titulo="Combine com", italico="seus charms",
    ),
]
FINAL_T0 = 12.8  # cartela final até 15 s


def desenhar_texto_cena(base, cena, t, fmt):
    W, H = base.size
    dentro = t - cena["t0"]
    dur = cena["t1"] - cena["t0"]
    entrada = ease_out((dentro - 0.15) / 0.55)
    saida = 1 - ease_io((dentro - (dur - 0.35)) / 0.3)
    a = max(0.0, min(entrada, saida))
    if a <= 0:
        return
    sobe = (1 - entrada) * 40

    camada = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(camada)
    if fmt == "9x16":
        # Área segura de Reels/Stories: texto entre ~69% e ~80% da altura.
        y = 1320 + sobe
        fk, ft, fi, gap = fonte(SANS, 34), fonte(SERIF, 96, 600), fonte(SERIF_IT, 84, 400), 14
    else:
        y = 735 + sobe
        fk, ft, fi, gap = fonte(SANS, 24), fonte(SERIF, 72, 600), fonte(SERIF_IT, 62, 400), 10
    al = int(255 * a)
    texto_centro(d, W, y, cena["kicker"], fk, DOURADO, al, espacamento=gap * 0.55)
    y += fk.size + gap * 2.2
    texto_centro(d, W, y, cena["titulo"], ft, OFF, al)
    y += ft.size * 1.12
    texto_centro(d, W, y, cena["italico"], fi, ROSA if cena["kicker"] == "PRÁTICO" else OFF, al)
    base.alpha_composite(camada)


def quadro_cena(cena, t, fmt, W, H, scrims):
    (c0, c1) = cena["cam"][fmt]
    x = ease_io((t - cena["t0"]) / (cena["t1"] - cena["t0"] + FADE))
    cx, cy, z = (lerp(a, b, x) for a, b in zip(c0, c1))
    img = enquadrar(foto(cena["foto"]), W, H, cx, cy, z).convert("RGBA")
    img.alpha_composite(scrims[fmt])
    desenhar_texto_cena(img, cena, t, fmt)
    return img


def cartela_final(t, fmt, W, H):
    dentro = t - FINAL_T0
    img = Image.new("RGBA", (W, H), MARINHO + (255,))
    d = ImageDraw.Draw(img)

    # Foto do produto inteiro como cartão (redução, sem ampliar a foto).
    src = foto("03-cabide.jpg")
    if fmt == "9x16":
        cw = 720
        topo = 230
    else:
        cw = 400
        topo = 70
    ch = round(cw * src.height / src.width)
    e = ease_out(dentro / 0.6)
    card = src.resize((cw, ch), Image.LANCZOS).convert("RGBA")
    mask = Image.new("L", (cw, ch), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, cw - 1, ch - 1), radius=28, fill=int(255 * e))
    card.putalpha(mask)
    x = (W - cw) // 2
    y = int(topo + (1 - e) * 50)
    moldura = (x - 10, y - 10, x + cw + 9, y + ch + 9)
    d.rounded_rectangle(moldura, radius=36, outline=DOURADO + (int(200 * e),), width=3)
    img.alpha_composite(card, (x, y))

    # Textos e botão.
    camada = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(camada)
    e2 = ease_out((dentro - 0.35) / 0.55)
    al = int(255 * e2)
    if fmt == "9x16":
        ty = topo + ch + 70 + (1 - e2) * 30
        ft, fi, fb = fonte(SERIF, 88, 600), fonte(SERIF_IT, 64, 400), fonte(SANS, 40)
        bw, bh = 640, 112
    else:
        ty = topo + ch + 36 + (1 - e2) * 24
        ft, fi, fb = fonte(SERIF, 64, 600), fonte(SERIF_IT, 46, 400), fonte(SANS, 30)
        bw, bh = 480, 84
    texto_centro(d, W, ty, "Encomende o seu", ft, OFF, al)
    ty += ft.size * 1.15
    texto_centro(d, W, ty, "avental personalizado em brim", fi, ROSA, al)
    ty += fi.size * 1.6

    e3 = ease_out((dentro - 0.7) / 0.5)
    pulso = 1 + 0.03 * math.sin(max(0, dentro - 1.2) * 2 * math.pi / 1.1) * (dentro > 1.2)
    bw2, bh2 = bw * pulso, bh * pulso
    bx, by = (W - bw2) / 2, ty + (bh - bh2) / 2
    d.rounded_rectangle((bx, by, bx + bw2, by + bh2), radius=bh2 / 2, fill=DOURADO + (int(255 * e3),))
    rot = "Chame no WhatsApp"
    tw = d.textlength(rot, font=fb)
    d.text(((W - tw) / 2, by + (bh2 - fb.size) / 2 - fb.size * 0.12), rot, font=fb, fill=MARINHO + (int(255 * e3),))
    img.alpha_composite(camada)
    return img


def quadro(t, fmt, W, H, scrims):
    if t >= FINAL_T0:
        final = cartela_final(t, fmt, W, H)
        f = (t - FINAL_T0) / FADE
        if f < 1:
            ant = quadro_cena(CENAS[-1], t, fmt, W, H, scrims)
            return Image.blend(ant, final, ease_io(f))
        return final
    for i, c in enumerate(CENAS):
        if c["t0"] <= t < c["t1"]:
            img = quadro_cena(c, t, fmt, W, H, scrims)
            if i > 0 and t - c["t0"] < FADE:
                ant = quadro_cena(CENAS[i - 1], t, fmt, W, H, scrims)
                img = Image.blend(ant, img, ease_io((t - c["t0"]) / FADE))
            return img
    raise ValueError(t)


def render(fmt):
    W, H = (1080, 1920) if fmt == "9x16" else (1080, 1080)
    scrims = {fmt: scrim(W, H, 0.48 if fmt == "9x16" else 0.38, 225)}
    saida = AQUI / f"anuncio-avental-{fmt}.mp4"
    cmd = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
        "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=48000",
        "-map", "0:v", "-map", "1:a", "-shortest",
        "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p",
        "-crf", "17", "-preset", "slow", "-movflags", "+faststart",
        "-c:a", "aac", "-b:a", "128k", str(saida),
    ]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    n = int(DURACAO * FPS)
    for i in range(n):
        p.stdin.write(quadro(i / FPS, fmt, W, H, scrims).convert("RGB").tobytes())
    p.stdin.close()
    if p.wait():
        sys.exit(f"ffmpeg falhou ({fmt})")
    print("ok", saida.name)


if __name__ == "__main__":
    for fmt in sys.argv[1:] or ["9x16", "1x1"]:
        render(fmt)
