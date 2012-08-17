(function() {
  GridCell = function(options) {
    var self = this

    this.dom         = document.createElement('td')
    this.dom.cell    = this
    this.dom.onclick = function() {
      self.fire('click')
    }

    this.setType(GridCell.INACCESSABLE)

    Utils.addObserverMethods(this)
  }

  GridCell.INACCESSABLE = 'inaccessable'
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
})()
