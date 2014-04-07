'use strict';
define([
  'restify',
  'routes',
  'lib-handlers'
], function (restify, router, handlers) {
  
  var initialize = function (worker) {

    var port = config.server.port;
    var name = config.server.name;

    var api = restify.createServer({
      name: name,
      log: log
    });

    handlers.initialize(api, worker);

    router.initialize(api);

    api.listen(port, function () {
      log.info('Worker: ' + worker.id, 'Port: ' + port);
    });
  };

  return {
    initialize: initialize
  };
});