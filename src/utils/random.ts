export function randomToken(len = 8): string {
  const bytes = new Uint8Array(len)
  try {
    crypto.getRandomValues(bytes)
  } catch {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256)
    }
  }

  let out = ''
  for (const b of bytes) {
    out += (b % 36).toString(36)
  }

  return out
}
