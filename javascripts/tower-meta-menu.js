(function() {
  "use strict";

  var TowerMetaMenu = function(tower, player) {
    this.tower  = tower
    this.player = player
    this.dom    = document.createElement('ul')

    Utils.addObserverMethods(this)
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
      , upgradeMessage = 'Upgrade to Level %{level} (%{costs})'

    if(level === 3) {
      upgradeMessage = 'Max level %{level} reached.'
      upgradeMessage = window.Utils.interpolate(upgradeMessage, { level: level, costs: costs })
    } else {
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
        upgradeMessage = window.Utils.interpolate(upgradeMessage, { level: level + 1, costs: costs })
      }.bind(this)
    }

    upgrade.appendChild(
      document.createTextNode(window.Utils.interpolate(upgradeMessage, { level: level + 1, costs: costs }))
    )
    upgrade.className = 'upgrade'

    this.dom.appendChild(upgrade)
  }

  var appendSell = function() {
    var sell        = document.createElement('li')
      , level       = this.tower.level
      , costs       = window.Tower.TYPES[this.tower.type].costs[level] / 2
      , sellMessage = window.Utils.interpolate('Sell (%{costs})', { costs: costs })

    sell.appendChild(document.createTextNode(sellMessage))

    sell.onclick = function() {
      this.player.sell(this.tower)
      this.tower.destroy()
      this.fire('tower:sold', this.tower)
    }.bind(this)
    sell.className = 'sell'

    this.dom.appendChild(sell)
  }

  window.TowerMetaMenu = TowerMetaMenu
})()
