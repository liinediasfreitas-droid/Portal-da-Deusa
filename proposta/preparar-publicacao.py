#!/usr/bin/env python3
"""Prepara a cópia da proposta animada para publicar como Artifact.

Uso: python3 preparar-publicacao.py PASTA_DE_SAIDA [--local]

- Embute as fontes em base64, para o link não depender de servidor de fontes.
- Tira doctype, html, head e body, porque o Artifact já embrulha a página.
- --local acrescenta esse mesmo embrulho, para abrir a cópia no navegador e conferir.
- Imprime as imagens e o vídeo que precisam subir junto, no formato do campo `files`.
"""
import base64
import json
import pathlib
import re
import sys

aqui = pathlib.Path(__file__).resolve().parent
saida = pathlib.Path(sys.argv[1])
local = '--local' in sys.argv
html = (aqui / 'proposta-animada.html').read_text(encoding='utf-8')

titulo = re.search(r'<title>.*?</title>', html, re.S).group(0)
estilo = re.search(r'<style>.*?</style>', html, re.S).group(0)
corpo = re.search(r'<body>(.*)</body>', html, re.S).group(1).strip()


def fonte(m):
    dados = base64.b64encode((aqui / 'fonts' / f'{m.group(1)}.woff2').read_bytes()).decode()
    return f"url(data:font/woff2;base64,{dados}) format('woff2')"


estilo, n = re.subn(r"url\(fonts/([\w-]+)\.woff2\) format\('woff2'\),url\(fonts/\1\.woff\) format\('woff'\)", fonte, estilo)
assert n == 4, f"esperava 4 fontes, achei {n}"

pagina = f'{titulo}\n{estilo}\n{corpo}\n'
if local:
    pagina = (
        '<!doctype html><html><head><meta charset=utf8>'
        '<meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover">'
        '<style>:root{color-scheme:light;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);'
        'padding-bottom:env(safe-area-inset-bottom,0px)}html{scroll-padding-top:env(safe-area-inset-top,0px)}'
        'body{margin:0;padding:0;font:14px -apple-system,BlinkMacSystemFont,sans-serif;background:#fff;color:#000}'
        'img{max-width:100%}[hidden]:not([hidden=until-found i]){display:none!important}</style></head><body>\n'
        + pagina + '</body></html>\n'
    )

saida.mkdir(parents=True, exist_ok=True)
(saida / 'index.html').write_text(pagina, encoding='utf-8')

arquivos = sorted({a for a in re.findall(r'(?:src|poster)="([^"#]+)"', corpo) if not re.match(r'(https?:|data:)', a)})
faltam = [a for a in arquivos if not (aqui / a).is_file()]
assert not faltam, f'arquivos que faltam: {faltam}'
print(f'{saida / "index.html"}: {len(pagina.encode()) // 1024} KB, {len(arquivos)} arquivos junto')
print(json.dumps({a: str(aqui / a) for a in arquivos}, indent=1, ensure_ascii=False))
