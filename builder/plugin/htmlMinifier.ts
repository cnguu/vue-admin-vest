import type { Options as HtmlMinifierOptions } from 'html-minifier-terser'
import type { PluginOption } from 'vite'

import { minify } from 'html-minifier-terser'

const DEFAULT_OPTIONS: HtmlMinifierOptions = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  removeEmptyAttributes: true,
  removeAttributeQuotes: true,
  caseSensitive: true,
  minifyJS: {
    ecma: 5,
    ie8: true,
    safari10: true,
  },
  minifyCSS: true,
}

const PLUGIN_NAME = 'vite-plugin-html-minifier'

export const VitePluginHtmlMinifier = (options: HtmlMinifierOptions = {}): PluginOption => {
  return {
    name: PLUGIN_NAME,
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      async handler(html) {
        try {
          return await minify(html, {
            ...DEFAULT_OPTIONS,
            ...options,
          })
        } catch (error) {
          console.error(`[${PLUGIN_NAME}] Minify error:`, error)
          return html
        }
      },
    },
  }
}
