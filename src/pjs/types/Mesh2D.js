

var Tuum = (function(nsp) {

/** :namespace Tuum.pjs: **/
nsp.pjs = (function(nsp) {

  nsp.Mesh2D = Class.Extend({
    init: function() {
      this.vertices = [];
    },

    setType: function(t) { this.vType = t; },
    setVertices: function(vxs) { this.vertices = vxs; },

    draw: function(p) {
      p.beginShape(this.vType);
      for(var ix = 0; ix < this.vertices.length; ix++)
      p.vertex.apply(p, this.vertices[ix]);
      p.endShape();
    }
  });

  return nsp;
})(nsp.pjs || {});

  return nsp;
})(Tuum || {});
