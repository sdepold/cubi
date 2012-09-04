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
    if(this.options.health < 20) {
      return 'beast'
    } else if(this.options.health < 40) {
      return 'scout-lite'
    } else if(this.options.health < 60) {
      return 'scout-mid'
    } else if(this.options.health < 80) {
      return 'amphibian-lite'
    } else if(this.options.health < 100) {
      return 'tank-lite'
    } else if(this.options.health < 120) {
      return 'tank-mid'
    } else {
      return 'tank-heavy'
    }
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
