import type { ConfigEnv } from 'vite'

import { URL, fileURLToPath } from 'node:url'

import { NodePackageImporter } from 'sass-embedded'
import { createLogger, defineConfig, loadEnv } from 'vite'

import { vue, vueDevTools, vueJsx } from './builder/plugin'
import { getServerProxy } from './builder/util'

const logger = createLogger()

export default ({ mode }: ConfigEnv) => {
  const isDev = mode === 'dev'

  const envDir = fileURLToPath(new URL('./src/env', import.meta.url))

  const env = loadEnv(mode, envDir) as ImportMetaEnv

  const { VITE_APP_TITLE, VITE_BASE_URL, SERVER_PORT, SERVER_PROXY } = env

  logger.info(VITE_APP_TITLE)
  logger.info(`当前环境变量:\n${JSON.stringify(env, null, 4)}`)

  return defineConfig({
    root: process.cwd(),
    base: VITE_BASE_URL,
    plugins: [vue(), vueJsx(), vueDevTools()],
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
      port: Number(SERVER_PORT),
      strictPort: true,
      proxy: SERVER_PROXY ? getServerProxy(SERVER_PROXY) : void 0,
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
      port: Number(SERVER_PORT),
    },
  })
}
