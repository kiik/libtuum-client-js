

var Tuum = (function(nsp) {

/** :namespace Tuum.pjs: **/
nsp.pjs = (function(nsp) {

  nsp.GridWidget = nsp.Component.Extend({
    init: function() {
      nsp.Component.prototype.init.apply(this);
    },
    setup: function(ctx) {

    },
    process: function(ctx) {
      var toPixelView = Tuum.pjs.toPixelView;

      function cfloor(v, c) {
        return Math.round(v / c) * c;
      }

      ctx.p.pushMatrix();
      var dx = this.entity.transform.getX() % toPixelView,
          dy = this.entity.transform.getY() % toPixelView; // 22.2 / 20

      ctx.p.rotate(-this.entity.transform.rot[0]);
      ctx.p.translate(-dx, -dy);

      var area = 20 * toPixelView;
      var dx = area / 2, dy = area / 2;

      ctx.p.stroke(162, 222, 208, 120);
      var range = 20;
      var x, y;
      for(var ix = 1; ix < range; ix++) {
        var column = ix * toPixelView;
        x = column - dx;
        ctx.p.line(x, -dy, x, dy);
      }

      range = 20;
      for(var ix = 1; ix < range; ix++) {
        var column = ix * toPixelView;
        y = column - dy;
        ctx.p.line(-dx, y, dx, y);
      }

      ctx.p.popMatrix();
    }
  });

  return nsp;
})(nsp.pjs || {});

  return nsp;
})(Tuum || {});
