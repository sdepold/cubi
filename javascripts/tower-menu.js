(function() {
  var TowerMenu = function(cell) {
    this.cell  = cell
    this.popUp = new PopUp()

    Utils.addObserverMethods(this)
  }

  TowerMenu.prototype.render = function() {
    var container = document.getElementById('tower-menu')
      , x = this.cell.dom.offsetLeft + 40
      , y = this.cell.dom.offsetTop - 30

    this.cell.addClassName('selected')

    this.popUp.setContent(buildContainer.call(this))
    this.popUp.render({ left: x, top: y })

    return this
  }

  TowerMenu.prototype.remove = function() {
    this.popUp.close()
    this.cell.removeClassName('selected')
  }

  // private

  var buildContainer = function() {
    var container = document.createElement('ul')

    container.id = 'tower-menu'
    container.className = 'menu'

    for(var type in Tower.TYPES) {
      renderTower.call(this, type, container)
    }

    return container
  }

  var renderTower = function(type, container) {
    var self     = this
      , li       = document.createElement('li')
      , tower    = Tower.TYPES[type]
      , text     = Utils.interpolate("%{name} (%{costs})", { name: tower.name, costs: tower.costs[0] })
      , textNode = document.createTextNode(text)

    li.appendChild(textNode)
    li.setAttribute('data-tower-type', type)
    li.className = type.toLowerCase()

    li.onclick = function() {
      self.fire('select', this.getAttribute('data-tower-type'))
    }

    container.appendChild(li)
  }

  window.TowerMenu = TowerMenu
})()
