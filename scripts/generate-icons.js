import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateIcons() {
  const projectRoot = path.join(__dirname, '..');
  const iconsDir = path.join(projectRoot, 'public', 'icons');
  
  // Ensure the icons directory exists
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  console.log('Generating PWA icons...');

  try {
    // Generate 192x192 PNG from SVG
    await sharp(path.join(iconsDir, 'pwa-192x192.svg'))
      .png()
      .resize(192, 192)
      .toFile(path.join(iconsDir, 'pwa-192x192.png'));
    console.log('✓ Generated pwa-192x192.png');

    // Generate 512x512 PNG from SVG
    await sharp(path.join(iconsDir, 'pwa-512x512.svg'))
      .png()
      .resize(512, 512)
      .toFile(path.join(iconsDir, 'pwa-512x512.png'));
    console.log('✓ Generated pwa-512x512.png');

    // Generate 512x512 maskable PNG from SVG
    await sharp(path.join(iconsDir, 'pwa-512x512-maskable.svg'))
      .png()
      .resize(512, 512)
      .toFile(path.join(iconsDir, 'pwa-512x512-maskable.png'));
    console.log('✓ Generated pwa-512x512-maskable.png');

    console.log('All PWA icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
