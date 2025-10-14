import esbuild from 'esbuild';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const baseConfig = {
  bundle: true,
  minify: false,
  sourcemap: true,
  external: [...Object.keys(pkg.dependencies || {})],
};

const configs = [
  {
    ...baseConfig,
    entryPoints: ['src/background.ts'],
    outfile: 'dist/background.js',
    platform: 'node',
  },
  {
    ...baseConfig,
    entryPoints: ['src/contentScript.ts'],
    outfile: 'dist/contentScript.js',
    platform: 'browser',
  }
  // REMOVED: floatingButton build config
];

async function build() {
  try {
    for (const config of configs) {
      await esbuild.build(config);
    }
    console.log('Extension build complete!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();