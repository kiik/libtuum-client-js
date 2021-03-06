
var Tuum = (function(nsp) {

  nsp.WSComm = Tuum.WSClient.Extend(
    Tuum.ProtocolResolver.Extend(
    {
      init: function(params) {
        Tuum.WSClient.prototype.init.apply(this, [params]);
        Tuum.ProtocolResolver.prototype.init.apply(this, [this.ws]);
      },
      setup: function() {
        Tuum.WSClient.prototype.setup.apply(this);
        Tuum.ProtocolResolver.prototype.setup.apply(this);
      }
    }
  ).prototype);

  nsp.wsCommFactory = function(params) {
    return new nsp.WSComm(params);
  }

  return nsp;
})(Tuum || {});
