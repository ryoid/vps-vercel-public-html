
// FIX esbuild bug https://github.com/evanw/esbuild/pull/2067
// probably not necessary when `./prerender/vite-plugin-ssr` will be included in `vite-plugin-ssr`
// eslint-disable-next-line no-undef
import module from 'module';
globalThis.require = module.createRequire(import.meta.url);

import solidPlugin from 'vite-plugin-solid'
import ssr from 'vite-plugin-ssr/plugin'
import vercel from 'vite-plugin-vercel'
import { defineConfig } from 'vite'

import * as path from "path";

export default defineConfig(async ({ command, mode }) => {
  // Dynamic import to bypass esbuild compilation issue.
  // If you are not using ESM, could me move as a top synchronous import
  const vitePluginSsrVercelPlugin = await import('./prerender/vite-plugin-ssr');

  return {
    plugins: [solidPlugin({ ssr: true }), ssr(), vercel(), vitePluginSsrVercelPlugin.default()],
    build: {
      polyfillDynamicImport: false,
    },
    resolve: {
      alias: {
        src: path.resolve(__dirname, "src"),
        "@terra-money/terra.js": "@terra-money/terra.js/dist/bundle.js",
        "@coinhall/terra-tome": path.resolve(
          __dirname,
          "lib/terra-tome/src/index.ts"
        ),
        process: path.resolve(__dirname, "src/polyfill/process-es6.js"),
      },
    },
    // https://github.com/magne4000/vite-plugin-vercel/blob/main/packages/vercel/src/types.ts#L15
    vercel: {
      expiration: 25,
    },
  };
});