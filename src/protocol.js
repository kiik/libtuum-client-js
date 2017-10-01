
var Tuum = (function(nsp) {

  var Protocol = Tuum.EventEmitter.Extend({
    init: function(wsc) {
      Tuum.EventEmitter.prototype.init.apply(this);

      return this;
    },
    setup: function() {

    },

    protocolRefresh: function() {
      var that = this;

      const data = {
        'nsp': '*'
      };

      this.send(data).then(function(res) {
          if(!res) throw new Error('[Tuum::ProtocolResolver]Undefined protocol response!');
          var comm = that.protocolParse(res.protocols);
          that.emit('protocol', comm);
        }
      );
    },

    protocolParse: function(protocols) {
      var that = this;
      var comm = {}; // Communication api object

      console.log(protocols);
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

                if(typeof arguments[ix] === 'undefined') throw new Error(String.format("libtuum::{0} - missing '{1}' argument! ( n={2}, arguments={3} )", formatEndpointName(rsc.urn), spec.k, ix, JSON.stringify(arguments)));

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

  nsp.ProtocolResolver = Protocol;

  nsp.protocolFactory = function(wsc) {
    return new Protocol(wsc);
  }

  return nsp;
})(Tuum || {});
