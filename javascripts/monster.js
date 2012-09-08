(function() {
  var Monster = function(path, type) {
    this.type       = type
    this.options    = this.getStats()
    this.health     = this.options.health
    this.path       = path
    this.pathIndex  = 0
    this.cell       = null
    this.intervalId = null

    this.hasTriggeredKilledEvent = false
  }

  Utils.addObserverMethodsToClass(Monster)

  Monster.TYPES = [
    {
      name: 'beast',
      health: 20,
      speed: 500,
      revenue: 40
    }, {
      name: 'scout-lite',
      health: 30,
      speed: 400,
      revenue: 100
    }, {
      name: 'amphibian-lite',
      health: 90,
      speed: 300,
      revenue: 100
    }, {
      name: 'scout-mid',
      health: 70,
      speed: 300,
      revenue: 60
    }, {
      name: 'mech-lite',
      health: 500,
      speed: 500,
      revenue: 200
    }, {
      name: 'mech-mid',
      health: 1000,
      speed: 600,
      revenue: 300
    }, {
      name: 'mech-heavy',
      health: 1500,
      speed: 800,
      revenue: 400
    }, {
      name: 'scout-heavy',
      health: 100,
      speed: 200,
      revenue: 150
    }, {
      name: 'tank-lite',
      health: 5000,
      speed: 400,
      revenue: 1000
    }, {
      name: 'tank-lite-2',
      health: 10000,
      speed: 400,
      revenue: 1500
    }, {
      name: 'tank-mid',
      health: 15000,
      speed: 350,
      revenue: 2000
    }, {
      name: 'tank-laser',
      health: 20000,
      speed: 500,
      revenue: 2000
    }, {
      name: 'tank-heavy',
      health: 30000,
      speed: 600,
      revenue: 5000
    }
  ]

  Monster.getTypeByName = function(name) {
    return Monster.TYPES.filter(function(type) {
      return type.name === name
    })[0]
  }

  Monster.prototype.getStats = function() {
    return Monster.getTypeByName(this.type)
  }

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

  Monster.prototype.getRevenue = function() {
    return this.options.revenue
  }

  Monster.prototype.hurt = function(damage) {
    this.health -= damage

    if(this.health <= 0) {
      this.die()
    }
  }

  Monster.prototype.die = function() {
    if(!this.hasTriggeredKilledEvent) {
      this.hasTriggeredKilledEvent = true
      this.stop()
      this.cell.setType(GridCell.TYPES.PATH)
      this.fire('killed')
    }
  }

  Monster.prototype.isDead = function() {
    return this.health <= 0
  }

  // private

  var getClassName = function() {
    return Monster.TYPES.filter(function(type) {
      return this.type === type.name
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
