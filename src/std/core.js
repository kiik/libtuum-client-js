
var Tuum = (function(nsp) {

  /** Simple JavaScript Inheritance
   *  By John Resig http://ejohn.org/
   *  MIT Licensed.
   */
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  function loadClass(nsp)
  {
    nsp.Class = function(){};

    nsp.Class.Extend = function(prop) {
      var _super = this.prototype;

      initializing = true;
      var prototype = new this();
      initializing = false;

      for (var name in prop) {
        prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;

            this._super = _super[name];

            var ret = fn.apply(this, arguments);
            this._super = tmp;

            return ret;
          };
        })(name, prop[name]) :
        prop[name];
      }

      function Class() {
        if ( !initializing && this.init )
        this.init.apply(this, arguments);
      }

      Class.prototype = prototype;
      Class.prototype.constructor = Class;
      Class.Extend = arguments.callee;

      //if(arguments.length > 1)
      //  return Class.Extend(Class, Array.prototype.slice.call(arguments, 1));

      return Class;
    };
  }

  loadClass(nsp);

  return nsp;
})(Tuum || {});



var Tuum = (function(nsp) {

  nsp.EventEmitter = nsp.Class.Extend({
    init: function() {
      this._evs = {};
      this._listeners = {};
    },
    on: function(ev, cb) {
      this._evs[ev] = cb;
    },
    emit: function(ev) {
      if(this._evs.hasOwnProperty(ev))
        this._evs[ev].apply(this, arguments);

      if(this._listeners.hasOwnProperty(ev)) {
        for(var ix in this._listeners[ev]) {
          this._listeners[ev][ix].apply(this, arguments);
        }
      }
    },
    addListener: function(ev, cb) {
      if(!this._listeners.hasOwnProperty(ev))
        this._listeners[ev] = [cb];
      else
        this._listeners[ev].push(cb);
    }
  });

  return nsp;
})(Tuum || {});
