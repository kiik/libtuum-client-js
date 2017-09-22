
var Tuum = (function(nsp) {

  var data = {
    // Perception data
    perc: {
      data: [
        [234, 314], [123, 124], [123, 140]
      ]
    },

    // Map data
    map: {
      node: {
        id: 123,
        name: 'Segment #123',
        landmarks: [
          [250, 413], [125, 571], [300, 200]
        ]
      }
    },

    // Navigation mesh
    navmesh: {
      paths: [
        {id: 231, data: [[250, 412], [280, 440], [300, 450]]}
      ]
    },
  }

  nsp.NaviSceneController = Class.Extend({
    init: function(device, scene) {
      this.dev = device;
      this.scene = scene;

      this.running = true;
    },

    process: function() {
      if(!this.running) return;
      if(!this.dev.isReady()) {
        this.scene.setWarning("[NaviSceneCtl]Device not ready!");
        return;
      }

      var ag = this.scene.getAgent();

      var v = this.dev.data.navi.v, w = this.dev.data.navi.w;
      ag.getComponent('MotionView').setVelocity(0, 0);

      if(this.dev.data.pose) {
        var p = this.dev.data.pose.pos, o = this.dev.data.pose.ori;
        var path = this.dev.data.path;
        if(path && path.length > 0) {
          var wp = path[0].wps[0];

          ag.transform.position = [p[0], p[1], 0];
          ag.transform.setRotation(o);
          ag.getComponent('MotionView').setTarget(wp);
        }
      }
    }
  });

  return nsp;
})(Tuum || {});
