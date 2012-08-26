(function() {
  Tower = function(type, cell) {
    this.type     = type
    this.level    = 0
    this.cell     = cell
    this.lastShot = null
    this.range    = null

    Utils.addObserverMethods(this)
  }

  Tower.TYPES = {
    LASER: {
      name:         'Laser Tower',
      costs:        [100, 200, 1000],
      damages:      [2, 5, 10],
      ranges:       [3, 5, 7],
      frequencies:  [500, 450, 400]
    },

    ROCKET: {
      name:         'Rocket Tower',
      costs:        [300, 500, 1500],
      damages:      [10, 15, 25],
      ranges:       [7, 9, 12],
      frequencies:  [3000, 2700, 2200]
    },

    FREEZER: {
      name:         'Freezer',
      costs:        [200, 500, 750],
      damages:      [5, 7, 9],
      ranges:       [3, 4, 5],
      frequencies:  [5000, 4000, 3000]
    }
  }

  Tower.prototype.upgrade = function() {
    this.level++
    this.cell.setType(GridCell.TOWER, toClassNames.call(this))
  }

  Tower.prototype.render = function() {
    this.cell.setType(GridCell.TOWER, toClassNames.call(this))
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
    if(monster.cell.dom) {
      var isInRange = this.pointIsInRange({
        x: monster.cell.dom.offsetLeft + (monster.cell.dom.offsetWidth / 2),
        y: monster.cell.dom.offsetTop + (monster.cell.dom.offsetHeight / 2)
      })

      if(isInRange && this.canShoot()) {
        this.shoot(monster)
        this.lastShot = +new Date()
      }
    }
  }

  Tower.prototype.pointIsInRange = function(point) {
    var radius     = this.getRange() * this.cell.dom.offsetHeight
      , centerX    = getCenter.call(this).x
      , centerY    = getCenter.call(this).y
      , distance   = Math.pow(Math.pow(point.x - centerX, 2) + Math.pow(point.y - centerY, 2), 0.5)

    return distance <= radius
  }

  Tower.prototype.canShoot = function() {
    return !this.lastShot || (((+new Date()) - this.lastShot) >= this.getFrequency())
  }

  Tower.prototype.shoot = function(monster) {
    var bullet  = document.createElement('div')
      , body    = document.body
      , xTarget = monster.cell.dom.offsetLeft
      , yTarget = monster.cell.dom.offsetTop
      , self    = this

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
      , self   = this

    circle.className   = 'range'
    circle.style.width = circle.style.height = this.getRange() * 2 * dom.offsetHeight + 'px'

    // 2 === border width
    var x = getCenter.call(this).x - parseInt(circle.style.width, 10) / 2 - 2
      , y = getCenter.call(this).y - parseInt(circle.style.height, 10) / 2 - 2

    circle.style.left   = x + 'px'
    circle.style.top    = y + 'px'

    this.range = circle
    this.range.onclick = function() {
      self.removeRange()

      document.querySelectorAll('.menu').forEach(function(menu) {
        document.body.removeChild(menu)
      })
    }

    document.body.appendChild(circle)
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
      , levelName = 'level-' + this.level

    return [towerName, levelName]
  }
})()
