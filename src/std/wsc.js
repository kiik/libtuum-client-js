
var Tuum = (function(nsp) {

  function parseMessageBlob(input, cb)
  {
    var r = new FileReader();

    r.onload = function(ev) {
      var lines = ev.target.result.split("\n");

      lines.forEach(function(elm) {
        if(!elm) return;

        var buf = null;

        try {
          buf = JSON.parse(elm);
        } catch (e) {
                console.log(e, elm);
        }

        var mId = buf._, data = buf.v;

        cb(mId, data);
      });
    }

    r.readAsText(input);
  }

  var Stream = function() {
    this.init();
  }

  Stream.prototype = {
    init: function() {
      this._evs = {
        data: function(){},
        end: function(){},
      };
    },
    on: function(ev, cb) {
      this._evs[ev] = cb;
    },
    push: function(data) {
      this._evs['data'](data);
    },
    end: function() {
      this._evs['end']();
    }
  }

  function WSCheck() {
    if("WebSocket" in window) return true;
    return false;
  }

  nsp.WSClient = function() {

    this.init();
  };

  nsp.WSClient = Tuum.EventEmitter.Extend({
    init: function(params) {
      Tuum.EventEmitter.prototype.init.apply(this);

      this.ws = null;
      this._wsSetupTime = null;

      this._ready_flag = false;
      this._conn_flag = false;
      this._delay_flag = false;

      if(!WSCheck()) {
        alert("WebSocket NOT supported by your Browser!");
        return;
      }

      this._queue = [];
      this._ctx = {};
      this._streamCtx = {};
      this._seq = 1;

      this.host = params.host;
      this.protocol = params.protocol;

      this.ReadyState = {
        Init: -1,
        Disconnect: 0,
        Connect: 1,
        Ready: 2,
        Delay: 3,
      };

      this.readyState = this.ReadyState.Init;
    },
    setup: function() {
      this.wsSetup();
    },
    wsSetup: function(params) {
      if(this._ready_flag) return;

      var that = this;

      console.log('[Tuum.WSC::wsSetup]Connecting...');
      this._conn_flag = true;
      this.readyState = this.ReadyState.Connect;

      function placeholderFn() {}

      if(this.ws != null) {
        this.ws.onopen = placeholderFn;
        this.ws.onerror = placeholderFn;
        this.ws.onclose = placeholderFn;
        this.ws.onmessage = placeholderFn;

        delete this.ws;
        this.ws = null;
      }

      if(this.ws == null) {
        this.ws = new WebSocket(this.host, this.protocol);
        this.ws.binaryType = "arraybuffer";

        this.ws.onopen = function() {that.onOpen.apply(that, arguments);};
        this.ws.onerror = function() {that.onClose.apply(that, arguments);};
        this.ws.onclose = function() {that.onClose.apply(that, arguments);};
        this.ws.onmessage = function (evt) {that.onMessage.apply(that, arguments);};

        this._pong = null;
        this._watchdog = setInterval(function() {
          that.watchdogTick();
        }, 500);

        this.on('pong', function() {
          this._pong = new Date();
        });
      }

      this._wsSetupTime = new Date();
    },

    ping: function() {
      //TODO: Handle offline state
      if(this._ready_flag)
        this.ws.send(JSON.stringify({_:0}));
    },
    watchdogTick: function() {
      var now = new Date();

      this.ping();

      if(this._pong != null) {
        var dt = (now - this._pong);

        if(this.readyState >= this.ReadyState.Ready)
          if(dt >= 1500) {
            this.readyState = this.ReadyState.Delay;
            this._delay_flag = true;
          } else {
            this.readyState = this.ReadyState.Ready;
            this._delay_flag = false;
          }
      }

      if(this.readyState < this.ReadyState.Ready)
        if(now - this._wsSetupTime > 5000) this.wsSetup();
    },

    isAvailable: function() { return this._ready_flag; },

    onOpen: function() {
      if(this.ws.readyState != 1) {
        console.log('[WSC::onOpen ]Error: socket not ready. ', this.ws.readyState);
        return;
      }

      var that = this;

      console.log('[Tuum.WSC::onOpen]Connected.', arguments);
      this._ready_flag = true;
      this._conn_flag = false;
      this.readyState = this.ReadyState.Ready;

      this._queue.forEach(function(elm) {
        that.ws.send(elm);
      });

      this._queue = [];
      this.emit('connected');
    },
    onClose: function() {
      console.log('WS connection closed.', arguments);
      this._ready_flag = false;
      this._conn_flag = false;
      this.readyState = this.ReadyState.Disconnect;
      this.emit('disconnected');
    },
    onMessage: function(evt) {
      var that = this;

      if(evt.data instanceof Blob) {
        var out = [];

        parseMessageBlob(evt.data, function(mId, data) {
          var stream;

          if(!that._streamCtx.hasOwnProperty(mId)) {
            var handler = that._ctx[mId];
            stream = new Stream();

            handler[0](stream);
            that._streamCtx[mId] = stream;
          } else stream = that._streamCtx[mId];

          if(data.length == 3 && data == 'EOF') stream.end();
          else stream.push(data);
        });

      } else if(evt.data instanceof ArrayBuffer) {
        var stream = null;
        var enc = new TextDecoder();
        var rows = enc.decode(evt.data).split('\n');

        rows.forEach(function(elm) {
          if(!elm) return;

          var msg = JSON.parse(elm);

          if(!msg) {
            console.log('DBG', msg);
            return;
          }

          const mId = msg._, data = msg.v;

          if(stream == null) {
            if(!that._streamCtx.hasOwnProperty(mId)) {
              const handler = that._ctx[mId];
              stream = new Stream();

              handler[0](stream);
              that._streamCtx[mId] = stream;
            } else stream = that._streamCtx[mId];
          }

          if(data.length == 4 && data == 'DONE') stream.end();
          else stream.push(data);
        });

      } else {
        const msg = JSON.parse(evt.data);
        const handler = this._ctx[msg._];

        //TODO: Store index outside of response data scope
        if(msg._ != 0) handler[0](msg, msg._);
        else that.emit('pong');
      }
    },

    send: function(data) {
      //TODO: Handle offline state
      var that = this;
      var payload = {};

      for(var key in data) if(data.hasOwnProperty(key)) payload[key] = data[key];
      payload._ = this._seq++;

      //TODO: Catch errors
      //TODO: Handle not ready flag
      var dat = JSON.stringify(payload);
      if(this._ready_flag)
        this.ws.send(dat);
      else {
        this._queue.push(dat);
      }

      return new Promise(function(resolve, reject) {
        that._ctx[payload._] = [resolve, reject];
      });
    },

    feed: function(data) {
      var that = this;
      var payload = {};

      for(var key in data) if(data.hasOwnProperty(key)) payload[key] = data[key];
      payload._ = this._seq++;

      var dat = JSON.stringify(payload);

      if(this._ready_flag)
        this.ws.send(dat);
      else {
        this._queue.push(dat);

        if(!this._conn_flag) {
          this._conn_flag = true;
          this.wsSetup();
        }
      }

      return new Promise(function(resolve, reject) {
        var obj = new GR.ObjectFeed(function reducer(data) {
          this.emit('data', data);
        });

        that._ctx[payload._] = [function streamPromiseResolver(data) {
          obj.digest(data);
        }, reject];

        resolve(obj);
      });
    },

  });

  return nsp;
})(Tuum || {});
