
var Tuum = (function(nsp) {

  var Vec2D = Class.Extend({
    init: function(x, y) {
      this.x = x;
      this.y = y;
    },

    length: function() {
      return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
  });

  var Path = Class.Extend({
    init: function() {
      this.points = [];

      this.path = null;
      this.rect = [0, 0, 0, 0];

      this.ui = null;

      this.poly = null;
      this.rectPoly = null;
    },

    uiBind: function(obj) {
      this.ui = obj;
      this._dataInit();
    },

    _dataInit: function() {
      this.path = [];

      this.poly = new google.maps.Polyline({
        path: [],
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

      this.rectPoly = new google.maps.Polyline({
        path: [],
        geodesic: true,
        strokeColor: '#00FF00',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

      this.rectPoly.setMap(this.ui);
      this.poly.setMap(this.ui);
    },
    _rectInit: function(p1, p2) {
      this.rect = [
        Math.min(p1.lat, p2.lat),
        Math.min(p1.lng, p2.lng),
        Math.max(p1.lat, p2.lat),
        Math.max(p1.lng, p2.lng)
      ];
    },
    _rectUpdate: function(p) {
      this.rect = [
        Math.min(this.rect[0], p.lat),
        Math.min(this.rect[1], p.lng),
        Math.max(this.rect[2], p.lat),
        Math.max(this.rect[3], p.lng)
      ];

      var path = [
        {lat: this.rect[0], lng: this.rect[1]},
        {lat: this.rect[2], lng: this.rect[3]}
      ];

      this.rectPoly.setPath(path);
    },

    push: function(point) {
      this.points.push(point);

      if(this.points.length == 2)
        this._rectInit(this.points[0], this.points[1]);
      else if(this.points.length > 2)
        this._rectUpdate(point);

      if(this.points.length >= 2)
        this.poly.setPath(this.points);
    },

    calcDelta: function(p) {
      if(this.points.length == 0) return new Vec2D(0, 0);

      var p2 = this.points[this.points.length - 1];
      return new Vec2D(p.lat - p2.lat, p.lng - p2.lng);
    },

    highlight: function(p) {

    }
  });

  nsp.Path = function() {
    return new Path();
  }

  return nsp;
})(Tuum || {});
