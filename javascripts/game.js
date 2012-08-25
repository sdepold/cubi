(function() {
  Game = function(canvasSelector, options) {
    this.options = Utils.merge({
      rows:         10,
      cols:         10,
      waveDuration: 20 * 1000
    }, options || {})

    this.canvas   = document.querySelector(canvasSelector)
    this.grid     = new Grid(this.options.rows, this.options.cols, this.canvas)
    this.meta     = document.createElement('div')
    this.player   = new Player(canvasSelector, this.meta)

    this.player.on('died', function() {
      alert('Hmm... there you go :(')
      this.pause()
    }.bind(this))

    this.monsters = []
    this.towers   = []
    this.wave     = -1

    this.nextWaveStartsAt = null
    this.towerMenu        = null
  }

  Game.prototype.render = function(options) {
    this.grid.render()
    this.player.render()

    this.meta.id = 'meta-data'
    document.body.appendChild(this.meta)

    waitUntilNextWaveStart.call(this, this.spawnNextWave.bind(this))

    updateWaveDuration.call(this)
    setInterval(updateWaveDuration.bind(this), 1000)

    observeGridCellClicks.call(this)

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

  Game.prototype.spawnNextWave = function() {
    this.wave++
    this.monsters[this.wave] = generateMonsters.call(this)
    moveMonsters.call(this)
  }

  // private

  var waitUntilNextWaveStart = function(callback) {
    this.nextWaveStartsAt = this.nextWaveStartsAt || (+new Date() + 5000)

    setTimeout(function() {
      if(!this.player.isDead()) {
        callback()
        this.nextWaveStartsAt = (+new Date() + this.options.waveDuration)
        waitUntilNextWaveStart.call(this, callback)
      }
    }.bind(this), Math.abs(+new Date() - this.nextWaveStartsAt))
  }

  var updateWaveDuration = function() {
    var container = document.getElementById('wave-duration')

    if(!container) {
      container = document.createElement('span')
      container.id = 'wave-duration'

      this.meta.appendChild(container)
    }

    var nextStart = Math.ceil(Math.abs(+new Date() - this.nextWaveStartsAt) / 1000)
      , message   = 'Wave #' + (this.wave + 2) + ' starts in ' + nextStart + 's'

    container.innerHTML = message
  }

  var generateMonsters = function() {
    var self     = this
      , speed    = Math.max(250, ~~(Math.random() * 1000))
      , monsters = []

    for(var i = 0; i < ((this.wave + 1) * 10); i++) {
      var monster = new Monster(this.grid.path, {
        speed: speed
      })

      monster.on('goal:reached', this.player.hurt.bind(this.player))
      monster.on('move', function() {
        checkTowerDistances.call(self, this)
      })
      monster.on('die', function() {
        self.monsters = self.monsters.filter(function(_monster) {
          return _monster !== monster
        })
        self.player.earn(monster.options.revenue)
      })

      monsters.push(monster)
    }

    return monsters
  }

  var observeGridCellClicks = function() {
    var self = this

    this.grid.cells.forEach(function(cellGroup) {
      cellGroup.forEach(function(cell) {
        cell.on('click', function() {
          switch(this.type) {
            case GridCell.INACCESSABLE:
              initTowerMenu.call(self, this)
              removeTowerRanges.call(self)
              break
            case GridCell.TOWER:
              removeTowerRanges.call(self)

              if(self.menu) {
                self.menu.remove()
                self.menu = null
              }

              var tower = self.getTowerByGridCell(this)
                , menu  = new TowerMetaMenu(tower, self.player)

              tower.renderRange();
              menu.render()
              menu.on('tower:sold', function(tower) {
                removeTowerRanges.call(self)
                self.towers = self.towers.filter(function(_tower) {
                  return _tower !== tower
                })
                clearMenus.call(this)
              })

              break
          }
        })
      })
    })
  }

  var removeTowerRanges = function() {
    this.towers.forEach(function(tower) {
      tower.removeRange()
    })
  }

  var clearMenus = function() {
    if(this.menu) {
      this.menu.remove()
    }

    document.querySelectorAll('.menu').forEach(function(menu) {
      document.body.removeChild(menu)
    })
  }

  var initTowerMenu = function(cell) {
    var self = this

    clearMenus.call(this)

    if(cell.hasClassName('tower')) {
      return
    }

    this.menu = new TowerMenu(cell).render()
    this.menu.on('select', function(towerType) {
      if(self.player.canBuy(towerType)) {
        var tower = new Tower(towerType, cell).render()

        self.player.buy(towerType)
        self.towers.push(tower)

        cell.fire('click')
      } else {
        alert('too expensive!')
      }
    })
  }

  var checkTowerDistances = function(monster) {
    this.towers.forEach(function(tower) {
      tower.checkDistanceTo(monster)
    })
  }

  var moveMonsters = function() {
    this.monsters[this.wave].forEach(function(monster, i) {
      setTimeout(function() {
        monster.initMoving()
      }, i * 2 * monster.options.speed)
    })
  }
})()
