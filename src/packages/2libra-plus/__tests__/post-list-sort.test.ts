import { beforeEach, describe, expect, it } from 'vitest'

import { runPostListSort } from '../post-list-sort'

function createList(
  items: Array<{ id: string; datetime?: string; replyCount?: number }>,
  withPager = false
): HTMLUListElement {
  const section = document.createElement('section')
  const container = document.createElement('div')
  container.dataset.mainLeft = 'true'
  const ul = document.createElement('ul')
  ul.className = 'card'

  for (const item of items) {
    const li = document.createElement('li')
    li.dataset.id = item.id
    if (item.datetime) {
      const time = document.createElement('time')
      time.setAttribute('datetime', item.datetime)
      li.append(time)
    }

    if (typeof item.replyCount === 'number') {
      const badge = document.createElement('div')
      badge.className = 'badge'
      badge.textContent = String(item.replyCount)
      li.append(badge)
    }

    ul.append(li)
  }

  if (withPager) {
    const pager = document.createElement('div')
    pager.dataset.testid = 'pager'
    ul.append(pager)
  }

  container.append(ul)
  section.append(container)
  document.body.append(section)
  return ul
}

function getListIds(list: HTMLUListElement): string[] {
  const ids: string[] = []
  for (const child of Array.from(list.children)) {
    if (child instanceof HTMLLIElement) {
      ids.push(child.dataset.id || '')
    }
  }

  return ids
}

function clickSortMode(mode: string): void {
  const sortContainer = document.querySelector<HTMLElement>(
    '[data-libra-plus-sort="reply-time"]'
  )
  if (!sortContainer) {
    throw new Error('sort container not found')
  }

  const btn = sortContainer.querySelector<HTMLButtonElement>(
    `button[data-sort-mode="${mode}"]`
  )
  if (!btn) {
    throw new Error(`sort button not found: ${mode}`)
  }

  btn.click()
}

describe('post-list-sort', () => {
  beforeEach(() => {
    document.body.replaceChildren()
  })

  it('does nothing when postListSort is disabled in settings', () => {
    const list = createList([
      { id: 'a', datetime: '2024-01-01T00:00:00.000Z' },
      { id: 'b', datetime: '2024-01-03T00:00:00.000Z' },
    ])

    const before = getListIds(list)
    runPostListSort(() => ({ enabled: true, postListSort: false }))
    const after = getListIds(list)

    expect(after).toEqual(before)
  })

  it('sorts by latest reply time when selecting newToOld', () => {
    const list = createList([
      { id: 'a', datetime: '2024-01-01T00:00:00.000Z' },
      { id: 'b', datetime: '2024-01-03T00:00:00.000Z' },
      { id: 'c', datetime: '2024-01-02T00:00:00.000Z' },
    ])

    runPostListSort(() => ({ enabled: true, postListSort: true }))
    clickSortMode('newToOld')

    expect(getListIds(list)).toEqual(['b', 'c', 'a'])
  })

  it('sorts by reply count descending and keeps items without count at the end', () => {
    const list = createList(
      [
        { id: 'a', replyCount: 3 },
        { id: 'b' },
        { id: 'c', replyCount: 1 },
        { id: 'd', replyCount: 2 },
      ],
      true
    )

    runPostListSort(() => ({ enabled: true, postListSort: true }))
    clickSortMode('replyDesc')

    expect(getListIds(list)).toEqual(['a', 'd', 'c', 'b'])

    const pager = list.querySelector('[data-testid="pager"]')
    expect(pager).not.toBeNull()
    expect(list.lastElementChild).toBe(pager)
  })

  it('sorts by reply count ascending', () => {
    const list = createList([
      { id: 'a', replyCount: 3 },
      { id: 'b', replyCount: 1 },
      { id: 'c', replyCount: 2 },
    ])

    runPostListSort(() => ({ enabled: true, postListSort: true }))
    clickSortMode('replyAsc')

    expect(getListIds(list)).toEqual(['b', 'c', 'a'])
  })
})
