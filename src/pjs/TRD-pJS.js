
var Mesh2D = function(mesh) {

}

Mesh2D.prototype.setType = function(t) {
  this.vType = t;
}

Mesh2D.prototype.setVertices = function(vxs) {
  this.vertices = vxs;
}

Mesh2D.prototype.draw = function(p) {
  p.beginShape(this.vType);
  for(var ix = 0; ix < this.vertices.length; ix++)
    p.vertex.apply(p, this.vertices[ix]);
  p.endShape();
}


var TRD_mdl = {
  axleLength: 58,
  axleWidth: 64,
  jointWidth: 12,

  frameChamfer: 6,

  createAxle: function(p) {
    var out = new Mesh2D();

    var l = TRD_mdl.axleLength, w0 = TRD_mdl.jointWidth, w1 = TRD_mdl.axleWidth;
    var w0_05 = w0 / 2, w1_05 = w1 / 2, l_05 = l / 2, dx = -l_05;

    out.setType(p.QUADS);
    out.setVertices([
      [-l_05 + dx, -w0_05],
      [-l_05 + dx, w0_05],
      [l_05 + dx, w1_05],
      [l_05 + dx, -w1_05],
    ]);

    out.draw = function(p) {
      p.fill(200, 200, 200);
      p.stroke(0, 0, 0);

      Mesh2D.prototype.draw.call(this, p);
    }

    return out;
  },

  createFrame: function(p) {
    var out = new Mesh2D();

    var l = TRD_mdl.axleLength, w1 = TRD_mdl.axleWidth, ch = TRD_mdl.frameChamfer;
    var w1_05 = w1 / 2.6, l_05 = l / 1.4;

    out.setType(null);
    out.setVertices([
      [-l_05, w1_05],
      [-l_05 + ch, w1_05 + ch],
      [l_05 - ch, w1_05 + ch],
      [l_05, w1_05],
      [l_05, -w1_05],
      [l_05 - ch, -w1_05 - ch],
      [-l_05 + ch, -w1_05 - ch],
      [-l_05, -w1_05],
      [-l_05, w1_05],
    ]);

    out.draw = function(p) {
      p.fill(0, 0, 0, 0);
      p.stroke(0, 0, 50, 120);

      Mesh2D.prototype.draw.call(this, p);
    }

    return out;
  },
}
