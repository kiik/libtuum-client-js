
var Tuum = (function(nsp) {

/** :namespace Tuum.pjs: **/
nsp.pjs = (function(nsp) {

  nsp.Transform = Class.Extend({
    init: function() {
      this.pos = [0.0, 0.0, 0.0];
      this.rot = [0.0];

      Object.defineProperty(this, 'x', {
        get: function() {
          return this.pos[0];
        },
        set: function(val) {
          this.pos[0] = val;
        }
      });

      Object.defineProperty(this, 'y', {
        get: function() {
          return this.pos[1];
        },
        set: function(val) {
          this.pos[1] = val;
        }
      });

      Object.defineProperty(this, 'z', {
        get: function() {
          return this.pos[2];
        },
        set: function(val) {
          this.pos[2] = val;
        }
      });

      Object.defineProperty(this, 'position', {
        get: function() {
          return this.pos;
        },
        set: function(val) {
          this.pos[0] = val[0] || 0;
          this.pos[1] = val[1] || 0;
          this.pos[2] = val[2] || 0;
        }
      });
    },

    getX: function() { return this.pos[0]; },
    getY: function() { return this.pos[1]; },

    translate: function(val) {
      if(val.constructor === Array) {
        this.pos[0] += val[0];
        this.pos[1] += val[1];
      } else {
        var alfa = this.rot[0];
        this.pos[0] += Math.cos(alfa) * val;
        this.pos[1] += Math.sin(alfa) * val;
      }
    },

    rotate: function(val) {
      if(val.constructor === Array)
        this.rot[0] += val[0];
      else this.rot[0] += val;
    },
    setRotation: function(val) {
      this.rot[0] = val;
    }
  });

  return nsp;
})(nsp.pjs || {});

  return nsp;
})(Tuum || {});
