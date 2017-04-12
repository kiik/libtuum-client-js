


/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
 // Inspired by base2 and Prototype
(function(){
var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

// The base Class implementation (does nothing)
this.Class = function(){};

// Create a new Class that inherits from this class
Class.Extend = function(prop) {
  var _super = this.prototype;

  // Instantiate a base class (but only create the instance,
  // don't run the init constructor)
  initializing = true;
  var prototype = new this();
  initializing = false;

  // Copy the properties over onto the new prototype
  for (var name in prop) {
    // Check if we're overwriting an existing function
    prototype[name] = typeof prop[name] == "function" &&
      typeof _super[name] == "function" && fnTest.test(prop[name]) ?
      (function(name, fn){
        return function() {
          var tmp = this._super;

          // Add a new ._super() method that is the same method
          // but on the super-class
          this._super = _super[name];

          // The method only need to be bound temporarily, so we
          // remove it when we're done executing
          var ret = fn.apply(this, arguments);
          this._super = tmp;

          return ret;
        };
      })(name, prop[name]) :
      prop[name];
  }

  // The dummy class constructor
  function Class() {
    // All construction is actually done in the init method
    if ( !initializing && this.init )
      this.init.apply(this, arguments);
  }

  // Populate our constructed prototype object
  Class.prototype = prototype;

  // Enforce the constructor to be what we expect
  Class.prototype.constructor = Class;

  // And make this class extendable
  Class.Extend = arguments.callee;

  return Class;
};

})( (function() { return this; })() );




(function() {

this.ab2str = function(buf) {
  return String.fromCharCode.apply(new Uint16Array(buf));
}

this.str2ab = function(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);

  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }

  return buf;
}

this.zArray = function(n) { return Array.apply(null, Array(n)).map(Number.prototype.valueOf,0); }

this.gps_fix = function(v) { return Math.floor(v) + ( (v % 1) * 100.0 / 60.0 ) }

if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

this.formatEndpointName = function(name) {
  var buf = name.replace(" ", "").substr(1, name.length);
  buf = name.charAt(0).toLowerCase() + buf;
  return buf;
}

})( (function() { return this; })() );




var Tuum = (function(nsp) {
  nsp.EventEmitter = Class.Extend({
    init: function() {
      this._evs = {};
    },
    on: function(ev, cb) {
      this._evs[ev] = cb;
    },
    emit: function(ev) {
      if(!this._evs.hasOwnProperty(ev)) return;
      this._evs[ev].apply(this, arguments);
    }
  });

  return nsp;
})(Tuum || {});
