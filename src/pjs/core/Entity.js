

var Tuum = (function(nsp) {

/** :namespace Tuum.pjs: **/
nsp.pjs = (function(nsp) {

  nsp.Entity = nsp.Component.Extend({
    init: function() {
      nsp.Component.prototype.init.apply(this);

      this.components = [];

      this.parent = null;
      this.children = [];

      this.transform = new nsp.Transform();
    },

    addComponent: function(c) {
      this.components.push(c);
      c.entity = this;
    },

    setup: function(ctx) {
      ctx.simObject = this;
      this.components.forEach(function(e) {
        e.setup(ctx);
      });

      // Debug
      this.addComponent(new nsp.AnchorWidget());
    },

    process: function(ctx) {
      ctx.simObject = this;

      ctx.p.pushMatrix();
      ctx.p.translate(this.transform.getX(), this.transform.getY());
      ctx.p.rotate(this.transform.rot[0]);

      this.components.forEach(function(e) {
        e.process(ctx);
      });

      ctx.p.popMatrix();

    },

    /** Changes origin to world **/
    modelToWorld: function(ctx) {
      ctx.p.rotate(-this.transform.rot[0]);
      ctx.p.translate(-this.transform.getX(), -this.transform.getY());
    },

    /** Changes origin to entity center **/
    modelToAnchor: function(ctx) {
      var dx = this.transform.getX() % Tuum.pjs.toPixelView,
          dy = this.transform.getY() % Tuum.pjs.toPixelView;

      ctx.p.rotate(-this.transform.rot[0]);
      ctx.p.translate(-dx, -dy);
    }

  });

  return nsp;
})(nsp.pjs || {});

  return nsp;
})(Tuum || {});
