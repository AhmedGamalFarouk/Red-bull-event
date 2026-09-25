#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const publicDir = path.resolve(repoRoot, 'public');
const postersDir = path.resolve(publicDir, 'drafts', 'posters');
const configPath = path.resolve(__dirname, 'drafts.config.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.bin': 'application/octet-stream',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
};

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

function startStaticServer(baseDir) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        let pathname = decodeURIComponent(parsedUrl.pathname);

        // Redirect bare draft paths without trailing slash e.g. /drafts/original -> /drafts/original/
        if (/^\/drafts\/[^/]+$/.test(pathname)) {
          res.writeHead(302, { Location: `${pathname}/${parsedUrl.search}` });
          res.end();
          return;
        }

        if (pathname.endsWith('/')) {
          pathname += 'index.html';
        }

        const safePath = path.normalize(path.join(baseDir, pathname));

        if (!safePath.startsWith(baseDir)) {
          res.writeHead(403, { 'Content-Type': 'text/plain' });
          res.end('Forbidden');
          return;
        }

        fs.stat(safePath, (err, stats) => {
          if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(`Not found: ${pathname}`);
            return;
          }

          const ext = path.extname(safePath).toLowerCase();
          const contentType = MIME_TYPES[ext] || 'application/octet-stream';

          res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': stats.size,
            'Cache-Control': 'no-cache',
          });

          const stream = fs.createReadStream(safePath);
          stream.pipe(res);
        });
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server error: ${err.message}`);
      }
    });

    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      resolve({ server, port, origin: `http://127.0.0.1:${port}` });
    });

    server.on('error', reject);
  });
}

async function bypassPreloaderGate(page) {
  try {
    const candidates = page.locator('button, a, [role="button"]');
    const count = await candidates.count();
    for (let i = 0; i < count; i++) {
      const el = candidates.nth(i);
      const isVisible = await el.isVisible().catch(() => false);
      if (isVisible) {
        const text = (await el.innerText().catch(() => '')).trim();
        if (/enter|explore|start|skip/i.test(text)) {
          console.log(`Found preloader gate button ("${text}"), clicking...`);
          await el.click().catch(() => {});
          console.log('Waiting 3s for site reveal...');
          await page.waitForTimeout(3000);
          break;
        }
      }
    }
  } catch (err) {
    console.warn('Preloader gate check skipped:', err.message);
  }
}

async function captureDraftPosters(page, draft, origin) {
  const targetUrl = `${origin}/drafts/${draft.slug}/`;
  const desktopPosterPath = path.resolve(postersDir, `${draft.slug}.jpg`);
  const mobilePosterPath = path.resolve(postersDir, `${draft.slug}-mobile.jpg`);

  console.log(`\nCapturing posters for "${draft.name}" (${draft.slug})...`);
  console.log(`Navigating to ${targetUrl}`);

  // 1. Capture Desktop Poster (1440x900)
  await page.setViewportSize({ width: 1440, height: 900 });
  try {
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 25000 });
  } catch {
    // If networkidle times out due to streaming/keep-alive, fall back to load
    await page.waitForLoadState('load').catch(() => {});
  }

  // Wait ~7s for preloader and reveal animations to finish
  console.log(`Waiting 7s for preloader animations to finish...`);
  await page.waitForTimeout(7000);

  // If a preloader gate exists, click it and wait ~3s more
  await bypassPreloaderGate(page);

  await page.screenshot({
    path: desktopPosterPath,
    type: 'jpeg',
    quality: 78,
    fullPage: false,
  });

  const desktopSize = fs.statSync(desktopPosterPath).size;

  // 2. Capture Mobile Poster (390x844)
  console.log(`Capturing mobile poster at 390x844...`);
  await page.setViewportSize({ width: 390, height: 844 });
  // Reload at mobile size so any responsive setup / layout hooks adjust cleanly
  try {
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 25000 });
  } catch {
    await page.waitForLoadState('load').catch(() => {});
  }
  await page.waitForTimeout(7000);

  // If a preloader gate exists, click it and wait ~3s more
  await bypassPreloaderGate(page);

  await page.screenshot({
    path: mobilePosterPath,
    type: 'jpeg',
    quality: 78,
    fullPage: false,
  });

  const mobileSize = fs.statSync(mobilePosterPath).size;

  console.log(
    `[POSTER OK] ${draft.slug}: desktop (${formatBytes(desktopSize)}), mobile (${formatBytes(mobileSize)})`
  );
}

async function main() {
  if (!fs.existsSync(configPath)) {
    console.error(`Config file not found at ${configPath}`);
    process.exit(1);
  }

  const allDrafts = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const filterSlugs = process.argv.slice(2).filter((arg) => !arg.startsWith('-'));

  let targetDrafts = allDrafts;
  if (filterSlugs.length > 0) {
    targetDrafts = allDrafts.filter((d) => filterSlugs.includes(d.slug));
    if (targetDrafts.length === 0) {
      console.error(`No matching drafts found for slugs: ${filterSlugs.join(', ')}`);
      process.exit(1);
    }
  }

  if (!fs.existsSync(postersDir)) {
    fs.mkdirSync(postersDir, { recursive: true });
  }

  console.log('Starting local static server to serve public/...');
  const { server, origin } = await startStaticServer(publicDir);
  console.log(`Static server running at ${origin}`);

  let browser;
  try {
    console.log('Launching Playwright Chromium browser...');
    browser = await chromium.launch({
      headless: true,
      args: ['--enable-webgl', '--use-gl=angle', '--no-sandbox'],
    });

    const context = await browser.newContext({
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    let successCount = 0;
    let failCount = 0;

    for (const draft of targetDrafts) {
      // Check if built draft exists first
      const draftIndex = path.resolve(publicDir, 'drafts', draft.slug, 'index.html');
      if (!fs.existsSync(draftIndex)) {
        console.warn(`[SKIP] Built draft index not found at ${draftIndex}. Run drafts:build first.`);
        failCount++;
        continue;
      }

      try {
        await captureDraftPosters(page, draft, origin);
        successCount++;
      } catch (err) {
        console.error(`[ERROR] Failed to capture posters for "${draft.slug}":`, err.message);
        failCount++;
      }
    }

    console.log('\n--- Posters Capture Summary ---');
    console.log(`Captured: ${successCount} drafts, Failed/Skipped: ${failCount} drafts`);
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
    server.close();
    console.log('Static server stopped.');
  }
}

main().catch((err) => {
  console.error('Fatal error capturing posters:', err);
  process.exit(1);
});
