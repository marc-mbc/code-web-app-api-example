'use strict';
define([
  'restify-validator',
  'node-restify-validation'
], function (restifyValidator, restifyValidation) {

  var initialize = function (api) {
    api.use(restifyValidator);
    api.use(restifyValidation.validationPlugin({ errorsAsArray: false }));
  };
  
  return {
    initialize: initialize
  };
});