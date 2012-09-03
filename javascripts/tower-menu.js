(function() {
  var TowerMenu = function(cell) {
    this.cell  = cell
    this.popUp = new PopUp()
  }

  Utils.addObserverMethodsToClass(TowerMenu)

  TowerMenu.prototype.render = function() {
    var container = document.getElementById('tower-menu')
      , x = this.cell.dom.offsetLeft + 40
      , y = this.cell.dom.offsetTop - 30

    if(y < 0) {
      y = 0
    }

    this.cell.addClassName('selected')

    this.popUp.setContent(buildContainer.call(this))
    this.popUp.render({ left: x, top: y })

    if(x + this.popUp.dom.offsetWidth > document.querySelector('table').offsetWidth) {
      this.popUp.setPosition({ left: (x - 270) })
    }

    return this
  }

  TowerMenu.prototype.remove = function() {
    this.popUp.close()
    this.cell.removeClassName('selected')
  }

  // private

  var buildContainer = function() {
    var container = Utils.createDomNode('ul', {id: 'tower-menu', className: 'menu'})

    for(var type in Tower.TYPES) {
      renderTower.call(this, type, container)
    }

    return container
  }

  var renderTower = function(type, container) {
    var self     = this
      , tower    = Tower.TYPES[type]
      , template = Utils.needsReducedLayout() ? "%{costs}$" : "%{name} (%{costs}$)"
      , text     = Utils.interpolate(template, { name: tower.name, costs: tower.costs[0] })

    container.appendChild(Utils.createDomNode('li', {
      value: text,
      'data-tower-type': type,
      className: type.toLowerCase(),
      onclick: function() {
        self.fire('select', this.getAttribute('data-tower-type'))
      }
    }))
  }

  window.TowerMenu = TowerMenu
})()
