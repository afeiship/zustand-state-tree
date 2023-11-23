import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  cjsInterop: true,

  // react
  minify: true,
  sourcemap: true,
  splitting: true,
  target: 'es6',
  bundle: true,
  external: ['react', 'react-dom', 'zustand', '@jswork/next'],
  outExtension({ format }) {
    return {
      js: `.${format}.js`,
    };
  },
});
