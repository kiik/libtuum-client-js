
var Tuum = (function(nsp) {

  var MapUI = Class.Extend({
    init: function(gmap) {
      this.map = gmap;
      this.devs = [];
    },
    markDevice: function(dev) {
      this.devs.push(dev);
      var that = this;

      var marker = new google.maps.Marker({
        position: {lat: 0, lng: 0},
        label: dev.getName(),
        map: this.map
      });

      dev.addListener('gps', function(ev, data) {
        marker.setPosition(data);
        that.map.panTo(data);
        that.map.setZoom(18);
      });

      return this.devs.length - 1;
    }
  });

  nsp.MapController = function(map_elem) {

    var gmap = new google.maps.Map(map_elem, {
      zoom: 8,
      center: {lat: 58.756972, lng: 25.638104}
    });

    return new MapUI(gmap);
  }

  return nsp;
})(Tuum || {});
