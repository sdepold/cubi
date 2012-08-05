(function() {
  Grid = function(rows, cols, canvas) {
    this.rows      = rows
    this.cols      = cols
    this.canvas    = canvas
    this.container = document.createElement('table')
  }

  Grid.prototype.render = function() {
    for(var i = 0; i < this.rows; i++) {
      var tr = document.createElement('tr')

      for(var j = 0; j < this.cols; j++) {
        var cell = new GridCell(GridCell.INACCESSABLE)
        tr.appendChild(cell.getElement())
      }

      this.container.appendChild(tr)
    }

    this.canvas.appendChild(this.container)
  }
})()
