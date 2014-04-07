'use strict';
define([
  'lib-utils',
  'models/room-type'
], function (utils, roomTypeModel) {

  var defaultPage = 0;
  var defaultCount = 20;

  var getHotelValidators = {
    hotel_id: {
      isRequired: true,
      scope: 'path',
      description: 'Hotel ID'
    },
    from_date: {
      isRequired: true,
      scope: 'path',
      description: 'check in date'
    },
    to_date: {
      isRequired: true,
      scope: 'path',
      description: 'check out date'
    },
    page: {
      isRequired: false,
      scope: 'path',
      description: 'Page number from last hotel. Default: ' + defaultPage,
      isInt: true,
      min: 0
    },
    count: {
      isRequired: false,
      scope: 'path',
      description: 'Number of hotels on each page of results. Default: ' + defaultCount,
      isInt: true,
      min: 1,
      max: 100
    }
  };
  var getRoomTypes = function (req, res, next) {

    var params = {
      hotel_id: utils.getParam(req, 'hotel_id'),
      from_date: utils.getParam(req, 'from_date'),
      to_date: utils.getParam(req, 'to_date'),
      page: utils.getParam(req, 'page', defaultPage),
      count: utils.getParam(req, 'count', defaultCount)
    };
    
    //Query
    roomTypeModel.findAvaliable(params, function (err, roomTypes) {
      if (err) utils.sendInvalidArgumentError(res, err);
      else if (!roomTypes) utils.sendInvalidArgumentError(res, 'Could not find any avaliable room');
      else utils.sendOk(res, roomTypes);
    });
  };

  var initialize = function (api) {
    api.get({
        url: '/room_types',
        swagger: {
          summary: 'Get avaliable room types',
          notes: '',
          nickname: 'get'
        },
        validation: utils.joinValidators(getHotelValidators, roomTypeModel.validators)
      }, getRoomTypes);
  };

  return {
    initialize: initialize
  };
});
