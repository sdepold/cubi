(function() {
  Game = function(canvasSelector, options) {
    this.options = options || {}
    this.options.rows = this.options.rows || 10
    this.options.cols = this.options.cols || 10

    this.canvas = document.querySelectorAll(canvasSelector)[0]
    this.grid   = new Grid(this.options.rows, this.options.cols, this.canvas)
    this.player = new Player(canvasSelector)
  }

  Game.prototype.render = function(options) {
    this.grid.render()
    this.player.render()

    var monsters = []
      , speed    = Math.min(250, ~~(Math.random() * 2000))

    for(var i = 0; i < 10; i++) {
      var monster = new Monster(this.grid.path, {
        speed: speed,
        onReachedGoal: this.player.hurt.bind(this.player)
      })

      monsters.push(monster)
    }

    monsters.forEach(function(monster, i) {
      setTimeout(function() {
        monster.initMoving()
      }, i * 2 * speed)
    })

    return this
  }
})()
