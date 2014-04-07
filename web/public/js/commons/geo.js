(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as anonymous module.
    define([], factory);
  } else {
    // Browser globals.
    factory();
  }
}(function () {
  // Save a reference to the global object (`window` in the browser, `exports`
  // on the server).
  var root = this;
  root._success_tries = 4;

  //GEOLOCATION
  function fetchPos(success, error) {
    if (hasGeolocation()) {
      var options = getPosOptions();
      if (root._watchPos) {
        navigator.geolocation.clearWatch(root._watchPos);
        root._watchPos = null;
      }
      root._success_count = 0;
      root._watchPos = navigator.geolocation.watchPosition(success, error, options);
    }
  }

  function getPosOptions() {
    return {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 30000
    };
  }

  function hasGeolocation() {
    return typeof navigator.geolocation !== 'undefined';
  }

  //UTILS
  function getObject(pos) {
    return {
      lng: pos.coords.longitude,
      lat: pos.coords.latitude,
      accuracy: pos.coords.accuracy,
      altitude: pos.coords.altitude || 0,
      altitude_accuracy: pos.coords.altitudeAccuracy || 0,
      heading: pos.coords.heading || 0,
      speed: pos.coords.speed || 0,
      timestamp: pos.timestamp
    };
  }

  //METHODS
  var Methods = {
    clean: function () {
      console.log('Geo:clean');
      root._position = null;
      root._position_error = null;
    },

    fetch: function () {
      console.log('Geo:fetch');
      fetchPos(this.fetchPosSuccess, this.fetchPosError);
    },

    fetchPosSuccess: function (pos) {
      root._success_count++;
      root._position_error = null;
      console.log('Geo:fetch:success', root._success_count);
      var oldPosition = root._position;
      root._position = getObject(pos);
      if (root._listener) {
        if (!oldPosition || Methods.getDistance(oldPosition, root._position) >= 0.01) {
          root._listener.newPosition(root._position);
        }
      }
      if (root._success_tries < root._success_count && root._watchPos) {
        navigator.geolocation.clearWatch(root._watchPos);
        root._watchPos = null;
      }
    },

    fetchPosError: function (error) {
      console.log('Geo:fetch:error', error, root._success_count);
      root._position_error = error;
      if (root._listener && root._success_count === 0) {
        root._listener.newError(root._position_error.code);
      }
    },

    setListener: function (geoLocate) {
      root._listener = geoLocate;
      if (root._position) root._listener.newPosition(root._position);
      else if (root._position_error) root._listener.newError(root._position_error.code);
      else root._listener.setState('loading');
    },
    initGeo: function () {
      /** Converts numeric degrees to radians */
      if (typeof(Number.prototype.toRad) === 'undefined') {
        Number.prototype.toRad = function () {
          return this * Math.PI / 180;
        };
      }
    },
    /**
     * Get distance between two points in km
     * Uses 'haversine' formula
     * http://www.movable-type.co.uk/scripts/latlong.html
     */
    getDistance: function (p1, p2) {
      Methods.initGeo();

      var R = 6371; // km
      var dLat = (p2.lat - p1.lat).toRad();
      var dLon = (p2.lng - p1.lng).toRad();
      var lat1 = p1.lat.toRad();
      var lat2 = p2.lat.toRad();

      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;

      return d;
    }
  };

  //INITIALIZATION
  if (!this.Geo) Methods.fetch();

  // The top-level namespace. All public classes and modules will
  // be attached to this. Exported for both the browser and the server.
  var Geo;
  if (typeof exports !== 'undefined') {
    Geo = exports;
  }
  else {
    Geo = root.Geo = Methods;
  }

  // Return object for define callers
  return Geo;
}));
