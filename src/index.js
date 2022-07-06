const Elements = document.getElementsByTagName('*')
const path = []
const outlineStyle = '1px inset #fff'
Array.from(Elements).forEach(element => {
  element.addEventListener('mouseenter', moveIn)
  element.addEventListener('mouseleave', moveOut)
})
function moveIn(e) {
  const element = e.target
  const lastIndex = path.length - 1
  const parent = path[lastIndex]
  parent && (parent.element.style.outline = parent?.otline)
  
  const otline = getComputedStyle(element).getPropertyValue('outline')
  path.push({
    element,
    otline
  })

  element.style.outline = outlineStyle
}
function moveOut(e) {
  const element = e.target
  const lastIndex = path.length - 1
  const otline = path.splice(lastIndex, 1)[0].otline
  
  const parent = path[lastIndex - 1]
  parent && (parent.element.style.outline = outlineStyle)
  element.style.outline = otline;
}