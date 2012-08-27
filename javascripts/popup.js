(function() {
  window.currentPopUp = null

  var PopUp = function(content) {
    this.dom     = document.createElement('div')
    this.content = content

    this.dom.className = 'pop-up'

    Utils.addObserverMethods(this)
  }

  PopUp.prototype.setContent = function(content) {
    this.content = content
  }

  PopUp.prototype.render = function() {
    if (typeof this.content === 'string') {
      this.content = document.createTextNode(this.content)
    }

    this.dom.appendChild(this.content)

    if(window.currentPopUp) {
      window.currentPopUp.close()
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
