

var Tuum = (function(nsp) {

/** :namespace Tuum.pjs: **/
nsp.pjs = (function(nsp) {

  nsp.Console = nsp.Component.Extend({
    init: function() {
      nsp.Component.prototype.init.apply(this);

      this.data = [];
    },
    setup: function(ctx) {

    },
    process: function(ctx) {
      var toPixelView = Tuum.pjs.toPixelView;

      ctx.p.pushMatrix();
      ctx.p.resetMatrix();
      ctx.p.fill(200, 200, 200);
      ctx.p.textSize(12);

      var t = Date.now();
      var N = this.data.length;
      for(var i = 0; i < N; i++) {
        var dat = this.data[i];

        if(t >= dat[1]) {
          this.data.splice(i, 1);
          i--;
          N--;
          continue;
        }

        ctx.p.text(dat[0], 5, 15 * i + 15);
      }

      ctx.p.popMatrix();
    },
    newPopup: function(msg, timeout) {
      var t = Date.now();
      t += timeout;
      this.data.push([msg, t]);
    },
    popupTimeout: function() {

    }
  });

  return nsp;
})(nsp.pjs || {});

  return nsp;
})(Tuum || {});
