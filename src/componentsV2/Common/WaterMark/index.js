import textToImage from 'utils/textToImage'

function Watermark({ text = '', container = document.body }) {
  if (!text) {
    console.warn('水印组件需要传入text参数哦～')
    return false
  }
  if (!container || !container.setAttribute) {
    return false
  }
  // try to destroy and reconstruct
  // Watermark.destroy(container)

  const backgroundImageStyle = {
    marginX: 45,
    marginY: 90,
    line2Coordinate: '73px 73px',
    line3Coordinate: '146px 146px',
  }

  const background = textToImage(`${text}`, {
    textColor: '#EDEFF5',
    fontSize: 13,
    rotate: -30,
    fontFamily: 'PingFangSC-Thin',
    ...backgroundImageStyle,
  })

  const originStyle = container.getAttribute('style')

  let style = `
    background-image: url(${background}), url(${background}), url(${background});
    background-repeat: repeat, repeat, repeat;
    background-position: 0 0, ${backgroundImageStyle.line2Coordinate}, ${backgroundImageStyle.line3Coordinate};
`

  style = `${originStyle || ''}${style}`

  container.setAttribute('style', style)

  return true
}

Watermark.destroy = (container) => {
  if (!container) return false
  container.removeAttribute('style')
  return true
}

export default Watermark
