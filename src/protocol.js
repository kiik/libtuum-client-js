
var Tuum = (function(nsp) {

  var Protocol = Tuum.EventEmitter.Extend({
    init: function(wsc) {
      Tuum.EventEmitter.prototype.init.apply(this);

      this.srv = wsc;
      return this;
    },

    send: function(data) {
      return this.srv.send(data); // Returns promise which resolves to server response
    },

    refresh: function() {
      var data = {'nsp': '*'};
      var that = this;

      this.send(data).then(
        function(res) {
          var comm = that.parseProtocols(res.protocols);
          that.emit('protocol', comm);
        }
      );
    },

    parseProtocols: function(protocols) {
      var that = this;
      var comm = {}; // Communication api object

      for(var p_ix in protocols) {
        var p = protocols[p_ix];
        var nsp = p.uri;

        for(var ix in p.rscs) {
          var rsc = p.rscs[ix];
          var fn = formatEndpointName(rsc.urn);

          comm[fn] = (function(nsp, rsc) {
            return function() {
              var data = {
                nsp: nsp,
                uri: rsc.uri,
              }

              if(arguments.length != rsc.args.length)
                throw new Error((String.format("libtuum::{0} - invalid argument count '{1} != {2}' ( '{3}' )", formatEndpointName(rsc.urn), arguments.length, rsc.args.length, data.uri)));

              for(var ix in rsc.args) {
                var spec = rsc.args[ix];

                if(!arguments[ix]) throw new Error(String.format("libtuum::{0} - missing '{1}' argument (n={2})", formatEndpointName(rsc.urn), spec.k, ix));

                if(spec.t == 0)
                  data[spec.k] = parseInt(arguments[ix]);
                else if(spec.t == 1)
                  data[spec.k] = String(arguments[ix]);
                else if(spec.t == 2)
                  data[spec.k] = arguments[ix];
              }

              return that.send(data);
            }
          })(nsp, rsc);

        }
      }

      this.comm = comm;
      return comm;
    }
  });

  nsp.protocolFactory = function(wsc) {
    return new Protocol(wsc);
  }

  return nsp;
})(Tuum || {});
