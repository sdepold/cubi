(function() {
  var Monster = function(path, options) {
    this.options = Utils.merge({
      speed: 100,
      health: 10,
      revenue: 30
    }, options || {})

    this.health     = this.options.health
    this.path       = path
    this.pathIndex  = 0
    this.cell       = null
    this.intervalId = null
  }

  Utils.addObserverMethodsToClass(Monster)

  Monster.TYPES = [
    {
      name: 'beast',
      health: 20,
      count: 10,
      speed: 500
    }, {
      name: 'scout-lite',
      health: 30,
      count: 15,
      speed: 400
    }, {
      name: 'scout-mid',
      health: 50,
      count: 15,
      speed: 350
    }, {
      name: 'scout-heavy',
      health: 70,
      count: 15,
      speed: 300
    }, {
      name: 'amphibian-lite',
      health: 90,
      count: 20,
      speed: 200
    }, {
      name: 'tank-lite',
      health: 120,
      count: 10,
      speed: 100
    }, {
      name: 'tank-lite-2',
      health: 150,
      count: 15,
      speed: 150
    }, {
      name: 'tank-mid',
      health: 200,
      count: 15,
      speed: 200
    }, {
      name: 'tank-laser',
      health: 250,
      count: 20,
      speed: 200
    }, {
      name: 'tank-heavy',
      health: 300,
      count: 20,
      speed: 250
    }, {
      name: 'mech-lite',
      health: 200,
      count: 30,
      speed: 500
    }, {
      name: 'mech-mid',
      health: 250,
      count: 25,
      speed: 600
    }, {
      name: 'mech-heavy',
      health: 300,
      count: 20,
      speed: 800
    }
  ]

  Monster.prototype.stop = function() {
    clearInterval(this.intervalId)
  }

  Monster.prototype.move = function() {
    setPosition.call(this, this.path[this.pathIndex])
    this.pathIndex++

    if(this.cell) {
      this.fire('move')
    } else {
      this.fire('goal:reached')
    }
  }

  Monster.prototype.getPosition = function() {
    return this.cell && this.cell.getCoordinates()
  }

  Monster.prototype.hurt = function(damage) {
    this.health -= damage

    if(this.health <= 0) {
      this.die()
    }
  }

  Monster.prototype.die = function() {
    this.stop()
    this.cell.setType(GridCell.TYPES.PATH)
    this.fire('killed')
  }

  Monster.prototype.isDead = function() {
    return this.health === 0
  }

  // private

  var getClassName = function() {
    return Monster.TYPES.filter(function(type) {
      return this.options.health === type.health
    }.bind(this))[0].name
  }

  var setPosition = function(cell) {
    if(this.cell) {
      this.cell.setType(GridCell.TYPES.PATH)
    }

    if(cell) {
      cell.setType(GridCell.TYPES.MONSTER, [getClassName.call(this)])
    }

    this.cell = cell
  }

  window.Monster = Monster
})()
