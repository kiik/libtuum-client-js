

var Tuum = (function(nsp) {

/** :namespace Tuum.pjs: **/
nsp.pjs = (function(nsp) {

  nsp.Label2D = nsp.Component.Extend({
    init: function(val) {
      nsp.Component.prototype.init.apply(this);

      this.text = val;
    },
    setup: function(ctx) {

    },
    process: function(ctx) {
      ctx.p.pushMatrix();

      this.entity._textFix(ctx);

      //TODO: Configurable properties
      ctx.p.fill(255, 255, 255);
      ctx.p.textSize(14);
      ctx.p.text(this.text, 20, 20);
      ctx.p.popMatrix();
    },

    setText: function(val) {
      this.text = val;
    }
  });

  return nsp;
})(nsp.pjs || {});

  return nsp;
})(Tuum || {});
