

var Tuum = (function(nsp) {

/** :namespace Tuum.pjs: **/
nsp.pjs = (function(nsp) {

  nsp.MotionView = nsp.Component.Extend({
    init: function() {
      nsp.Component.prototype.init.apply(this);

      this.v = 4;
      this.w = 20 * (3.14 / 180);
      this.t = 200;
      this.dt = 0;
    },
    setup: function(ctx) {

    },

    // r = v / w
    process: function(ctx) {
      //TODO: Handle scaling better.
      var toPixelView = Tuum.pjs.toPixelView;

      var w = this.w;

      var r = this.v / this.w; // Radius (m)
      var alfa = this.w * this.t;

      var o1, o2;

      //var mvec = 2 * [] / 2 * Math.sin(alfa / 2);
      //this.entity.transform.translate(this.v * ctx.dt);

      r *= toPixelView;

      if(this.v * this.w >= 0) {
        o1 = 4.71 - (w < 0 ? alfa : 0);
        o2 = 4.71 + (w >= 0 ? alfa : 0);
      } else {
        o1 = 1.57 - (w < 0 ? alfa : 0);
        o2 = 1.57 + (w >= 0 ? alfa : 0);
      }

      // Draw motion prediction
      ctx.p.noFill();
      ctx.p.stroke(75, 119, 190);
      ctx.p.ellipseMode(ctx.p.CENTER);
      ctx.p.arc(0, r, r*2, r*2, o1, o2);

      var pos = this.entity.transform.position;

      // Debug vectors
      ctx.p.stroke(255, 255, 255);
      ctx.p.line(0, 0 + r, 0, 0); // Radius

      var p2 = [
        0 * Math.cos(alfa) - (-r) * Math.sin(alfa),
        0 * Math.sin(alfa) + (-r) * Math.cos(alfa) + r
      ];
      ctx.p.line(0, 0 + r, p2[0], p2[1]); // Chord enpoint radius

      ctx.p.stroke(0, 255, 0);
      ctx.p.line(0, 0, p2[0], p2[1]); // Motion vector

      // Simulate motion
      this.dt += ctx.dt;

      if(this.dt >= (1.0 / 10.0)) {
        var dA = this.w * this.dt;

        var mp = [
          r * Math.sin(dA),
          -r * Math.cos(dA) + r
        ];

        var l = this.v * this.dt;

        //this.entity.transform.x += mp[0];
        //this.entity.transform.y += mp[1];

        this.dt = 0;
      }
    }
  });

  return nsp;
})(nsp.pjs || {});

  return nsp;
})(Tuum || {});
