// Pruebas básicas antes de publicar (sin dependencias): node scripts/check.mjs
import { readFileSync, existsSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const errors = [];
const fail = (m) => errors.push(m);

if (!/<html[^>]*\slang="/.test(html)) fail('Falta el atributo lang en <html>.');
if (!/<title>[^<]+<\/title>/.test(html)) fail('Falta <title>.');
if (!/<meta name="description" content="[^"]{50,}"/.test(html)) fail('Falta meta description (mínimo 50 caracteres).');
if (!/<meta name="viewport"/.test(html)) fail('Falta meta viewport.');
if ((html.match(/<h1[\s>]/g) || []).length !== 1) fail('Debe haber exactamente un <h1>.');
if ((html.match(/<main[\s>]/g) || []).length !== 1) fail('Debe haber exactamente un <main>.');

for (const m of html.matchAll(/<img\b[^>]*>/g)) {
  const tag = m[0];
  if (!/\salt="[^"]+"/.test(tag)) fail(`Imagen sin alt: ${tag.slice(0, 80)}`);
  if (!/\swidth="/.test(tag) || !/\sheight="/.test(tag)) fail(`Imagen sin width/height: ${tag.slice(0, 80)}`);
}

const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
for (const m of html.matchAll(/href="#([^"]+)"/g)) {
  if (!ids.has(m[1])) fail(`Ancla sin destino: #${m[1]}`);
}

for (const m of html.matchAll(/(?:src|href)="([^"#:]+\.[a-z0-9]+)"/gi)) {
  if (!existsSync(m[1])) fail(`Archivo local no encontrado: ${m[1]}`);
}

for (const m of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
  if (!/rel="[^"]*noopener/.test(m[0])) fail(`Enlace externo sin rel="noopener": ${m[0].slice(0, 80)}`);
}

if (errors.length) {
  console.error('Fallaron ' + errors.length + ' pruebas:\n- ' + errors.join('\n- '));
  process.exit(1);
}
console.log('Todas las pruebas pasaron.');
