(function() {
  TowerMenu = {
    render: function() {
      var container = document.getElementById('tower-menu')
        , self      = this

      if(!container) {
        container = document.createElement('ul')
        container.id = 'tower-menu'

        for(var type in Tower.TYPES) {
          var li   = document.createElement('li')
            , text = document.createTextNode(Tower.TYPES[type].name)

          li.appendChild(text)
          li.setAttribute('data-tower-type', type)

          li.onclick = function() {
            self.fire('select', this.getAttribute('data-tower-type'))
          }

          container.appendChild(li)
        }

        document.querySelector('body').appendChild(container)
      }
    },

    clear: function() {
      var menu = document.getElementById('tower-menu')
        , body = document.querySelector('body')

      body.removeChild(menu)
    }
  }

  Utils.addObserverMethods(TowerMenu)
})()
