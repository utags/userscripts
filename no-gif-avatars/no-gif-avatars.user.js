// ==UserScript==
// @name                 No GIF Avatars
// @name:zh-CN           屏蔽 GIF 头像
// @namespace            https://www.pipecraft.net/
// @homepageURL          https://github.com/utags/userscripts#readme
// @supportURL           https://github.com/utags/userscripts/issues
// @version              0.1.2
// @description          Convert GIF avatars into static images with enhanced performance and error handling
// @description:zh-CN    将动图头像转换为静态图片，具有增强的性能和错误处理。
// @author               Pipecraft
// @license              MIT
// @match                https://linux.do/*
// @match                https://www.nodeloc.com/*
// @icon                 https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant                GM_addStyle
// ==/UserScript==

;(function () {
  'use strict'

  // Configuration constants
  const CONFIG = {
    OBSERVER_DELAY: 50, // Delay before processing mutations (ms)
    AVATAR_SELECTORS: [
      'img[src*="avatar"]',
      'img[src*="user"]',
      '.avatar img',
      '.user-avatar img',
      '.PostUser img',
    ],
    GIF_EXTENSIONS: ['.gif', '.webp'], // Extensions to replace
    REPLACEMENT_EXTENSION: '.png', // Target extension
    DEBUG: false, // Enable debug logging
  }

  let processingTimeout = null

  /**
   * Log debug messages if debug mode is enabled
   * @param {string} message - The message to log
   * @param {any} data - Optional data to log
   */
  function debugLog(message, data = null) {
    if (CONFIG.DEBUG) {
      console.log(`[No GIF Avatars] ${message}`, data || '')
    }
  }

  /**
   * Apply CSS styles to disable animations and hide decorative elements
   */
  function applyStyles() {
    const style = `
      /* Disable text animations and effects */
      .PostUser-name .username {
        text-shadow: unset !important;
        animation: unset !important;
      }

      /* Disable icon animations */
      .fa-beat,
      .fa-bounce,
      .fa-fade,
      .fa-beat-fade,
      .fa-flip,
      .fa-shake,
      .fa-spin {
        animation-name: unset !important;
        animation: unset !important;
      }

      /* Disable badge animations */
      .UserBadge {
        animation: unset !important;
      }

      /* Hide decorative avatar frames */
      .decorationAvatarFrameImageSource {
        display: none !important;
      }

      /* Disable CSS animations on avatars */
      img[src*="avatar"],
      .avatar img,
      .user-avatar img {
        animation: unset !important;
        transition: unset !important;
      }
    `

    try {
      GM_addStyle(style)
      debugLog('Styles applied successfully')
    } catch (error) {
      debugLog('Error applying styles:', error)
    }
  }

  /**
   * Check if an image URL contains GIF or other animated formats
   * @param {string} src - The image source URL
   * @returns {boolean} True if the image is animated
   */
  function isAnimatedImage(src) {
    if (!src || typeof src !== 'string') {
      return false
    }

    const lowerSrc = src.toLowerCase()
    return CONFIG.GIF_EXTENSIONS.some((ext) => lowerSrc.includes(ext))
  }

  /**
   * Convert animated image URL to static version
   * @param {string} src - The original image source URL
   * @returns {string} The converted static image URL
   */
  function convertToStaticImage(src) {
    let convertedSrc = src

    // Replace animated extensions with static one
    CONFIG.GIF_EXTENSIONS.forEach((ext) => {
      convertedSrc = convertedSrc.replace(
        new RegExp(ext.replace('.', '\\.'), 'gi'),
        CONFIG.REPLACEMENT_EXTENSION
      )
    })

    return convertedSrc
  }

  /**
   * Process a single image element
   * @param {HTMLImageElement} img - The image element to process
   * @returns {boolean} True if the image was processed
   */
  function processImage(img) {
    try {
      const originalSrc = img.src
      if (!isAnimatedImage(originalSrc)) {
        return false
      }

      const newSrc = convertToStaticImage(originalSrc)
      if (newSrc !== originalSrc) {
        img.src = newSrc
        debugLog(`Converted image: ${originalSrc} -> ${newSrc}`)
        return true
      }

      return false
    } catch (error) {
      debugLog('Error processing image:', error)
      return false
    }
  }

  /**
   * Process all images on the page
   * @param {NodeList|Array} targetImages - Specific images to process (optional)
   */
  function processImages(targetImages = null) {
    try {
      let images

      if (targetImages) {
        // Process specific images
        images = Array.from(targetImages).filter(
          (node) =>
            node.nodeType === Node.ELEMENT_NODE && node.tagName === 'IMG'
        )
      } else {
        // Process all avatar images using optimized selectors
        images = []
        CONFIG.AVATAR_SELECTORS.forEach((selector) => {
          try {
            const found = document.querySelectorAll(selector)
            images.push(...Array.from(found))
          } catch (error) {
            debugLog(`Error with selector ${selector}:`, error)
          }
        })

        // Fallback: process all images if no avatars found
        if (images.length === 0) {
          images = Array.from(document.querySelectorAll('img'))
        }
      }

      let processedCount = 0
      images.forEach((img) => {
        if (processImage(img)) {
          processedCount++
        }
      })

      if (processedCount > 0) {
        debugLog(`Processed ${processedCount} images`)
      }
    } catch (error) {
      debugLog('Error in processImages:', error)
    }
  }

  /**
   * Check if mutation contains relevant image changes
   * @param {NodeList} addedNodes - The added nodes from mutation
   * @returns {boolean} True if images were added
   */
  function hasImageChanges(addedNodes) {
    if (!addedNodes || addedNodes.length === 0) {
      return false
    }

    for (const node of addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Check if the node itself is an image
        if (node.tagName === 'IMG') {
          return true
        }

        // Check if the node contains images
        if (node.querySelector && node.querySelector('img')) {
          return true
        }
      }
    }

    return false
  }

  /**
   * Handle DOM mutations with debouncing
   * @param {MutationRecord[]} mutationsList - List of mutations
   */
  function handleMutations(mutationsList) {
    let hasRelevantChanges = false
    const newImages = []

    for (const mutation of mutationsList) {
      // FIXME: 没有找到原因，只处理新的节点不管用
      if (1 || hasImageChanges(mutation.addedNodes)) {
        hasRelevantChanges = true

        // Collect new images for targeted processing
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'IMG') {
              newImages.push(node)
            } else if (node.querySelector) {
              const imgs = node.querySelectorAll('img')
              newImages.push(...Array.from(imgs))
            }
          }
        }
      }
    }

    if (hasRelevantChanges) {
      // Clear existing timeout
      if (processingTimeout) {
        clearTimeout(processingTimeout)
      }

      // Debounce processing
      processingTimeout = setTimeout(() => {
        debugLog('Processing mutations with new images')
        processImages(newImages.length > 0 ? newImages : null)
      }, CONFIG.OBSERVER_DELAY)
    }
  }

  /**
   * Initialize the script
   */
  function initialize() {
    try {
      debugLog('Initializing No GIF Avatars script')

      // Apply CSS styles
      applyStyles()

      // Process existing images
      processImages()

      // Set up mutation observer
      const observer = new MutationObserver(handleMutations)
      observer.observe(document, {
        childList: true,
        subtree: true,
      })

      debugLog('Script initialized successfully')
    } catch (error) {
      debugLog('Error during initialization:', error)
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize)
  } else {
    initialize()
  }
})()
