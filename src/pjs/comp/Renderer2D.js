

var Tuum = (function(nsp) {

/** :namespace Tuum.pjs: **/
nsp.pjs = (function(nsp) {

  nsp.Renderer2D = nsp.Component.Extend({
    init: function() {
      nsp.Component.prototype.init.apply(this);

      this.set('model', null);
    },

    process: function(ctx) {
      var m = this.get('model');
      if(m) m.draw(ctx.p);
    }
  });

  return nsp;
})(nsp.pjs || {});

  return nsp;
})(Tuum || {});
