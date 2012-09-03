(function() {
  window.currentPopUp = null

  var PopUp = function(content) {
    this.dom           = document.createElement('div')
    this.dom.className = 'pop-up'
    this.content       = content
  }

  Utils.addObserverMethodsToClass(PopUp)

  PopUp.notify = function(msg, options) {
    options = options || {}

    var popUp = new PopUp(msg)

    popUp.render()

    if(!options.sticky) {
      setTimeout(function() {
        if(window.currentPopUp === popUp) {
          popUp.close()
        }
      }, 2000)
    }
  }

  PopUp.prototype.setContent = function(content) {
    this.content = content
  }

  PopUp.prototype.render = function(options) {
    options = options || {}

    if (typeof this.content === 'string') {
      this.content = document.createTextNode(this.content)
    }

    this.dom.appendChild(this.content)

    if(window.currentPopUp) {
      window.currentPopUp.close()
    }

    this.setPosition(options)

    document.body.appendChild(this.dom)
    window.currentPopUp = this

    fixPosition.call(this)
  }

  PopUp.prototype.setPosition = function(options) {
    options = options || {}

    if(options.left) {
      this.dom.style.left = options.left + 'px'
    }

    if(options.top) {
      this.dom.style.top = options.top + 'px'
    }
  }

  PopUp.prototype.close = function() {
    document.body.removeChild(this.dom)
    window.currentPopUp = null
  }

  // private

  var fixPosition = function() {
    var canvas   = document.querySelector('table')
      , selected = document.querySelector('.selected, .with-range')
      , width    = this.dom.offsetWidth
      , height   = this.dom.offsetHeight
      , minX     = canvas.offsetLeft
      , maxX     = minX + canvas.offsetWidth - width
      , minY     = canvas.offsetTop
      , maxY     = minY + canvas.offsetHeight - height
      , options  = {}

    if(selected && (selected.offsetLeft > maxX) && (selected.offsetLeft < (maxX + width))) {
      maxX = selected.offsetLeft - width - 10
    }

    if(this.dom.offsetLeft < minX) {
      options.left = minX
    }

    if(this.dom.offsetLeft > maxX) {
      options.left = maxX
    }

    if(this.dom.offsetTop < minY) {
      options.top = minY
    }

    if(this.dom.offsetTop > maxY) {
      options.top = maxY
    }

    if(options.top || options.left) {
      this.setPosition(options)
    }
  }

  window.PopUp = PopUp
})()
