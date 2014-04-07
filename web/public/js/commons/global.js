/* global Utils: false, exports: false */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as anonymous module.
    define(['commons-utils'], factory);
  } else {
    // Browser globals.
    factory(Utils);
  }
}(function (Utils) {
  var ltd = Utils.getLtd();

  var Methods = {

    /**
     * APP
     */
    app_title: 'By Hours',

    /**
     * API
     */
    api_url: 'http://api.byhours' + ltd,
    
    /**
     * WEB
     */


    /**
     * PHOTO
     */
    

    /**
     * GEO
     */
    

    /**
     * VARS
     */
    

  };

  // Save a reference to the global object (`window` in the browser, `exports`
  // on the server).
  var root = this;

  // The top-level namespace. All public classes and modules will
  // be attached to this. Exported for both the browser and the server.
  var Global;
  if (typeof exports !== 'undefined') {
    Global = exports;
  }
  else {
    Global = root.Global = Methods;
  }

  // Return object for define callers
  return Global;
}));
