(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as anonymous module.
    define([], factory);
  } else {
    // Browser globals.
    factory();
  }
}(function () {

  Methods = {

    /**
     * Try document redirection
     * if not supported then error callback
     */
    redirect: function(url, error) {
      try {
        window.location.href = url;
      }catch(err) {
        if(error) error(err);
      }
    },

    /**
     * Try document reloading
     * if fetch == true then force cache refresh
     * if not supported then error callback
     */
    reload: function(fetch, error) {
      try {
        window.location.reload(fetch);
        window.location.href = window.location.href; //Safari compatibility
      }catch(err) {
        if(error) error(err);
      }
    },

    /**
     * Try opening window
     * 
     */
    open: function(url, title, attrs, error) {
      try {
        return window.open(url, title, attrs);
      }catch(err) {
        if(error) error(err);
      }
    },

    /**
     * Try closing self window
     * 
     */
    closeSelf: function(error) {
      try {
        window.open('', '_self', '');
        window.close();
      }catch(err) {
        if(error) error(err);
      }
    },

    /**
     * Browser's
     * TODO: Not even tested
     */
    broMobile: function() {
      return navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i);
    },

    /**
     * Get current browser's name and version numbers
     * http://www.javascripter.net/faq/browsern.htm
     * http://stackoverflow.com/questions/2400935/browser-detection-in-javascript
     */
    getBrowser: function() {
      var nVer = navigator.appVersion;
      var nAgt = navigator.userAgent;
      var browserName  = navigator.appName;
      var fullVersion  = ''+parseFloat(navigator.appVersion); 
      var majorVersion = parseInt(navigator.appVersion,10);
      var nameOffset,verOffset,ix;

      // In Opera (OLD), the true version is after "Opera" or after "Version"
      if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
       browserName = "Opera";
       fullVersion = nAgt.substring(verOffset+6);
       if ((verOffset=nAgt.indexOf("Version"))!=-1) 
         fullVersion = nAgt.substring(verOffset+8);
      }
      // In Opera (NEW), the true version is after "Opera" or after "Version"
      else if ((verOffset=nAgt.indexOf("OPR"))!=-1) {
       browserName = "Opera";
       fullVersion = nAgt.substring(verOffset+4);
       if ((verOffset=nAgt.indexOf("Version"))!=-1) 
         fullVersion = nAgt.substring(verOffset+8);
      }
      // In MSIE, the true version is after "MSIE" in userAgent
      else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
       browserName = "Microsoft Internet Explorer";
       fullVersion = nAgt.substring(verOffset+5);
      }
      // In Chrome, the true version is after "Chrome" 
      else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
       browserName = "Chrome";
       fullVersion = nAgt.substring(verOffset+7);
      }
      // In Safari, the true version is after "Safari" or after "Version" 
      else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
       browserName = "Safari";
       fullVersion = nAgt.substring(verOffset+7);
       if ((verOffset=nAgt.indexOf("Version"))!=-1) 
         fullVersion = nAgt.substring(verOffset+8);
      }
      // In Firefox, the true version is after "Firefox" 
      else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
       browserName = "Firefox";
       fullVersion = nAgt.substring(verOffset+8);
      }
      // In most other browsers, "name/version" is at the end of userAgent 
      else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < 
                (verOffset=nAgt.lastIndexOf('/')) ) 
      {
       browserName = nAgt.substring(nameOffset,verOffset);
       fullVersion = nAgt.substring(verOffset+1);
       if (browserName.toLowerCase()==browserName.toUpperCase()) {
        browserName = navigator.appName;
       }
      }
      // trim the fullVersion string at semicolon/space if present
      if ((ix=fullVersion.indexOf(";"))!=-1)
         fullVersion=fullVersion.substring(0,ix);
      if ((ix=fullVersion.indexOf(" "))!=-1)
         fullVersion=fullVersion.substring(0,ix);

      majorVersion = parseInt(''+fullVersion,10);
      if (isNaN(majorVersion)) {
       fullVersion  = ''+parseFloat(navigator.appVersion); 
       majorVersion = parseInt(navigator.appVersion,10);
      }

      // console.log(
      //   'browserName: '+browserName+', '
      //  +'fullVersion: '+fullVersion+', '
      //  +'majorVersion: '+majorVersion+', '
      // );

      return {
        name: browserName,
        fullVersion: fullVersion,
        majorVersion: majorVersion
      };
    },

    logBrowserRaw: function() {
      var an = window.navigator.appName;
      var ua = window.navigator.userAgent;
      var av = window.navigator.appVersion;
      var ve = window.navigator.vendor;
      console.log('AppName: '+an);
      console.log('UserAgent: '+ua);
      console.log('AppVersion: '+av);
      console.log('Vendor: '+ve);
    },

    /**
     * Get parameter from url
     * 
     */
    getURLParam: function(name) {
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
    },

    /**
     * Get action from hash, trimming the first bit
     * if the first part cannot be trimmed then returns default
     */
    getHashAction: function(pattern, def) {
      var a = window.location.hash.replace(pattern, '');
      return a && a !== '' ? a : def;
    },

    /**
     * Get current URL's extension
     */
    getLtd: function() {
      var hostname = window.location.hostname;
      var ext = hostname.substr(hostname.lastIndexOf('.'), hostname.length) || hostname;
      return ext;
    },

    /**
     * Geo-location
     */
    getPositionWithTimeout: function(success, error, timeout, time) {
      this.callWithTimeout(this.getPosition, success, error, timeout, time);
    },

    getPosition: function(success, error, time) {
      if(this.hasGeolocation()) {
        var options = this.getPositionOptions(time, 0);
        this._getPositionId = navigator.geolocation.getCurrentPosition(success, error, options);
      }
    },

    watchPositionWithTimeout: function(success, error, timeout, time) {
      this.callWithTimeout(this.watchPosition, success, error, timeout, time);
    },

    watchPosition: function(success, error, time) {
      if(this.hasGeolocation()) {
        this.clearWatchPosition();
        var options = this.getPositionOptions(time, 0);
        this._watchPositionId = navigator.geolocation.watchPosition(success, error, options);
      }
    },

    clearWatchPosition: function() {
      navigator.geolocation.clearWatch(this._watchPositionId);
    },

    getPositionOptions: function(time, cache) {
      return {
        enableHighAccuracy: true,
        timeout: time,
        maximumAge: cache
      };
    },

    hasGeolocation: function() {
      return typeof navigator.geolocation !== 'undefined';
    },

    /**
     *  GEO MATH
     */
    initGeo: function() {
      /** Converts numeric degrees to radians */
      if (typeof(Number.prototype.toRad) === "undefined") {
        Number.prototype.toRad = function() {
          return this * Math.PI / 180;
        };
      }
    },

    /**
     *  TIMEOUT
     */
    callOnTimeout: function(cb, time) {
      //Prior cleaning in case gets called repeatedly
      if(this._onTimeout) window.clearTimeout(this._onTimeout);
      if(typeof time === 'undefined') time = 1000;
      this._onTimeout = window.setTimeout(cb, time);
    },

    callWithTimeout: function(cb, success, error, timeout, time) {
      //Prior cleaning in case gets called repeatedly
      if(this._withTimeout) window.clearTimeout(this._withTimeout);
      if(typeof time === 'undefined') time = 1000;
      this._withTimeout = window.setTimeout(timeout, time);
      var that = this;
      var _clearTimeout = function() {
        window.clearTimeout(that._withTimeout);
        delete that._withTimeout;
      };
      var _success = function(result) {
        _clearTimeout();
        if(success) success(result);
      };
      var _error = function(err) {
        _clearTimeout();
        if(error) error(err);
      };
      cb.call(this, _success, _error, time); //callback.call(context, params)
    },

    /**
     * ----------------------------
     * CROSS-ENVIRONMENT FUNCTIONS
     * Not using platform specifics
     * ----------------------------
     */

    /**
     * Convert text to Title Case
     * http://stackoverflow.com/questions/5086390/jquery-camelcase
     */
    toTitleCase: function (str) {
      return str.replace(/(?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
      });
    },
    
    /**
     * Sleep some milliseconds (blocking)
     * http://www.jquery4u.com/jquery-functions/delay-sleep-pause-wait/
     */
    sleep: function (milliseconds) {
      var start = new Date().getTime();
      for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
          break;
        }
      }
    },

    /**
     * Get strength of a given password
     */
    getPasswordStrength: function (password, blankValue, lengthValue, strengthValueMap) {
      if(typeof strengthValueMap === 'undefined') strengthValueMap = [];
      if(typeof lengthValue === 'undefined') lengthValue = null;
      var strength = 0;

      //if the password length is null, return message.
      if (!password || password.length === 0) return blankValue || 'blank';
      //if the password length is less than 6, return message.
      if (password.length < 6) return lengthValue || 'short';

      //length is ok, lets continue.

      //if length is 8 characters or more, increase strength value
      if (password.length > 7) strength += 1;

      //if password contains both lower and uppercase characters, increase strength value
      if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/))  strength += 1;

      //if it has numbers and characters, increase strength value
      if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/))  strength += 1;

      //if it has one special character, increase strength value
      if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/))  strength += 1;

      //if it has two special characters, increase strength value
      if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,",%,&,@,#,$,^,*,?,_,~])/)) strength += 1;

      if (strength <= 1)      return strengthValueMap[0] || 'weak';
      else if (strength <= 2)  return strengthValueMap[1] || 'good';
      else if (strength <= 3)  return strengthValueMap[2] || 'strong';
      else                    return strengthValueMap[3] || 'verystrong';
    },

    /**
     * Returns minutes elapsed from given times
     */
    getMinutesElapsed: function(date1, date2) {
      return (date1 - date2)/(60*1000);
    },

    /**
     * Returns seconds elapsed from given times
     */
    getSecondsElapsed: function(date1, date2) {
      return (date1 - date2)/(1000);
    },

    /**
     * Get distance between two points in km
     * Uses 'haversine' formula
     * http://www.movable-type.co.uk/scripts/latlong.html
     */
    getDistance: function(p1, p2) {
      this.initGeo();

      var R = 6371; // km
      var dLat = (p2.lat-p1.lat).toRad();
      var dLon = (p2.lng-p1.lng).toRad();
      var lat1 = p1.lat.toRad();
      var lat2 = p2.lat.toRad();

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c;

      return d;
    },

    /**
     * Get Basic authentication header
     */
    getBasicAuthHeader: function(username, password) {
      return "Basic " + btoa(username+':'+password);
    },

  };

  // Save a reference to the global object (`window` in the browser, `exports`
  // on the server).
  var root = this;

  // The top-level namespace. All public classes and modules will
  // be attached to this. Exported for both the browser and the server.
  var Utils;
  if (typeof exports !== 'undefined') {
    Utils = exports;
  } else {
    Utils = root.Utils = Methods;
  }

  // Return object for define callers
  return Utils;
}));