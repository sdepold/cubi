(function() {
  Monster = function(path, options) {
    this.options = Utils.merge({
      speed: 100,
      health: 10,
      revenue: 100
    }, options || {})

    this.path       = path
    this.pathIndex  = 0
    this.cell       = null
    this.intervalId = null

    Utils.addObserverMethods(this)
  }

  Monster.prototype.initMoving = function() {
    var self = this

    this.intervalId = setInterval(function() {
      if(self.pathIndex < self.path.length) {
        self.move()
      } else {
        setPosition.call(self, null)
        self.fire('goal:reached')
        clearInterval(self.intervalId)
      }
    }, this.options.speed)
  }

  Monster.prototype.stop = function() {
    clearInterval(this.intervalId)
  }

  Monster.prototype.move = function() {
    setPosition.call(this, this.path[this.pathIndex])
    this.pathIndex++

    if(this.cell) {
      this.fire('move')
    }
  }

  Monster.prototype.getPosition = function() {
    return this.cell && this.cell.getCoordinates()
  }

  Monster.prototype.hurt = function(damage) {
    this.options.health -= damage

    if(this.options.health <= 0) {
      this.die()
    }
  }

  Monster.prototype.die = function() {
    this.stop()
    this.cell.setType(GridCell.PATH)
    this.fire('die')
  }

  // private

  var setPosition = function(cell) {
    if(this.cell) {
      this.cell.setType(GridCell.PATH)
    }

    if(cell) {
      cell.setType(GridCell.MONSTER)
    }

    this.cell = cell
  }
})()
