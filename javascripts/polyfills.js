Function.prototype.bind = Function.prototype.bind || function (obj) {
  var slice = [].slice
    , args  = slice.call(arguments, 1)
    , self  = this
    , nop   = function () {}
    , bound = function () {
        return self.apply(
          this instanceof nop ? this : (obj || {}),
          args.concat(slice.call(arguments))
        )
      }
  bound.prototype = this.prototype
  return bound
}
