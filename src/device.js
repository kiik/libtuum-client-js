
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
        last_updated: 0,

        navi: { v: 0, w: 0 },

        /*
        org: {
          inv: {
            containers: 6,
            avail_sample_n: 60,
          },
          storage: {
            containers: 6,
            samples: 16
          },
          sampler: {
            extrusion: 2,
            moisture: 24,
            temp: 5,
          },
          job: {
            name: 'Väli nr 3',
            class: 'soil-sampler',
            next_node: 17,
            samples_n: 16,
            samples_N: 78,
            wp_n: 1,
            wp_N: 13,
            travel: 0.7,
            dist: 5.1
          }
        }*/
      };

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
      });

      // Demo
/*
      setTimeout(function() {
        that.emit('connect');
        that.emit('protocol');

        that.data.gps = {lat: 58.389177, lng: 26.692365};
        console.log(that.data);
        that.emit('gps', that.data.gps);
        that.emit('model-update');
      }, 3000);
*/
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

      this.comm.getGPS().then(function(data) {
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
      });
    }
  });

  nsp.deviceConnect = function(device_info) {
    return new Device(device_info);
  }

  return nsp;
})(Tuum || {});
