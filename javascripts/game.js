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
  }

  Game.prototype.render = function(options) {
    this.grid.render()
    this.player.render()
    this.meta.id = 'meta-data'

    this.eventManager.init()

    document.body.appendChild(this.meta)

    var spawnNewWave = function() {
      new Wave(this.round + 1, this.path).spawn(20).on('spawned', spawnNewWave)
    }

    new Wave(1, this.grid.path).spawn(5).on('spawned', spawnNewWave)

    // waitUntilNextWaveStart.call(this, this.spawnNextWave.bind(this))

    // updateWaveDuration.call(this)
    // setInterval(updateWaveDuration.bind(this), 1000)

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

  // Game.prototype.spawnNextWave = function() {
  //   this.wave++
  //   this.monsters[this.wave] = generateMonsters.call(this)
  //   moveMonsters.call(this)
  // }

  // private

  // var waitUntilNextWaveStart = function(callback) {
  //   this.nextWaveStartsAt = this.nextWaveStartsAt || (+new Date() + 5000)

  //   setTimeout(function() {
  //     if(!this.player.isDead()) {
  //       callback()
  //       this.nextWaveStartsAt = (+new Date() + this.options.waveDuration)
  //       waitUntilNextWaveStart.call(this, callback)
  //     }
  //   }.bind(this), Math.abs(+new Date() - this.nextWaveStartsAt))
  // }

  // var updateWaveDuration = function() {
  //   var container = document.getElementById('wave-duration')

  //   if(!container) {
  //     container = document.createElement('span')
  //     container.id = 'wave-duration'

  //     this.meta.appendChild(container)
  //   }

  //   var nextStart = Math.ceil(Math.abs(+new Date() - this.nextWaveStartsAt) / 1000)
  //     , message   = 'Wave #' + (this.wave + 2) + ' starts in ' + nextStart + 's'

  //   container.innerHTML = message
  // }

  // var generateMonsters = function() {
  //   var self     = this
  //     , speed    = Math.max(250, ~~(Math.random() * 1000))
  //     , monsters = []

  //   for(var i = 0; i < ((this.wave + 1) * 10); i++) {
  //     var monster = new Monster(this.grid.path, {
  //       speed: speed,
  //       health: (this.wave + 1) * 10
  //     })

  //     monster.on('goal:reached', this.player.hurt.bind(this.player))
  //     monster.on('move', function() {
  //       checkTowerDistances.call(self, this)
  //     })
  //     monster.on('die', function() {
  //       var _monsters = []
  //         , monster   = this

  //       self.monsters.forEach(function(wave) {
  //         _monsters.push(wave.filter(function(_monster) {
  //           return _monster !== monster
  //         }))
  //       })

  //       self.monsters = _monsters

  //       self.player.earn(monster.options.revenue)
  //     })

  //     monsters.push(monster)
  //   }

  //   return monsters
  // }

  // var checkTowerDistances = function(monster) {
  //   this.towers.forEach(function(tower) {
  //     tower.checkDistanceTo(monster)
  //   })
  // }

  // var moveMonsters = function() {
  //   this.monsters[this.wave].forEach(function(monster, i) {
  //     setTimeout(function() {
  //       monster.initMoving()
  //     }, i * 2 * monster.options.speed)
  //   })
  // }

  window.Game = Game
})()
