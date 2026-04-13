import type { ProxyOptions } from 'vite'

export const getServerProxy = (config: string) => {
  const ret: Record<string, string | ProxyOptions> = {}
  try {
    const list: [string, string][] = JSON.parse(config)
    for (const [prefix, target] of list) {
      ret[prefix] = {
        target,
        changeOrigin: true,
        ws: true,
        rewrite: (path: string) => path.replace(new RegExp(`^${prefix}`), ''),
        ...(/^https:\/\//.test(target) ? { secure: false } : {}),
      }
    }
  } catch (error) {
    console.error(error)
  }
  return ret
}
