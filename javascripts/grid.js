(function() {
  var Grid = function(rows, cols, canvas) {
    this.rows      = rows
    this.cols      = cols
    this.canvas    = canvas
    this.container = document.createElement('table')
    this.path      = []
    this.cells     = []
  }

  Grid.prototype.render = function() {
    createDOM.call(this)

    this.path = createPath.call(this)

    this.path.forEach(function(cell) {
      cell.setType(GridCell.TYPES.PATH)
    })

    addPathSurroundings.call(this)
  }

  // private

  var addPathSurroundings = function() {
    this.path.forEach(function(cell) {
      var pos = getPositionOfCell.call(this, cell)

      if(pos.x > 0) {
        var left = getCell.call(this, pos.x - 1, pos.y)

        if(!Utils.hasClassName(left.dom, 'path')) {
          Utils.addClassName(left.dom, 'left')
          Utils.removeClassName(left.dom, GridCell.TYPES.ACCESSIBLE)
          Utils.addClassName(left.dom, GridCell.TYPES.INACCESSIBLE)
          left.type = GridCell.TYPES.INACCESSIBLE
        }
      }

      if(pos.x < this.cells[0].length - 1) {
        var right = getCell.call(this, pos.x + 1, pos.y)

        if(!Utils.hasClassName(right.dom, 'path')) {
          Utils.addClassName(right.dom, 'right')
          Utils.removeClassName(right.dom, GridCell.TYPES.ACCESSIBLE)
          Utils.addClassName(right.dom, GridCell.TYPES.INACCESSIBLE)
          right.type = GridCell.TYPES.INACCESSIBLE
        }
      }

      if(pos.y > 0) {
        var top = getCell.call(this, pos.x, pos.y - 1)

        if(!Utils.hasClassName(top.dom, 'path')) {
          Utils.addClassName(top.dom, 'top')
          Utils.removeClassName(top.dom, GridCell.TYPES.ACCESSIBLE)
          Utils.addClassName(top.dom, GridCell.TYPES.INACCESSIBLE)
          top.type = GridCell.TYPES.INACCESSIBLE
        }
      }

      if(pos.y < this.cells.length - 1) {
        var bottom = getCell.call(this, pos.x, pos.y + 1)

        if(!Utils.hasClassName(bottom.dom, 'path')) {
          Utils.addClassName(bottom.dom, 'bottom')
          Utils.removeClassName(bottom.dom, GridCell.TYPES.ACCESSIBLE)
          Utils.addClassName(bottom.dom, GridCell.TYPES.INACCESSIBLE)
          bottom.type = GridCell.TYPES.INACCESSIBLE
        }
      }
    }.bind(this))

    ;(function() {
      for(var y = 0; y < this.cells.length; y++) {
        var colCells = this.cells[y]

        for(var x = 0; x < colCells.length; x++) {
          var cell = colCells[x]

          if(x > 0) {
            var left = getCell.call(this, x - 1, y)

            if(!Utils.hasClassName(cell.dom, 'top') && Utils.hasClassName(left.dom, 'top')) {
              Utils.addClassName(cell.dom, 'top-right')
              Utils.removeClassName(cell.dom, GridCell.TYPES.ACCESSIBLE)
              Utils.addClassName(cell.dom, GridCell.TYPES.INACCESSIBLE)
              cell.type = GridCell.TYPES.INACCESSIBLE
            }

            if(!Utils.hasClassName(cell.dom, 'bottom') && Utils.hasClassName(left.dom, 'bottom')) {
              Utils.addClassName(cell.dom, 'bottom-right')
              Utils.removeClassName(cell.dom, GridCell.TYPES.ACCESSIBLE)
              Utils.addClassName(cell.dom, GridCell.TYPES.INACCESSIBLE)
              cell.type = GridCell.TYPES.INACCESSIBLE
            }
          }

          if(x < colCells.length - 1) {
            var right = getCell.call(this, x + 1, y)

            if(!Utils.hasClassName(cell.dom, 'top') && Utils.hasClassName(right.dom, 'top')) {
              Utils.addClassName(cell.dom, 'top-left')
              Utils.removeClassName(cell.dom, GridCell.TYPES.ACCESSIBLE)
              Utils.addClassName(cell.dom, GridCell.TYPES.INACCESSIBLE)
              cell.type = GridCell.TYPES.INACCESSIBLE
            }

            if(!Utils.hasClassName(cell.dom, 'bottom') && Utils.hasClassName(right.dom, 'bottom')) {
              Utils.addClassName(cell.dom, 'bottom-left')
              Utils.removeClassName(cell.dom, GridCell.TYPES.ACCESSIBLE)
              Utils.addClassName(cell.dom, GridCell.TYPES.INACCESSIBLE)
              cell.type = GridCell.TYPES.INACCESSIBLE
            }
          }
        }
      }
    }.bind(this))()

    ;(function() {
      for(var y = 0; y < this.cells.length; y++) {
        var colCells = this.cells[y]

        for(var x = 0; x < colCells.length; x++) {
          var cell = colCells[x]

          if(y > 0) {
            var top = getCell.call(this, x, y - 1)

            if(Utils.hasClassName(cell.dom, 'top') && Utils.hasClassName(top.dom, 'right')) {
              Utils.removeClassName(cell.dom, 'top')
              Utils.removeClassName(cell.dom, 'right')
              Utils.removeClassName(cell.dom, GridCell.TYPES.ACCESSIBLE)
              Utils.addClassName(cell.dom, 'top-right-inner')
              Utils.addClassName(cell.dom, GridCell.TYPES.INACCESSIBLE)
              cell.type = GridCell.TYPES.INACCESSIBLE
            }

            if(Utils.hasClassName(cell.dom, 'top') && Utils.hasClassName(top.dom, 'left')) {
              Utils.removeClassName(cell.dom, 'top')
              Utils.removeClassName(cell.dom, 'left')
              Utils.removeClassName(cell.dom, GridCell.TYPES.ACCESSIBLE)
              Utils.addClassName(cell.dom, 'top-left-inner')
              Utils.addClassName(cell.dom, GridCell.TYPES.INACCESSIBLE)
              cell.type = GridCell.TYPES.INACCESSIBLE
            }
          }

          if(y < this.cells.length - 1) {
            var bottom = getCell.call(this, x, y + 1)

            if(Utils.hasClassName(cell.dom, 'bottom') && Utils.hasClassName(bottom.dom, 'right')) {
              Utils.removeClassName(cell.dom, 'bottom')
              Utils.removeClassName(cell.dom, 'right')
              Utils.removeClassName(cell.dom, GridCell.TYPES.ACCESSIBLE)
              Utils.addClassName(cell.dom, 'bottom-right-inner')
              Utils.addClassName(cell.dom, GridCell.TYPES.INACCESSIBLE)
              cell.type = GridCell.TYPES.INACCESSIBLE
            }

            if(Utils.hasClassName(cell.dom, 'bottom') && Utils.hasClassName(bottom.dom, 'left')) {
              Utils.removeClassName(cell.dom, 'bottom')
              Utils.removeClassName(cell.dom, 'left')
              Utils.removeClassName(cell.dom, GridCell.TYPES.ACCESSIBLE)
              Utils.addClassName(cell.dom, 'bottom-left-inner')
              Utils.addClassName(cell.dom, GridCell.TYPES.INACCESSIBLE)
              cell.type = GridCell.TYPES.INACCESSIBLE
            }
          }
        }
      }
    }.bind(this))()

    ;(function() {
      for(var y = 0; y < this.cells.length; y++) {
        var colCells = this.cells[y]

        for(var x = 0; x < colCells.length; x++) {
          var cell = colCells[x]

          if(y > 0) {
            var top = getCell.call(this, x, y - 1)

            if(Utils.hasClassName(cell.dom, 'top') && Utils.hasClassName(top.dom, 'top-left')) {
              Utils.removeClassName(cell.dom, 'top')
              Utils.removeClassName(cell.dom, 'left')
              Utils.addClassName(cell.dom, 'top-left-inner')
              cell.type = GridCell.TYPES.INACCESSIBLE
            }

            if(Utils.hasClassName(cell.dom, 'top') && Utils.hasClassName(top.dom, 'top-right')) {
              Utils.removeClassName(cell.dom, 'top')
              Utils.removeClassName(cell.dom, 'right')
              Utils.addClassName(cell.dom, 'top-right-inner')
              cell.type = GridCell.TYPES.INACCESSIBLE
            }
          }

          if(y < this.cells.length - 1) {
            var bottom = getCell.call(this, x, y + 1)

            if(Utils.hasClassName(cell.dom, 'bottom') && Utils.hasClassName(bottom.dom, 'bottom-right')) {
              Utils.removeClassName(cell.dom, 'bottom')
              Utils.removeClassName(cell.dom, 'right')
              Utils.addClassName(cell.dom, 'bottom-right-inner')
              cell.type = GridCell.TYPES.INACCESSIBLE
            }

            if(Utils.hasClassName(cell.dom, 'bottom') && Utils.hasClassName(bottom.dom, 'bottom-left')) {
              Utils.removeClassName(cell.dom, 'bottom')
              Utils.removeClassName(cell.dom, 'left')
              Utils.addClassName(cell.dom, 'bottom-left-inner')
              cell.type = GridCell.TYPES.INACCESSIBLE
            }
          }
        }
      }
    }.bind(this))()

    this.path.forEach(function(cell) {
      var random = Math.random()
      if(random < 0.025) {
        Utils.addClassName(cell.dom, 'version-1')
      } else if(random < 0.05) {
        Utils.addClassName(cell.dom, 'version-2')
      } else if(random < 0.1) {
        Utils.addClassName(cell.dom, 'version-3')
      } else if(random < 0.125) {
        Utils.addClassName(cell.dom, 'version-4')
      } else if(random < 0.15) {
        Utils.addClassName(cell.dom, 'version-5')
      }
    }.bind(this))
  }

  var createDOM = function() {
    var self = this

    for(var i = 0; i < this.rows; i++) {
      var tr    = document.createElement('tr')
        , cells = []

      for(var j = 0; j < this.cols; j++) {
        var cell = new GridCell(self)

        cells.push(cell)
        tr.appendChild(cell.getElement())
      }

      this.container.appendChild(tr)
      this.cells.push(cells)
    }

    this.canvas.appendChild(this.container)
  }

  var createPath = function() {
    var indexes = getPathCellIndexes.call(this)
      , cells   = []
      , self    = this

    indexes.forEach(function(col, x) {
      col.forEach(function(y) {
        var cell = getCell.call(self, x, y)
        cells.push(cell)
      })
    })

    return cells
  }

  var getPathCellIndexes = function() {
    var indexes      = []
      , lastWayPoint = null

    for(var colIndex = 0; colIndex < this.cols; colIndex++) {
      var cells = []
        , start = (lastWayPoint !== null) ? lastWayPoint : (~~(Math.random() * this.rows))
        , end   = ~~(Math.random() * this.rows)

      if(colIndex % 4 !== 0) {
        cells.push(start)
        lastWayPoint = start
      } else {
        if(start === end) {
          cells.push(start)
        } else {
          for(var i = start; i !== end; (start > end) ? i-- : i++) {
            cells.push(i)
          }
          cells.push(i)
        }

        lastWayPoint = end
      }

      indexes.push(cells)
    }

    return indexes
  }

  var getCell = function(x, y) {

    var rows = this.container.querySelectorAll('tr')
      , row  = rows[y]

    return row.querySelectorAll('td')[x].cell
  }

  var getPositionOfCell = function(cell) {
    for(var y = 0; y < this.cells.length; y++) {
      var colCells = this.cells[y]

      for(var x = 0; x < colCells.length; x++) {
        var _cell = colCells[x]

        if(cell === _cell) {
          return {
            x: x,
            y: y
          }
        }
      }
    }

    return { x: null, y: null }
  }

  window.Grid = Grid
})()
