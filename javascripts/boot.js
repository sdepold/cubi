var readyStateCheckInterval = setInterval(function() {
  if (document.readyState === "complete") {
    clearInterval(readyStateCheckInterval)

    soundManager.setup({
      url: '/javascripts/soundmanager/swf/',
      debugMode: false,
      preferFlash: false,
      onready: function() {
        var cellWidth  = 20
          , cellHeight = 20
          , windowDim  = Utils.getWindowDimension()
          , cols       = ~~((windowDim.width - (4 * 2) - (1 * 2)) / cellWidth)
          , rows       = ~~((windowDim.height - 24 - (4 * 2) - (1 * 2)) / cellHeight)

        if(cols < 20) {
          document.body.className = document.body.className.split(' ').concat(['reduced']).join(' ')
        }

        game = new Game('#game', { cols: cols, rows: rows }).render()

        var gameDom     = document.getElementById('game')
          , metaDataDom = document.getElementById('meta-data')

        metaDataDom.style.width = (gameDom.offsetWidth - 10) + 'px'
      },

      ontimeout: function() {
        console.log('no sound!')
      }
    })
  }
}, 10)
