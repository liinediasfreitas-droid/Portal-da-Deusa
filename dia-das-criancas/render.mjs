// Renderiza a animação (index.html) quadro a quadro em PNG/JPG.
// Uso:  node render.mjs <pasta-saida> [--from N --to N] [--stills t1,t2,...]
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const out = path.resolve(args[0] || 'render-tmp');
const opt = (k, d) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : d; };
const FPS = 30;

fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ['--disable-gpu', '--font-render-hinting=none', '--allow-file-access-from-files'],
});
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.goto('file://' + path.join(here, 'index.html') + '?render');
await page.evaluate(() => window.__ready());
const duration = await page.evaluate(() => window.__duration);

const stills = opt('--stills', null);
if (stills) {
  for (const t of stills.split(',').map(Number)) {
    await page.evaluate(t => window.__seek(t), t);
    await page.screenshot({ path: path.join(out, `still-${String(t).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 90 });
  }
} else {
  const total = Math.round(duration * FPS);
  const from = +opt('--from', 0), to = +opt('--to', total - 1);
  for (let f = from; f <= to; f++) {
    await page.evaluate(t => window.__seek(t), f / FPS);
    await page.screenshot({ path: path.join(out, `f${String(f).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 95 });
    if (f % 60 === 0) console.log(`frame ${f}/${total}`);
  }
}
await browser.close();
