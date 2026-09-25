#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { build } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const configPath = path.resolve(__dirname, 'drafts.config.json');
const publicDraftsDir = path.resolve(repoRoot, 'public', 'drafts');
const manifestPath = path.resolve(publicDraftsDir, 'manifest.json');
const repoNodeModules = path.resolve(repoRoot, 'node_modules');

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

function getDirStats(dirPath) {
  let totalBytes = 0;
  let fileCount = 0;

  function walk(current) {
    if (!fs.existsSync(current)) return;
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        fileCount++;
        totalBytes += fs.statSync(fullPath).size;
      }
    }
  }

  walk(dirPath);
  return { totalBytes, fileCount };
}

function getShortCommit(ref) {
  try {
    return execSync(`git rev-parse --short "${ref}"`, {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch (err) {
    console.warn(`Could not resolve short commit for ref "${ref}":`, err.message);
    return ref;
  }
}

async function buildDraft(draft) {
  const tmpDir = path.join(os.tmpdir(), `rb-draft-${draft.slug}-${Date.now()}`);
  const tmpNodeModules = path.join(tmpDir, 'node_modules');
  const outDir = path.resolve(publicDraftsDir, draft.slug);

  console.log(`\n==================================================`);
  console.log(`Building draft "${draft.name}" (${draft.slug}) from ref ${draft.ref}`);
  console.log(`Temp worktree: ${tmpDir}`);
  console.log(`Output directory: ${outDir}`);

  const originalCwd = process.cwd();
  try {
    // 1. Add detached temp worktree
    execSync(`git worktree add --detach "${tmpDir}" "${draft.ref}"`, {
      cwd: repoRoot,
      stdio: 'inherit',
    });

    // 2. Create junction from <tmp>/node_modules to <repo>/node_modules
    fs.symlinkSync(repoNodeModules, tmpNodeModules, 'junction');

    // Switch CWD to tmpDir so PostCSS and Tailwind load the draft's own configs
    process.chdir(tmpDir);

    // 3. Build using Vite JS API
    const configFile = path.join(tmpDir, 'vite.config.ts');
    await build({
      root: tmpDir,
      configFile,
      base: `/drafts/${draft.slug}/`,
      publicDir: false,
      logLevel: 'warn',
      build: {
        outDir,
        emptyOutDir: true,
      },
    });

    const stats = getDirStats(outDir);
    const commit = getShortCommit(draft.ref);

    console.log(
      `[SUCCESS] Draft "${draft.slug}" built (${commit}): ${stats.fileCount} files, ${formatBytes(stats.totalBytes)} -> ${path.relative(repoRoot, outDir)}`
    );

    return {
      ...draft,
      path: `/drafts/${draft.slug}/`,
      poster: `/drafts/posters/${draft.slug}.jpg`,
      commit,
      builtAt: new Date().toISOString(),
    };
  } finally {
    try {
      process.chdir(originalCwd);
    } catch {
      // ignore
    }

    // Cleanup: always remove the junction first (fs.unlinkSync / fs.rmSync ONLY on junction, NEVER recursive!)
    try {
      const exists = fs.existsSync(tmpNodeModules) || fs.lstatSync(tmpNodeModules, { throwIfNoEntry: false });
      if (exists) {
        fs.unlinkSync(tmpNodeModules);
      }
    } catch (err) {
      console.warn(`Warning: failed to unlink node_modules junction at ${tmpNodeModules}:`, err.message);
    }

    // Remove temp git worktree
    try {
      execSync(`git worktree remove --force "${tmpDir}"`, {
        cwd: repoRoot,
        stdio: 'pipe',
      });
      execSync('git worktree prune', {
        cwd: repoRoot,
        stdio: 'pipe',
      });
    } catch (err) {
      console.warn(`Warning: failed to remove git worktree at ${tmpDir}:`, err.message);
    }
  }
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

  if (!fs.existsSync(publicDraftsDir)) {
    fs.mkdirSync(publicDraftsDir, { recursive: true });
  }

  // Load existing manifest if present for partial builds
  let existingManifest = [];
  if (fs.existsSync(manifestPath)) {
    try {
      existingManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      if (!Array.isArray(existingManifest)) existingManifest = [];
    } catch {
      existingManifest = [];
    }
  }

  const manifestMap = new Map();
  for (const item of existingManifest) {
    if (item?.slug) {
      manifestMap.set(item.slug, item);
    }
  }

  console.log(`Starting build for ${targetDrafts.length} draft(s)...`);

  for (const draft of targetDrafts) {
    const result = await buildDraft(draft);
    manifestMap.set(result.slug, result);
  }

  // Preserve order from drafts.config.json for known items
  const finalManifest = allDrafts
    .map((d) => manifestMap.get(d.slug))
    .filter(Boolean);

  // Append any extra items that might have been in the existing manifest
  for (const [slug, item] of manifestMap.entries()) {
    if (!finalManifest.some((d) => d.slug === slug)) {
      finalManifest.push(item);
    }
  }

  fs.writeFileSync(manifestPath, JSON.stringify(finalManifest, null, 2) + '\n', 'utf8');
  console.log(`\nUpdated manifest at ${path.relative(repoRoot, manifestPath)} with ${finalManifest.length} drafts.`);

  // Print summary
  console.log('\n--- Build Summary ---');
  let totalAllBytes = 0;
  for (const d of targetDrafts) {
    const draftDir = path.join(publicDraftsDir, d.slug);
    const stats = getDirStats(draftDir);
    totalAllBytes += stats.totalBytes;
    console.log(`- ${d.slug} (${d.name}): ${stats.fileCount} files, ${formatBytes(stats.totalBytes)}`);
  }
  console.log(`Total size of built drafts: ${formatBytes(totalAllBytes)}`);
}

main().catch((err) => {
  console.error('\nBuild failed with error:', err);
  process.exit(1);
});
