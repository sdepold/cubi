(function() {
  GridCell = function() {
    this.dom           = document.createElement('td')
    this.dom.cell      = this

    this.setType(GridCell.INACCESSABLE)
  }

  GridCell.INACCESSABLE = 'inaccessable'
  GridCell.PATH         = 'path'
  GridCell.MONSTER      = 'monster'

  GridCell.prototype.getElement = function() {
    return this.dom
  }

  GridCell.prototype.setType = function(type) {
    this.type          = type
    this.dom.className = this.type
  }
})()
