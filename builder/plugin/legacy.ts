import legacy from '@vitejs/plugin-legacy'

export const VitePluginLegacy = legacy({
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
})
