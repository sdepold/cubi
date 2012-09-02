(function() {
  var Wave = function(round, path) {
    this.round           = round
    this.monsters        = []
    this.path            = path
    this.speed           = Math.max(250, ~~(Math.random() * 1000))

    this.monstersToSpawn = this.round * 10
    this.spawnedMonsters = 0

    this.meta            = document.getElementById('meta-data')
    this.moveIntervalId  = null
    this.updateTimerIntervalId = null
    this.spawnTimeoutId  = null
    this.spawnTimeoutIds = []
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
      var now  = +new Date
        , diff = Math.ceil(Math.abs(then - now) / 1000)

      if(diff > countDownFrom) {
        clearInterval(this.updateTimerIntervalId)
      } else {
        setTimerContainerText.call(this, countDownFrom - diff)
      }
    }.bind(this), 100)
  }

  var setTimerContainerText = function(seconds) {
    var container = document.getElementById('wave-duration')
      , message   = "Wave #%{wave} starts in %{seconds}s"

    if(!container) {
      container = document.createElement('span')
      container.id = 'wave-duration'

      this.meta.appendChild(container)
    }

    container.innerHTML = Utils.interpolate(message, {
      wave: this.round,
      seconds: seconds
    })
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

  var spawnMonster = function() {
    var monster = new Monster(this.path, {
      speed:  this.speed,
      health: this.round * 10
    })

    var removeMonster = function() {
      this.monsters = this.monsters.filter(function(_monster) {
        return _monster !== monster
      })

      if(this.monsters.length === 0) {
        this.fire('cleared')
      }
    }

    monster.on('die', removeMonster.bind(this))
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
