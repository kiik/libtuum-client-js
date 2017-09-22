

var Tuum = (function(nsp) {

/** :namespace Tuum.pjs: **/
nsp.pjs = (function(nsp) {

  function bezier(var t, var p0, var p1, var p2, var p3)
  {
    float u = 1 – t;
    float tt = t*t;
    float uu = u*u;
    float uuu = uu * u;
    float ttt = tt * t;

    Vector3 p = uuu * p0; //first term
    p += 3 * uu * t * p1; //second term
    p += 3 * u * tt * p2; //third term
    p += ttt * p3;        //fourth term

    return p;
  }

  nsp.TestComponent = nsp.Component.Extend({
    init: function() {
      nsp.Component.prototype.init.apply(this);

    },

    setup: function(ctx) {

    },

    process: function(ctx) {

      ctx.p.pushMatrix();

      ctx.p.line(0, 0, 100, 100);

      ctx.p.popMatrix();
    }
  });

  return nsp;
})(nsp.pjs || {});

  return nsp;
})(Tuum || {});
