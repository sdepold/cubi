(function() {
  var Game = function(canvasSelector, options) {
    this.options = Utils.merge({
      rows:         10,
      cols:         10,
      waveDuration: 20 * 1000
    }, options || {})

    this.canvas       = document.querySelector(canvasSelector)
    this.meta         = document.createElement('div')
    this.grid         = new Grid(this.options.rows, this.options.cols, this.canvas)
    this.player       = new Player(canvasSelector, this.meta)
    this.eventManager = new EventManager(this)

    this.monsters = []
    this.towers   = []

    Utils.addObserverMethods(this)
  }

  Game.prototype.render = function(options) {
    this.grid.render()
    this.player.render()
    this.meta.id = 'meta-data'

    document.body.appendChild(this.meta)

    this.eventManager.init()


    this.fire('rendered')

    return this
  }

  Game.prototype.pause = function() {
    this.monsters.forEach(function(wave) {
      wave.forEach(function(monster) {
        monster.stop()
      })
    })
  }

  Game.prototype.continue = function() {
    this.monsters.forEach(function(wave) {
      wave.forEach(function(monster) {
        monster.initMoving()
      })
    })
  }

  Game.prototype.getTowerByGridCell = function(cell) {
    var towers = this.towers.filter(function(tower) {
      return tower.cell === cell
    })

    return (towers.length === 1) ? towers[0] : null
  }

  window.Game = Game
})()
