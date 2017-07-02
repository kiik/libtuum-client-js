
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

      var localMapMarker = new google.maps.Marker({
        position: {lat: 0, lng: 0},
        label: 'Map#null',
        map: this.map
      });

      var localMapBounds = Tuum.Path();
      localMapBounds.uiBind(this.map);

      var targetTrajMarker = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: {lat: 0, lng: 0},
        radius: 10
      });


      //TODO: Optional panning
      dev.addListener('gps', function(ev, data) {
        marker.setPosition(data);

        if(pan) {
          that.map.panTo(data);
          that.map.setZoom(18);
          pan = false;
        }

        var len = that.selectedPath.calcDelta(data).length();
        if(len >= that.step || that.selectedPath.points.length < 2) {
          that.selectionMarker.setPosition(data);
          that.selectedPath.push(data);
        }
      });

      dev.addListener('pose', function(ev, data) {

      });

      dev.addListener('local-maps', function(ev, data) {
        if(dev.data.pose != null) {
          for(var ix in data.maps) {
            var m = data.maps[ix];

            if(m.id == dev.data.pose.mapId) {
              localMapMarker.setPosition({lat:m.anchor[0], lng:m.anchor[1]});
              localMapMarker.setLabel(String.format("Map#{0}", m.id));

              //targetTrajMarker.setCenter(...);

              for(var i in m.gps_bounds) {
                var p = m.gps_bounds[i];
                localMapBounds.push({lat: p[0], lng: p[1]});
              }
            }
          }
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
