(function() {
  var MetaBar = function() {
    this.dom   = Utils.createDomNode('div', { id: 'meta-data' })
    this.parts = {}
  }

  MetaBar.prototype.render = function() {
    var gameDom = document.getElementById('game')

    this.dom.style.width = (gameDom.offsetWidth - 10) + 'px'
    document.body.appendChild(this.dom)

    return this
  }

  MetaBar.prototype.add = function(name, value, options) {
    var container = Utils.createDomNode('span', Utils.merge(options || {}, {
      id: name,
      value: value
    }))

    this.parts[name] = container
    this.dom.appendChild(container)
  }

  MetaBar.prototype.update = function(name, value, options) {
    this.parts[name].innerHTML = value

    if (options) {
      for(var key in options) {
        this.parts[name][key] = options[key]
      }
    }
  }

  MetaBar.prototype.get = function(name) {
    return this.parts[name]
  }

  MetaBar.prototype.updateOrAdd = function(name, value, options) {
    var method = !!this.get(name) ? 'update' : 'add'
    this[method](name, value, options)
  }

  window.MetaBar = MetaBar
})()
