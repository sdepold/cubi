(function() {
  var Game = function(canvasSelector, options) {
    this.options = Utils.merge({
      rows:         10,
      cols:         10
    }, options || {})

    this.canvas           = document.querySelector(canvasSelector)
    this.metaBar          = new MetaBar()
    this.grid             = new Grid(this.options.rows, this.options.cols, this.canvas)
    this.player           = new Player(canvasSelector, this.metaBar)
    this.eventManager     = new EventManager(this)
    this.towers           = []

    Utils.addClassName(this.canvas, Game.THEMES[0])
  }

  Utils.addObserverMethodsToClass(Game)

  Game.THEMES = ['grass']

  Game.prototype.render = function(options) {
    this.grid.render()
    this.player.render()
    this.metaBar.render()

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
    this.metaBar.get('force-next-wave').className = 'disabled'
  }

  Game.prototype.enableForcedSpawn = function() {
    this.metaBar.get('force-next-wave').className = ''
  }

  // private

  var drawForceSpawnMenu = function() {
    var value = Utils.needsReducedLayout() ? 'Next wave' : "Force next wave"

    this.metaBar.add( 'force-next-wave', value, {
      onclick: function() {
        this.fire('wave:spawn')
      }.bind(this)
    })
  }

  window.Game = Game
})()
