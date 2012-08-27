(function() {
  var EventManager = function(game) {
    this.game = game
  }

  EventManager.prototype.init = function() {
    observePlayer.call(this)
  }

  // private

  var observePlayer = function() {
    this.game.player.on('died', function() {
      PopUp.notify('Oh my gosh, you died!', { sticky: true })
      this.game.pause()
    }.bind(this))
  }

  window.EventManager = EventManager
})()
