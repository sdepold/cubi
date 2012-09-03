(function() {
  var TowerMetaMenu = function(tower, player) {
    this.tower  = tower
    this.player = player
    this.popUp  = new PopUp()
  }

  Utils.addObserverMethodsToClass(TowerMetaMenu)

  TowerMetaMenu.prototype.render = function() {
    var ul = document.createElement('ul')
      , x  = this.tower.cell.dom.offsetLeft + 40
      , y  = this.tower.cell.dom.offsetTop - 30

    ul.className = 'menu'

    ul.appendChild(buildUpgradeMenu.call(this))
    ul.appendChild(buildSellMenu.call(this))
    ul.appendChild(buildStatsMenu.call(this))

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
      , costs          = Tower.TYPES[this.tower.type].costs[level]
      , upgradeMessage = Utils.needsReducedLayout() ? "Level %{level}: %{costs}$" : 'Upgrade to Level %{level} (%{costs}$)'

    if(level === 3) {
      upgradeMessage = 'Max level %{level} reached.'
      upgradeMessage = Utils.interpolate(upgradeMessage, { level: level, costs: costs })
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
          this.tower.removeRange()
          PopUp.notify('Too expensive!')
        }
        upgradeMessage = Utils.interpolate(upgradeMessage, { level: level + 1, costs: costs })
      }.bind(this)
    }

    upgrade.appendChild(
      document.createTextNode(Utils.interpolate(upgradeMessage, { level: level + 1, costs: costs }))
    )
    upgrade.className = 'upgrade'

    return upgrade
  }

  var buildStatsMenu = function() {
    var fields = ['%{range}', '%{damage} (%{damagePerSecond}dmg/s)', '1 shot/%{frequency}s']
      , stats  = this.tower.getStats()
      , result = document.createElement('li')
      , ul     = document.createElement('ul')

    for(var i = 0, j = fields.length; i < j; ++i) {
      var li = document.createElement('li')
      li.innerHTML = Utils.interpolate(fields[i], stats)
      li.className = "stats-" + fields[i].match(/%\{(.*?)\}/)[1]
      ul.appendChild(li)
    }

    result.appendChild(ul)
    result.className = "nested"

    return result
  }

  var buildSellMenu = function() {
    var sell        = document.createElement('li')
      , level       = this.tower.level
      , costs       = Tower.TYPES[this.tower.type].costs[level] / 2
      , sellMessage = Utils.interpolate('Sell: %{costs}$', { costs: costs })

    sell.appendChild(document.createTextNode(sellMessage))

    sell.onclick = function() {
      this.player.sell(this.tower)
      this.tower.cell.setType(GridCell.TYPES.INACCESSABLE)
      this.tower.destroy()
      this.fire('tower:sold', this.tower)
    }.bind(this)

    sell.className = 'sell'

    return sell
  }

  window.TowerMetaMenu = TowerMetaMenu
})()
