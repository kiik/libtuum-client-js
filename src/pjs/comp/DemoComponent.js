

var Tuum = (function(nsp) {

/** :namespace Tuum.pjs: **/
nsp.pjs = (function(nsp) {

  nsp.DemoComponent = nsp.Component.Extend({
    init: function() {
      nsp.Component.prototype.init.apply(this);

      this.deg = 0;
      this.ampl = 100;
    },

    setup: function(ctx) {
      this.basePos = ctx.simObject.transform.getX();
    },

    process: function(ctx) {
      var p = ctx.p, centerX = ctx.scene.rect.cX, centerY = ctx.scene.rect.cY;

      this.deg += (90 % 360) * ctx.dt;
      var dx = this.ampl * Math.sin(this.deg * 3.14 / 180);

      //ctx.simObject.transform.x = this.basePos + dx;

      var maxArmLength = Math.min(centerX, centerY);

      p.stroke(0);

      function drawArm(position, lengthScale, weight) {
        p.strokeWeight(weight);
        p.line(centerX, centerY,
        centerX + Math.sin(position * 2 * Math.PI) * lengthScale * maxArmLength,
        centerY + Math.cos(position * 2 * Math.PI) * lengthScale * maxArmLength);
      }

      var now = new Date();

      // Moving hours arm by small increments
      var hoursPosition = (now.getHours() % 12 + now.getMinutes() / 60) / 12;
      drawArm(hoursPosition, 0.5, 5);

      // Moving minutes arm by small increments
      var minutesPosition = (now.getMinutes() + now.getSeconds() / 60) / 60;
      drawArm(minutesPosition, 0.80, 3);

      // Moving hour arm by second increments
      var secondsPosition = now.getSeconds() / 60;
      drawArm(secondsPosition, 0.90, 1);
    }
  });

  return nsp;
})(nsp.pjs || {});

  return nsp;
})(Tuum || {});
