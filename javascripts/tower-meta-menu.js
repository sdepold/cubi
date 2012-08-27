(function() {
  var TowerMetaMenu = function(tower, player) {
    this.tower  = tower
    this.player = player
    this.popUp  = new PopUp()

    Utils.addObserverMethods(this)
  }

  TowerMetaMenu.prototype.render = function() {
    var ul = document.createElement('ul')
      , x  = this.tower.cell.dom.offsetLeft + 40
      , y  = this.tower.cell.dom.offsetTop - 30

    ul.className = 'menu'

    ul.appendChild(buildUpgradeMenu.call(this))
    ul.appendChild(buildSellMenu.call(this))

    this.popUp.setContent(ul)
    this.popUp.render({ left: x, top: y })

    if(x + this.popUp.dom.offsetWidth > document.querySelector('table').offsetWidth) {
      this.popUp.setPosition({ left: (x - 300) })
    }
  }

  TowerMetaMenu.prototype.clear = function() {
    this.popUp.close()
  }

  // private

  var buildUpgradeMenu = function() {
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

          this.clear();

          new TowerMetaMenu(this.tower, this.player).render()
        } else {
          PopUp.notify('Too expensive!')
        }
        upgradeMessage = window.Utils.interpolate(upgradeMessage, { level: level + 1, costs: costs })
      }.bind(this)
    }

    upgrade.appendChild(
      document.createTextNode(window.Utils.interpolate(upgradeMessage, { level: level + 1, costs: costs }))
    )
    upgrade.className = 'upgrade'

    return upgrade
  }

  var buildSellMenu = function() {
    var sell        = document.createElement('li')
      , level       = this.tower.level
      , costs       = window.Tower.TYPES[this.tower.type].costs[level] / 2
      , sellMessage = window.Utils.interpolate('Sell (%{costs})', { costs: costs })

    sell.appendChild(document.createTextNode(sellMessage))

    sell.onclick = function() {
      this.player.sell(this.tower)
      this.tower.cell.setType(GridCell.INACCESSABLE)
      this.tower.destroy()
      this.fire('tower:sold', this.tower)
    }.bind(this)

    sell.className = 'sell'

    return sell
  }

  window.TowerMetaMenu = TowerMetaMenu
})()
