var readyStateCheckInterval = setInterval(function() {
  if (document.readyState === "complete") {
    clearInterval(readyStateCheckInterval)

    var cellWidth  = 20
      , cellHeight = 20
      , windowDim  = Utils.getWindowDimension()
      , cols       = ~~((windowDim.width - (4 * 2) - (1 * 2)) / cellWidth)
      , rows       = ~~((windowDim.height - 24 - (4 * 2) - (1 * 2)) / cellHeight)

    if(cols < 20) {
      document.body.className = document.body.className.split(' ').concat(['reduced']).join(' ')
    }

    game = new Game('#game', { cols: cols, rows: rows }).render()

    document.getElementById('meta-data').style.width = (document.querySelector('#game').offsetWidth - 10) + 'px'
  }
}, 10)
