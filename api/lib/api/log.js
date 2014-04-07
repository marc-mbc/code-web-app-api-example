'use strict';
define([
  'restify',
  'bunyan'
], function (restify, bunyan) {
  var base = config.log.path.base;
  var paths = config.log.path;
  var log = bunyan.createLogger({
    name: config.server.name,
    src: config.log.log_src,
    streams: [
      /*{
        level: 'fatal',             // log FATAL (60): The service/app is going to stop or become unusable
        path: base + paths.fatal    // now. An operator should definitely look into this soon.                  
      },
      {
        level: 'error',             // log ERROR (50): Fatal for a particular request, but the service/app continues 
        path: base + paths.error    // servicing other requests. An operator should look at this soon(ish).
      },*/
      {
        period: '1w',               // weekly rotation
        count: 8,                   // keep 8 back copies
        type: 'rotating-file',
        level: 'warn',              // log WARN (40): A note on something that should probably be looked at by
        path: base + paths.warn     // an operator eventually.
      },
      /*{
        level: 'info',              // log INFO (30): Detail on regular operation.
        path: base + paths.info
      },*/
      {
        level: 'debug',             // log DEBUG (20): Anything else, i.e. too verbose to be included in "info" level.
        stream: process.stdout
      }/*,
      {
        level: 'trace',             // log TRACE (10): Logging from external libraries used by your app or very 
        path: base + paths.trace    // detailed application logging.
      }*/
    ],
    serializers: restify.bunyan.serializers
  });
  if (!GLOBAL.log) GLOBAL.log = log;
  else log.warn('log GLOBAL name already used');
});