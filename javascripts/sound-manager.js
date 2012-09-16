(function() {
  var SoundManager = function() {
    this.soundFiles = {
      'rocket-explosion': {
        file: '/sounds/rocket-explosion.wav',
        volume: 30
      },
      'rocket-shoot':     {
        file: '/sounds/rocket-shoot.wav',
        volume: 30
      },
      'turret-shoot':     {
        file:   '/sounds/turret-shoot.wav',
        volume: 70
      }
    }

    this.sounds = {}
  }

  SoundManager.MAX_INSTANCES = 5
  SoundManager.SOUND_DELAY   = 100

  SoundManager.prototype.play = function(type) {
    return;
    var sound = this.sounds[type]

    if (!sound) {
      sound = {
        current: 0,
        instances: [],
        lastShotAt: null,
        getCurrentInstance: function() {
          var instance = this.instances[this.current]

          this.current = ++this.current % SoundManager.MAX_INSTANCES

          return instance
        },
        canBePlayed: function() {
          var diff = this.lastShotAt ? +new Date() - this.lastShotAt : SoundManager.SOUND_DELAY
          return (diff >= SoundManager.SOUND_DELAY)
        }
      }

      this.sounds[type] = sound
    }

    if (sound.instances.length !== SoundManager.MAX_INSTANCES) {
      sound.instances.push(createSound.call(this, type, type + '-' + sound.instances.length))
    }

    if(sound.canBePlayed()) {
      var instance = sound.getCurrentInstance()
      sound.lastShotAt = +new Date()
      instance.stop().play()
    }
  }

  // private

  var createSound = function(type, id) {
    var pathOrOptions = this.soundFiles[type]
      , url           = ((typeof pathOrOptions === 'string') ? pathOrOptions : pathOrOptions.file)
      , volume        = undefined

    if ((typeof pathOrOptions !== 'string') && pathOrOptions.volume) {
      volume = pathOrOptions.volume
    }

    return soundManager.createSound({
      id: id,
      url: url,
      volume: volume
    })
  }

  window.SoundManager = new SoundManager()
})()
