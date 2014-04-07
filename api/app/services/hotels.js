'use strict';
define([
  'lib-utils',
  'models/hotel',
], function (utils, hotelModel) {

  var defaultPage = 0;
  var defaultCount = 20;

  var getHotelValidators = {
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
  var getHotels = function (req, res, next) {

    var params = {
      from_date: utils.getParam(req, 'from_date'),
      to_date: utils.getParam(req, 'to_date'),
      page: utils.getParam(req, 'page', defaultPage),
      count: utils.getParam(req, 'count', defaultCount)
    };
    
    hotelModel.findAvaliable(params, function (err, hotels) {
      if (err) utils.sendInvalidArgumentError(res, err);
      else if (!hotels) utils.sendInvalidArgumentError(res, 'Could not find hotels');
      else utils.sendOk(res, hotels);
    });
  };

  var getHotelByIdValidators = {
    id: {
      isRequired: true,
      scope: 'path',
      description: 'Hotel Id'
    }
  };

  var getHotelsById = function (req, res, next) {

    var params = {
      id: utils.getParam(req, 'id')
    };
    
    hotelModel.findHotelById(params, function (err, hotel) {
      if (err) utils.sendInvalidArgumentError(res, err);
      else if (!hotel) utils.sendInvalidArgumentError(res, 'Could not find hotel with id: ' + params.id);
      else utils.sendOk(res, hotel);
    });
  };

  var newHotelValidators = {
    name: {
      isRequired: true,
      scope: 'path',
      description: 'Hotel name'
    },
    description: {
      isRequired: true,
      scope: 'path',
      description: 'Hotel name'
    }
  };

  var newHotel = function (req, res, next) {

    var params = {
      name: utils.getParam(req, 'name'),
      description: utils.getParam(req, 'description')
    };
    
    hotelModel.newHotel(params, function (err, hotel) {
      if (err) utils.sendInvalidArgumentError(res, err);
      else utils.sendOk(res, hotel);
    });
  };

  var deleteHotelValidators = {
    id: {
      isRequired: true,
      scope: 'path',
      description: 'Hotel Id'
    }
  };

  var deleteHotel = function (req, res, next) {

    var params = {
      id: utils.getParam(req, 'id')
    };
    
    hotelModel.deleteHotel(params, function (err, hotel) {
      if (err) utils.sendInvalidArgumentError(res, err);
      else utils.sendOk(res);
    });
  };

  var updateHotelValidators = {
    id: {
      isRequired: true,
      scope: 'path',
      description: 'Hotel Id'
    },
    name: {
      isRequired: false,
      scope: 'path',
      description: 'Hotel name'
    },
    description: {
      isRequired: false,
      scope: 'path',
      description: 'Hotel name'
    }
  };

  var updateHotel = function (req, res, next) {

    var params = {
      id: utils.getParam(req, 'id'),
      name: utils.getParam(req, 'name', ''),
      description: utils.getParam(req, 'description', '')
    };
    if (params.name || params.description) {
      hotelModel.updateHotel(params, function (err, hotel) {
        if (err) utils.sendInvalidArgumentError(res, err);
        else utils.sendOk(res, hotel);
      });
    }
  };

  var initialize = function (api) {
    api.get({
        url: '/hotels',
        swagger: {
          summary: 'Get hotels with any avaliable room',
          notes: '',
          nickname: 'get'
        },
        validation: utils.joinValidators(getHotelValidators, hotelModel.validators)
      }, getHotels);

    // CRUD
    api.get({
        url: '/hotels/:id',
        swagger: {
          summary: 'Gets hotels by id',
          notes: '',
          nickname: 'get'
        },
        validation: utils.joinValidators(getHotelByIdValidators, hotelModel.validators)
      }, getHotelsById);

    api.put({
        url: '/hotels',
        swagger: {
          summary: 'Creates a new hotel',
          notes: '',
          nickname: 'new'
        },
        validation: utils.joinValidators(newHotelValidators, hotelModel.validators)
      }, newHotel);

    api.del({
        url: '/hotels',
        swagger: {
          summary: 'Delete a hotel by id',
          notes: '',
          nickname: 'delete'
        },
        validation: utils.joinValidators(deleteHotelValidators, hotelModel.validators)
      }, deleteHotel);

    api.post({
        url: '/hotels',
        swagger: {
          summary: 'Updates a hotel data by id',
          notes: '',
          nickname: 'update'
        },
        validation: utils.joinValidators(updateHotelValidators, hotelModel.validators)
      }, updateHotel);
  };

  return {
    initialize: initialize
  };
});
