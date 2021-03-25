export default (url, filename) => {
  const tempLink = document.createElement('a')
  tempLink.href = url
  tempLink.setAttribute('download', filename)
  document.body.appendChild(tempLink)
  tempLink.click()
  document.body.removeChild(tempLink)
}
