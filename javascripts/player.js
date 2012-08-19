(function() {
  Player = function(canvasSelector) {
    this.life   = 20
    this.cash   = 1000
    this.dom    = document.createElement('div')
    this.canvas = document.querySelectorAll(canvasSelector)[0]
  }

  Player.prototype.render = function() {
    if(this.dom.parentNode === null) {
      this.canvas.appendChild(this.dom)
    }

    renderLife.call(this)
    renderCash.call(this)
  }

  Player.prototype.canBuy = function(towerType, level) {
    level = (typeof level === 'undefined') ? 0 : level
    return (this.cash >= Tower.TYPES[towerType].costs[level])
  }

  Player.prototype.buy = function(towerType, level) {
    level = (typeof level === 'undefined') ? 0 : level

    this.cash -= Tower.TYPES[towerType].costs[level]
    this.render()
  }

  Player.prototype.earn = function(money) {
    this.cash += money
    this.render()
  }

  Player.prototype.sell = function(tower) {
    this.cash += tower.getPrice()
    render()
  }

  Player.prototype.hurt = function() {
    this.life--
    this.render()
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

    lifeContainer.innerHTML = this.life.toString() + ' / 20'
  }

  var renderCash = function() {
    var cashContainer = document.getElementById('cash')

    if(!cashContainer) {
      cashContainer = document.createElement('span')
      cashContainer.id = 'cash'
      this.dom.appendChild(cashContainer)
    }

    cashContainer.innerHTML = this.cash
  }
})()
