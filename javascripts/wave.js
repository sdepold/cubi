(function() {
  var Wave = function(round, path) {
    this.round                 = round
    this.path                  = path

    this.speed                 = Monster.TYPES[this.round - 1].speed
    this.monstersToSpawn       = Monster.TYPES[this.round - 1].count
    this.spawnedMonsters       = 0
    this.monsters              = []

    this.meta                  = document.getElementById('meta-data')
    this.moveIntervalId        = null
    this.updateTimerIntervalId = null
    this.spawnTimeoutId        = null
    this.spawnTimeoutIds       = []
  }

  Utils.addObserverMethodsToClass(Wave)

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
    for(var i = 0, j = this.monstersToSpawn; i < j; i++) {
      this.spawnTimeoutIds.push(
        setTimeout(spawnMonster.bind(this), this.speed * i)
      )
    }

    this.on('monster:spawned', move.bind(this))

    this.on('spawned', function() {
      this.moveIntervalId = setInterval(move.bind(this), this.speed)
    }.bind(this))
  }

  var createMonster = function() {
    return new Monster(this.path, Monster.TYPES[this.round - 1].name)
    // return new Giant().render()
  }

  var spawnMonster = function() {
    var monster = createMonster.call(this)

    var removeMonster = function() {
      this.monsters = this.monsters.filter(function(_monster) {
        return _monster !== monster
      })

      if((this.monsters.length === 0) && (this.spawnedMonsters === this.monstersToSpawn)) {
        this.fire('cleared')
      }
    }

    monster.on('killed', removeMonster.bind(this))
    monster.on('goal:reached', removeMonster.bind(this))

    this.monsters.push(monster)

    this.fire('monster:spawned', [ monster ])

    this.spawnedMonsters = this.spawnedMonsters + 1

    if(this.spawnedMonsters === this.monstersToSpawn) {
      this.fire('spawned')
    }
  }

  window.Wave = Wave
})()
