import type { ConfigEnv } from 'vite'

import { URL, fileURLToPath } from 'node:url'

import ViteVueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import VitePluginTailwindcss from '@tailwindcss/vite'
import VitePluginLegacy from '@vitejs/plugin-legacy'
import VitePluginVue from '@vitejs/plugin-vue'
import VitePluginVueJsx from '@vitejs/plugin-vue-jsx'
import { visualizer as RollupPluginVisualizer } from 'rollup-plugin-visualizer'
import { NodePackageImporter } from 'sass-embedded'
import ElementPlus from 'unplugin-element-plus/vite'
import { createLogger, defineConfig, loadEnv } from 'vite'
import { compression } from 'vite-plugin-compression2'
import VitePluginJson5 from 'vite-plugin-json5'
import VitePluginVueDevTools from 'vite-plugin-vue-devtools'
import ViteVueRouter from 'vue-router/vite'

import { VitePluginHtmlMinifier, VitePluginTailwindReference } from './builder/plugin'
import { getServerProxy } from './builder/util'

const logger = createLogger()

export default ({ mode, command }: ConfigEnv) => {
  const isDev = mode === 'dev'
  const isBuild = command === 'build'

  const envDir = fileURLToPath(new URL('./src/env', import.meta.url))

  const env = loadEnv(mode, envDir) as ImportMetaEnv

  const {
    VITE_BASE_URL,
    VITE_SERVER_PROXY,
    VITE_SERVER_PORT,
    VITE_DEV_TOOLS,
    VITE_PLUGIN_VISUALIZER,
    VITE_DROP_CONSOLE,
    VITE_PLUGIN_COMPRESSION,
  } = env

  logger.info(`当前环境变量:\n${JSON.stringify(env, null, 2)}`)

  return defineConfig({
    root: process.cwd(),
    base: VITE_BASE_URL,
    plugins: [
      VitePluginJson5({ dts: false }),
      ViteVueRouter({
        extensions: ['.vue'],
        routesFolder: ['src/page'],
        exclude: ['**/component/**'],
        importMode: 'async',
        dts: './src/dts/typed-router.d.ts',
      }),
      VitePluginVue(),
      VitePluginVueJsx(),
      ElementPlus({
        format: 'esm',
      }),
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
      ViteVueI18nPlugin({
        compositionOnly: true,
        fullInstall: true,
        runtimeOnly: true,
      }),
      VitePluginTailwindReference(),
      VitePluginTailwindcss(),
      isBuild ? void 0
      : VITE_DEV_TOOLS === 'true' ? VitePluginVueDevTools()
      : void 0,
      isBuild && VITE_PLUGIN_VISUALIZER === 'true' ?
        RollupPluginVisualizer({
          open: true,
          filename: 'stats.html',
          gzipSize: true,
          brotliSize: true,
        })
      : void 0,
      isBuild && VITE_PLUGIN_COMPRESSION === 'true' ?
        [
          compression({
            include: /\.(html|xml|css|json|js|mjs|svg|yaml|yml|toml)$/,
            exclude: /\.(png|jpg|jpeg|gif|webp|woff|woff2|gz|br)$/,
            threshold: 1024,
            algorithms: ['gzip', 'brotliCompress'],
            deleteOriginalAssets: false,
            skipIfLargerOrEqual: true,
            logLevel: 'info',
          }),
          VitePluginHtmlMinifier(),
        ]
      : void 0,
    ].flat(),
    publicDir: 'static',
    cacheDir: 'node_modules/.vite',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.json5'],
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
      modulePreload: {
        polyfill: true,
      },
      outDir: 'dist/vue-admin-vest',
      assetsDir: 'assets',
      assetsInlineLimit: 0,
      cssCodeSplit: true,
      cssTarget: 'chrome61',
      cssMinify: 'lightningcss',
      sourcemap: false,
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
      port: Number(VITE_SERVER_PORT) - 1,
    },
  })
}
