'use strict';
define([
  'services/hotels',
  'services/room-types'
], function (hotelServices, roomTypeServices) {

  var initialize = function (api) {

    // ROOT AND NOT FOUND  
    api.get('/status', function (req, res) {
      return res.send(200,
        {
          code: 'Ok',
          message: 'ByHour API is running. Awesome!',
          pid: process.pid,
          memory: process.memoryUsage(),
          uptime: process.uptime()
        }
      );
    });
    
    api.on('NotFound', function (req, res) {
      var response;
      response = {
        code: 'ResourceNotFound',
        message: req.url
      };
      return res.send(404, response);
    });

    hotelServices.initialize(api);
    roomTypeServices.initialize(api);
  };

  return {
    initialize: initialize
  };
});
