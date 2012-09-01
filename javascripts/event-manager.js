(function() {
  var EventManager = function(game) {
    this.game = game
  }

  EventManager.prototype.init = function() {
    observePlayer.call(this)
    observeGridCellClicks.call(this)
    observeGameRendering.call(this)
  }

  /////////////////////////
  // private - observers //
  /////////////////////////

  var observeGameRendering = function() {
    this.game.on('rendered', function() {
      spawnNewWave.call(this)
    }.bind(this))
  }

  var observeWave = function(wave) {
    wave.on('spawned', function() {
      spawnNewWave.call(this, wave)
    }.bind(this))

    wave.on('monster:spawned', function(wave, monster) {
      monster.on('die', function() {
        this.game.player.earn(monster.options.revenue)
      }.bind(this))

      monster.on('goal:reached', function() {
        this.game.player.hurt()
      }.bind(this))

      monster.on('move', function() {
        this.game.towers.forEach(function(tower) {
          tower.checkDistanceTo(monster)
        })
      }.bind(this))
    }.bind(this))

    this.game.player.on('killed', function() {
      wave.stop()
    }.bind(this))
  }

  var observePlayer = function() {
    this.game.player.on('killed', function() {
      PopUp.notify('Oh my gosh, you died!', { sticky: true })
    }.bind(this))
  }

  var observeGridCellClicks = function() {
    this.game.grid.cells.forEach(function(cellGroup) {
      cellGroup.forEach(function(cell) {
        cell.on('click', function() {
          unselectGridCell.call(this)

          switch(cell.type) {
            case GridCell.INACCESSABLE:
              onAccessibleCellClick.call(this, cell)
              break
            case GridCell.TOWER:
              onTowerCellClick.call(this, cell)
              break
          }
        }.bind(this))
      }.bind(this))
    }.bind(this))
  }

  ///////////////////////////////
  // private - event reactions //
  ///////////////////////////////

  var onAccessibleCellClick = function(cell) {
    initTowerMenu.call(this, cell)
    removeTowerRanges.call(this)
  }

  var onTowerCellClick = function(cell) {
    removeTowerRanges.call(this)

    var tower = this.game.getTowerByGridCell(cell)
      , menu  = new TowerMetaMenu(tower, this.game.player)

    tower.renderRange()

    menu.render()
    menu.on('tower:sold', function(tower) {
      removeTowerRanges.call(this)
      this.game.towers = this.game.towers.filter(function(_tower) {
        return _tower !== tower
      })
      clearMenus()
    }.bind(this))
  }

  /////////////////////
  // private - logic //
  /////////////////////

  var removeTowerRanges = function() {
    this.game.towers.forEach(function(tower) {
      tower.removeRange()
    })
  }

  var unselectGridCell = function() {
    var selected = document.querySelector('.selected')
    if(selected) {
      selected.className = selected.className.split(' ').filter(function(klass) {
        return klass != 'selected'
      })
    }
  }

  var clearMenus = function() {
    window.currentPopUp && window.currentPopUp.close()
  }

  var initTowerMenu = function(cell) {
    clearMenus()

    if(cell.hasClassName('tower')) {
      return
    }

    new TowerMenu(cell).render().on('select', function(menu, towerType) {
      if(this.game.player.canBuy(towerType)) {
        var tower = new Tower(towerType, cell).render()

        this.game.player.buy(towerType)
        this.game.towers.push(tower)

        cell.fire('click')
      } else {
        PopUp.notify('Too expensive!')
      }
    }.bind(this))
  }

  var spawnNewWave = function(prevWave) {
    var round = 1
      , delay = 5

    if(typeof prevWave !== 'undefined') {
      round = prevWave.round + 1
      delay = 20
    }

    observeWave.call(this, new Wave(round, this.game.grid.path).spawn(delay))
  }

  window.EventManager = EventManager
})()
