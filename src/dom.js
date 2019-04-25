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
