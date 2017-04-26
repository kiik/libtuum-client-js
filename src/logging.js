

var Tuum = (function(nsp) {

  /** Event fields: {'msg', 'ctx'} **/
  var EventLog = Class.Extend({
    init: function() {
      this.data = [];
    },
    push: function(elem) {
      this.data.push(elem);
    },
    pop: function() {
      return this.data.pop();
    },
    size: function() {
      return this.data.length;
    },
    read: function() {
      var out = this.data;
      this.data = [];
      return out;
    }
  });

  nsp.gEventLog = new EventLog();

  return nsp;
})(Tuum || {});
