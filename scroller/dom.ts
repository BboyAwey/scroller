import ResizeObserver from 'resize-observer-polyfill'

export const createElement = (elName: string, className: string) => {
  const el = document.createElement(elName)
  el.className = className
  return el
}

export const nestElements = (elements: HTMLElement[]) => {
  for (let i = 0; i < elements.length; i++) {
    if (!i) continue
    elements[i - 1].appendChild(elements[i])
  }
}

export const transferDOM = (source: HTMLElement, target: HTMLElement, clear: boolean = true) => {
  // recover dom constructure
  const fragment = document.createDocumentFragment()
  const contents = source.children
  for (let i = 0; i < contents.length; i++) {
    fragment.appendChild(contents[i])
  }
  target.innerHTML = ''
  if (clear) source.innerHTML = ''
  target.appendChild(fragment)
}

export const addClass = (el: HTMLElement, className: string) => {
  if (el.className.indexOf(className) === -1) {
    el.className += ((el.className.trim()) ? ' ' : '') + className
  }
}

export const removeClass = (el: HTMLElement, className: string) => {
  if (el.className.indexOf(className) !== -1) {
    el.className = el.className.split(/\s+/).filter(c => {
      return c && c.trim() !== className.trim()
    }).join(' ')
  }
}

export const hasClass = (el: HTMLElement, className: string) => {
  return el.className.trim().indexOf(className.trim()) !== -1
}

export const addListener = (el: HTMLElement | Window | Document, event: string, handler: EventListener) => {
  el.removeEventListener(event, handler)
  el.addEventListener(event, handler)
}

export const removeListener = (el: HTMLElement | Window | Document , event: string, handler: EventListener) => {
  el.removeEventListener(event, handler)
}

export const observeMutation = (
  el: HTMLElement,
  handler: (mutationList: MutationRecord[]) => void,
  config: MutationObserverInit,
  context: any,
  throttle?: number
) => {
  let throttleTimer: number | null = null
  const clear = () => {
    if (throttleTimer) {
      window.clearTimeout(throttleTimer)
      throttleTimer = null
    }
  }
  const observer = new window.MutationObserver(mutationList => {
    if (throttle) {
      clear()
      throttleTimer = window.setTimeout(() => {
        handler.call(context, mutationList)
        clear()
      }, throttle)
    } else {
      handler.call(context, mutationList)
    }
  })
  observer.observe(el, config)
  return observer
}

export const observeChildInsert = (
  el: HTMLElement,
  handler: (nodes: Node[]) => void,
  context: any
) => {
  return observeMutation(el, mutationList => {
    let addedNodes = []
    for (let mutation of mutationList) {
      if (mutation.addedNodes && mutation.addedNodes.length) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i]
          if (addedNodes.indexOf(node) === -1) addedNodes.push(node)
        }
      }
    }
    if (addedNodes.length) handler.call(context, addedNodes)
  }, { childList: true }, context)
}

export const observeStyleChange = (
  el: HTMLElement,
  handler: (mutationList: MutationRecord[]) => void,
  context: any
) => observeMutation(el, handler, { attributeFilter: ['style'] }, context)

export const observeResize = (
  el: HTMLElement,
  handler: () => void,
  context: any
) => {
  let oldSize = { width: 0, height: 0 }
  const observer = new ResizeObserver((entity) => {
    let rect = entity[0].contentRect

    if (rect.width !== oldSize.width || rect.height !== oldSize.height) {
      handler.call(context)
      oldSize.width = rect.width
      oldSize.height = rect.height
    }
  })
  observer.observe(el)
  return observer
}

export const isFirefox = () => navigator.userAgent.indexOf('Firefox') !== -1

export const isOnDocument = (elementNode: Node): boolean => {
  if (elementNode === document.body) return true
  else if (!elementNode.parentNode) return false
  else if (elementNode.parentNode === document.body) return true
  else return isOnDocument(elementNode.parentNode)
}

let nativeScrollWidth: number | null = null
export const getNativeScrollBarWidth = () => {
  if (nativeScrollWidth) return nativeScrollWidth
  let outer = document.createElement('div')
  let inner = document.createElement('div')
  outer.appendChild(inner)
  outer.style.width = '100px'
  outer.style.position = 'absolute'
  outer.style.visibility = 'hidden'
  document.body.appendChild(outer)
  let before = inner.getBoundingClientRect().width
  outer.style.overflow = 'scroll'
  let after = inner.getBoundingClientRect().width
  document.body.removeChild(outer)

  nativeScrollWidth = before - after
  return nativeScrollWidth
}
