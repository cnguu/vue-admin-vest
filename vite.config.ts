import type { ConfigEnv } from 'vite'

import { URL, fileURLToPath } from 'node:url'

import { NodePackageImporter } from 'sass-embedded'
import { createLogger, defineConfig, loadEnv } from 'vite'

import {
  VitePluginLegacy,
  VitePluginTailwindReference,
  tailwindcss,
  vue,
  vueDevTools,
  vueJsx,
} from './builder/plugin'
import { getServerProxy } from './builder/util'

const logger = createLogger()

export default ({ mode, command }: ConfigEnv) => {
  const isDev = mode === 'dev'
  const isBuild = command === 'build'

  const envDir = fileURLToPath(new URL('./src/env', import.meta.url))

  const env = loadEnv(mode, envDir) as ImportMetaEnv

  const { VITE_APP_TITLE, VITE_BASE_URL, VITE_SERVER_PROXY, VITE_SERVER_PORT } = env

  logger.info(VITE_APP_TITLE)
  logger.info(`当前环境变量:\n${JSON.stringify(env, null, 2)}`)

  return defineConfig({
    root: process.cwd(),
    base: VITE_BASE_URL,
    plugins: [
      vue(),
      vueJsx(),
      VitePluginLegacy,
      VitePluginTailwindReference(),
      tailwindcss(),
      isBuild ? void 0 : vueDevTools(),
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
      reportCompressedSize: true,
      chunkSizeWarningLimit: 500,
    },
    preview: {
      port: Number(VITE_SERVER_PORT),
    },
  })
}
