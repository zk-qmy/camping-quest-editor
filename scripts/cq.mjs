#!/usr/bin/env node
/**
 * Build tooling for the single-file app.
 *
 *   node scripts/cq.mjs build   src/  -> index.html
 *   node scripts/cq.mjs split   index.html -> src/   (use after exporting from the hosted app)
 *   node scripts/cq.mjs check   fail if index.html is not what `build` would produce
 *   node scripts/cq.mjs check-hall   fail if hall-projects/ differs from the projects embedded in the app
 *
 * No dependencies; needs Node 18+.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const OUT = join(ROOT, 'index.html');

const TEMPLATE = join(SRC, 'template.html');
const DATA = join(SRC, 'data', 'course.json');
const STYLES_DIR = join(SRC, 'styles');
const JS_DIR = join(SRC, 'js');

// Where the three generated regions live inside index.html.
const REGIONS = {
  STYLES: { open: '<style id="appcss">', close: '</style>' },
  DATA: { open: '<script type="application/json" id="data">', close: '</script>' },
  SCRIPT: { open: '<script id="app">', close: '</script>' },
};

// The app code is wrapped in an IIFE; the wrapper is added by the build, not stored in src/js.
const IIFE_OPEN = '\n(function(){\n';
const IIFE_CLOSE = '\n})();\n';

const SECTION = /^(?=\/\* ={3,})/m; // lines like: /* ============ NAME ============ */

const read = (p) => readFileSync(p, 'utf8');
const write = (p, s) => {
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, s);
};
const readParts = (dir, ext) =>
  readdirSync(dir)
    .filter((f) => f.endsWith(ext))
    .sort()
    .map((f) => read(join(dir, f)))
    .join('');

function extract(html, { open, close }) {
  const start = html.indexOf(open);
  if (start < 0) throw new Error(`Region not found: ${open}`);
  const from = start + open.length;
  const end = html.indexOf(close, from);
  if (end < 0) throw new Error(`Unclosed region: ${open}`);
  return { from, end, text: html.slice(from, end) };
}

const slug = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'section';

function writeChunks(dir, ext, text) {
  if (existsSync(dir)) rmSync(dir, { recursive: true });
  const parts = text.split(SECTION);
  parts.forEach((part, i) => {
    const m = part.match(/^\/\* =+ (.+?) =+ \*\//);
    const name = i === 0 && !m ? 'preamble' : m ? slug(m[1]) : `part-${i}`;
    write(join(dir, `${String(i).padStart(2, '0')}-${name}${ext}`), part);
  });
}

function build() {
  let html = read(TEMPLATE);
  const parts = {
    STYLES: readParts(STYLES_DIR, '.css'),
    DATA: read(DATA).replace(/\n$/, ''),
    SCRIPT: IIFE_OPEN + readParts(JS_DIR, '.js') + IIFE_CLOSE,
  };
  for (const [key, value] of Object.entries(parts)) {
    if (!html.includes(`{{${key}}}`)) throw new Error(`Template is missing {{${key}}}`);
    html = html.replace(`{{${key}}}`, () => value);
  }
  return html;
}

function split() {
  let html = read(OUT);
  const found = {};
  // Replace from the back so earlier offsets stay valid.
  const order = Object.keys(REGIONS)
    .map((k) => ({ k, ...extract(html, REGIONS[k]) }))
    .sort((a, b) => b.from - a.from);
  for (const r of order) {
    found[r.k] = r.text;
    html = html.slice(0, r.from) + `{{${r.k}}}` + html.slice(r.end);
  }
  const script = found.SCRIPT;
  if (!script.startsWith(IIFE_OPEN) || !script.endsWith(IIFE_CLOSE)) {
    throw new Error('Unexpected app script wrapper; expected a single IIFE.');
  }
  write(TEMPLATE, html);
  write(DATA, found.DATA + '\n');
  writeChunks(STYLES_DIR, '.css', found.STYLES);
  writeChunks(JS_DIR, '.js', script.slice(IIFE_OPEN.length, script.length - IIFE_CLOSE.length));
  // Sanity check: the build must reproduce the input exactly.
  if (build() !== read(OUT)) throw new Error('Round-trip mismatch after split; src/ not trustworthy.');
  console.log('Split index.html into src/ (round-trip verified).');
}

// Folder under hall-projects/ for each project id in HALL_DEFAULT.
const HALL_DIRS = {
  m3: 'm3-night-camp',
  m4: 'm4-night-camp-style',
  m5: 'm5-night-camp-pages',
  m6: 'm6-night-camp-flexbox',
  m7: 'm7-night-camp-hover',
  m8: 'm8-night-camp-final',
};

/** Verify hall-projects/ matches the HALL_DEFAULT list embedded in the app. */
function checkHall() {
  const js = read(join(JS_DIR, '15-hall.js'));
  const match = js.match(/var HALL_DEFAULT=(\[[\s\S]*?\]);\n/);
  if (!match) throw new Error('HALL_DEFAULT not found in src/js/15-hall.js');
  const norm = (t) => String(t ?? '').replace(/\r\n/g, '\n').trim();
  const problems = [];
  const expected = new Set();
  const compare = (dir, file, text) => {
    const rel = `${dir}/${file}`;
    expected.add(rel);
    const path = join(ROOT, 'hall-projects', dir, file);
    if (!existsSync(path)) problems.push(`missing: hall-projects/${rel}`);
    else if (norm(read(path)) !== norm(text)) problems.push(`differs from app: hall-projects/${rel}`);
  };
  for (const h of JSON.parse(match[1])) {
    const dir = HALL_DIRS[h.id];
    if (!dir) {
      problems.push(`no folder mapped for project "${h.id}" (update HALL_DIRS in scripts/cq.mjs)`);
      continue;
    }
    compare(dir, 'index.html', h.finalCode);
    if (norm(h.finalCss)) compare(dir, 'style.css', h.finalCss);
    for (const pg of h.pages || []) compare(dir, pg.name, pg.code);
  }
  for (const dir of Object.values(HALL_DIRS)) {
    const full = join(ROOT, 'hall-projects', dir);
    if (!existsSync(full)) continue;
    for (const f of readdirSync(full)) {
      if (!expected.has(`${dir}/${f}`)) problems.push(`not in app: hall-projects/${dir}/${f}`);
    }
  }
  if (problems.length) {
    console.error(problems.join('\n'));
    process.exit(1);
  }
  console.log('hall-projects/ matches the app.');
}

/** Fail if a teacher PIN (plain or hashed) or other secret-looking value is about to be committed. */
function checkSecrets() {
  const problems = [];
  const pinIn = (text, where) => {
    const m = text.match(/"pin"\s*:\s*"([^"]*)"/);
    if (m && m[1] !== '') problems.push(`${where} has a non-empty "pin". Clear it before committing.`);
  };
  pinIn(read(DATA), 'src/data/course.json');
  const html = read(OUT);
  const d = extract(html, REGIONS.DATA).text;
  pinIn(d, 'index.html (embedded data)');
  const patterns = [/ghp_[A-Za-z0-9]{20,}/, /sk-[A-Za-z0-9]{20,}/, /AKIA[0-9A-Z]{12,}/, /BEGIN [A-Z ]*PRIVATE KEY/, /file:\/\/\/[a-z]:\//i];
  for (const f of ['index.html', 'README.md', 'CONTRIBUTING.md', 'docs/architecture.md']) {
    const t = read(join(ROOT, f));
    for (const re of patterns) if (re.test(t)) problems.push(`${f} matches ${re}`);
  }
  if (problems.length) {
    console.error(problems.join('\n'));
    process.exit(1);
  }
  console.log('No PIN or secrets in committed files.');
}

const cmd = process.argv[2];
if (cmd === 'build') {
  write(OUT, build());
  console.log('Built index.html');
} else if (cmd === 'split') {
  split();
} else if (cmd === 'check') {
  if (build() !== read(OUT)) {
    console.error('index.html is out of date with src/. Run `npm run build`.');
    process.exit(1);
  }
  console.log('index.html is in sync with src/.');
} else if (cmd === 'check-secrets') {
  checkSecrets();
} else if (cmd === 'check-hall') {
  checkHall();
} else {
  console.error('Usage: node scripts/cq.mjs <build|split|check|check-hall|check-secrets>');
  process.exit(2);
}
