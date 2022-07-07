;(function() {
  const Elements = document.body.getElementsByTagName('*')
  const path = []
  
  let curElement
  let curInputElement
  const contentDiv = document.createElement('div')
  
  initEvent()
  initContentDiv()
  
  function initEvent() {
    document.addEventListener('keydown', placeContent)
    const outlineStyle = '2px solid #ddd'
    Array.from(Elements).forEach(element => {
      element.className += ' editTransition'
      element.addEventListener('mouseenter', moveIn)
      element.addEventListener('mouseleave', moveOut)
    })
    function moveIn(e) {
      const element = e.target
      const lastIndex = path.length - 1
      const parent = path[lastIndex]
      parent && (parent.element.style.outline = parent?.outline)
      path.push({
        element,
        outline: getComputedStyle(element).getPropertyValue('outline')
      })
      element.style.outline = outlineStyle
      curElement = element
    }
    function moveOut(e) {
      const element = e.target
      const lastIndex = path.length - 1
      const outline = path.splice(lastIndex, 1)[0].outline    
      const parent = path[lastIndex - 1]
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
      curInputElement = curElement
      contentDiv.textContent = curInputElement.innerHTML
      showContentDiv()
    }
    function showContentDiv() {
      contentDiv.style.visibility = 'visible'
    }
  }
  
  function initContentDiv() {
    contentDiv.setAttribute('contenteditable', true)
    contentDiv.setAttribute('id', 'contentDiv')
    contentDiv.setAttribute('class', 'contentDiv')
    document.body.appendChild(contentDiv)
    initContentDivEvent()
  }
  
  function initContentDivEvent() {
    contentDiv.addEventListener('paste', function(e) {
      curInputElement.innerHTML = contentDiv.textContent
    })
    contentDiv.addEventListener('input', function(e) {
      curInputElement.innerHTML = contentDiv.textContent
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

})()
