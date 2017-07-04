
var Tuum = (function(nsp) {

  var round = function(v, c) {
    return Math.round(v * c) / c;
  }

  var Device = Tuum.EventEmitter.Extend({
    init: function(info) {
      Tuum.EventEmitter.prototype.init.apply(this);

      this.info = info;
      this.addr = String.format('ws://{0}:8080', info.local_ip || 'localhost');
      this.wsc = Tuum.wsClientFactory(this.addr, 'ws-json');
      this.protocol = Tuum.protocolFactory(this.wsc);

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

      var that = this;

      this.wsc.on('connect', function() {
        that.meta.connected = true;
        that.refreshState();
        if(!that.meta.protocol) that.protocol.refresh();
      });

      this.wsc.on('disconnect', function() {
        that.meta.connected = false;
        that.refreshState();
      });

      this.protocol.on('protocol', function(ev, comm) {
        that.comm = comm;
        that.meta.protocol = true;
        that.refreshState();

        if(that.isReady()) that.emit('ready');
      });

      this.addHook('ready', function(ev, cb) {
        if(this.isReady()) cb(ev, this);
      });

      // Job spec data
      this.Job = Tuum.FindExtension('TuumJobMod')(this);
    },
    when: function(ev, cb) {
      var fn = null;
      if(ev in this._when) fn = this._when[ev];

      fn.apply(this, [ev, cb]); // If condition met run callback immediately
      var that = this;
      Tuum.EventEmitter.prototype.on.apply(this, [ev, function() {fn.apply(that, [ev, cb]);}]);
    },
    addHook: function(label, cb) {
      this._when[label] = cb;
    },

    getName: function() { return this.info.name; },

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

    getName: function() { return this.info.name; },

    getCenter: function() {
      return { latitude: this.data.gps.lat, longitude: this.data.gps.lng }
    },

    enable: function() {
      this.ready = true;
    },
    disable: function() {
      this.ready = false;
    },


    telemetryProcess: function() {
      if(!this.isReady()) return;
      var that = this;

      this.comm.getGlobalPosition().then(function(data) {
        if(data.res >= 0) {
          that.data.gps.lat = data.lat; // gpsFix(data.lat);
          that.data.gps.lng = data.lng; // gpsFix(data.lng);
          that.emit('gps', that.data.gps);
        }

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
      });

      this.comm.getLocalPose().then(function(data) {
        that.data.pose = data;
        that.emit('pose', that.data.pose);
      });

      this.comm.getLocalMaps().then(function(data) {
        that.data.maps = data;
        that.emit('local-maps', that.data.maps);
      });
    }
  });

  nsp.deviceConnect = function(device_info) {
    return new Device(device_info);
  }

  return nsp;
})(Tuum || {});
