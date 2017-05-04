
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

      /*
      this.device.getPerceptionData().then(function(data) {
        console.log('[NSC::process]#TODO: ', data);
      });*/

      var v = this.dev.data.navi.v, w = this.dev.data.navi.w;
      this.scene.getAgent().getComponent('MotionView').setVelocity(v, w);
    }
  });

  return nsp;
})(Tuum || {});
