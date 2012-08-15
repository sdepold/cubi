(function() {
  GridCell = function(options) {
    this.dom         = document.createElement('td')
    this.dom.cell    = this
    this.dom.onclick = onClick.bind(this)

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

  // private

  var onClick = function() {
    var self = this

    var onSelect = function(type) {
      TowerMenu.off('select', onSelect)
      TowerMenu.clear()


      new Tower(type, self).render()
    }

    TowerMenu.on('select', onSelect)
    TowerMenu.render()
  }
})()
