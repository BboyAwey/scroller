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

export const observeStyleChange = (el, handler) => {
  const config = {
    attributes: true,
    childList: false,
    subtree: false
  }

  return new MutationObserver(mutationsList => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        handler()
      }
    }
  }).observe(el, config)
}

export const isFirefox = _ => {
  return navigator.userAgent.indexOf('Firefox') !== -1
}
