
var Tuum = (function(nsp) {

  var WSClient = Tuum.EventEmitter.Extend({
    init: function(addr, ws_protocol_name) {
      Tuum.EventEmitter.prototype.init.apply(this);

      this.ws = new WebSocket("ws://"+"localhost"+":8080/", "ws-json");
      this.packets = {};
      this.packet_id_seq = 0;

      var that = this;

      this.ws.onopen = function() { that.onConnect(); }
      this.ws.onclose = function() { that.onDisconnect(); }
      this.ws.onmessage = function(msg) { that.receive(msg); }
    },
    onConnect: function() {
      this.emit('connect');
    },
    onDisconnect: function() {
      this.emit('disconnect');
    },

    send: function(data) {
      var defer = $.Deferred();

      var id = this.packet_id_seq++;
      data['_'] = id;

      this.packets[id] = {
        time: new Date(),
        cb:defer
      };

      if(this.ws.readyState == 1) {
        var dat = JSON.stringify(data);
        this.ws.send(dat);
      } else {
        //TODO: Proper handling of this case
        console.log(String.format('Error: message send failed, ws not ready ({0})', this.ws.readyState));
      }

      return defer;
    },

    receive: function(msg) {
      var data = JSON.parse(msg.data);

      if(!data.hasOwnProperty("_")) {
        console.log(String.format("Error: no id in message - '{0}'", data));
        return;
      }

      var id = data["_"];
      this.packets[id].cb.resolve(data);
      delete this.packets[id];
    }
  });

  nsp.wsClientFactory = function(addr, ws_protocol_name) {
    return new WSClient(addr, ws_protocol_name);
  }

  return nsp;
})(Tuum || {});
