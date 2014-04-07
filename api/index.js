'use strict';
  // The "api" dependency is passed in as "Api"
  // Again, the other dependencies passed in are not "AMD" therefore don't pass
  // a parameter to this function
var cluster = require('cluster');

var numCPUs = require('os').cpus().length;
var minNumWorkers = 1;
var maxNumWorkers = 4;
var numWorkers = Math.min(Math.max(numCPUs - 2, minNumWorkers), maxNumWorkers);

// Master
if (cluster.isMaster) {
  // In real life, you'd probably use more than just 2 workers,
  // and perhaps not put the master and worker in the same file.
  //
  // You can also of course get a bit fancier about logging, and
  // implement whatever custom logic you need to prevent DoS
  // attacks and other bad behavior.
  //
  // See the options in the cluster documentation.
  //
  // The important thing is that the master does very little,
  // increasing our resilience to unexpected errors.
   
  var activeWorkers = 0;

  // Fork workers.
  cluster.on('fork', function (worker) {
    console.log('Starting worker ', worker.id, new Date().toISOString());
    activeWorkers++;
  });

  cluster.on('exit', function (worker, code, signal) {
    console.error('Exit worker: ', worker.id);
  });

  cluster.on('disconnect', function (worker) {
    activeWorkers--;
    if (activeWorkers <= numWorkers) cluster.fork();
  });

  for (var i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  var endMaster = function (signal) {
    console.log('Finishing master...');
    cluster.disconnect(function () {
      console.log('All workers disconnected. End master');
      process.kill(process.pid, signal);
    });
  };

  process.on('SIGTERM', function () {
    endMaster('SIGTERM');
  });

  process.once('SIGUSR2', function () {
    endMaster('SIGUSR2');
  });

  process.on('exit', function () {
    endMaster('SIGTERM');
  });

}
// Worker
else {
  var requirejs = require('requirejs');

  requirejs.config({
    baseUrl: __dirname,
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require,
    paths: {
      'bh-config':                'config/index',
      'api':                      'app/api',
      'routes':                   'app/routes',
      'services':                 'app/services',
      'models':                   'app/models',
      'remotes':                  'app/models/remotes',
      'utils':                    'app/utils',
      'lib-log':                  'lib/api/log',
      'lib-postgres':             'lib/db/drivers/postgres',
      'lib-sql-builder':          'lib/db/drivers/sql-builder',
      'lib-handlers':             'lib/api/handlers',
      'lib-utils':                'lib/api/utils',
      'middleware-worker':        'lib/api/middlewares/worker',
      'middleware-restify':       'lib/api/middlewares/restify',
      'middleware-validation':    'lib/api/middlewares/validation'
    }
  });

  requirejs([
    'bh-config',
    'lib-log',
    // Load our app module and pass it to our definition function
    'api'
    // Some plugins have to be loaded in order due to their non AMD compliance
    // Because these scripts are not "modules" they do not pass any values to the 
    // definition function below
  ], function (config, log, Api) {
    Api.initialize(cluster.worker);
  });
}
