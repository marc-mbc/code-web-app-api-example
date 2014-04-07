'use strict';
define([
  'restify'
], function (restify) {

  var initialize = function (api) {
    api.use(restify.throttle({
      burst: config.throttle.burst,
      rate: config.throttle.rate,
      ip: config.throttle.ip, // throttle based on source ip address /32
      username: config.throttle.username, // throttle based on req.username
      xff: config.throttle.xff // throttle based on a /32 (X-Forwarded-For)
    }));
    api.use(restify.acceptParser(api.acceptable));
    api.use(restify.dateParser());
    api.use(restify.queryParser());
    api.use(restify.fullResponse());
    api.pre(restify.pre.sanitizePath());
  };

  return {
    initialize: initialize
  };
});