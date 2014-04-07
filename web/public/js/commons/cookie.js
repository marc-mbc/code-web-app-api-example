/* global exports: false */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as anonymous module.
    define([
      'jquery',
      'jquery.cookie'
    ], factory);
  } else {
    // Browser globals.
    factory(jQuery);
  }
}(function ($) {
  var Methods = {
    get: function (key) {
      var value = $.cookie(key);
      return value ? decodeURIComponent(value) : value;
    },
    getJSON: function (key) {
      return JSON.parse($.cookie(key) || null);
    },
    set: function (key, value, options) {
      return $.cookie(key, value ? encodeURIComponent(value) : value, options);
    },
    setJSON: function (key, value, options) {
      return $.cookie(key, JSON.stringify(value), options);
    },
    remove: function (key, options) {
      return $.removeCookie(key, options);
    },
    supported: function () {
      // Quick test if browser has cookieEnabled host property
      if (navigator.cookieEnabled)
        return true;
      var key = 'cookietest';
      var options = { expires: 1 };
      // Create cookie
      $.cookie(key, 1, options);
      var ret = !!$.cookie(key);
      // Delete cookie
      $.removeCookie(key, options);
      return ret;
    }
  };
  // Save a reference to the global object (`window` in the browser, `exports`
  // on the server).
  var root = this;
  // The top-level namespace. All public classes and modules will
  // be attached to this. Exported for both the browser and the server.
  var Cookie;
  if (typeof exports !== 'undefined') {
    Cookie = exports;
  } else {
    Cookie = root.Cookie = Methods;
  }
  // Return object for define callers
  return Cookie;
}));
