// Script to inject webbluetooth node_modules into the packaged zip file
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, readdirSync, existsSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';
import { createWriteStream, createReadStream } from 'fs';
import { pipeline } from 'stream/promises';
import { Extract } from 'unzipper';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to recursively copy a directory
function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

async function injectWebbluetooth() {
  console.log('\n[Inject] Injecting webbluetooth into packaged app...');

  const projectRoot = join(__dirname, '..');
  const distDir = join(projectRoot, 'dist');
  
  // Read manifest to get version
  const manifestPath = join(distDir, 'manifest.json');
  if (!existsSync(manifestPath)) {
    console.error('✗ manifest.json not found');
    process.exit(1);
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const zipPath = join(distDir, `${manifest.id}-v${manifest.version}.zip`);
  
  if (!existsSync(zipPath)) {
    console.error(`✗ Zip file not found: ${zipPath}`);
    process.exit(1);
  }

  // Create temp extraction directory
  const tempDir = join(distDir, 'temp-extract');
  if (existsSync(tempDir)) {
    rmSync(tempDir, { recursive: true, force: true });
  }
  mkdirSync(tempDir, { recursive: true });

  // Extract the zip
  console.log('[Inject] Extracting zip...');
  await pipeline(
    createReadStream(zipPath),
    Extract({ path: tempDir })
  );

  // Copy webbluetooth
  const webbluetoothSrc = join(projectRoot, 'node_modules', 'webbluetooth');
  const webbluetoothDest = join(tempDir, 'server', 'node_modules', 'webbluetooth');

  if (!existsSync(webbluetoothSrc)) {
    console.error('✗ webbluetooth package not found in node_modules');
    process.exit(1);
  }

  console.log('[Inject] Copying webbluetooth...');
  copyDir(webbluetoothSrc, webbluetoothDest);
  console.log(`✓ Copied webbluetooth to temp directory`);

  // Copy webbluetooth's dependencies (pkg-prebuilds)
  const pkgPrebuildsSrc = join(projectRoot, 'node_modules', 'pkg-prebuilds');
  const pkgPrebuildsDestInWebbluetooth = join(webbluetoothDest, 'node_modules', 'pkg-prebuilds');
  
  if (existsSync(pkgPrebuildsSrc)) {
    console.log('[Inject] Copying pkg-prebuilds dependency...');
    copyDir(pkgPrebuildsSrc, pkgPrebuildsDestInWebbluetooth);
    console.log(`✓ Copied pkg-prebuilds`);
  }

  // Also copy prebuilds to where the bundled code expects them
  const prebuildsSrc = join(webbluetoothSrc, 'prebuilds');
  const prebuildsDestInServer = join(tempDir, 'server', 'prebuilds');
  
  console.log('[Inject] Copying prebuilds to server directory...');
  copyDir(prebuildsSrc, prebuildsDestInServer);
  console.log(`✓ Copied prebuilds for direct access`);

  // Re-zip
  console.log('[Inject] Re-zipping with webbluetooth...');
  const output = createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(`✓ Package updated: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
    // Clean up temp directory
    rmSync(tempDir, { recursive: true, force: true });
    console.log('✓ Successfully injected webbluetooth into package!\n');
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);
  archive.directory(tempDir, false);
  await archive.finalize();
}

injectWebbluetooth().catch(err => {
  console.error('✗ Error:', err);
  process.exit(1);
});
