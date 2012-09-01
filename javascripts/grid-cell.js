(function() {
  var GridCell = function(grid, options) {
    var self = this

    this.grid        = grid
    this.type        = GridCell.INACCESSABLE
    this.dom         = document.createElement('td')
    this.dom.cell    = this
    this.dom.onclick = function() {
      self.fire('click')
    }

    this.setType(this.type)
  }

  Utils.addObserverMethodsToClass(GridCell)

  GridCell.INACCESSABLE = 'inaccessable'
  GridCell.ACCESSABLE   = 'accessable'
  GridCell.PATH         = 'path'
  GridCell.MONSTER      = 'monster'
  GridCell.TOWER        = 'tower'

  GridCell.prototype.getElement = function() {
    return this.dom
  }

  GridCell.prototype.setType = function(type, additionalClasses) {
    this.type          = type
    this.dom.className = [this.type].concat(additionalClasses || []).join(' ')
  }

  GridCell.prototype.addClassName = function(name) {
    this.dom.className = this.dom.className.split(' ').concat([name]).join(' ')
  }

  GridCell.prototype.removeClassName = function(name) {
    this.dom.className = this.dom.className.split(' ').filter(function(_name) {
      return name !== _name
    }).join(' ')
  }

  GridCell.prototype.hasClassName = function(className) {
    return this.dom.className.split(' ').indexOf(className) !== -1
  }

  GridCell.prototype.getCoordinates = function() {
    var result = this.coordinates
      , self   = this

    if(!result) {
      this.grid.cells.forEach(function(cells, x) {
        cells.forEach(function(cell, y) {
          if(self === cell) {
            result = this.coordinates = { x: x, y: y }
          }
        })
      })
    }

    return result
  }

  window.GridCell = GridCell
})()
