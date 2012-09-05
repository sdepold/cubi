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

if ( !Array.prototype.forEach ) {
  Array.prototype.forEach = function( callback, thisArg ) {
    var T, k;

    if ( this === null ) {
      throw new TypeError( "this is null or not defined" );
    }

    var O = Object(this);
    var len = O.length >>> 0;

    if ( {}.toString.call(callback) != "[object Function]" ) {
      throw new TypeError( callback + " is not a function" );
    }

    if ( thisArg ) {
      T = thisArg;
    }

    k = 0;

    while( k < len ) {
      var kValue;

      if ( k in O ) {
        kValue = O[ k ];
        callback.call( T, kValue, k, O );
      }
      k++;
    }
  };
}

;[].filter||(Array.prototype.filter=function(a,b,c,d,e){c=this;d=[];for(e in c)~~e+''==e&&e>=0&&a.call(b,c[e],+e,c)&&d.push(c[e]);return d})
;[].indexOf||(Array.prototype.indexOf=function(a,b,c){for(c=this.length,b=(c+~~b)%c;b<c&&(!(b in this)||this[b]!==a);b++);return b^c?b:-1;})

