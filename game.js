(function() {
  Game = function(canvasSelector, options) {
    this.options = options || {}
    this.options.rows = this.options.rows || 10
    this.options.cols = this.options.cols || 10

    this.canvas = document.querySelectorAll(canvasSelector)[0]
    this.grid   = new Grid(this.options.rows, this.options.cols, this.canvas)
  }

  Game.prototype.render = function(options) {
    this.grid.render()

    var monster = new Monster(this.grid.path)

    setInterval(function() {
      monster.move()
    }, 1000)
  }
})()
