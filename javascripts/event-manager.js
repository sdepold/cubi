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
      if(wave.round !== Wave.ROUNDS.length) {
        spawnNewWave.call(this, wave)
      }
    }.bind(this))

    var onMonsterSpawn = function(wave, monster) {
      var intervalId = null

      this.game.player.on('killed', function() {
        clearInterval(intervalId)
      })

      this.game.player.on('won', function() {
        clearInterval(intervalId)
      })

      monster.on('killed', function() {
        clearInterval(intervalId)
        this.game.player.earn(monster.getRevenue())
        this.game.player.recordStat('killedMonsters', 1)
        this.game.player.recordStat('highscore', ~~(this.game.player.cash * this.game.player.life / 1000))
      }.bind(this))

      monster.on('goal:reached', function() {
        this.game.player.hurt()
      }.bind(this))

      monster.on('move', function() {
        if(intervalId) {
          clearInterval(intervalId)
        }

        intervalId = setInterval(function() {
          if(this.game.player.isDead()) {
            clearInterval(intervalId)
            return
          }

          this.game.towers.forEach(function(tower) {
            tower.checkDistanceTo(monster)
          })
        }.bind(this), 100)
      }.bind(this))
    }

    wave.on('monster:spawned', onMonsterSpawn.bind(this))
    wave.on('giant:spawned', onMonsterSpawn.bind(this))

    this.game.player.on('killed', function() {
      wave.stop()
    }.bind(this))

    this.game.player.on('won', function() {
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

    if(wave.round === Wave.ROUNDS.length) {
      wave.on('cleared', function() {
        this.game.player.fire('won')
      }.bind(this))
    }
  }

  var observePlayer = function() {
    this.game.player.on('killed', function() {
      new PopUp.GameOver('Oh my gosh, you died!', this.game.player.stats).render()
    }.bind(this))

    this.game.player.on('won', function() {
      document.querySelectorAll('.monster').forEach(function(monster) {
        monster.className = monster.className.replace('monster', 'path')
      })
      new PopUp.GameOver("You've won the match!", this.game.player.stats).render()
    }.bind(this))
  }

  var observeGridCellClicks = function() {
    this.game.grid.cells.forEach(function(cellGroup) {
      cellGroup.forEach(function(cell) {
        cell.on('click', function() {
          unselectGridCell.call(this)

          switch(cell.type) {
            case GridCell.TYPES.ACCESSIBLE:
              onAccessibleCellClick.call(this, cell)
              break
            case GridCell.TYPES.TOWER:
              onTowerCellClick.call(this, cell)
              break
            default:
              clearMenus()
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

  var showGameEndDialog = function(headline) {

    var template = document.getElementById('highscore-template').innerHTML
      , div      = document.createElement('div')

    template = template.replace('%{spentMoney}', this.game.player.stats.spentMoney)
                       .replace('%{earnedMoney}', this.game.player.stats.earnedMoney)
                       .replace('%{killedMonsters}', this.game.player.stats.killedMonsters)
                       .replace('%{killedMonsters}', this.game.player.stats.killedMonsters)
                       .replace('%{upgradedTowers}', this.game.player.stats.upgradedTowers)
                       .replace('%{upgradedTowers}', this.game.player.stats.upgradedTowers)
                       .replace('%{highscore}', this.game.player.stats.highscore)

    div.innerHTML = template

    PopUp.notify(div, { sticky: true })
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
      Utils.removeClassName(selected, 'selected')
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
        menu.remove()
        PopUp.notify('Too expensive!')
      }
    }.bind(this))
  }

  var spawnNewWave = function(prevWave) {
    var round = 1
      , delay = 13

    if(typeof prevWave !== 'undefined') {
      round = prevWave.round + 1
    }

    observeWave.call(this, new Wave(round, this.game.grid.path).spawn(delay))
  }

  window.EventManager = EventManager
})()
