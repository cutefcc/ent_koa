/**
 * 获取ele节点下标
 * **/
const siblings = (ele) => {
  let { className, id } = ele
  const tagName = ele.tagName.toLowerCase()
  if (Object.prototype.toString.call(className) !== '[object String]') {
    className = ''
  }
  if (className.includes('-open')) {
    className = className
      .split(/\s+/)
      .filter((v) => {
        if (!v.includes('-open')) {
          return v
        }
      })
      .join(' ')
  }
  if (className.includes('badge') || className.includes('tip')) {
    return {}
  }
  if (
    (className && checkClassName(className) && !className.includes('active')) ||
    id
  ) {
    return { index: 0, tagName, id, className, only: true }
  }
  if (ele.parentNode.getElementsByClassName(className).length === 1) {
    return { index: 0, tagName, id, className }
  }
  let index = -1
  const parentElement = ele.parentNode.children //获取父级的所有子节点
  for (let i = 0; i < parentElement.length; i++) {
    if (parentElement[i].nodeType == 1 && parentElement[i] == ele) {
      index = i
    }
  }
  return { index, tagName, id, className }
}

/**
 * 过滤弹窗事件
 * **/
const handleCheckPath = (domPath) => {
  let isAntModal = false
  let isAntModalButton = false
  for (let i = 0; i < domPath.length; i++) {
    const { className = '' } = domPath[i]
    if (
      className &&
      Object.prototype.toString.call(className) === '[object String]'
    ) {
      if (className.includes('ant-modal')) {
        isAntModal = true
      }
      if (className.includes('subscribeBtn')) {
        isAntModalButton = true
      }
    }
  }
  return isAntModal && !isAntModalButton
}

/**
 * 校验生成的path
 * **/
const checkPath = (path) => {
  let checkPath = true
  path = path.map((v) => {
    const { index } = v
    if (index === -1) {
      checkPath = false
    }
    return v
  })
  if (!checkPath) {
    path = []
  }
  return path
}

/**
 * 初始化当前点击dom文本
 * **/
const initText = (target) => {
  const innerText = (target.innerText && target.innerText.trim()) || ''
  const innerTextArray = innerText.split(/[\n]/).filter((v) => {
    return v
  })
  const tagName = target.tagName.toLowerCase()
  if ((innerText && innerTextArray.length > 1) || !innerText) {
    const isImg = tagName === 'img'
    const isInput = tagName === 'input'
    const isTextarea = tagName === 'textarea'
    const isuse = tagName === 'use'
    const className = target.className || ''
    const isCheckClassName =
      className &&
      Object.prototype.toString.call(className) === '[object String]' &&
      (className.includes('hotMapTag') ||
        className.includes('ant-cascader-picker-label'))
    if (!isImg && !isInput && !isTextarea && !isCheckClassName && !isuse) {
      return ''
    }
  }
  return innerText || tagName
}

const checkClassName = (className) => {
  const dom = document.getElementsByClassName(className)
  return dom && dom.length === 1
}
/**
 * 初始化当前点击dom path路径
 * **/
const initPath = (target) => {
  let path = []
  let dom = target
  let array = Object.keys(Array.from({ length: 20 }))
  let isOk = true
  array.map(() => {
    if (isOk) {
      let domObj = siblings(dom) || {}
      dom = dom.parentElement
      const { only = false } = domObj
      if (only) {
        isOk = false
        delete domObj.only
      }
      if (Object.keys(domObj).length > 0) {
        path.push(domObj)
      }
    }
  })
  path = checkPath(path)
  if (path.length > 0) {
    path = path.reverse()
  }
  return path
}

const handle = (event) => {
  try {
    const { clientX, clientY, target, offsetX, offsetY } = event
    const domPath = event.path
    if (handleCheckPath(domPath)) {
      console.log('modal事件不统计')
      return
    }
    const innerText = initText(target)
    if (!innerText) {
      console.log('空白区不上报')
      return
    }
    const { pathname = '' } = window.location
    const key = 'thermodynamic_diagram'
    let path = initPath(target)
    if (Array.isArray(path) && path.length == 0) {
      console.log('dom路径分析不到')
      return
    }
    const x = clientX
    const y = clientY
    const params = {
      x,
      y,
      text: innerText,
      url: pathname,
      type: 'ent',
      path: path,
      offsetX,
      offsetY,
    }
    if (window.voyager && x > 0 && y > 0 && x < 1280) {
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        ...params,
      }
      console.log(params)
      window.voyager.trackEvent(key, key, param)
    }
  } catch (e) {
    console.log(e)
  }
}
const throttle = (fn, delay) => {
  let previous = 0
  return function () {
    let _this = this
    let args = arguments
    let now = new Date()
    if (now - previous > delay) {
      fn.apply(_this, args)
      previous = now
    }
  }
}
const handleFn = (event) => {
  throttleFn(event)
}
const throttleFn = throttle(handle, 1000) // 节流函数
export const removeHotPicPing = () => {
  document.removeEventListener('click', handleFn, true)
}
export const hotPicPing = () => {
  document.addEventListener('click', handleFn, true)
}
