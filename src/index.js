const Elements = document.getElementsByTagName('*')
const path = []
Array.from(Elements).forEach(element => {
  element.addEventListener('mouseenter', moveIn.bind(element))
  element.addEventListener('mouseleave', moveOut.bind(element))
})
function moveIn() {
  const element = this
  let parent = path[path.length - 1]
  parent && (parent.element.style.outline = parent?.otline)

  let otline = getComputedStyle(element).getPropertyValue('outline')
  path.push({
    element,
    otline
  })

  element.style.outline = '1px solid #fff';
}
function moveOut() {
  const element = this
  let parent = path[path.length - 1]
  parent && (parent.element.style.outline = '1px solid #fff')
  path.some((elem, index) => {
    if (elem === element) {
      path.splice(index, 1)
      return true
    }
  })

  element.style.outline = otline;
}