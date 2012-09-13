(function() {
  var Player = function(canvasSelector, metaDataContainer) {
    this.life   = 13
    this.cash   = 1000
    this.dom    = metaDataContainer
    this.canvas = document.querySelectorAll(canvasSelector)[0]
    this.stats  = {
      spentMoney:     0,
      earnedMoney:    0,
      killedMonsters: 0,
      upgradedTowers: 0,
      highscore:      0
    }
  }

  Utils.addObserverMethodsToClass(Player)

  Player.prototype.isDead = function() {
    return this.life === 0
  }

  Player.prototype.render = function() {
    if(this.dom.parentNode === null) {
      this.canvas.appendChild(this.dom)
    }

    renderLife.call(this)
    renderCash.call(this)
  }

  Player.prototype.recordStat = function(stat, value) {
    this.stats[stat] += value
  }

  Player.prototype.canBuy = function(towerType, level) {
    level = (typeof level === 'undefined') ? 0 : level
    return (this.cash >= window.Tower.TYPES[towerType].costs[level])
  }

  Player.prototype.buy = function(towerType, level) {
    level = (typeof level === 'undefined') ? 0 : level

    var costs = window.Tower.TYPES[towerType].costs[level]

    this.cash -= costs
    this.recordStat('spentMoney', costs)
    this.render()
  }

  Player.prototype.earn = function(money) {
    this.cash += money
    this.recordStat('earnedMoney', money)
    this.render()
  }

  Player.prototype.sell = function(tower) {
    this.earn(tower.getPrice() / 2)
  }

  Player.prototype.hurt = function() {
    this.life--
    this.render()

    if(this.life === 0) {
      this.fire('killed')
    }
  }

  Player.prototype.heal = function() {
    this.life++
    this.render()
  }

  // private

  var renderLife = function() {
    var lifeContainer = document.getElementById('life')

    if(!lifeContainer) {
      lifeContainer = document.createElement('span')
      lifeContainer.id = 'life'
      this.dom.appendChild(lifeContainer)
    }

    lifeContainer.innerHTML = 'HP: ' + this.life.toString() + '|13'
  }

  var renderCash = function() {
    var cashContainer = document.getElementById('cash')
      , template      = Utils.needsReducedLayout() ? '$%{cash}' : "Cash: %{cash}$"

    if(!cashContainer) {
      cashContainer = document.createElement('span')
      cashContainer.id = 'cash'
      this.dom.appendChild(cashContainer)
    }

    cashContainer.innerHTML = Utils.interpolate(template, { cash: this.cash })
  }

  window.Player = Player
})()
