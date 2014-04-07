'use strict';
define([
  'restify',
  'crypto',
  'underscore',
  'validator'
], function (restify, crypto, _, validator) {

  var utils = {

    validator: validator,

    /*
     *  RESTIFY
     */

    //PARAMS
    getParam: function (req, name, defaultValue) {
      if (defaultValue !== undefined) {
        req.params[name] = req.params[name] ? req.params[name] : defaultValue;
      }
      return req.params[name];
    },

    //FILES
    getFile: function (req, name) {
      return req.files[name];
    },

    //HEADERS
    getAuthorization: function (req, name, defaultValue) {
      return req.authorization[name] || defaultValue;
    },

    //RESPONSE
    
    //http://stackoverflow.com/questions/10973479/how-do-you-send-html-with-restify
    sendHTML: function (res, result) {
      if (!res._headerSent) {
        res.writeHead(200, {
          'Content-Length': Buffer.byteLength(result),
          'Content-Type': 'text/html'
        });
        res.write(result);
        res.end();
      }
      else {
        log.error('Error Already send', result);
        res.end();
      }
    },

    //http://www.restapitutorial.com/lessons/httpmethods.html
    sendOk: function (res, result) {
      if (!res._headerSent) res.send(200, result);
      else {
        log.error('Error Already send', result);
        res.end();
      }
    },

    sendRedirect: function (res, url) {
      if (!res._headerSent) {
        res.header('Location', url);
        res.send(302);
      }
      else {
        log.error('Error Already send, redirect to ', url);
        res.end();
      }
    },

    sendCreated: function (res, result) {
      if (!res._headerSent) res.send(201, result);
      else {
        log.error('Error Already send', result);
        res.end();
      }
    },

    sendUpdated: function (res, result) {
      var code;
      if (!result) code = 204;
      else code = 201;
      if (!res._headerSent) res.send(code, result);
      else {
        log.error('Error Already send', result);
        res.end();
      }
    },

    sendInternalError: function (res, err) {
      if (!res._headerSent) {
        log.error(err);
        res.send(500, new restify.InternalError('Oops, internal error :S'));
      }
      else {
        log.error('Error Already send', err);
        res.end();
      }
    },

    sendInvalidArgumentError: function (res, err) {
      var logErr = err;
      if (typeof err !== 'string' && typeof err.message === 'string') err = err.message;
      if (err.indexOf('duplicate key value violates unique constraint') !== -1) {
        if (err.indexOf('email') !== -1) err = 'Invalid argument error: Duplicate email';
        else if (err.indexOf('username') !== -1) err = 'Invalid argument error: Duplicate username';
        else err = 'Invalid argument error: Duplicate value';
      }
      else err = 'Oops, invalid argument error';
      if (!res._headerSent) {
        log.error(logErr);
        res.send(400, new restify.InvalidArgumentError(err));
      }
      else {
        log.error('Error Already send', logErr);
        res.end();
      }
    },

    sendUnauthorizedError: function (res, err) {
      if (!res._headerSent) {
        log.error(err);
        res.send(401, new restify.UnauthorizedError(err));
      }
      else {
        log.error('Error Already send', err);
        res.end();
      }
    },

    sendInvalidCredentialsError: function (res, err) {
      if (!res._headerSent) {
        log.error(err);
        res.send(401, new restify.InvalidCredentialsError(err));
      }
      else {
        log.error('Error Already send', err);
        res.end();
      }
    },

    sendForbiddenError: function (res, err) {
      if (!res._headerSent) {
        log.error(err);
        res.send(403, new restify.ForbiddenError(err));
      }
      else {
        log.error('Error Already send', err);
        res.end();
      }
    },
    /**
     * Join validators of params in validatorsB overwriting validatorsA.
     * @param  {Object} validatorsA
     * @param  {Object} validatorsB
     * @return {Object}
     */
    joinValidators: function (validatorsA, validatorsB) {
      var joinedValidators = {};
      if (!_.isEmpty(validatorsA)) {
        _.each(validatorsB, function (validators, param) {
          if (validatorsA.hasOwnProperty(param)) {
            joinedValidators[param] = _.extend(validatorsA[param], validators);
          }
        });
        _.each(validatorsA, function (validators, param) {
          if (!validatorsB.hasOwnProperty(param)) {
            joinedValidators[param] = validators;
          }
        });
      }
      return joinedValidators;
    },

    /**
     * Add validators of validatorsB in validatorsA (only if not exist in validatorsA).
     * @param  {Object} validatorsA
     * @param  {Object} validatorsB
     * @return {Object}
     */
    addValidators: function (validatorsA, validatorsB) {
      for (var param in validatorsB) {
        if (validatorsB.hasOwnProperty(param) && !validatorsA.hasOwnProperty(param)) {
          validatorsA[param] = validatorsB[param];
        }
      }
      return validatorsA;
    },

    dateDaysDiff: function (startDate, endDate) {
      return ((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    },

    dateHoursDiff: function (startDate, endDate) {
      return ((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
    },

    //GENERATE TOKEN
    generateUrlToken: function (data) {
      var random = crypto.randomBytes(20).toString('hex');
      var timestamp = (new Date()).getTime();
      var sha1 = crypto.createHmac('sha1', random + timestamp);
      return sha1.update(data).digest('hex');
    },

    /**
     * ----------------------------
     * CROSS-ENVIRONMENT FUNCTIONS
     * Not using platform specifics
     * ----------------------------
     */
    
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
      this.initGeo();

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
    },

    contains: function (array, object) {
      return array.indexOf(object) > -1;
    },

    getFileExtension: function (filename) {
      return filename.split('.').pop();
    }
  };

  return utils;
});