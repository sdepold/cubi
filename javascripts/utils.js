Utils = {
  merge: function(obj1, obj2) {
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
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
        callback.apply(null, data)
      })
    }
  }
}
