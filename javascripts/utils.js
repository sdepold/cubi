Utils = {
  merge: function(obj1, obj2) {
    var obj3 = {}
      , attr = null

    for (attr in obj1) { obj3[attr] = obj1[attr] }
    for (attr in obj2) { obj3[attr] = obj2[attr] }

    return obj3
  },

  addObserverMethodsToClass: function(klass) {
    klass.prototype.__defineGetter__('listeners', function() {
      if(typeof this._listeners === 'undefined') {
        this._listeners = {}
      }
      return this._listeners
    })

    klass.prototype.on = function(eventName, callback) {
      this.listeners[eventName] = this.listeners[eventName] || []
      this.listeners[eventName].push(callback)
    }

    klass.prototype.off = function(eventName, callback) {
      this.listeners[eventName] = this.listeners[eventName].filter(function(cb) {
        return cb != callback
      })
    }

    klass.prototype.fire = function(eventName, data) {
      data = data || []
      data = (Array.isArray(data) ? data : [data])
      data.unshift(this)

      ;(this.listeners[eventName] || []).forEach(function(callback) {
        callback.apply(this, data)
      }.bind(this))
    }
  },

  interpolate: function(s, replacements) {
    var result = s

    for(var key in replacements) {
      result = result.replace(new RegExp('%{' + key + '}', 'g'), replacements[key])
    }

    return result
  },

  createDomNode: function(elementType, content, attributes) {
    var node = document.createElement(elementType)

    if(typeof content !== 'undefined') {
      if(typeof content === 'string') {
        node.appendChild(document.createTextNode(content))
      } else {
        node.appendChild(content)
      }
    }

    if(typeof attributes !== 'undefined') {
      for(var name in attributes) {
        node[name] = attributes[name]
      }
    }

    return node
  }
}

NodeList.prototype.forEach = Array.prototype.forEach
