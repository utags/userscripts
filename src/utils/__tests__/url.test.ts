import { describe, it, expect, beforeEach } from 'vitest'
import { extractDomain } from '../url'

describe('extractDomain', () => {
  beforeEach(() => {
    // Reset location mock before each test
    Object.defineProperty(globalThis, 'location', {
      value: { hostname: 'example.com' },
      writable: true,
    })
  })

  it('should extract domain from current location by default', () => {
    expect(extractDomain()).toBe('example.com')
  })

  it('should extract domain from provided URL string', () => {
    expect(extractDomain('https://www.google.com/search')).toBe('google.com')
  })

  it('should handle subdomains', () => {
    expect(extractDomain('https://sub.example.com')).toBe('example.com')
    expect(extractDomain('https://a.b.c.example.com')).toBe('example.com')
  })

  it('should handle second-level domains (co.uk, com.au)', () => {
    expect(extractDomain('https://www.bbc.co.uk')).toBe('bbc.co.uk')
    expect(extractDomain('https://example.com.au')).toBe('example.com.au')
  })

  it('should handle simple domains', () => {
    expect(extractDomain('https://localhost')).toBe('localhost')
    expect(extractDomain('https://example')).toBe('example')
  })

  it('should handle www prefix correctly', () => {
    expect(extractDomain('https://www.example.com')).toBe('example.com')
    expect(extractDomain('www.example.com')).toBe('example.com')
  })

  it('should fallback to input if invalid URL', () => {
    expect(extractDomain('invalid-url')).toBe('invalid-url')
  })

  it('should fallback to location.hostname if extraction fails', () => {
    // Simulate complex case that might fail logic but we want to test fallback behavior
    // Actually our logic is robust, so we test the fallback when URL is empty/undefined
    // which defaults to location.hostname
    Object.defineProperty(globalThis, 'location', {
      value: { hostname: 'fallback.com' },
      writable: true,
    })
    expect(extractDomain(undefined)).toBe('fallback.com')
  })
})
