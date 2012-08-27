(function() {
  window.currentPopUp = null

  var PopUp = function(content) {
    this.dom     = document.createElement('div')
    this.content = content

    this.dom.className = 'pop-up'

    Utils.addObserverMethods(this)
  }

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

    if(options.left) {
      this.dom.style.left = options.left + 'px'
    }

    if(options.top) {
      this.dom.style.top = options.top + 'px'
    }

    document.body.appendChild(this.dom)
    window.currentPopUp = this
  }

  PopUp.prototype.close = function() {
    document.body.removeChild(this.dom)
    window.currentPopUp = null
  }

  window.PopUp = PopUp
})()
