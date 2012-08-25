Utils = {
  merge: function(obj1, obj2) {
    var obj3 = {}
      , attr = null

    for (attr in obj1) { obj3[attr] = obj1[attr] }
    for (attr in obj2) { obj3[attr] = obj2[attr] }

    return obj3
  },

  addObserverMethods: function(instance) {
    instance.listeners = {}
    instance.on = function(eventName, callback) {
      instance.listeners[eventName] = instance.listeners[eventName] || []
      instance.listeners[eventName].push(callback)
    }
    instance.off = function(eventName, callback) {
      instance.listeners[eventName] = instance.listeners[eventName].filter(function(cb) {
        return cb != callback
      })
    }
    instance.fire = function(eventName, data) {
      data = data || []
      data = (Array.isArray(data) ? data : [data]);

      (instance.listeners[eventName] || []).forEach(function(callback) {
        callback.apply(instance, data)
      })
    }
  },

  interpolate: function(s, replacements) {
    for(var key in replacements) {
      s = s.replace(new RegExp('%{' + key + '}', 'g'), replacements[key])
    }

    return s
  }
}
