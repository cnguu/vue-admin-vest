/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 应用标题 */
  readonly VITE_APP_TITLE: string

  /** 部署应用的基本URL */
  readonly VITE_BASE_URL: string

  /** 请求接口地址的基本URL */
  readonly VITE_API_URL: string

  /** 开发服务器端口 */
  readonly VITE_SERVER_PORT: string

  /** 开发服务器请求代理 */
  readonly VITE_SERVER_PROXY: string

  /** 启用 rollup-plugin-visualizer 插件 */
  readonly VITE_PLUGIN_VISUALIZER: 'true' | 'false'
}

interface ImportMeta {
  readonly env: Env.ImportMetaEnv
}
