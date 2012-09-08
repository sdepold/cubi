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
      showGameEndDialog.call(this, 'Oh my gosh, you died!')
    }.bind(this))

    this.game.player.on('won', function() {
      document.querySelectorAll('.monster').forEach(function(monster) {
        monster.className = monster.className.replace('monster', 'path')
      })
      showGameEndDialog.call(this, "Woot woot! You've won the match!")
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

  var showGameEndDialog = function(headline) {
    var div = document.createElement('div')
      , ul  = Utils.createDomNode('ul', { className: 'game-over' })

    ul.appendChild(Utils.createDomNode('li', { value: headline }))
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

    div.appendChild(ul)

    div.appendChild(Utils.createDomNode('a', {
      href: 'https://twitter.com/share',
      className: 'twitter-share-button',
      'data-url': 'http://cubi.depold.com',
      'data-text': "Just played Cubi by @sdepold and killed " + this.game.player.stats.killedMonsters + " monsters :) Give it a try!",
      'data-count': "horizontal",
      value: 'Tweet'
    }))
    div.appendChild(Utils.createDomNode('iframe', {
      src: 'http://www.facebook.com/plugins/like.php?href=http://cubi.depold.com/&amp;send=false&amp;layout=button_count&amp;width=110&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font=segoe+ui&amp;height=21',
      scrolling: 'no',
      frameborder: '0',
      style: {
        border: 'none',
        overflow: 'hidden',
        width: '130px',
        height: '21px'
      },
      allowTransparency: 'true'
    }))
    div.appendChild(Utils.createDomNode('g:plusone', {
      size: 'medium',
      href: 'http://cubi.depold.com'
    }))

    document.body.appendChild(Utils.createDomNode('script', {
      type: 'text/javascript',
      src: 'https://apis.google.com/js/plusone.js'
    }))

    document.body.appendChild(Utils.createDomNode('script', {
      type: 'text/javascript',
      src: 'http://platform.twitter.com/widgets.js'
    }))

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
        var selected = document.querySelector('.selected')
        selected.className = selected.className.replace('selected', '')
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
