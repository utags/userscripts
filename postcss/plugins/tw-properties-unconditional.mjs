const twPropertiesUnconditional = () => ({
  postcssPlugin: 'tw-properties-unconditional',
  Once(root) {
    root.walkAtRules('layer', (layer) => {
      if (String(layer.params || '').trim() !== 'properties') return
      layer.walkAtRules('supports', (supp) => {
        if (!supp.nodes || supp.nodes.length === 0) return
        supp.replaceWith(...supp.nodes)
      })
    })
  },
})
twPropertiesUnconditional.postcss = true
export default twPropertiesUnconditional
