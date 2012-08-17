(function() {
  TowerMenu = function(cell) {
    this.cell = cell

    Utils.addObserverMethods(this)
  }

  TowerMenu.prototype.render = function() {
    var container = document.getElementById('tower-menu')
      , self      = this

    if(!container) {
      container = buildContainer.call(this)
      console.log(container)
      document.querySelector('body').appendChild(container)
    }

    return this
  }

  TowerMenu.prototype.remove = function() {
    var menu = document.getElementById('tower-menu')
      , body = document.querySelector('body')

    body.removeChild(menu)
  }

  // private

  var buildContainer = function() {
    var container = document.createElement('ul')

    container.id = 'tower-menu'

    for(var type in Tower.TYPES) {
      renderTower.call(this, type, container)
    }

    return container
  }

  var renderTower = function(type, container) {
    var self     = this
      , li       = document.createElement('li')
      , tower    = Tower.TYPES[type]
      , text     = [tower.name, '(' + tower.costs[0] + ')'].join(' ')
      , textNode = document.createTextNode(text)

    li.appendChild(textNode)
    li.setAttribute('data-tower-type', type)

    li.onclick = function() {
      self.fire('select', this.getAttribute('data-tower-type'))
    }

    container.appendChild(li)
  }
})()
