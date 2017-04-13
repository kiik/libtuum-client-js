
var Tuum = (function(nsp) {

  var Path = Class.Extend({
    init: function() {
      this.points = [];
      this.ui = null;
    },

    uiBind: function(obj) { this.ui = obj; }
  });

  nsp.Path = function() {
    return new Path();
  }

  return nsp;
})(Tuum || {});
