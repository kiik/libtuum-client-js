

var Tuum = (function(nsp) {

/** :namespace Tuum.pjs: **/
nsp.pjs = (function(nsp) {

  nsp.AnchorWidget = nsp.Component.Extend({
    init: function() {
      nsp.Component.prototype.init.apply(this);
    },
    setup: function(ctx) {

    },
    process: function(ctx) {
      var vec = [20, 20], op = 180;

      ctx.p.stroke(255, 0, 0, op);
      ctx.p.line(0, 0, vec[0], 0);
      ctx.p.stroke(0, 255, 0, op);
      ctx.p.line(0, 0, 0, vec[1]);
    }
  });

  return nsp;
})(nsp.pjs || {});

  return nsp;
})(Tuum || {});
