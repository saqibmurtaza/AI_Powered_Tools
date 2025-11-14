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

// ✅ CORRECTED: popup.html is in the ROOT directory, not src
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
  'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || ''),
  'import.meta.env.VITE_AI_API_KEY': JSON.stringify(process.env.VITE_AI_API_KEY || ''),
  'import.meta.env.VITE_AI_BASE_URL': JSON.stringify(process.env.VITE_AI_BASE_URL || '')
};

const baseConfig = {
  bundle: true,
  minify: false,
  sourcemap: true,
  platform: 'browser',
  target: 'es2020',
  format: 'esm',
  define: defineEnv,
  // ✅ Add TypeScript support
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx'
  },
  // ✅ Add proper TypeScript config
  tsconfig: path.join(rootDir, 'tsconfig.json')
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
    
    // ✅ Validate source files exist before building
    const requiredFiles = [
      { path: path.join(srcDir, 'background.ts'), name: 'background.ts' },
      { path: path.join(srcDir, 'contentScript.ts'), name: 'contentScript.ts' },
      { path: path.join(srcDir, 'popup.ts'), name: 'popup.ts' },
      { path: popupHtmlSrc, name: 'popup.html' }, // Now correctly points to root
      { path: manifestSrc, name: 'manifest.json' }
    ];

    for (const file of requiredFiles) {
      if (!fs.existsSync(file.path)) {
        console.error(`❌ Missing file: ${file.path}`);
        throw new Error(`Missing required file: ${file.name} at ${file.path}`);
      }
    }

    console.log('✅ All required files found');

    // ✅ Build TypeScript files
    for (const config of configs) {
      const entryName = path.basename(config.entryPoints[0]);
      console.log(`📦 Building: ${entryName}`);
      
      const result = await esbuild.build(config);
      if (result.errors.length > 0) {
        console.error(`❌ Build errors in ${entryName}:`, result.errors);
        throw new Error(`Failed to build ${entryName}`);
      }
      
      console.log(`✅ Built: ${entryName} → ${path.basename(config.outfile)}`);
    }

    // ✅ Copy manifest.json
    if (fs.existsSync(manifestSrc)) {
      fs.copyFileSync(manifestSrc, manifestDest);
      console.log('📋 Copied manifest.json → dist/');
      
      // Verify manifest structure
      try {
        const manifestContent = fs.readFileSync(manifestDest, 'utf8');
        const manifest = JSON.parse(manifestContent);
        console.log('✅ Manifest validation passed');
      } catch (error) {
        console.warn('⚠️ Manifest JSON might be invalid');
      }
    } else {
      throw new Error('manifest.json not found in root directory');
    }

    // ✅ Copy popup.html (from root directory)
    if (fs.existsSync(popupHtmlSrc)) {
      let popupContent = fs.readFileSync(popupHtmlSrc, 'utf8');
      
      // Ensure popup.html references the correct JS files
      if (!popupContent.includes('popup.js')) {
        console.warn('⚠️ popup.html might not reference popup.js correctly');
      }
      
      fs.writeFileSync(popupHtmlDest, popupContent);
      console.log('📄 Copied popup.html → dist/');
    } else {
      throw new Error('popup.html not found in root directory');
    }

    // ✅ Copy icons
    if (fs.existsSync(iconsDir)) {
      const distIconsDir = path.join(distDir, 'icons');
      if (!fs.existsSync(distIconsDir)) {
        fs.mkdirSync(distIconsDir, { recursive: true });
      }
      
      const iconFiles = fs.readdirSync(iconsDir);
      if (iconFiles.length === 0) {
        console.warn('⚠️ No icon files found in icons directory');
      } else {
        iconFiles.forEach((file) => {
          fs.copyFileSync(path.join(iconsDir, file), path.join(distIconsDir, file));
        });
        console.log(`🖼️ Copied ${iconFiles.length} icons → dist/icons/`);
      }
    } else {
      console.warn('⚠️ Icons directory not found');
    }

    // ✅ Final verification
    const distFiles = fs.readdirSync(distDir);
    const requiredDistFiles = ['background.js', 'contentScript.js', 'popup.js', 'popup.html', 'manifest.json'];
    
    const missingFiles = requiredDistFiles.filter(file => !distFiles.includes(file));
    if (missingFiles.length > 0) {
      console.error('❌ Missing files in dist:', missingFiles);
      console.log('📁 Actual dist files:', distFiles);
      throw new Error(`Missing files in dist: ${missingFiles.join(', ')}`);
    }

    console.log('🎉 Extension build complete!');
    console.log('📁 Files in dist/:', distFiles);
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

build();