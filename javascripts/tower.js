(function() {
  var Tower = function(type, cell) {
    this.type     = type
    this.level    = 0
    this.cell     = cell
    this.lastShot = null
    this.range    = null
  }

  Utils.addObserverMethodsToClass(Tower)

  Tower.TYPES = {
    TURRET: {
      name:            'Turret',
      explosion:       'small',
      explosionOffset: -6,
      costs:           [50, 100, 200],
      damages:         [3, 5, 7],
      ranges:          [1, 1.5, 2],
      frequencies:     [300, 225, 150]
    },

    ROCKET: {
      name:            'Rocket Tower',
      explosion:       'mid',
      explosionOffset: -12,
      costs:           [200, 400, 600],
      damages:         [200, 300, 400],
      ranges:          [5, 7, 9],
      frequencies:     [3000, 2000, 1000]
    },

    ULTRA: {
      name:            'Ultra Tower',
      explosion:       'big',
      explosionOffset: -20,
      costs:           [5000, 7500, 10000],
      damages:         [99999, 99999, 99999],
      ranges:          [3, 8, 13],
      frequencies:     [10000, 7500, 5000]
    }
  }

  Tower.prototype.getStats = function() {
    var stats = {
      damage: this.getDamage(),
      range: this.getRange(),
      frequency: this.getFrequency() / 1000
    }

    stats.damagePerSecond = Math.ceil((1 / stats.frequency) * (1 / stats.frequency) * stats.damage)

    return stats
  }

  Tower.prototype.upgrade = function() {
    this.level++
    this.cell.setType(GridCell.TYPES.TOWER, toClassNames.call(this))
    this.fire('upgraded')
  }

  Tower.prototype.render = function() {
    this.cell.setType(GridCell.TYPES.TOWER, toClassNames.call(this))
    return this
  }

  Tower.prototype.getPrice = function() {
    return Tower.TYPES[this.type].costs[this.level]
  }

  Tower.prototype.getRange = function() {
    return Tower.TYPES[this.type].ranges[this.level]
  }

  Tower.prototype.getFrequency = function() {
    return Tower.TYPES[this.type].frequencies[this.level]
  }

  Tower.prototype.getDamage = function() {
    return Tower.TYPES[this.type].damages[this.level]
  }

  Tower.prototype.getExplosion = function() {
    return Tower.TYPES[this.type].explosion
  }

  Tower.prototype.getExplosionOffset = function() {
    return Tower.TYPES[this.type].explosionOffset
  }

  Tower.prototype.checkDistanceTo = function(monster) {
    var monsterPosition = monster.getPosition()

    if(monsterPosition) {
      var isInRange = this.pointIsInRange(monsterPosition)

      if(isInRange && this.canShoot()) {
        this.shoot(monster)
        this.lastShot = +new Date()
      }
    }
  }

  Tower.prototype.pointIsInRange = function(point) {
    var radius     = this.getRange() * this.cell.dom.offsetHeight
      , circleX    = getCenter.call(this).x
      , circleY    = getCenter.call(this).y

    if (Math.abs(circleX - point.x) < radius && Math.abs(circleY - point.y) < radius) {
      var distanceSquared = Math.pow(circleX - point.x, 2) + Math.pow(circleY - point.y, 2)
      return distanceSquared <= (radius * radius)
    } else {
      return false
    }
  }

  Tower.prototype.canShoot = function() {
    if(!this.lastShot) {
      return true
    } else {
      var diff = +new Date() - this.lastShot
      return diff >= this.getFrequency()
    }
  }

  Tower.prototype.shoot = function(monster) {
    var bullet    = document.createElement('div')
      , explosion = Utils.createDomNode('div', { className: 'explosion ' + this.getExplosion() })
      , body      = document.body
      , xTarget   = monster.getPosition().x
      , yTarget   = monster.getPosition().y

    bullet.className  = 'bullet ' + this.type
    bullet.style.left = (this.cell.dom.offsetLeft + this.cell.dom.offsetWidth / 2) + 'px'
    bullet.style.top  = (this.cell.dom.offsetTop + this.cell.dom.offsetHeight / 2) + 'px'

    body.appendChild(bullet)

    setTimeout(function() {
      bullet.style.left = xTarget + 'px'
      bullet.style.top  = yTarget + 'px'
    }.bind(this), 10)

    setTimeout(function() {
      body.removeChild(bullet)
      monster.hurt(this.getDamage())

      explosion.style.left = (parseInt(bullet.style.left, 10) + this.getExplosionOffset()) + 'px'
      explosion.style.top = (parseInt(bullet.style.top, 10) + this.getExplosionOffset()) + 'px'

      body.appendChild(explosion)

      setTimeout(function() {
        body.removeChild(explosion)
      }, this.type === 'ultra' ? 1000 : 400)
    }.bind(this), 240)
  }

  Tower.prototype.renderRange = function() {
    var circle = document.createElement('div')
      , dom    = this.cell.dom
      , size   = dom.offsetHeight

    circle.className   = 'range'
    circle.style.width = circle.style.height = this.getRange() * 2 * dom.offsetHeight + 'px'

    // 2 === border width
    var x = getCenter.call(this).x - parseInt(circle.style.width, 10) / 2 - 2
      , y = getCenter.call(this).y - parseInt(circle.style.height, 10) / 2 - 2

    circle.style.left   = x + 'px'
    circle.style.top    = y + 'px'

    this.range = circle
    this.range.onclick = function() {
      this.removeRange()
      this.cell.removeClassName('with-range')
      window.currentPopUp && window.currentPopUp.close()
    }.bind(this)

    document.body.appendChild(circle)
    this.cell.addClassName('with-range')
  }

  Tower.prototype.removeRange = function() {
    var body = document.body

    if(this.range) {
      body.removeChild(this.range)
    }

    this.range = null
  }

  Tower.prototype.destroy = function() {
    toClassNames.call(this).forEach(function(klass) {
      this.cell.removeClassName(klass)
    }.bind(this))
  }

  // private

  var getCenter = function() {
    return {
      x: this.cell.dom.offsetLeft + (this.cell.dom.offsetWidth / 2),
      y: this.cell.dom.offsetTop  + (this.cell.dom.offsetHeight / 2)
    }
  }

  var toClassNames = function() {
    var towerName = this.type.toLowerCase().replace(/ /, '-')
      , levelName = 'level-' + (this.level + 1)

    return [towerName, levelName]
  }

  window.Tower = Tower
})()
