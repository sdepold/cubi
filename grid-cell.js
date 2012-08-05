(function() {
  GridCell = function(type) {
    this.type = type
    this.dom  = document.createElement('td')
    this.dom.className = type
    this.dom.cell = this
  }

  GridCell.INACCESSABLE = 'inaccessable'
  GridCell.ACCESSABLE   = 'accessable'

  GridCell.prototype.getElement = function() {
    return this.dom
  }
})()
