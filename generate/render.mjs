// Renders generate/meme.html to meme.png with headless Chromium over CDP.
// Run from the repository root:  node generate/render.mjs
// Writes meme.png (1080x1080) next to POST.json.
//
// This VM's Chromium is a Hatch build that refuses to start without a WebGL
// domain policy, so the renderer writes a minimal policy file (a header line
// plus one registrable domain; the meme page uses no WebGL) to the OS temp
// directory and passes it with its SHA-256. Plain --screenshot exits without
// writing a file on this build, so the shot is taken through the DevTools
// protocol instead, using Node 22's built-in WebSocket client.

import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = join(root, 'generate', 'meme.html');
const png = join(root, 'meme.png');
const chrome = process.env.CHROME_BIN ?? '/opt/meta-chromium/chrome';
const PORT = 9333;

const policyPath = join(tmpdir(), 'meme-webgl-policy.txt');
writeFileSync(policyPath, 'hatch-webgl-allowed-domains-v1\nexample.com\n');
const policySha = createHash('sha256').update('hatch-webgl-allowed-domains-v1\nexample.com\n').digest('hex');

const child = spawn(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  `--user-data-dir=${join(tmpdir(), 'meme-chrome-prof')}`,
  `--hatch-webgl-allowed-domains-file=${policyPath}`,
  `--hatch-webgl-allowed-domains-sha256=${policySha}`,
  `--remote-debugging-port=${PORT}`,
  '--window-size=1080,1080',
  'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForChrome() {
  for (let i = 0; i < 50; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (res.ok) return;
    } catch { /* not up yet */ }
    await sleep(200);
  }
  throw new Error('chromium did not open its DevTools port');
}

function call(ws, id, method, params = {}) {
  return new Promise((resolve, reject) => {
    const onMessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id !== id) return;
      ws.removeEventListener('message', onMessage);
      if (msg.error) reject(new Error(`${method}: ${msg.error.message}`));
      else resolve(msg.result);
    };
    ws.addEventListener('message', onMessage);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

let code = 0;
try {
  await waitForChrome();
  const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
  const page = targets.find((t) => t.type === 'page' && t.url === 'about:blank') ?? targets[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve);
    ws.addEventListener('error', reject);
  });

  let id = 0;
  await call(ws, ++id, 'Page.enable');
  await call(ws, ++id, 'Emulation.setDeviceMetricsOverride', {
    width: 1080, height: 1080, deviceScaleFactor: 1, mobile: false,
  });
  const load = new Promise((resolve) => {
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Page.loadEventFired') resolve();
    });
  });
  await call(ws, ++id, 'Page.navigate', { url: `file://${html}` });
  await load;
  await sleep(400);
  const shot = await call(ws, ++id, 'Page.captureScreenshot', { format: 'png' });
  writeFileSync(png, Buffer.from(shot.data, 'base64'));
  ws.close();
} catch (err) {
  console.error(`render failed: ${err.message}`);
  code = 1;
} finally {
  child.kill();
}

if (code === 0) {
  if (!existsSync(png) || statSync(png).size < 10000) {
    console.error('meme.png was not written or is suspiciously small');
    process.exit(1);
  }
  console.log(`wrote ${png} (${statSync(png).size} bytes)`);
}
process.exit(code);
