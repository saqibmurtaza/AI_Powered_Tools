import esbuild from 'esbuild';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const baseConfig = {
  bundle: true,
  minify: false,
  sourcemap: true,
  external: [...Object.keys(pkg.dependencies || {})],
  platform: 'browser',
};

async function buildOnce() {
  try {
    await esbuild.build({
      ...baseConfig,
      entryPoints: ['src/background.ts', 'src/contentScript.ts'],
      outdir: 'dist',
    });
    console.log('✅ Extension dev build complete!');
    console.log('📁 Files built in dist/ folder');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

async function watch() {
  const ctx = await esbuild.context({
    ...baseConfig,
    entryPoints: ['src/background.ts', 'src/contentScript.ts'],
    outdir: 'dist',
  });
  await ctx.watch();
  console.log('👀 Watching for changes...');
}

const mode = process.argv[2];
if (mode === '--watch') {
  watch();
} else {
  buildOnce();
}