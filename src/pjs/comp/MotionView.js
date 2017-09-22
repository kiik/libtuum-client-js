

var Tuum = (function(nsp) {

/** :namespace Tuum.pjs: **/
nsp.pjs = (function(nsp) {

  nsp.MotionView = nsp.Component.Extend({
    init: function() {
      nsp.Component.prototype.init.apply(this);
      this.Type = 'MotionView';

      this.v = 2;
      this.w = 5 * (3.14 / 180);
      this.t = 10;
      this.dt = 0;
      this.target = null;

      this.phist = [];
      this.phist_N = 10;  // History size
      this.phist_s = 2;   // Path step
    },

    setVelocity: function(v, w) {
      this.v = v;
      this.w = w;
    },
    setTarget: function(p) {
      this.target = p;
    },

    processPathHistory: function(ctx) {
      if(this.entity == null) return;

      var p_new = [this.entity.transform.getX(), this.entity.transform.getY()];

      if(this.phist.length == 0) {
        this.phist.push(p_new);
        return;
      }

      var p = this.phist[this.phist.length - 1];
      var d = Math.sqrt( Math.pow(p_new[0] - p[0], 2) + Math.pow(p_new[1] - p[1], 2));

      if(d >= this.phist_s * Tuum.pjs.toPixelView) {
        this.phist.push(p_new);
      }

      if(this.phist.length >= this.phist_N) this.phist.shift();
    },
    renderPathHistory: function(ctx) {
      if(this.entity == null) return;
      if(this.phist.length < 2) return;

      ctx.p.pushMatrix();
      this.entity.modelToWorld(ctx);

      ctx.p.noFill();

      for(var ix_2 = 1, ix_1 = 0; ix_2 < this.phist.length; ix_1++, ix_2++) {
        var p1 = this.phist[ix_1], p2 = this.phist[ix_2];

        ctx.p.stroke(255, 255, 255, 120);
        ctx.p.line(p1[0], p1[1], p2[0], p2[1]);

        ctx.p.stroke(255, 255, 255, 200);
        ctx.p.point(p1[0], p1[1]);
        ctx.p.point(p2[0], p2[1]);
      }

      ctx.p.popMatrix();
    },

    setup: function(ctx) {

    },

    // r = v / w
    process: function(ctx) {
      //TODO: Handle scaling better.
      var toPixelView = Tuum.pjs.toPixelView;

      var w = this.w;

      var r = this.v / (this.w != 0 ? this.w : 1); // Radius (m)

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

      this.processPathHistory(ctx);
      this.renderPathHistory(ctx);

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

        if(this.w != 0) {
          var dA = this.w * this.dt;

          var mp = [
            r * Math.sin(dA),
            -r * Math.cos(dA) + r
          ];

          var d = Math.sqrt(Math.pow(mp[0], 2) + Math.pow(mp[1], 2));

          this.entity.transform.rotate(dA);
          this.entity.transform.translate(d);
        } else {
          this.entity.transform.translate(this.v * this.dt * Tuum.pjs.toPixelView);
        }

        this.dt = 0;
      }

      // Draw Target vector
      if(this.target) {
        ctx.p.stroke(200, 200, 0);
        var t = [this.target[0] + pos[0], this.target[1] + pos[1]];
        ctx.p.line(0, 0, t[0], t[1]);
      }
    }
  });

  return nsp;
})(nsp.pjs || {});

  return nsp;
})(Tuum || {});
