import { readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { JSDOM } from 'jsdom'

process.stdout.on('error', (err) => {
  if (err?.code === 'EPIPE') return
  throw err
})

const defaultInputPath = path.resolve(
  process.cwd(),
  '2libra-plus',
  'ranking.html'
)
const inputPath = path.resolve(
  process.cwd(),
  process.argv[2] ?? defaultInputPath
)

const html = await readFile(inputPath, 'utf8')
const dom = new JSDOM(`<body>${html}</body>`)
const { document } = dom.window

const userEntries = Array.from(
  document.querySelectorAll('div[data-user-id]')
).filter(
  (el) =>
    el.querySelector('a[href^="/user/"]') && el.querySelector('div.w-8 span')
)

const byBadge = new Map()
const badgeImgByName = new Map()
const noBadge = []

for (const entry of userEntries) {
  const rankSpan = entry.querySelector('div.w-8 span')
  const rankText = rankSpan?.textContent?.trim() ?? ''
  const rankNumber = Number.parseInt(rankText, 10)

  const userLink = entry.querySelector('a[href^="/user/"]')
  const nameSpan = userLink?.querySelector('div.flex.items-center.gap-1 > span')
  const username = nameSpan?.textContent?.trim() ?? ''

  if (!username || !rankText || Number.isNaN(rankNumber)) continue

  const badgeImgs = Array.from(
    userLink.querySelectorAll(
      'div.flex.items-center.gap-1 div.tooltip.emoji img[alt]'
    )
  )

  const badges = Array.from(
    new Map(
      badgeImgs
        .map((img) => {
          const badgeName = img.getAttribute('alt')?.trim() ?? ''
          const imgUrl =
            img.dataset.lhSrc?.trim() ?? img.getAttribute('src')?.trim() ?? ''
          if (!badgeName) return null
          return [badgeName, { badgeName, imgUrl }]
        })
        .filter(Boolean)
    ).values()
  )

  const userInfo = { username, rankNumber, rankText }

  if (badges.length === 0) {
    noBadge.push(userInfo)
    continue
  }

  for (const badge of badges) {
    if (badge.imgUrl && !badgeImgByName.has(badge.badgeName)) {
      badgeImgByName.set(badge.badgeName, badge.imgUrl)
    }

    const badgeName = badge.badgeName
    const list = byBadge.get(badgeName) ?? []
    list.push(userInfo)
    byBadge.set(badgeName, list)
  }
}

const badgeGroups = Array.from(byBadge.entries())
  .map(([badgeName, users]) => {
    const uniqueByUser = new Map()
    for (const u of users) uniqueByUser.set(u.username, u)
    const list = Array.from(uniqueByUser.values()).sort(
      (a, b) => a.rankNumber - b.rankNumber
    )
    return { badgeName, users: list }
  })
  .sort((a, b) => {
    if (b.users.length !== a.users.length)
      return b.users.length - a.users.length
    return a.badgeName.localeCompare(b.badgeName, 'zh')
  })

const noBadgeUnique = Array.from(
  new Map(noBadge.map((u) => [u.username, u])).values()
).sort((a, b) => a.rankNumber - b.rankNumber)

const lines = []

for (const group of badgeGroups) {
  const badgeImgUrl = badgeImgByName.get(group.badgeName) ?? ''
  const badgePrefix = badgeImgUrl
    ? `![${group.badgeName}](${badgeImgUrl}#inline-sm) `
    : ''

  lines.push(`### ${badgePrefix}${group.badgeName}：${group.users.length} 人`)
  for (const u of group.users) lines.push(`- ${u.username} #${u.rankText}`)
  lines.push('')
}

lines.push(`### 无徽章：${noBadgeUnique.length} 人`)
for (const u of noBadgeUnique) lines.push(`- ${u.username} #${u.rankText}`)

process.stdout.write(`${lines.join('\n')}\n`)
