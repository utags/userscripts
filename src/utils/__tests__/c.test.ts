// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { c } from '../c'

describe('c (create element helper)', () => {
  it('creates a basic element without options', () => {
    const el = c('div')
    expect(el).toBeInstanceOf(HTMLDivElement)
    expect(el.tagName).toBe('DIV')
  })

  it('sets className', () => {
    const el = c('div', { className: 'foo bar' })
    expect(el.className).toBe('foo bar')
  })

  it('sets classes list', () => {
    const el = c('span', { classes: ['foo', 'bar'] })
    expect(el.classList.contains('foo')).toBe(true)
    expect(el.classList.contains('bar')).toBe(true)
  })

  it('sets dataset attributes', () => {
    const el = c('div', { dataset: { foo: '1', barBaz: '2' } })
    expect(el.dataset.foo).toBe('1')
    expect(el.dataset.barBaz).toBe('2')

    // eslint-disable-next-line unicorn/prefer-dom-node-dataset
    expect(el.getAttribute('data-foo')).toBe('1')
    // eslint-disable-next-line unicorn/prefer-dom-node-dataset
    expect(el.getAttribute('data-bar-baz')).toBe('2')
  })

  it('sets arbitrary attributes', () => {
    const el = c('a', { attrs: { href: '#', target: '_blank' } })
    expect(el.getAttribute('href')).toBe('#')
    expect(el.getAttribute('target')).toBe('_blank')
  })

  it('sets inline styles', () => {
    const el = c('div', { style: { color: 'red', display: 'none' } })
    expect(el.style.color).toBe('red')
    expect(el.style.display).toBe('none')
  })

  it('sets text content', () => {
    const el = c('p', { text: 'Hello World' })
    expect(el.textContent).toBe('Hello World')
  })

  it('sets input attributes (value, type, placeholder, checked)', () => {
    const input = c('input', {
      type: 'checkbox',
      value: 'yes',
      checked: true,
      placeholder: 'ignore-me',
    })
    expect(input.type).toBe('checkbox')
    expect(input.value).toBe('yes')
    expect(input.checked).toBe(true)
    // input type=checkbox might ignore placeholder in some browsers, but DOM prop should be set
    expect(input.placeholder).toBe('ignore-me')

    const textInput = c('input', {
      type: 'text',
      placeholder: 'Enter text',
    })
    expect(textInput.type).toBe('text')
    expect(textInput.placeholder).toBe('Enter text')
  })

  it('sets textarea rows', () => {
    const ta = c('textarea', { rows: 5 })
    expect(ta.rows).toBe(5)
  })

  it('appends children (string and Node)', () => {
    const child1 = c('span', { text: 'child1' })
    const el = c('div', {
      children: [child1, 'child2'],
    })
    expect(el.childNodes.length).toBe(2)
    expect(el.firstChild).toBe(child1)
    expect(el.lastChild).toBeInstanceOf(Text)
    expect(el.lastChild?.textContent).toBe('child2')
  })

  it('handles empty/undefined options gracefully', () => {
    const el = c('div', {
      text: '',
      classes: [],
      children: [],
    })
    expect(el.tagName).toBe('DIV')
    expect(el.textContent).toBe('')
  })
})
