
var Tuum = (function(nsp) {

  var Device = Class.Extend({
    init: function(info) {
      this.addr = String.format('ws://{0}:8080', info.local_ip || 'localhost');
      this.wsc = Tuum.wsClientFactory(this.addr, 'ws-json');
      this.protocol = Tuum.protocolFactory(this.wsc);
    },
  });

  nsp.deviceConnect = function(device_info) {
    return new Device(device_info);
  }

  return nsp;
})(Tuum || {});
