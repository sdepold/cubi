(function() {
  "use strict";

  var TowerMetaMenu = function(tower, player) {
    this.tower  = tower
    this.player = player
    this.dom    = document.createElement('ul')
  }

  TowerMetaMenu.prototype.render = function() {
    this.dom.className = 'menu'

    var upgrade        = document.createElement('li')
      , level          = (this.tower.level + 1)
      , costs          = window.Tower.TYPES[this.tower.type].costs[level]
      , upgradeMessage = window.Utils.interpolate('Upgrade to Level %{level} (%{costs})', { level: level, costs: costs })

    upgrade.appendChild(document.createTextNode(upgradeMessage))

    this.dom.appendChild(upgrade)
    document.body.appendChild(this.dom)
  }

  TowerMetaMenu.prototype.clear = function() {
    document.body.removeChild(this.dom)
  }

  window.TowerMetaMenu = TowerMetaMenu
})()
