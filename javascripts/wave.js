(function() {
  var Wave = function(round, path) {
    this.round                 = round
    this.path                  = path

    this.spawnedMonsters       = 0
    this.monsters              = []

    this.meta                  = document.getElementById('meta-data')
    this.moveIntervalId        = null
    this.updateTimerIntervalId = null
    this.spawnTimeoutId        = null
    this.spawnTimeoutIds       = []
  }

  Utils.addObserverMethodsToClass(Wave)

  Wave.ROUNDS = [
    {
      monsters: [ 'beast' ],
      monsterCount: 10
    }, {
      monsters: [ 'scout-lite' ],
      monsterCount: 50
    }, {
      monsters: [ 'amphibian-lite' ],
      monsterCount: 20
    }, {
      monsters: [ 'scout-mid' ],
      monsterCount: 50
    }, {
      monsters: [ 'mech-lite' ],
      monsterCount: 30
    }, {
      monsters: [ 'mech-mid' ],
      monsterCount: 25
    }, {
      monsters: [ 'mech-heavy' ],
      monsterCount: 20
    }, {
      monsters: [ 'scout-heavy' ],
      monsterCount: 100
    }, {
      monsters: [ 'tank-lite' ],
      monsterCount: 30
    }, {
      monsters: [ 'tank-lite-2' ],
      monsterCount: 20
    }, {
      monsters: [ 'tank-mid' ],
      monsterCount: 10
    }, {
      monsters: [ 'tank-laser' ],
      monsterCount: 10
    }, {
      monsters: [ 'tank-heavy' ],
      monsterCount: 5
    }
  ]

  Wave.prototype.spawn = function(delay) {
    drawTimer.call(this, delay)

    this.spawnTimeoutId = setTimeout(function() {
      spawnMonsters.call(this)
    }.bind(this), delay * 1000)

    return this
  }

  Wave.prototype.stop = function() {
    this.spawnTimeoutIds.forEach(function(id) {
      clearTimeout(id)
    })

    clearInterval(this.moveIntervalId)
    clearInterval(this.spawnTimeoutId)
    clearInterval(this.updateTimerIntervalId)
  }

  Wave.prototype.forceSpawn = function() {
    clearTimeout(this.spawnTimeoutId)
    clearInterval(this.updateTimerIntervalId)
    setTimerContainerText.call(this, 0)
    spawnMonsters.call(this)
  }

  Wave.prototype.getRoundOptions = function() {
    var result = this.roundOptions

    if(!result) {
      result = this.roundOptions = Wave.ROUNDS[this.round - 1]
    }

    return result
  }

  Wave.prototype.getTotalMonsterCount = function() {
    var result = this._totalMonsterCount

    if(!result) {
      this._totalMonsterCount = 0

      if(this.getRoundOptions().monsters) {
        this._totalMonsterCount += this.getRoundOptions().monsters.length * this.getRoundOptions().monsterCount
      }

      if(this.getRoundOptions().giants) {
        this._totalMonsterCount += this.getRoundOptions().giants.length * this.getRoundOptions().giantCount
      }

      result = this._totalMonsterCount
    }

    return result
  }

  // private

  var move = function() {
    this.monsters.forEach(function(monster) {
      monster.move()
    })
  }

  var drawTimer = function(countDownFrom) {
    var then = +new Date

    this.updateTimerIntervalId = setInterval(function() {
      var now  = +new Date()
        , diff = Math.ceil(Math.abs(then - now) / 1000)

      if(diff > countDownFrom) {
        clearInterval(this.updateTimerIntervalId)
      } else {
        setTimerContainerText.call(this, countDownFrom - diff)
      }
    }.bind(this), 100)
  }

  var getTimerContainer = function() {
    var container = document.getElementById('wave-duration')

    if(!container) {
      container = document.createElement('span')
      container.id = 'wave-duration'

      this.meta.appendChild(container)
    }

    return container
  }

  var setTimerContainerText = function(seconds) {
    var container = getTimerContainer.call(this)
      , message   = Utils.needsReducedLayout() ? "#%{wave}: %{seconds}s" : "Wave #%{wave} starts in %{seconds}s"

    if(seconds === 0) {
      setTimerContainerClass.call(this, 'disabled')
      this.fire('timer:disabled')
    } else {
      setTimerContainerClass.call(this, '')
      this.fire('timer:enabled')
    }

    container.innerHTML = Utils.interpolate(message, {
      wave: this.round,
      seconds: seconds
    })
  }

  var setTimerContainerClass = function(classes) {
    classes = Array.isArray(classes) ? classes : [classes]
    getTimerContainer.call(this).className = classes.join(' ')
  }

  var spawnMonsters = function() {
    var roundData = this.getRoundOptions()

    roundData.monsters.forEach(function(monsterType) {
      var monsterSpeed = Monster.getTypeByName(monsterType).speed

      for(var i = 0, j = roundData.monsterCount; i < j; i++) {
        this.spawnTimeoutIds.push(
          setTimeout(function() {
            spawnMonster.call(this, monsterType)
          }.bind(this), monsterSpeed * i)
        )
      }

      this.on('monster:spawned', move.bind(this))

      this.on('spawned', function() {
        this.moveIntervalId = setInterval(move.bind(this), monsterSpeed)
      }.bind(this))
    }.bind(this))
  }

  var createMonster = function(monsterType) {
    return new Monster(this.path, monsterType)
    // return new Giant().render()
  }

  var spawnMonster = function(monsterType) {
    var monster = createMonster.call(this, monsterType)

    var removeMonster = function() {
      this.monsters = this.monsters.filter(function(_monster) {
        return _monster !== monster
      })

      if((this.monsters.length === 0) && (this.spawnedMonsters === this.getTotalMonsterCount())) {
        this.fire('cleared')
      }
    }

    monster.on('killed', removeMonster.bind(this))
    monster.on('goal:reached', removeMonster.bind(this))

    this.monsters.push(monster)

    this.fire('monster:spawned', [ monster ])

    this.spawnedMonsters = this.spawnedMonsters + 1

    if(this.spawnedMonsters === this.getTotalMonsterCount()) {
      this.fire('spawned')
    }
  }

  window.Wave = Wave
})()
