(function() {
  Monster = function(path, options) {
    this.options = Utils.merge({
      speed: 100,
      health: 10
    }, options || {})

    this.path        = path
    this.pathIndex   = 0
    this.currentCell = null
    this.intervalId  = null
  }

  Monster.prototype.initMoving = function() {
    var self = this

    this.intervalId = setInterval(function() {
      if(self.pathIndex < self.path.length) {
        self.move()
      } else {
        setPosition.call(self, null)
        clearInterval(self.intervalId)
      }
    }, this.options.speed)
  }

  Monster.prototype.move = function() {
    setPosition.call(this, this.path[this.pathIndex])
    this.pathIndex++
  }

  // private

  var setPosition = function(cell) {
    if(this.currentCell) {
      this.currentCell.setType(GridCell.PATH)
    }

    if(cell) {
      cell.setType(GridCell.MONSTER)
    }

    this.currentCell = cell
  }
})()
