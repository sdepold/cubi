Utils = {
  addClassName: function(dom, className) {
    dom.className = dom.className
      .split(' ')
      .concat([className])
      .filter(function(name) { return name !== '' })
      .join(' ')
  },

  hasClassName: function(dom, className) {
    return dom.className.split(' ').indexOf(className) !== -1
  },

  removeClassName: function(dom, className) {
    dom.className = dom.className
      .split(' ')
      .filter(function(name) { return name !== className })
      .join(' ')
  },

  getWindowDimension: function() {
    var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight

    return { width: x, height: y }
  },

  needsReducedLayout: function() {
    return document.body.className.indexOf('reduced') !== -1
  },

  merge: function(obj1, obj2) {
    var obj3 = {}
      , attr = null

    for (attr in obj1) { obj3[attr] = obj1[attr] }
    for (attr in obj2) { obj3[attr] = obj2[attr] }

    return obj3
  },

  addObserverMethodsToClass: function(klass) {
    klass.prototype.initListeners = function() {
      if(typeof this.listeners === 'undefined') {
        this.listeners = {}
      }
    }

    klass.prototype.on = function(eventName, callback) {
      this.initListeners()

      this.listeners[eventName] = this.listeners[eventName] || []
      this.listeners[eventName].push(callback)
    }

    klass.prototype.off = function(eventName, callback) {
      this.initListeners()

      this.listeners[eventName] = this.listeners[eventName].filter(function(cb) {
        return cb != callback
      })
    }

    klass.prototype.fire = function(eventName, data) {
      this.initListeners()

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

  createDomNode: function(elementType, attributes) {
    var node    = document.createElement(elementType)
      , content = null
      , style   = null

    if((attributes || {}).hasOwnProperty('value')) {
      content = attributes.value;
      delete attributes.value;
    }

    if((attributes || {}).hasOwnProperty('style')) {
      style = attributes.style;
      delete attributes.style;
    }

    if(content !== null) {
      node.appendChild(document.createTextNode(content))
    }

    if(style !== null) {
      for(var cssAttr in style) {
        node.style[cssAttr] = style[cssAttr]
      }
    }

    if(typeof attributes !== 'undefined') {
      for(var name in attributes) {
        if(name.indexOf('-') !== -1) {
          node.setAttribute(name, attributes[name])
        } else {
          node[name] = attributes[name]
        }
      }
    }

    return node
  }
}

NodeList.prototype.forEach = Array.prototype.forEach
