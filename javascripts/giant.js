(function() {
  var Giant = function() {
    this.dom = Utils.createDomNode('div', {
      className: 'giant airship'
    })
    this.dom.style.top = ~~(Math.random() * (document.querySelector('#game').offsetHeight)) + 'px'

    this.finalX = Utils.getWindowDimension().width// + 300
    this.health = 1000000
    this.hasTriggeredKilledEvent = false
    this.spawnedAt = null
  }

  Utils.addObserverMethodsToClass(Giant)

  Giant.prototype.render = function() {
    document.querySelector('#game').appendChild(this.dom)

    setTimeout(function() {
      this.dom.style.left = this.finalX + 'px'
      this.spawnedAt = +new Date()
    }.bind(this), 10)

    return this
  }

  Giant.prototype.move = function() {
    if(!this.spawnedAt || ((+new Date() - this.spawnedAt) < (1000 * 120))) {
      this.fire('move')
    } else {
      this.fire('goal:reached')
    }
  }

  Giant.prototype.getPosition = function() {
    return {
      x: this.dom.offsetLeft + (this.dom.offsetWidth / 2),
      y: this.dom.offsetTop  + (this.dom.offsetHeight / 2),
      isInPixels: true
    }
  }

  Giant.prototype.die = function() {
    if(!this.hasTriggeredKilledEvent) {
      this.hasTriggeredKilledEvent = true
      animateDestruction.call(this)
      this.fire('killed')
    }
  }

  Giant.prototype.getRevenue = function() {
    return 30000
  }

  ;['hurt', 'isDead'].forEach(function(name) {
    Giant.prototype[name] = Monster.prototype[name]
  })

  // private

  var animateDestruction = function() {
    var game = document.getElementById('game')

    Utils.shakeScreen(2000, 20, function() {
      game.removeChild(this.dom)
    }.bind(this))

    this.dom.style.opacity = 0


    for (var i = 0; i < 50; i++) {
      setTimeout(function() {
        var explosion = Utils.createDomNode('div', {
          className: 'explosion big',
          style: {
            left: Math.random() * this.dom.offsetWidth + this.dom.offsetLeft - 40 + 'px',
            top: Math.random() * this.dom.offsetHeight + this.dom.offsetTop - 40 + 'px'
          }
        })

        game.appendChild(explosion)

        setTimeout(function() {
          game.removeChild(explosion)
        }, 1000)
      }.bind(this), Math.random() * 1000)

    }
  }

  window.Giant = Giant
})()
