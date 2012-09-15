(function() {
  var GameOver = function(headline, stats) {
    this.headline = headline
    this.stats    = stats
  }

  GameOver.prototype.getTemplate = function() {
    return document.getElementById('highscore-template').innerHTML
  }

  GameOver.prototype.render = function() {
    var div = Utils.createDomNode('div', { className: 'game-over' })

    this.getHighscore(function(highscores) {
      div.innerHTML = this.getTemplate()
        .replace('%{headline}',        this.headline)
        .replace('%{spentMoney}',      this.stats.spentMoney)
        .replace('%{earnedMoney}',     this.stats.earnedMoney)
        .replace('%{killedMonsters}',  this.stats.killedMonsters)
        .replace('%{killedMonsters}',  this.stats.killedMonsters)
        .replace('%{upgradedTowers}',  this.stats.upgradedTowers)
        .replace('%{upgradedTowers}',  this.stats.upgradedTowers)
        .replace('%{highscore}',       this.stats.highscore)
        .replace('%{highscoreList}',   eval(highscores).map(function(highscore, i) {
          return '<li>' + (i + 1) + '. ' + highscore.score + ' (' + highscore.username + ')</li>'
        }).join(''))

      var popUp = PopUp.notify(div, { sticky: true })

      document.body.appendChild(Utils.createDomNode('div', {
        className: 'game-over-background'
      }))

      setPosition.call(this, popUp)
      bindHighscoreButton.call(this)
    }.bind(this))
  }


  GameOver.prototype.getHighscore = function(callback) {
    microAjax('/highscore', callback)
  }

  GameOver.prototype.postHighscore = function(username) {
    var postData = "username=" + username + "&score=" + this.stats.highscore
    microAjax('/highscore', function(data) {}, postData)
  }

  // private

  var setPosition = function(popUp) {
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
  }

  var bindHighscoreButton = function() {
    var button  = document.getElementById('save-highscore-button')
      , clicked = false

    button.onclick = function() {
      if(!clicked) {
        var username = prompt('Please enter a nickname:')

        if(username !== null) {
          clicked = true
          this.postHighscore(username)
          button.innerHTML = 'Highscore saved!'
        }
      }

      return false
    }.bind(this)
  }

  window.PopUp.GameOver = GameOver
})()
