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
      var intervalId = null

      this.game.player.on('killed', function() {
        clearInterval(intervalId)
      })

      monster.on('killed', function() {
        clearInterval(intervalId)
        this.game.player.earn(monster.options.revenue)
        this.game.player.recordStat('killedMonsters', 1)
      }.bind(this))

      monster.on('goal:reached', function() {
        this.game.player.hurt()
      }.bind(this))

      monster.on('move', function() {
        if(intervalId) {
          clearInterval(intervalId)
        }

        intervalId = setInterval(function() {
          this.game.towers.forEach(function(tower) {
            tower.checkDistanceTo(monster)
          })
        }.bind(this), 100)
      }.bind(this))
    }.bind(this))

    this.game.player.on('killed', function() {
      wave.stop()
    }.bind(this))

    var spawnWave = function() {
      var spawnIsAllowed = (document.getElementById('wave-duration').className || "").indexOf('disabled') === -1

      if(spawnIsAllowed) {
        wave.forceSpawn()
      }
    }

    this.game.on('wave:spawn', spawnWave)

    wave.on('spawned', function() {
      this.game.off('wave:spawn', spawnWave)
    }.bind(this))

    wave.on('timer:disabled', function() {
      this.game.disableForcedSpawn()
    }.bind(this))

    wave.on('timer:enabled', function() {
      this.game.enableForcedSpawn()
    }.bind(this))
  }

  var observePlayer = function() {
    this.game.player.on('killed', function() {
      var ul = Utils.createDomNode('ul', { className: 'game-over' })

      ul.appendChild(Utils.createDomNode('li', { value: 'Oh my gosh, you died!' }))
      ul.appendChild(Utils.createDomNode('li'))
      ul.appendChild(Utils.createDomNode('li', { value: "Spent money: " + this.game.player.stats.spentMoney + '$' }))
      ul.appendChild(Utils.createDomNode('li', { value: "Earned money: " + this.game.player.stats.earnedMoney + '$' }))
      ul.appendChild(Utils.createDomNode('li', { value: "Killed monsters: " + this.game.player.stats.killedMonsters }))
      ul.appendChild(Utils.createDomNode('li', { value: "Upgraded towers: " + this.game.player.stats.upgradedTowers }))

      var link = Utils.createDomNode('li')
      link.appendChild(Utils.createDomNode('a', {
        value: 'Restart the game!',
        href: '#',
        onclick: function() { window.location.reload() }
      }))
      ul.appendChild(link)

      PopUp.notify(ul, { sticky: true })
    }.bind(this))
  }

  var observeGridCellClicks = function() {
    this.game.grid.cells.forEach(function(cellGroup) {
      cellGroup.forEach(function(cell) {
        cell.on('click', function() {
          unselectGridCell.call(this)

          switch(cell.type) {
            case GridCell.TYPES.INACCESSABLE:
              onAccessibleCellClick.call(this, cell)
              break
            case GridCell.TYPES.TOWER:
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
    menu.on('tower:sold', function(menu, tower) {
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

        tower.on('upgraded', function() {
          this.game.player.recordStat('upgradedTowers', 1)
        }.bind(this))

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
      , delay = 20

    if(typeof prevWave !== 'undefined') {
      round = prevWave.round + 1
    }

    observeWave.call(this, new Wave(round, this.game.grid.path).spawn(delay))
  }

  window.EventManager = EventManager
})()
