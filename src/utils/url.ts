/**
 * Extract the top-level domain from a URL or the current location
 * @param url The URL to extract the domain from (optional, defaults to current location)
 * @returns {string} The top-level domain
 */
export function extractDomain(url?: string): string {
  try {
    let hostname: string

    if (url) {
      try {
        hostname = new URL(url).hostname
      } catch {
        hostname = url // Assume it's already a hostname if URL parsing fails
      }
    } else {
      hostname = globalThis.location.hostname
    }

    // Remove 'www.' if present
    let domain = hostname.replace(/^www\./, '')

    // Extract the top-level domain (e.g., example.com from sub.example.com)
    const parts = domain.split('.')
    if (parts.length > 2) {
      // Handle special cases like co.uk, com.au, etc.
      const secondLevelDomains = [
        'co',
        'com',
        'org',
        'net',
        'edu',
        'gov',
        'mil',
      ]
      const thirdLevelDomain = parts[parts.length - 2]

      domain =
        parts.length > 2 && secondLevelDomains.includes(thirdLevelDomain)
          ? parts.slice(-3).join('.')
          : parts.slice(-2).join('.')
    }

    return domain
  } catch {
    return url || globalThis.location?.hostname || '' // Fallback
  }
}
