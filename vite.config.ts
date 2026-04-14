import type { ConfigEnv } from 'vite'

import { URL, fileURLToPath } from 'node:url'

import VitePluginTailwindcss from '@tailwindcss/vite'
import VitePluginLegacy from '@vitejs/plugin-legacy'
import VitePluginVue from '@vitejs/plugin-vue'
import VitePluginVueJsx from '@vitejs/plugin-vue-jsx'
import { visualizer as RollupPluginVisualizer } from 'rollup-plugin-visualizer'
import { NodePackageImporter } from 'sass-embedded'
import { createLogger, defineConfig, loadEnv } from 'vite'
import VitePluginVueDevTools from 'vite-plugin-vue-devtools'

import { VitePluginTailwindReference } from './builder/plugin'
import { getServerProxy } from './builder/util'

const logger = createLogger()

export default ({ mode, command }: ConfigEnv) => {
  const isDev = mode === 'dev'
  const isBuild = command === 'build'

  const envDir = fileURLToPath(new URL('./src/env', import.meta.url))

  const env = loadEnv(mode, envDir) as ImportMetaEnv

  const {
    VITE_APP_TITLE,
    VITE_BASE_URL,
    VITE_SERVER_PROXY,
    VITE_SERVER_PORT,
    VITE_PLUGIN_VISUALIZER,
    VITE_DROP_CONSOLE,
  } = env

  logger.info(VITE_APP_TITLE)
  logger.info(`当前环境变量:\n${JSON.stringify(env, null, 2)}`)

  return defineConfig({
    root: process.cwd(),
    base: VITE_BASE_URL,
    plugins: [
      VitePluginVue(),
      VitePluginVueJsx(),
      VitePluginLegacy({
        targets: ['chrome >= 49', 'android >= 5', 'not IE 11'],
        renderModernChunks: true,
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        polyfills: [
          'es.promise',
          'es.promise.finally',
          'es.symbol',
          'es.array.iterator',
          'es.array.from',
          'es.array.includes',
          'es.object.assign',
          'web.dom-collections.for-each',
        ],
      }),
      VitePluginTailwindReference(),
      VitePluginTailwindcss(),
      isBuild ? void 0 : VitePluginVueDevTools(),
      isBuild && VITE_PLUGIN_VISUALIZER === 'true' ?
        RollupPluginVisualizer({
          open: true,
          filename: 'stats.html',
          gzipSize: true,
          brotliSize: true,
        })
      : void 0,
    ],
    publicDir: 'static',
    cacheDir: 'node_modules/.vite',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use '@/style/global.scss' as *;`,
          importers: [new NodePackageImporter()],
        },
      },
    },
    customLogger: logger,
    clearScreen: false,
    envDir,
    appType: 'spa',
    server: {
      host: true,
      port: Number(VITE_SERVER_PORT),
      strictPort: true,
      proxy: VITE_SERVER_PROXY ? getServerProxy(VITE_SERVER_PROXY) : void 0,
      warmup: {
        clientFiles: ['./index.html', './src/boot.ts'],
      },
    },
    build: {
      target: 'es2015',
      modulePreload: {
        polyfill: true,
      },
      outDir: 'dist/vue-admin-vest',
      assetsDir: 'assets',
      assetsInlineLimit: 0,
      cssCodeSplit: true,
      cssTarget: 'chrome61',
      cssMinify: 'lightningcss',
      sourcemap: 'hidden',
      minify: 'oxc',
      write: true,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 500,
      rolldownOptions: {
        output: {
          minify: {
            compress: {
              dropConsole: VITE_DROP_CONSOLE === 'true',
              dropDebugger: VITE_DROP_CONSOLE === 'true',
            },
          },
        },
      },
    },
    preview: {
      port: Number(VITE_SERVER_PORT),
    },
  })
}
