(function() {
  GridCell = function(options) {
    var self = this

    this.dom           = document.createElement('td')
    this.dom.cell      = this

    this.setType(GridCell.INACCESSABLE)
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

  GridCell.prototype.on = function(eventName, callback) {
    this.dom['on' + eventName.toLowerCase()] = callback
  }
})()
