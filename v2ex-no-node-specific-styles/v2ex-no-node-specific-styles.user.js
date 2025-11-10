// ==UserScript==
// @name                 V2EX No Node Specific Styles
// @name:zh-CN           V2EX 去除节点特性化样式
// @namespace            https://github.com/utags
// @homepageURL          https://github.com/utags/userscripts#readme
// @supportURL           https://github.com/utags/userscripts/issues
// @version              0.1.4
// @description          Remove node-specific styles on V2EX to keep a unified, clean look.
// @description:zh-CN    去除 V2EX 每个节点的特性化样式，保持页面样式统一、简洁。
// @author               Pipecraft
// @license              MIT
// @icon                 https://wsrv.nl/?w=64&h=64&url=https%3A%2F%2Ft3.gstatic.com%2FfaviconV2%3Fclient%3DSOCIAL%26type%3DFAVICON%26fallback_opts%3DTYPE%2CSIZE%2CURL%26url%3Dhttps%3A%2F%2Fwww.v2ex.com%26size%3D64
// @match                https://*.v2ex.com/*
// @match                https://*.v2ex.co/*
// @noframes
// @run-at               document-start
// @grant                none
// ==/UserScript==

;(function () {
  'use strict'

  // Remove all <style> tags under #Rightbar
  function removeRightbarStyles() {
    document.querySelectorAll('#Rightbar style').forEach((el) => el.remove())
  }

  // Try immediately at document-start
  removeRightbarStyles()

  // Observe for #Rightbar creation and future style injections
  const docObserver = new MutationObserver((_, obs) => {
    const rightbar = document.querySelector('#Rightbar')
    if (rightbar) {
      removeRightbarStyles()

      const rbObserver = new MutationObserver((mutations) => {
        for (const m of mutations) {
          m.addedNodes &&
            m.addedNodes.forEach((node) => {
              if (node.nodeType === 1) {
                if (node.matches && node.matches('style')) {
                  node.remove()
                } else if (node.querySelectorAll) {
                  node.querySelectorAll('style').forEach((el) => el.remove())
                }
              }
            })
        }
      })
      rbObserver.observe(rightbar, { childList: true, subtree: true })

      // Stop observing the whole document once #Rightbar is found
      obs.disconnect()
    }
  })
  docObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
  })

  // Fallback once DOM is ready
  document.addEventListener('DOMContentLoaded', removeRightbarStyles)
})()
