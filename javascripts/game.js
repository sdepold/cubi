(function() {
  var Game = function(canvasSelector, options) {
    this.options = Utils.merge({
      rows:         10,
      cols:         10
    }, options || {})

    this.canvas           = document.querySelector(canvasSelector)
    this.meta             = Utils.createDomNode('div', {id: 'meta-data'})
    this.grid             = new Grid(this.options.rows, this.options.cols, this.canvas)
    this.player           = new Player(canvasSelector, this.meta)
    this.eventManager     = new EventManager(this)
    this.towers           = []

    Utils.addClassName(this.canvas, Game.THEMES[0])
  }

  Utils.addObserverMethodsToClass(Game)

  Game.THEMES = ['grass']

  Game.prototype.render = function(options) {
    this.grid.render()
    this.player.render()

    document.body.appendChild(this.meta)
    drawForceSpawnMenu.call(this)

    this.eventManager.init()

    this.fire('rendered')

    return this
  }

  Game.prototype.getTowerByGridCell = function(cell) {
    var towers = this.towers.filter(function(tower) {
      return tower.cell === cell
    })

    return (towers.length === 1) ? towers[0] : null
  }

  Game.prototype.disableForcedSpawn = function() {
    getForceSpawnMenu.call(this).className = 'disabled'
  }

  Game.prototype.enableForcedSpawn = function() {
    getForceSpawnMenu.call(this).className = ''
  }

  // private

  var getForceSpawnMenu = function() {
    var container = document.getElementById('force-next-wave')

    if(!container) {
      container = this.meta.appendChild(
        Utils.createDomNode('span', {id: 'force-next-wave'})
      )
    }

    return container
  }

  var drawForceSpawnMenu = function() {
    var container = getForceSpawnMenu.call(this)
      , message   = Utils.needsReducedLayout() ? 'Next wave' : "Force next wave"

    container.innerHTML = message
    container.onclick = function() {
      this.fire('wave:spawn')
    }.bind(this)
  }

  window.Game = Game
})()
