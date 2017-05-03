

var Tuum = (function(nsp) {

/** :namespace Tuum.pjs: **/
nsp.pjs = (function(nsp) {

  nsp.Camera = nsp.Component.Extend({
    init: function() {
      this.view = new nsp.Transform();
      this.view.position = [1.0, 1.0, 1.0];

      this.base_mpos = null;
    },

    setup: function(ctx) {

    },

    process: function(ctx) {
      var sv = 5.0;

      var scr = Input.getMouseScroll();
      if(scr != 0) {
        var c = this.view.z;
        this.view.z += scr * sv / 100.0;

        /*
        if(scr > 0) this.view.z = Math.max(0.1, this.view.z - sv);
        else this.view.z = Math.min(4.0, this.view.z + sv);
        */

        this.view.x -= ctx.p.mouseX * scr * sv / 100.0;
        this.view.y -= ctx.p.mouseY * scr * sv / 100.0;

        // Scale 1.0 -> 1.5 => center({1, 1}) -> center({1.5, 1.5})
      }

      if(Input.getMouseLeft()) {
        if(this.base_mpos) {
          var dv = [ctx.p.mouseX - this.base_mpos[0], ctx.p.mouseY - this.base_mpos[1]];
          this.view.x += dv[0] * 1.0 / this.view.z;
          this.view.y += dv[1] * 1.0 / this.view.z;
        }

        this.base_mpos = [ctx.p.mouseX, ctx.p.mouseY];
      } else if(this.base_mpos) this.base_mpos = null;
    },

    getViewMatrix: function() { return this.view; }
  });

  return nsp;
})(nsp.pjs || {});

  return nsp;
})(Tuum || {});
