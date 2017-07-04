
var Tuum = (function(nsp) {

  function optional_iterator(input, cb) {
    if(Array.isArray(input)) {
      for(var ix in input) cb(input[ix]);
      return 1;
    } else cb(input);
    return 0;
  }

  var MapUIDataBinder = Class.Extend({
    init: function(parent) {
      this._ui = parent;
      this._ctx = {};
      this._lod = {};
      this._z = this._ui.map.getZoom();

      var that = this;
      google.maps.event.addListener(this._ui.map, 'zoom_changed', function() {
        var z = that._ui.map.getZoom();
        if(z == that._z) return;

        if((z < 16) && (that._z >= 16)) {
          for(var key in that._ctx) {
            var d = that._ctx[key];

            var res = optional_iterator(d, function(elem) {
              if('ui' in elem)
                elem.ui.setMap(null);
              else
                elem.setMap(null);
            });

            if(res == 0) {
              if(d.lodAnchor) {
                that._lod[key] = new google.maps.Marker({
                  position: d.lodAnchor,
                  label: key,
                  map: that._ui.map,
                });
              }
            }
          }
        } else if((z >= 16) && (that._z < 16)) {
          for(var key in that._ctx) {
            var d = that._ctx[key];

            var res = optional_iterator(d, function(elem) {
              if('ui' in elem)
                elem.ui.setMap(that._ui.map);
              else
                elem.setMap(that._ui.map);
            });

            if(res == 0) {
              if(key in that._lod) {
                var e = that._lod[key];
                e.setMap(null);
                delete that._lod[key];
              }
            }
          }
        }

        that._z = z;
      });
    },
    _clear: function(label, data) {
      if(label in this._ctx) delete this._ctx[label];
    },
    polygon: function(label, data) {
      this._clear(label, data);

      if(!data) return;

      var ui_path = [];

      for(var ix in data) {
        var d = data[ix];
        ui_path.push({lat: d[0], lng: d[1]});
      }

      this._ctx[label] = {
        ui: new google.maps.Polyline({
          path: ui_path,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2,
          map: this._ui.map
        }),
        lodAnchor: ui_path[0]
      };

    },
    nodes: function(label, data) {
      this._clear(label, data);

      if(!data) return;

      var out = [];

      for(var ix in data) {
        var d = data[ix];

        var ui = new google.maps.Marker({
          position: {lat: d[0], lng: d[1]},
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 2,
            fillColor: 'red',
            fillOpacity: 0.8
          },
          label: 'S'+ix,
          map: this._ui.map,
        });

        out.push(ui);
      }

      this._ctx[label] = out;
    },
    path: function(label, data) {
      this._clear(label, data);

      if(!data) return;

      var ui_path = [];

      for(var ix in data) {
        var d = data[ix];
        ui_path.push({lat: d[0], lng: d[1]});
      }

      this._ctx[label] = {
        ui: new google.maps.Polyline({
          path: ui_path,
          geodesic: true,
          strokeColor: '#00FF00',
          strokeOpacity: 1.0,
          strokeWeight: 1,
          map: this._ui.map
        })
      };

    },
  });

  var MapUI = Class.Extend({
    init: function(gmap) {
      this.map = gmap;
      this.devs = [];

      this.$ = new MapUIDataBinder(this);

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
    view: function(p) {
      this.map.panTo({lat: p[0], lng: p[1]});
      this.map.setZoom(16);
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
        map: this.map,
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
