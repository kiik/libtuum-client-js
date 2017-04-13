
var Tuum = (function(nsp) {



  var MapUI = Class.Extend({
    init: function(gmap) {
      this.map = gmap;
      this.devs = [];

      var that = this;

      this.selectionMarker = new google.maps.Marker({
        position: {lat: 0, lng: 0},
        label: 'S0',
        map: this.map,
      });

      this.selectedPath = Tuum.Path();

      this.selectionMarker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
      this.selectedPath.uiBind(this.map);

      this.step = 0.00005;

      this.map.addListener('click', function(e) {
        var dat = {lat: e.latLng.lat(), lng: e.latLng.lng()};

        /*
        var len = that.selectedPath.calcDelta(dat).length();

        if(len >= that.step || that.selectedPath.points.length < 2) {
          that.selectionMarker.setPosition(e.latLng);
          that.selectedPath.push(dat);
        }
        */
      });

      this.map.addListener('mousemove', function(e) {
        //console.log(e.latLng);
        var dat = {lat: e.latLng.lat(), lng: e.latLng.lng()};
        that.selectedPath.highlight(dat);
      });
    },

    markDevice: function(dev, pan) {
      if(typeof pan === 'undefined') pan = false;

      this.devs.push(dev);
      var that = this;

      var marker = new google.maps.Marker({
        position: {lat: 0, lng: 0},
        label: dev.getName(),
        map: this.map
      });

      //TODO: Optional panning
      dev.addListener('gps', function(ev, data) {
        marker.setPosition(data);

        if(pan) {
          that.map.panTo(data);
          that.map.setZoom(18);
        }

        var len = that.selectedPath.calcDelta(data).length();
        if(len >= that.step || that.selectedPath.points.length < 2) {
          that.selectionMarker.setPosition(data);
          that.selectedPath.push(data);
        }
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
