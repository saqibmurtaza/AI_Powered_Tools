import esbuild from 'esbuild';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url);
const pkg = require(path.join(__dirname, '..', 'package.json'));

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const srcDir = path.join(rootDir, 'src');
const iconsDir = path.join(rootDir, 'icons');
const popupHtmlSrc = path.join(rootDir, 'popup.html');
const popupHtmlDest = path.join(distDir, 'popup.html');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log('📁 Created dist directory');
}

const baseConfig = {
  bundle: true,
  minify: false,
  sourcemap: true,
  external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})],
  platform: 'browser',
  target: 'es2020',
};

const configs = [
  {
    ...baseConfig,
    entryPoints: [path.join(srcDir, 'background.ts')],
    outfile: path.join(distDir, 'background.js'),
  },
  {
    ...baseConfig,
    entryPoints: [path.join(srcDir, 'contentScript.ts')],
    outfile: path.join(distDir, 'contentScript.js'),
  },
  {
    ...baseConfig,
    entryPoints: [path.join(srcDir, 'popup.ts')],
    outfile: path.join(distDir, 'popup.js'),
  },
];

async function build() {
  try {
    console.log('🔨 Building extension files...');
    for (const config of configs) {
      console.log(`📦 Building: ${path.basename(config.entryPoints[0])}`);
      await esbuild.build(config);
      console.log(`✅ Built: ${path.basename(config.entryPoints[0])} → ${path.basename(config.outfile)}`);
    }

    // ✅ Copy popup.html automatically
    if (fs.existsSync(popupHtmlSrc)) {
      fs.copyFileSync(popupHtmlSrc, popupHtmlDest);
      console.log('📄 Copied popup.html → dist/popup.html');
    } else {
      console.warn('⚠️ popup.html not found in root folder.');
    }

    // ✅ Copy icons folder automatically
    if (fs.existsSync(iconsDir)) {
      const distIconsDir = path.join(distDir, 'icons');
      fs.mkdirSync(distIconsDir, { recursive: true });
      fs.readdirSync(iconsDir).forEach((file) => {
        fs.copyFileSync(path.join(iconsDir, file), path.join(distIconsDir, file));
      });
      console.log('🖼️ Copied icons → dist/icons/');
    } else {
      console.warn('⚠️ No icons folder found.');
    }

    console.log('🎉 Extension build complete!');
    const files = fs.readdirSync(distDir);
    console.log('📁 Files in dist/:', files);
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
