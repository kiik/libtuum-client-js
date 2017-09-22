

var Tuum = (function(nsp) {

/** :namespace Tuum.pjs: **/
nsp.pjs = (function(nsp) {

  nsp.toPixelView = 20;

  nsp.mdl = (function(nsp) {

    nsp.createAgentMarker = function(pJS, length) {
      if(typeof length == 'undefined') length = 2 * Tuum.pjs.toPixelView;

      var out = new Tuum.pjs.Mesh2D();

      var l_05 = length / 2, l_03 = length / 3;

      out.setType(pJS.QUADS);
      out.setVertices([
        [-l_05, -l_03],
        [-l_05, l_03],
        [l_05, 0],
        [-l_05, -l_03],
      ]);

      out.draw = function(p) {
        p.fill(89, 171, 227, 120);
        p.stroke(249, 105, 14, 250);

        Mesh2D.prototype.draw.call(this, p);
      }

      return out;
    }

    return nsp;
  })(nsp.mdl || {});

  nsp.NaviScene = nsp.Scene.Extend({
    init: function(canvas) {
      nsp.Scene.prototype.init.apply(this, [canvas]);

      this.warnMsg = null;
    },

    loadScene: function(ctx) {
      this.ctx = ctx;
      console.log('Loading NaviScene...');
      //var entity = this.createObject();
      //entity.addComponent(new DemoComponent());

      var d1 = this.createAgent();
      //var d2 = this.createAgent(ctx);

      this.agent = d1;
      this.console = this.createConsole();

      var o = this.createEntity();
      o.transform.translate(100);
      this.entities.push(o);

      //d2.transform.translate(this.toSceneCoords([300, 200]));
    },

    createAgent: function() {
      var ctx = this.ctx;
      var drone = this.createObject();

      drone.addComponent(new nsp.GridWidget());

      var rend = new nsp.Renderer2D();
      rend.set('model', nsp.mdl.createAgentMarker(ctx.p));
      drone.addComponent(rend);

      drone.addComponent(new nsp.MotionView());
      drone.addComponent(new nsp.Label2D("d#1"));

      return drone;
    },
    createEntity: function() {
      var ctx = this.ctx;
      var obj = this.createObject();

      obj.addComponent(new nsp.TestComponent());

      return obj;
    },

    getAgent: function() { return this.agent; },

    createConsole: function() {
      var ctx = this.ctx;

      this._consoleEntity = this.createObject();

      var console = new nsp.Console();
      this._consoleEntity.addComponent(console);

      return console;
    },

    setWarning: function(msg) {
      if(msg == this.warnMsg) return;

      dt = 5000;
      this.warnMsg = msg;

      if(msg == null) return;
      this.console.newPopup(msg, dt);

      var that = this;
      setTimeout(function() {
        that.warnMsg = null;
      }, dt);
    }

  });

  nsp.createNaviScene = function(canvas) {
    return new nsp.NaviScene(canvas);
  }

  return nsp;
})(nsp.pjs || {});

  return nsp;
})(Tuum || {});
