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
      monsterType: 'beast',
      monsterCount: 10
    }, {
      monsterType: 'scout-lite',
      monsterCount: 50
    }, {
      monsterType: 'amphibian-lite',
      monsterCount: 20
    }, {
      monsterType: 'scout-mid',
      monsterCount: 50
    }, {
      monsterType: 'mech-lite',
      monsterCount: 30
    }, {
      monsterType: 'mech-mid',
      monsterCount: 25
    }, {
      monsterType: 'mech-heavy',
      monsterCount: 20
    }, {
      monsterType: 'scout-heavy',
      monsterCount: 100
    }, {
      monsterType: 'tank-lite',
      monsterCount: 30
    }, {
      monsterType: 'tank-lite-2',
      monsterCount: 20
    }, {
      monsterType: 'tank-mid',
      monsterCount: 10
    }, {
      monsterType: 'tank-laser',
      monsterCount: 10
    }, {
      monsterType: 'tank-heavy',
      monsterCount: 5
    }, {
      monsterType: 'beast',
      monsterCount: 100,
      giantType: 'airship',
      giantCount: 1
    }
  ]

  Wave.prototype.spawn = function(delay) {
    drawTimer.call(this, delay)

    this.spawnTimeoutId = setTimeout(spawnMonsters.bind(this), delay * 1000)

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

      if(this.getRoundOptions().monsterCount) {
        this._totalMonsterCount += this.getRoundOptions().monsterCount
      }

      if(this.getRoundOptions().giantCount) {
        this._totalMonsterCount += this.getRoundOptions().giantCount
      }

      result = this._totalMonsterCount
    }

    return result
  }

  // private

  var move = function(klass) {
    this.monsters.forEach(function(monster) {
      if(!klass || monster instanceof klass) {
        monster.move()
      }
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

    if(roundData.monsterType) {
      var monsterSpeed = Monster.getTypeByName(roundData.monsterType).speed
      spawnMonsterType.call(this, roundData.monsterType, roundData.monsterCount, monsterSpeed)

      this.on('monster:spawned', function() {
        move.call(this, Monster)
      }.bind(this))

      this.on('spawned', function() {
        this.moveIntervalId = setInterval(move.bind(this), monsterSpeed)
      }.bind(this))
    }

    if(roundData.giantType) {
      var giantSpeed = 10 * 1000

      spawnMonsterType.call(this, roundData.giantType, roundData.giantCount, giantSpeed)

      this.on('giant:spawned', function() {
        move.call(this, Giant)
      }.bind(this))
    }
  }

  var spawnMonsterType = function(type, count, speed) {
    for(var i = 0, j = count; i < j; i++) {
      this.spawnTimeoutIds.push(
        setTimeout(function() {
          spawnMonster.call(this, type)
        }.bind(this), speed * i)
      )
    }
  }

  var createMonster = function(monsterType) {
    if((this.getRoundOptions().monsterType || '') === monsterType) {
      return new Monster(this.path, monsterType)
    } else {
      return new Giant(monsterType).render()
    }
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

    if(monster instanceof Monster) {
      this.fire('monster:spawned', [ monster ])
    } else {
      this.fire('giant:spawned', [ monster ])
    }

    this.spawnedMonsters = this.spawnedMonsters + 1

    if(this.spawnedMonsters === this.getTotalMonsterCount()) {
      this.fire('spawned')
    }
  }

  window.Wave = Wave
})()
