function main() {
  console.log('UTags Ext - Custom Rule Template')

  // 百度首页 > 百度热搜
  for (const item of document.querySelectorAll<HTMLAnchorElement>(
    '.s-hotsearch-content a.title-content'
  )) {
    const titleElement = item.querySelector('span.title-content-title')
    const title = titleElement?.textContent?.trim()
    if (title) {
      // data-utags_link 用于存储链接, 可以留空
      item.dataset.utags_link = `https://www.baidu.com/s?wd=${encodeURIComponent(title)}`
      // data-utags_title 用于存储标题, 可以留空
      item.dataset.utags_title = title
    }
  }

  // 搜索结果 > 侧边栏 > 百度热搜
  for (const item of document.querySelectorAll<HTMLAnchorElement>(
    '#con-ceiling-wrapper a'
  )) {
    const title = item.textContent?.trim()
    if (title) {
      item.dataset.utags_link = `https://www.baidu.com/s?wd=${encodeURIComponent(title)}`
    }
  }

  // 搜索结果 > 侧边栏 > 百度热搜标题
  const sectionTitle = document.querySelector<HTMLAnchorElement>(
    '#con-ceiling-wrapper .cr-title a'
  )
  if (sectionTitle) {
    // 排除 百度热搜标题 中的链接
    sectionTitle.dataset.utags_ignore = ''
  }
}

main()
