function fetchReactProp(targets, propPath) {
  const first = targets.find(Boolean)
  if (!first) return []

  const reactKey = Object.keys(first).find((k) => k.startsWith('__reactInternalInstance') || k.startsWith('__reactFiber'))
  if (!reactKey) return []

  let props = []
  for (const element of targets) {
    if (!element) {
      // @ts-ignore
      props.push(null)
      continue
    }

    let res = (element)[reactKey]
    for (const prop of propPath) {
      if (!res) break
      if (typeof prop === 'string') {
        res = res[prop]
        continue
      }

      const queue = [ res ]
      res = null
      while (queue.length) {
        const el = queue.shift()
        if (prop.$find in el) {
          res = el
          break
        }

        for (const p of prop.$in) {
          // eslint-disable-next-line eqeqeq -- Intentional check for undefined & null
          if (p in el && el[p] != null) queue.push(el[p])
        }
      }
    }

    // Handle timestamps properly. for some reason fetching a moment object just breaks javascript with a weird cloning issue
    if (typeof res === 'object' && !!res._isAMomentObject) res = res.toDate();
    props.push(res)
  }

  return props
}

function executeReactProp (targets, propPath, args) {
  const fn = propPath.pop()
  if (typeof fn !== 'string') throw new Error('invalid query')
  const obj = fetchReactProp(targets, propPath)
  return obj.map((o) => o[fn].apply(o, args))
}

window.addEventListener('message', (e) => {
  if (e.source === window && e.data?.source === 'timezonedb') {
    const data = e.data.payload
    if (data.action === 'bridge.query') {
      const elements = data.targets.map((target) => {
        const node = document.querySelector(`[data-timezonedb-target-id="${target}"]`)
        if (node) node.removeAttribute('data-timezonedb-target-id')
        return node
      })

      let res
      if (data.args) {
        res = executeReactProp(elements, data.props, data.args)
      } else {
        res = fetchReactProp(elements, data.props)
      }

      window.postMessage({
        source: 'timezonedb',
        payload: {
          action: 'bridge.result',
          id: data.id,
          res: res,
        },
      }, e.origin)
    }
  }
})