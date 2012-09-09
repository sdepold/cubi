(function() {
  var GridCell = function(grid, options) {
    var self = this

    this.grid        = grid
    this.type        = GridCell.TYPES.ACCESSIBLE
    this.dom         = Utils.createDomNode('td', {
      cell: this,
      onclick:function() { this.fire('click') }.bind(this)
    })
    this.dom.appendChild(Utils.createDomNode('div'))

    this.setType(this.type)
  }

  Utils.addObserverMethodsToClass(GridCell)

  GridCell.TYPES = {
    INACCESSIBLE: 'inaccessible',
    ACCESSIBLE: 'accessible',
    PATH: 'path',
    MONSTER: 'monster',
    TOWER: 'tower'
  }

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
    return {
      x: this.dom.offsetLeft + (this.dom.offsetWidth / 2),
      y: this.dom.offsetTop  + (this.dom.offsetHeight / 2)
    }
  }

  window.GridCell = GridCell
})()
