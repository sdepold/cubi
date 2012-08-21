(function() {
  Game = function(canvasSelector, options) {
    this.options = Utils.merge({
      rows: 10,
      cols: 10
    }, options || {})

    this.canvas    = document.querySelectorAll(canvasSelector)[0]
    this.grid      = new Grid(this.options.rows, this.options.cols, this.canvas)
    this.player    = new Player(canvasSelector)

    this.monsters  = []
    this.towers    = []
    this.towerMenu = null
  }

  Game.prototype.render = function(options) {
    this.grid.render()
    this.player.render()

    this.spawnMonsters()
    observeGridCellClicks.call(this)

    return this
  }

  Game.prototype.pause = function() {
    this.monsters.forEach(function(monster) {
      monster.stop()
    })
  }

  Game.prototype.continue = function() {
    this.monsters.forEach(function(monster) {
      monster.initMoving()
    })
  }

  Game.prototype.spawnMonsters = function() {
    generateMonsters.call(this)
    moveMonsters.call(this)
  }

  Game.prototype.getTowerByGridCell = function(cell) {
    var towers = this.towers.filter(function(tower) {
      return tower.cell === cell
    })

    return (towers.length === 1) ? towers[0] : null
  }

  // private

  var generateMonsters = function() {
    var self  = this
      , speed = Math.min(1000, ~~(Math.random() * 2000))

    for(var i = 0; i < 10; i++) {
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

      self.monsters.push(monster)
    }
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
              self.getTowerByGridCell(this).renderRange()
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

  var initTowerMenu = function(cell) {
    var self = this

    if(this.menu) {
      this.menu.remove()
    }

    if(cell.hasClassName('tower')) {
      return
    }

    this.menu = new TowerMenu(cell).render()
    this.menu.on('select', function(towerType) {
      if(self.player.canBuy(towerType)) {
        var tower = new Tower(towerType, cell).render()

        self.player.buy(towerType)
        self.towers.push(tower)

        tower.on('click', tower.renderRange.bind(tower))

        tower.renderRange()
      } else {
        alert('too expensive!')
      }

      self.menu.remove()
      self.menu = null
    })
  }

  var checkTowerDistances = function(monster) {
    this.towers.forEach(function(tower) {
      tower.checkDistanceTo(monster)
    })
  }

  var moveMonsters = function() {
    this.monsters.forEach(function(monster, i) {
      setTimeout(function() {
        monster.initMoving()
      }, i * 2 * monster.options.speed)
    })
  }
})()
