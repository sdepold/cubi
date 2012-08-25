(function() {
  "use strict";

  var TowerMetaMenu = function(tower, player) {
    this.tower  = tower
    this.player = player
    this.dom    = document.createElement('ul')
  }

  TowerMetaMenu.prototype.render = function() {
    this.dom.className = 'menu'

    appendUpgrade.call(this)
    appendSell.call(this)

    document.body.appendChild(this.dom)
  }

  TowerMetaMenu.prototype.clear = function() {
    document.body.removeChild(this.dom)
  }

  // private

  var appendUpgrade = function() {
    var upgrade        = document.createElement('li')
      , level          = (this.tower.level + 1)
      , costs          = window.Tower.TYPES[this.tower.type].costs[level]
      , upgradeMessage = window.Utils.interpolate('Upgrade to Level %{level} (%{costs})', { level: level + 1, costs: costs })

    upgrade.appendChild(document.createTextNode(upgradeMessage))

    upgrade.onclick = function() {
      if(this.player.canBuy(this.tower.type, level)) {
        this.player.buy(this.tower.type, level)

        this.tower.upgrade()
        this.tower.removeRange()
        this.tower.renderRange()

        this.clear()

        new TowerMetaMenu(this.tower, this.player).render()
      } else {
        alert('too expensive!')
      }
    }.bind(this)

    this.dom.appendChild(upgrade)
  }

  var appendSell = function() {
    var sell        = document.createElement('li')
      , level       = this.tower.level
      , costs       = window.Tower.TYPES[this.tower.type].costs[level] / 2
      , sellMessage = window.Utils.interpolate('Sell (%{costs})', { costs: costs })

    sell.appendChild(document.createTextNode(sellMessage))

    this.dom.appendChild(sell)
  }

  window.TowerMetaMenu = TowerMetaMenu
})()
