const Elements = document.body.getElementsByTagName('*')
const path = []
const css = `
  position: fixed;
  width: 300px;
  height: 200px;
  background-color: #ddd;
  z-index: 9999999;
  top: 20px;
  left: 10px;
  -moz-user-modify: read-write-plaintext-only;
  -webkit-user-modify: read-write-plaintext-only;
  -o-user-modify: read-write-plaintext-only;
  outline: none;
  box-sizing: border-box;
  border: 1px solid #666;
  border-width: 20px 5px 5px;
  padding: 2px;
  border-radius: 5px;
  overflow: auto;
`
let curElement
let pathLen = 0
const pathProxy = new Proxy(path, {
  set(target, key, value) {
    const res = Reflect.set(target, key, value)
    pathLen = target.length
    return res
  }
})
const contentDiv = document.createElement('div')

initContentDiv()
initEvent()

function initEvent() {
  document.addEventListener('keydown', placeContent)
  const outlineStyle = '1px inset #fff'
  Array.from(Elements).forEach(element => {
    element.addEventListener('mouseenter', moveIn)
    element.addEventListener('mouseleave', moveOut)
  })
  function moveIn(e) {
    const element = e.target
    const lastIndex = pathProxy.length - 1
    const parent = pathProxy[lastIndex]
    parent && (parent.element.style.outline = parent?.outline)
    pathProxy.push({
      element,
      outline: getComputedStyle(element).getPropertyValue('outline')
    })
    element.style.outline = outlineStyle
    curElement = element
  }
  function moveOut(e) {
    const element = e.target
    const lastIndex = pathProxy.length - 1
    const outline = pathProxy.splice(lastIndex, 1)[0].outline    
    const parent = pathProxy[lastIndex - 1]
    parent && (parent.element.style.outline = outlineStyle)
    element.style.outline = outline;
  }
  function placeContent(e) {
    if (e.stopPropagation) {
      e.stopPropagation()
    } else {
      e.cancelBubble()
    }
    if (e.code !== 'AltLeft' && e.code !== 'AltRight') {
      return
    }
    contentDiv.textContent = curElement.innerHTML
    showContentDiv()
  }
  function showContentDiv() {
    contentDiv.style.visibility = 'visible'
  }
}

function initContentDiv() {
  contentDiv.setAttribute('contenteditable', true)
  contentDiv.setAttribute('id', 'contentDiv')
  contentDiv.style = css
  document.body.appendChild(contentDiv)
  initContentDivEvent()
}

function initContentDivEvent() {
  contentDiv.addEventListener('paste', function(e) {
    curElement.innerHTML = contentDiv.textContent
  })
  contentDiv.addEventListener('input', function(e) {
    curElement.innerHTML = contentDiv.textContent
    console.log(curElement, contentDiv.textContent)
  })
  contentDiv.addEventListener('mousedown', function(e) {
    const { offsetX, offsetY } = e
    if (offsetY > 0) {
      return
    }
    contentDiv.style.transition = 'none'
    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup', mouseUp)
  
    function mouseMove(e) {
      if (e.clientY < 0 || e.clientY > innerHeight - 20) {
        return
      }
      contentDiv.style.left = e.clientX - offsetX + 'px'
      contentDiv.style.top = e.clientY + offsetY + 'px'
    }
    function mouseUp() {
      const { left, width } = contentDiv.getBoundingClientRect()
      const leftOffset = window.innerWidth - left
      const topOffset = window.innerHeight - top
      if (leftOffset < width) {
        contentDiv.style.left = window.innerWidth - 20 + 'px'
      } else if (left < 0) {
        contentDiv.style.left = -width + 20 + 'px'
      }
      contentDiv.style.transition = '.2s'
      document.removeEventListener('mousemove', mouseMove)
      document.removeEventListener('mouseup', mouseUp)
    }
  })
}

