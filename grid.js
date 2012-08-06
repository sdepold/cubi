(function() {
  Grid = function(rows, cols, canvas) {
    this.rows      = rows
    this.cols      = cols
    this.canvas    = canvas
    this.container = document.createElement('table')
  }

  Grid.prototype.render = function() {
    createDOM.call(this)

    var cells = createPath.call(this)

    cells.forEach(function(cell) {
      cell.setType(GridCell.PATH)
    })
  }

  // private

  var createDOM = function() {
    for(var i = 0; i < this.rows; i++) {
      var tr = document.createElement('tr')

      for(var j = 0; j < this.cols; j++) {
        var cell = new GridCell()
        tr.appendChild(cell.getElement())
      }

      this.container.appendChild(tr)
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


    // for(var colIndex = 0; colIndex < this.cols; colIndex++) {
    //   indexes[colIndex].forEach(function(y) {
    //     console.log()
    //     var cell = getCell.call(this, colIndex, y)
    //     cells.push(cell)
    //   })
    // }

    return cells
  }

  var getPathCellIndexes = function() {
    var indexes      = []
      , lastWayPoint = null

    for(var colIndex = 0; colIndex < this.cols; colIndex++) {
      var cells = []

      var rowIndex1 = lastWayPoint || ~~(Math.random() * this.rows)
        , rowIndex2 = ~~(Math.random() * this.rows)

      if(rowIndex1 === rowIndex2) {
        cells.push(rowIndex1)
      } else {
        var sorted = [rowIndex1, rowIndex2].sort(function(a,b){ return (a<b) ? -1 : 1})
          , start  = sorted[0]
          , end    = sorted[1]

        while(start < end) {
          cells.push(start)
          start++
        }
      }

      indexes.push(cells)
      lastWayPoint = rowIndex2
    }

    return indexes
  }

  var getCell = function(x, y) {
    var rows = this.container.querySelectorAll('tr')
      , row  = rows[y]

    return row.querySelectorAll('td')[x].cell
  }
})()
