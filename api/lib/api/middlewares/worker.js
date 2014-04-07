'use strict';
define([
  'lib-utils',
  'domain',
  'lib-postgres'
], function (utils, domain, postgresDB) {

  var anyError = false;

  var disconnected = false;

  var initialize = function (api, worker) {
    
    api.removeAllListeners('uncaughtException');
    
    worker.on('disconnect', function () {
      // make sure we close down within 30 seconds
      // Close all db connections if they are not busy, if we close successfully finish response
      var killtimer = setTimeout(function () {
        postgresDB.closeAllClients(true, function () {
          process.exit(1);
        });
      }, 30 * 1000);
      // But don't keep the process open just for that!
      killtimer.unref();
    });
    api.use(function (req, res, next) {
      var d = createDomain(api, worker, req, res);
      d.run(function () {
        next();
      });
    });

  };

  function createDomain(api, worker, req, res) {
    var d = domain.create();
    d.on('error', function (err) {
      // Note: we're in dangerous territory!
      // By definition, something unexpected occurred,
      // which we probably didn't want.
      // Anything can happen now!  Be very careful!
      try {
        // try to send an error to the request that triggered the problem
        log.fatal('Fatal Error', {stack: err.stack, err: err});
        if (!anyError) {
          anyError = true;
          disconnectingWorker(api, worker);
        }
        if (res) utils.sendInternalError(res, 'Response on error');
      }
      catch (err2) {
        // oh well, not much we can do at this point.
        console.error('Error disconnecting a worker ' + worker.id + '!', err2.stack);
        console.error('Original Error before disconnect: ', err.stack);
      }
    });
    if (req) d.add(req);
    if (res) d.add(res);
    return d;
  }

  function disconnectingWorker(api, worker, cb) {
    if (!disconnected) {
      log.warn('Disconnecting worker ', worker.id);
      // Let the master know we're dead.  This will trigger a
      // 'disconnect' in the cluster master, and then it will fork
      // a new worker.
      worker.disconnect();
      // stop taking new requests.
      api.close();

      // Close every db connections as soon as they are not busy
      postgresDB.closeAllClients();
      disconnected = true;
    }
    if (cb) cb();
  }
  
  return {
    initialize: initialize
  };
});