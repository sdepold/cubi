(function() {
  Player = function(canvasSelector) {
    this.life   = 20
    this.dom    = document.createElement('div')
    this.canvas = document.querySelectorAll(canvasSelector)[0]
  }

  Player.prototype.render = function() {
    if(this.dom.parentNode === null) {
      this.canvas.appendChild(this.dom)
    }

    renderLife.call(this)
  }

  Player.prototype.hurt = function() {
    this.life--
    this.render()
  }

  Player.prototype.heal = function() {
    this.life++
    this.render()
  }

  // private

  var renderLife = function() {
    var lifeContainer = document.getElementById('life')

    if(!lifeContainer) {
      lifeContainer = document.createElement('span')
      lifeContainer.id = 'life'
      this.dom.appendChild(lifeContainer)
    }

    lifeContainer.innerHTML = this.life.toString() + ' / 20'
  }
})()
