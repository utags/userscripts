export class ProgressBar {
  el: HTMLElement
  timer: any

  constructor() {
    this.el = document.createElement('div')
    this.el.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 3px;
      background: #0969da;
      z-index: 2147483647;
      transition: width 0.2s, opacity 0.2s;
      opacity: 0;
      pointer-events: none;
    `
    document.documentElement.append(this.el)
  }

  start() {
    this.el.style.transition = 'width 0.2s, opacity 0.2s'
    this.el.style.opacity = '1'
    this.el.style.width = '0%'

    // Force reflow
    void this.el.getBoundingClientRect()

    this.el.style.width = '30%'

    if (this.timer) clearInterval(this.timer)

    // Trickle
    this.timer = setInterval(() => {
      const w = Number.parseFloat(this.el.style.width) || 0
      if (w < 90) {
        this.el.style.width = w + (90 - w) * 0.1 + '%'
      }
    }, 200)
  }

  finish() {
    if (this.timer) clearInterval(this.timer)
    this.el.style.width = '100%'
    setTimeout(() => {
      this.el.style.opacity = '0'
      setTimeout(() => {
        this.el.style.width = '0%'
      }, 200)
    }, 200)
  }
}
