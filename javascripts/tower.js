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
    var towerCoordinates   = this.cell.getCoordinates()
      , monsterCoordinates = monster.getPosition()

    if(monsterCoordinates) {
      var xDistance = Math.abs(towerCoordinates.x - monsterCoordinates.x)
        , yDistance = Math.abs(towerCoordinates.y - monsterCoordinates.y)
        , distance  = xDistance + yDistance

      if((xDistance !== 0) && (yDistance !== 0)) {
        distance = distance / 2
      }

      if((distance <= this.getRange()) && this.canShoot()) {
        this.shoot(monster)
        this.lastShot = +new Date()
      }
    }
  }

  Tower.prototype.canShoot = function() {
    return !this.lastShot || (((+new Date()) - this.lastShot) >= this.getFrequency())
  }

  Tower.prototype.shoot = function(monster) {
    var bullet  = document.createElement('div')
      , body    = document.querySelector('body')
      , xTarget = monster.cell.dom.offsetLeft
      , yTarget = monster.cell.dom.offsetTop
      , self    = this

    bullet.className      = 'bullet'
    bullet.style.left     = this.cell.dom.offsetLeft + 'px'
    bullet.style.top      = this.cell.dom.offsetTop + 'px'

    body.appendChild(bullet)

    var xStep = Math.abs(bullet.offsetLeft - xTarget) / 10
      , yStep = Math.abs(bullet.offsetTop  - yTarget) / 10
      , steps = 0

    var intervalId = setInterval(function() {
      if(xTarget < bullet.offsetLeft) {
        bullet.style.left = (parseInt(bullet.style.left, 10) - xStep) + 'px'
      } else {
        bullet.style.left = (parseInt(bullet.style.left, 10) + xStep) + 'px'
      }

      if(yTarget < bullet.offsetTop) {
        bullet.style.top  = (parseInt(bullet.style.top, 10) - yStep) + 'px'
      } else {
        bullet.style.top  = (parseInt(bullet.style.top, 10) + yStep) + 'px'
      }

      if(steps === 10) {
        clearInterval(intervalId)
        body.removeChild(bullet)
        console.log(monster)
        monster.hurt(self.getDamage())
      }

      steps++
    }, 20)
  }

  Tower.prototype.renderRange = function() {
    var circle = document.createElement('div')
      , dom    = this.cell.dom
      , size   = dom.offsetHeight
      , self   = this

    circle.className    = 'range'
    circle.style.width  = this.getRange() * dom.offsetWidth + 'px'
    circle.style.height = this.getRange() * dom.offsetHeight + 'px'

    var x = getCenter.call(this).x - parseInt(circle.style.width) / 2 - 4
      , y = getCenter.call(this).y - parseInt(circle.style.height) / 2 - 4

    circle.style.left   = x + 'px'
    circle.style.top    = y + 'px'

    this.range = circle
    this.range.onclick = function() {
      self.removeRange()
    }

    document.querySelector('body').appendChild(circle)
  }

  Tower.prototype.removeRange = function() {
    var body = document.querySelector('body')

    if(this.range) {
      body.removeChild(this.range)
    }

    this.range = null
  }

  // private

  var getCenter = function() {
    return {
      x: this.cell.dom.offsetLeft + this.cell.dom.offsetWidth,
      y: this.cell.dom.offsetTop  + this.cell.dom.offsetHeight
    }
  }

  var toClassNames = function() {
    var towerName = this.type.toLowerCase().replace(/ /, '-')
      , levelName = 'level-' + this.level

    return [towerName, levelName]
  }
})()
