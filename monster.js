(function() {
  Monster = function(path) {
    this.path        = path
    this.pathIndex   = 0
    this.currentCell = null
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

    cell.setType(GridCell.MONSTER)
    this.currentCell = cell
  }
})()
