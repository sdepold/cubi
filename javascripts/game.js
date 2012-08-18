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

    initTowerMenu.call(this)
    spawnMonsters.call(this)
    moveMonsters.call(this)

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

  // private

  var initTowerMenu = function() {
    var self = this

    this.grid.cells.forEach(function(cellGroup) {
      cellGroup.filter(function(cell) {
        return cell.type !== GridCell.PATH
      }).forEach(function(cell) {
        cell.on('click', function() {
          if(self.menu) {
            self.menu.remove()
          }

          self.menu = new TowerMenu(cell).render()
          self.menu.on('select', function(towerType) {
            if(self.player.canBuy(towerType)) {
              self.player.buy(towerType)
              self.towers.push(new Tower(towerType, cell).render())
            } else {
              alert('too expensive!')
            }

            self.menu.remove()
            self.menu = null
          })
        })
      })
    })
  }

  var spawnMonsters = function() {
    var self  = this
      , speed = Math.min(250, ~~(Math.random() * 2000))

    for(var i = 0; i < 10; i++) {
      var monster = new Monster(this.grid.path, {
        speed: speed
      })

      monster.on('goal:reached', this.player.hurt.bind(this.player))
      monster.on('move', function() {
        checkTowerDistances.call(self, monster)
      })

      self.monsters.push(monster)
    }
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
