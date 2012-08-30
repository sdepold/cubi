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
    this.timerIntervalId = null
    this.spawnTimeoutIds = []

    Utils.addObserverMethods(this)
  }

  Wave.prototype.spawn = function(delay) {
    drawTimer.call(this, delay)

    setTimeout(function() {
      spawnMonsters.call(this)
    }.bind(this), delay * 1000)

    return this
  }

  Wave.prototype.move = function() {
    this.monsters.forEach(function(monster) {
      monster.move()
    })
  }

  Wave.prototype.stop = function() {
    this.spawnTimeoutIds.forEach(function(id) {
      clearTimeout(id)
    })

    clearInterval(this.moveIntervalId)
  }

  // private

  var drawTimer = function(countDownFrom) {
    var container = document.getElementById('wave-duration')

    if(!container) {
      container = document.createElement('span')
      container.id = 'wave-duration'

      this.meta.appendChild(container)
    }

    var message = "Wave #%{wave} starts in %{seconds}s"
      , then    = +new Date

    this.timerIntervalId = setInterval(function() {
      var now  = +new Date
        , diff = Math.ceil(Math.abs(then - now) / 1000)

      if(diff > countDownFrom) {
        clearInterval(this.timerIntervalId)
      } else {
        container.innerHTML = Utils.interpolate(message, {
          wave: this.round,
          seconds: countDownFrom - diff
        })
      }
    }.bind(this), 100)
  }

  var spawnMonsters = function() {
    for(var i = 0, j = this.monstersToSpawn; i < j; i++) {
      this.spawnTimeoutIds.push(
        setTimeout(spawnMonster.bind(this), this.speed * i)
      )
    }

    this.on('monster:spawned', function() {
      this.move()
    }.bind(this))

    this.on('spawned', function() {
      this.moveIntervalId = setInterval(this.move.bind(this), this.speed)
    }.bind(this))
  }

  var spawnMonster = function() {
    var monster = new Monster(this.path, {
      speed:  this.speed,
      health: this.round * 10
    })

    monster.on('move', function() {
      // checkTowerDistances.call(this, monster)
    }.bind(this))

    monster.on('die', function() {
      this.monsters = this.monsters.filter(function(_monster) {
        return _monster !== monster
      })

      this.fire('monster:killed', [ monster ])

      if(this.monsters.length === 0) {
        this.fire('cleared')
      }
    }.bind(this))

    this.monsters.push(monster)

    this.fire('monster:spawned')

    this.spawnedMonsters = this.spawnedMonsters + 1

    if(this.spawnedMonsters === this.monstersToSpawn) {
      this.fire('spawned')
    }

  }

  window.Wave = Wave
})()
