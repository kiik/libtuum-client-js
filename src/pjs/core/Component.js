
var Tuum = (function(nsp) {

/** :namespace Tuum.pjs: **/
nsp.pjs = (function(nsp) {

  nsp.AttributeTable = Class.Extend({
    init: function() {
      this._attrs = {};
    },
    get: function(name) {
      return this._attrs[name];
    },
    set: function(name, val) {
      this._attrs[name] = val;
    },

    getAttributes: function() {
      return this._attrs;
    }
  });

  nsp.Component = nsp.AttributeTable.Extend({
    init: function() {
      nsp.AttributeTable.prototype.init.apply(this);
      this.entity = null;
    },
    setup: function() {},
    process: function() {}
  });

  return nsp;
})(nsp.pjs || {});

  return nsp;
})(Tuum || {});
