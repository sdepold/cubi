(function() {
  Game = function(canvasSelector, options) {
    this.options = options || {}
    this.options.rows = this.options.rows || 10
    this.options.cols = this.options.cols || 10

    this.canvas = document.querySelectorAll(canvasSelector)[0]
    this.grid   = new Grid(this.options.rows, this.options.cols, this.canvas)
  }

  Game.prototype.render = function(options) {
    var speed = Math.min(250, ~~(Math.random() * 2000))

    this.grid.render()

    var monsters = []

    for(var i = 0; i < 10; i++) {
      monsters.push(new Monster(this.grid.path, { speed: speed }))
    }

    monsters.forEach(function(monster, i) {
      setTimeout(function() {
        monster.initMoving()
      }, i * 2 * speed)
    })
  }
})()
