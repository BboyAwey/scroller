export const createDOM = (classNames = [], receiver = {}) => {
  let res = classNames.reduce((last, curr) => {
    const key = curr
      .split('_').filter(e => e)
      .reduce((l, c, i) => l + (!i ? c : (c[0].toUpperCase() + c.substring(1))), '')

    const el = document.createElement('div')
    el.className = curr

    if (last[last.length - 1]) {
      last[last.length - 1].el.appendChild(el)
    }
    last.push({ el, key })
    return last
  }, []).reduce((last, curr) => {
    last[curr.key] = curr.el
    return last
  }, receiver)

  return receiver || res
}

export const transferDOM = (source, target, clear = true) => {
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

export const addClass = (el, cn) => {
  if (el.className.indexOf(cn) === -1) {
    el.className += ((el.className.trim()) ? ' ' : '') + cn
  }
}

export const removeClass = (el, cn) => {
  if (el.className.indexOf(cn) !== -1) {
    el.className = el.className.split(/\s+/).filter(c => {
      return c && c.trim() !== cn.trim()
    })
  }
}

export const hasClass = (el, cn) => {
  return el.className.trim().indexOf(cn.trim()) !== -1
}

export const addListener = (el, event, handler) => {
  el.removeEventListener(event, handler)
  el.addEventListener(event, handler)
}

export const removeListener = (el, event, handler) => {
  el.removeEventListener(event, handler)
}

export const observeStyleChange = (el, handler, context) => {
  const observer = new MutationObserver(() => handler.call(context))
  observer.observe(el, { attributeFilter: ['style'] })
  return observer
}

export const observeChildInsert = (el, handler, context) => {
  const observer = new MutationObserver(mutationList => {
    let addedNodes = []
    for (let mutation of mutationList) {
      if (mutation.addedNodes && mutation.addedNodes.length) {
        for (let node of mutation.addedNodes) {
          if (addedNodes.indexOf(node) === -1) addedNodes.push(node)
        }
      }
    }
    if (addedNodes.length) handler.call(context, addedNodes)
  })
  observer.observe(el, { childList: true })
  return observer
}

export const isFirefox = _ => {
  return navigator.userAgent.indexOf('Firefox') !== -1
}
