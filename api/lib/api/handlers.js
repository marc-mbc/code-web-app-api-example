'use strict';
define([
  'middleware-worker',
  'middleware-restify',
  'middleware-validation'
], function (worker, restify, validation) {

  var initialize = function (api, workerData) {
    worker.initialize(api, workerData);
    restify.initialize(api);
    validation.initialize(api);
  };

  return {
    initialize: initialize
  };
});
