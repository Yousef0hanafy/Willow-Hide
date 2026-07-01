/**
 * Optimize Images — Batch convert JPG/PNG to WebP
 *
 * Usage:
 *   1. Install sharp:  npm install sharp
 *   2. Run:            node optimize-images.js
 *
 * Converts all .jpg/.jpeg/.png images in the Images/ directory
 * to .webp format with 80% quality, keeping the originals intact.
 */

const fs = require('fs');
const path = require('path');

// Try to load sharp — provide helpful message if not installed
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('sharp is required. Run: npm install sharp');
  process.exit(1);
}

const IMAGES_DIR = path.join(__dirname, 'Images');
const QUALITY = 80;

// File extensions to convert
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);

const images = [];

// Recursively walk directories
function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (EXTENSIONS.has(ext)) {
        images.push(fullPath);
      }
    }
  }
}

console.log('Scanning for images...');
walkDir(IMAGES_DIR);
console.log(`Found ${images.length} image(s) to convert.\n`);

let converted = 0;
let errors = 0;

(async () => {
  for (const imgPath of images) {
    const ext = path.extname(imgPath).toLowerCase();
    const webpPath = imgPath.replace(ext, '.webp');
    const relativePath = path.relative(__dirname, imgPath);

    try {
      let pipeline = sharp(imgPath);

      // Preserve metadata (orientation, etc.)
      pipeline = pipeline.withMetadata();

      // Convert to webp
      pipeline = pipeline.webp({ quality: QUALITY });

      await pipeline.toFile(webpPath);

      const originalSize = fs.statSync(imgPath).size;
      const newSize = fs.statSync(webpPath).size;
      const savings = ((1 - newSize / originalSize) * 100).toFixed(1);

      console.log(
        `  ✓ ${relativePath.padEnd(55)} ` +
        `${(originalSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB ` +
        `(${savings}% savings)`
      );
      converted++;
    } catch (err) {
      console.error(`  ✗ ${relativePath}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\nDone! ${converted} converted, ${errors} error(s).`);
  if (errors === 0) {
    console.log('All images optimized. Originals preserved.');
  }
})();
