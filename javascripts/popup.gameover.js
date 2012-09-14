(function() {
  var GameOver = function(headline) {
    this.headline = headline
  }

  GameOver.prototype.getTemplate = function() {
    return document.getElementById('highscore-template').innerHTML
  }

  GameOver.prototype.render = function(stats) {
    var div  = document.createElement('div')

    div.innerHTML = this.getTemplate()
      .replace('%{headline}',        this.headline)
      .replace('%{spentMoney}',      stats.spentMoney)
      .replace('%{earnedMoney}',     stats.earnedMoney)
      .replace('%{killedMonsters}',  stats.killedMonsters)
      .replace('%{killedMonsters}',  stats.killedMonsters)
      .replace('%{upgradedTowers}',  stats.upgradedTowers)
      .replace('%{upgradedTowers}',  stats.upgradedTowers)
      .replace('%{highscore}',       stats.highscore)

    var popUp = PopUp.notify(div, { sticky: true })

    popUp.dom.style.left = popUp.dom.style.top = '50%'
    popUp.dom.style.marginLeft = -(popUp.dom.offsetWidth / 2) + 'px'
    popUp.dom.style.marginTop  = -(popUp.dom.offsetHeight / 2) + 'px'

    var badge  = document.querySelector('.badge')
      , value  = document.querySelector('.badge-value')
      , shadow = document.querySelector('.badge-shadow')
      , left   = (popUp.dom.offsetWidth / 2) - (badge.offsetWidth / 2) - 30
      , top    = (popUp.dom.offsetHeight / 2) - (badge.offsetHeight / 2) - 30

    value.style.marginLeft = badge.style.marginLeft = left + 'px'
    value.style.marginTop = badge.style.marginTop = top + 'px'

    shadow.style.marginLeft = left + 4 + 'px'
    shadow.style.marginTop = top + 4 + 'px'

    document.body.appendChild(Utils.createDomNode('div', {
      className: 'game-over-background'
    }))
  }

  window.PopUp.GameOver = GameOver
})()
