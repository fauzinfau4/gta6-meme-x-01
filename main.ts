// gta6-meme-x-01 entrypoint (Node 22, standard library only).
//
// The entry itself is the X post: a GTA 6 meme (meme.png in this repo) posted
// from a public account with make.fun and the entrant's play code in its text.
// This program only hands the post's address to the grader: it reads POST.json
// from the repository root and writes an identical copy to the output
// directory, where the house reads it and looks the post up on X.
//
// Local run (from the repo root):
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
// In the grader the same two variables point at /bot and /output.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(BOT_DIR, 'POST.json');
const target = join(OUTPUT_DIR, 'POST.json');

mkdirSync(OUTPUT_DIR, { recursive: true });

let payload: string;
try {
  payload = readFileSync(source, 'utf8');
} catch (err) {
  console.error(`cannot read ${source}: ${(err as Error).message}`);
  process.exit(1);
}

// The address must be a JSON object with a url string; refuse to hand on
// anything else rather than silently copying a broken file.
let parsed: unknown;
try {
  parsed = JSON.parse(payload);
} catch {
  console.error(`POST.json is not valid JSON: ${source}`);
  process.exit(1);
}
if (typeof parsed !== 'object' || parsed === null || typeof (parsed as { url?: unknown }).url !== 'string') {
  console.error('POST.json must be a JSON object with a "url" string');
  process.exit(1);
}
const url = (parsed as { url: string }).url;

// The gate only accepts an X post address, so catch a wrong shape here
// instead of handing on a file the grader will refuse. The placeholder
// (".../status/0") has the right shape and passes; the real post address
// replaces it before submitting.
if (!/^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/[^/]+\/status\/\d+$/.test(url)) {
  console.error(`POST.json url is not an X post address: ${url}`);
  process.exit(1);
}

writeFileSync(target, payload, 'utf8');
