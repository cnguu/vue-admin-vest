import type { Plugin } from 'vite'

const REFERENCE_THEME = '@reference "@/style/theme.css";\n'

export const VitePluginTailwindReference = (): Plugin => {
  return {
    name: 'vite-plugin-tailwind-reference',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('.vue')) {
        return
      }
      if (!id.includes('type=style')) {
        return
      }
      if (code.includes('@reference')) {
        return
      }
      if (!code.includes('@apply')) {
        return
      }
      return {
        code: REFERENCE_THEME + code,
        map: null,
      }
    },
  }
}
