
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}



var Input = {
  kmap: {
    M_L: 0, // Mouse left btn
    M_R: 0, // Mouse right btn
    M_S: 0, // Mouse scroll btn
  },

  _tmr_ref: false,
  _inp_tmr: function() {
    if(Input._tmr_ref) {
      Input._tmr_ref = false;
      return;
    }

    Input.kmap.M_S = 0;
  },

  attach: function(canvas) {
    var that = this;

    canvas.addEventListener('mousemove', function(evt) {
      //var mousePos = getMousePos(canvas, evt);
      //var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
      //console.log(canvas, message);
    }, false);

    canvas.addEventListener('mousedown', function(evt) {
      //var mousePos = getMousePos(canvas, evt);
      //var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
      Input.kmap.M_L = 1;
    }, false);

    canvas.addEventListener('mouseup', function(evt) {
      //var mousePos = getMousePos(canvas, evt);
      //var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
      Input.kmap.M_L = 0;
    }, false);

    addWheelListener(canvas, function( e ) {
      Input.kmap.M_S = e.deltaY;
      e.preventDefault();
    });

    //setInterval(Input._inp_tmr, 20);
  },

  postProcess: function() {
    Input.kmap.M_S = 0;
  },

  getMouseLeft: function() { return Input.kmap.M_L; },
  getMouseRight: function() { return Input.kmap.M_R; },
  getMouseScroll: function() { return Input.kmap.M_S; },

  getX: function() { return 0; },
}



var Tuum = (function(nsp) {

/** :namespace Tuum.pjs: **/
nsp.pjs = (function(nsp) {

  nsp.Scene = Class.Extend({
    init: function(canvas) {
      console.log('new scene ', canvas);

      if(canvas.hasOwnProperty('trim')) canvas.asdasd();

      this.canvas = canvas;
      this.$c = $(canvas);

      this.entities = [];

      this.pJS = new Processing(this.canvas, this.start.bind(this));

      var ctx = {p: this.p};

      Input.attach(canvas);

      this.mainCamera = new nsp.Camera();

      this.loadScene(ctx);
      this.setup(ctx);
    },

    start: function(p) {
      var that = this;

      p.size(this.$c.parent().outerWidth(), this.$c.parent().outerHeight());
      this.$c.bind('resize', function() {
        p.size(this.$c.parent().outerWidth(), this.$c.parent().outerHeight());
      });

      this.p = p;

      this.rect = {
        cX: p.width / 2,
        cY: p.height / 2,
        w: p.width,
        h: p.height,
      }

      //TODO: Use separate render method?
      p.draw = this.process.bind(this);
    },

    setup: function(ctx) {
      var p = ctx.p;

      this.lastTick = Date.now();

      this.mainCamera.setup(ctx);

      this.entities.forEach(function(e) {
        e.setup(ctx);
      });
    },

    process: function(p) {
      var p = this.pJS;

      var ctx = {
        p: p,
        scene: this,
        dt: (Date.now() - this.lastTick) / 1000.0,
      }

      this.lastTick = Date.now();

      p.background(0, 0, 0);

      var view = this.mainCamera.getViewMatrix();
      p.scale(1 * view.z, -1 * view.z);
      p.translate(view.x, -this.rect.h - view.y);

      this.mainCamera.process(ctx);

      this.entities.forEach(function(e) {
        e.process(ctx);
      });

      Input.postProcess();

    },

    toSceneCoords: function(vec) {
      return [vec[0], this.rect.h - vec[1]];
    },
    toSceneOffset: function(vec) {
      return [vec[0], -vec[1]];
    },

    loadScene: function(ctx) {

    },

    createObject: function() {
      var e = new nsp.Entity();
      this.entities.push(e);
      return e;
    }

  });

  nsp.createScene = function(canvas) {
    return new nsp.Scene(canvas);
  }

  return nsp;
})(nsp.pjs || {});

  return nsp;
})(Tuum || {});
