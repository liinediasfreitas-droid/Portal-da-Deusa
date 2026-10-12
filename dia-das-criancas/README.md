# Dia das Crianças — Vó e netos (motion)

Vídeo vertical 1080×1920, 30 fps, 50 s, feito com as fotos e vídeos da família.

- `dia-das-criancas.mp4` — vídeo final (com trilha)
- `index.html` — a animação ao vivo (GSAP). Abra no navegador para ver/ajustar; o botão "Som" liga a trilha.
- `render.mjs` — renderiza a animação quadro a quadro (Playwright/Chromium)
- `musica.py` — sintetiza a trilha (caixinha de música + pad), composição original
- `fotos/`, `videos/` — material original enviado
- `fonts/` — Fraunces, Caveat e Baloo 2 (SIL OFL)

## Roteiro
1. **Título** — "Dia das Crianças", balões e confete, 12 de outubro
2. **"Como é bom, né, passar um tempo com os netos."** → câmera entra nas mãos dadas: "De mãos dadas, o mundo fica do tamanho de um passinho."
3. **"A infância mora nas coisas simples:"** — um balanço · uma roda na areia · um caminhãozinho · e uma vó por perto
4. **Correm. Pulam. Gritam. Riem.** — "Ontem cabiam no colo. Hoje correm mais rápido que a vó!"
5. **"Crescem depressa."** (régua de altura: ontem / hoje / amanhã) → "Mas o abraço da vó continua do mesmo tamanho."
6. **Final** — coração com as fotos, "Feliz Dia das Crianças!"

## Gerar de novo
```bash
# 1) trechos dos vídeos como sequência de quadros
mkdir -p .frames/{a,b,c}
ffmpeg -ss 1  -t 3 -i videos/balanco.mp4  -vf fps=30 -q:v 3 .frames/a/%03d.jpg
ffmpeg -ss 16 -t 3 -i videos/areia.mp4    -vf fps=30 -q:v 3 .frames/b/%03d.jpg
ffmpeg -ss 1  -t 3 -i videos/caminhao.mp4 -vf fps=30 -q:v 3 .frames/c/%03d.jpg
# 2) trilha
python3 -I musica.py audio/musica.wav && ffmpeg -i audio/musica.wav audio/musica.mp3
# 3) quadros (pode dividir com --from/--to em vários processos) e encode
node render.mjs render-tmp
ffmpeg -framerate 30 -i render-tmp/f%05d.jpg -i audio/musica.wav \
  -c:v libx264 -crf 17 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest dia-das-criancas.mp4
```
Para trocar textos, cores ou tempos, edite o `index.html` (as cenas estão em blocos comentados).
