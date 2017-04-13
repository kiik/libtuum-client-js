
var Tuum = (function(nsp) {

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
        ldr: { values: zArray(16), obstacles: zArray(16) },
        last_updated: 0,
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
        that.data.gps.lat = data.lat;
        that.data.gps.lng = data.lng;
        that.emit('gps', that.data.gps);
      });
    }
  });

  nsp.deviceConnect = function(device_info) {
    return new Device(device_info);
  }

  return nsp;
})(Tuum || {});
