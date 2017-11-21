
console.log('libtuum-client-js/device.js version 0.0.1-al.0');

var Tuum = (function(nsp) {

  var round = function(v, c) {
    return Math.round(v * c) / c;
  }

  var Device = Tuum.WSComm.Extend({
    init: function(params) {
      Tuum.EventEmitter.prototype.init.apply(this);
      Tuum.WSComm.prototype.init.apply(this, [{
        host: 'ws://localhost:8079',
        protocol: 'ws-json',
      }]);

      this.params = params;

      this.ready = false;
      this.meta = {
        connected: false,
        protocol: false
      }

      // TODO: Get model spec from device
      this.data = {
        gps: { lat: null, lng: null },
        imu: { head: null, pitch: null, roll: null },
        bat: { U: null, I: null},
        hyd: { oil: null, oil_temp: null, oil_work: null},
        ldr: { values: zArray(16), obstacles: zArray(16) },
        pose: null,
        job: null,
        last_updated: 0,

        navi: { v: 0, w: 0 },
      };

      this._when = {};

      this.pathTickCooldown = false;

      this.setup();
    },
    setup: function() {
      Tuum.WSComm.prototype.setup.apply(this);

      var that = this;

      this.on('connected', function() {
        that.meta.connected = true;
        that.refreshState();
        if(!that.meta.protocol) that.protocolRefresh();
      });

      this.on('disconnected', function() {
        that.meta.connected = false;
        that.refreshState();
      });

      this.on('protocol', function(ev, comm) {
        that.comm = comm;
        that.meta.protocol = true;
        that.refreshState();

        if(that.isReady()) that.emit('ready');
      });

      this.addHook('ready', function(ev, cb) {
        if(this.isReady()) cb(ev, this);
      });

      this.addHook('active-job', function(ev, cb) {
        if(this.isReady()) cb(ev, this);
      });

      this.addHook('active-job-ctx', function(ev, cb) {
        if(this.isReady()) cb(ev, this);
      });

      // Job spec data
      if(Tuum.hasOwnProperty('FindExtension'))
        this.Job = Tuum.FindExtension('TuumJobMod')(this);
    },
    when: function(ev, cb) {
      var fn = null;
      if(ev in this._when) {
        fn = this._when[ev];
      } else return;

      var that = this;

      var middleware = (function(fn) {
        var x = fn;
        return function(x) {
          fn.apply(that, [ev, cb]);

        }
      })(fn);

      var res =  Tuum.EventEmitter.prototype.on.apply(this, [ev, middleware]);

      if(ev == 'ready' && this.isReady()) middleware();

      return res;
    },
    addHook: function(label, cb) {
      this._when[label] = cb;
    },
    unwhen: function(ev, ref) {
      Tuum.EventEmitter.prototype.removeListener.apply(this, [ev, ref]);
    },

    getName: function() { return this.params.name; },

    refreshState: function() {
      if(this.isReady()) this.ready = true;
      else this.ready = false;
    },
    isReady: function() {
      return this.meta.connected && this.meta.protocol;
    },
    isNotReady: function() { return !this.isReady(); },

    getGPS: function() { return this.data.gps; },
    getIMU: function() { return this.data.imu; },
    getBAT: function() { return this.data.bat; },

    getName: function() { return this.params.name; },

    getCenter: function() {
      return { latitude: this.data.gps.lat, longitude: this.data.gps.lng }
    },

    enable: function() {
      this.ready = true;
    },
    disable: function() {
      this.ready = false;
    },

    updatePath: function(data) {
      this.data.path = data.path;
    },

    telemetryProcess: function() {
      if(!this.isReady()) return;
      var that = this;

      //this.comm.getGlobalPosition().then(function(data) {


        /*
        if(data.imu) {
          that.data.imu = {
            'h': round(data.imu.h, 100.0),
            'p': round(data.imu.p, 100.0),
            'r': round(data.imu.r, 100.0)
          }
        }

        if(data.bat)
          that.data.bat = data.bat;

        if(data.hyd)
          that.data.hyd = data.hyd;

        that.data.gps.lat = gpsFix(data.lat);
        that.data.gps.lng = gpsFix(data.lng);
        that.emit('gps', that.data.gps);
        **/
      //});

      /*
      this.comm.getPose().then(function(data) {
        if(data.res >= 0) {
          that.data.gps = data.gpos; // gpsFix(data.lat); gpsFix(data.lng);
          that.emit('gps', that.data.gps);

          that.data.pose = data.pose;
          that.emit('pose', that.data.pose);
        }

      });

      this.comm.getLocalMaps().then(function(data) {
        that.data.maps = data;
        that.emit('local-maps', that.data.maps);
      });

      this.comm.getDriveFeedback().then(function(data) {
        that.data.odometry = data;
      });

      this.comm.getControlMode().then(function(data) {
        that.data.ctlm = data.ctlm;
      });

      if(!this.pathTickCooldown) {
        setTimeout(function() {
          that.comm.getNavPath().then(function(data) {
            if(data != that.data.path)
              that.updatePath(data);

            that.pathTickCooldown = false;
          });
        }, 5000);
        this.pathTickCooldown = true;
      }*/
    }
  });

  nsp.deviceConnect = function(device_info) {
    return new Device(device_info);
  }

  return nsp;
})(Tuum || {});
