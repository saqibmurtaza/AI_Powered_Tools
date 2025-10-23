import esbuild from 'esbuild';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// ✅ Load environment variables from .env file
dotenv.config();

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
const manifestSrc = path.join(rootDir, 'manifest.json');
const manifestDest = path.join(distDir, 'manifest.json');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log('📁 Created dist directory');
}

// ✅ Automatically inject .env values
const defineEnv = {
  'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || ''),
  'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || '')
};

const baseConfig = {
  bundle: true,
  minify: false,
  sourcemap: true,
  platform: 'browser',
  target: 'es2020',
  format: 'esm',
  define: defineEnv
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

    // Copy manifest.json
    if (fs.existsSync(manifestSrc)) {
      fs.copyFileSync(manifestSrc, manifestDest);
      console.log('📋 Copied manifest.json → dist/');
    }

    // Copy popup.html
    if (fs.existsSync(popupHtmlSrc)) {
      fs.copyFileSync(popupHtmlSrc, popupHtmlDest);
      console.log('📄 Copied popup.html → dist/');
    }

    // Copy icons
    if (fs.existsSync(iconsDir)) {
      const distIconsDir = path.join(distDir, 'icons');
      fs.mkdirSync(distIconsDir, { recursive: true });
      fs.readdirSync(iconsDir).forEach((file) => {
        fs.copyFileSync(path.join(iconsDir, file), path.join(distIconsDir, file));
      });
      console.log('🖼️ Copied icons → dist/icons/');
    }

    console.log('🎉 Extension build complete!');
    console.log('📁 Files in dist/:', fs.readdirSync(distDir));
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
