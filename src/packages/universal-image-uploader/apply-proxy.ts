function isImgurUrl(url: string) {
  try {
    const u = new URL(url)
    const h = u.hostname.toLowerCase()
    return h.includes('imgur.com')
  } catch {
    return false
  }
}

export type ApplyProxyOptions = {
  providerKey?: string
  originalName?: string
  proxy?: string
  defaultUrl?: string
  useWebp?: boolean
}

export function applyProxy(url: string, options: ApplyProxyOptions = {}) {
  const {
    providerKey,
    originalName,
    proxy,
    defaultUrl,
    useWebp = false,
  } = options

  try {
    const isGif =
      typeof originalName === 'string' && /\.gif$/i.test(originalName.trim())

    let px = proxy || 'none'
    if (px === 'none') return url

    if (px === 'wsrv.nl') {
      const provider = providerKey || (isImgurUrl(url) ? 'imgur' : 'other')
      if (provider === 'imgur' || provider === '111666_best') {
        px = 'wsrv.nl-duckduckgo'
      } else {
        const urlEncoded = encodeURIComponent(url)
        const defaultUrlEncoded = encodeURIComponent(defaultUrl || url)
        const qp = `${isGif ? '&n=-1' : ''}${useWebp ? '&output=webp' : ''}&default=${defaultUrlEncoded}`
        return `https://wsrv.nl/?url=${urlEncoded}${qp}`
      }
    }

    if (px === 'duckduckgo') {
      const convertedUrl = useWebp
        ? applyProxy(url, {
            providerKey,
            originalName,
            proxy: 'wsrv.nl',
            defaultUrl,
            useWebp,
          })
        : url
      return `https://external-content.duckduckgo.com/iu/?u=${encodeURIComponent(convertedUrl)}`
    }

    if (px === 'wsrv.nl-duckduckgo') {
      const urlEncoded = encodeURIComponent(url)
      const defaultUrlEncoded = encodeURIComponent(defaultUrl || url)
      const ddgUrl = `https://external-content.duckduckgo.com/iu/?u=${urlEncoded}`
      const qp = `${isGif ? '&n=-1' : ''}${useWebp ? '&output=webp' : ''}&default=${defaultUrlEncoded}`
      return `https://wsrv.nl/?url=${encodeURIComponent(ddgUrl)}${qp}`
    }

    return url
  } catch {
    return url
  }
}

export function applyProxyFallback(
  chains: Array<{
    url: string
    providerKey?: string
    originalName?: string
    proxy?: string
    defaultUrl?: string
    useWebp?: boolean
  }>
) {
  if (chains.length > 1) {
    const head = chains[0]
    const defaultUrl = applyProxyFallback(chains.slice(1))
    const proxied = applyProxy(head.url, {
      providerKey: head.providerKey,
      originalName: head.originalName,
      proxy: head.proxy,
      defaultUrl,
      useWebp: head.useWebp,
    })
    return proxied
  }

  const head = chains[0]
  const proxied = applyProxy(head.url, {
    providerKey: head.providerKey,
    originalName: head.originalName,
    proxy: head.proxy,
    defaultUrl: head.defaultUrl,
    useWebp: head.useWebp,
  })
  return proxied
}

export function applyProxyForDualHost(
  primary: {
    url: string
    providerKey?: string
    originalName?: string
  },
  secondary: {
    url: string
    providerKey?: string
  },
  options: {
    proxy: string
    useWebp: boolean
  }
) {
  const { proxy, useWebp } = options
  return applyProxyFallback([
    {
      url: primary.url,
      providerKey: primary.providerKey,
      originalName: primary.originalName,
      proxy,
      useWebp,
    },
    {
      url: secondary.url,
      providerKey: secondary.providerKey,
      originalName: primary.originalName,
      proxy,
      useWebp,
    },
    {
      url: primary.url,
      providerKey: primary.providerKey,
      originalName: primary.originalName,
      proxy: 'none',
      useWebp,
    },
  ])
}
