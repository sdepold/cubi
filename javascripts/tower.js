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
      name:         'Turret',
      costs:        [50, 100, 200],
      damages:      [3, 5, 7],
      ranges:       [1, 1.5, 2],
      frequencies:  [300, 225, 150]
    },

    ROCKET: {
      name:         'Rocket Tower',
      costs:        [200, 400, 600],
      damages:      [200, 300, 400],
      ranges:       [5, 7, 9],
      frequencies:  [3000, 2000, 1000]
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

  Tower.prototype.checkDistanceTo = function(monster) {
    var monsterCell = monster.cell && monster.cell.dom

    if(monsterCell) {
      var isInRange = this.pointIsInRange({
        x: monsterCell.offsetLeft + (monsterCell.offsetWidth / 2),
        y: monsterCell.offsetTop + (monsterCell.offsetHeight / 2)
      })

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
    var bullet  = document.createElement('div')
      , body    = document.body
      , xTarget = monster.cell.dom.offsetLeft
      , yTarget = monster.cell.dom.offsetTop

    bullet.className      = 'bullet'
    bullet.style.left     = (this.cell.dom.offsetLeft + this.cell.dom.offsetWidth / 2) + 'px'
    bullet.style.top      = (this.cell.dom.offsetTop + this.cell.dom.offsetHeight / 2) + 'px'

    body.appendChild(bullet)

    setTimeout(function() {
      bullet.style.left = monster.cell.dom.offsetLeft +  monster.cell.dom.offsetWidth / 2 + 'px'
      bullet.style.top  = monster.cell.dom.offsetTop + monster.cell.dom.offsetHeight / 2 + 'px'
    }.bind(this), 10)

    setTimeout(function() {
      body.removeChild(bullet)
      monster.hurt(this.getDamage())
    }.bind(this), 250)
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
