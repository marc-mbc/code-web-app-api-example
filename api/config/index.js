'use strict';
define([
  'module',
  'os',
  'path',
  'config'
  // _module variable name is used to avoid duplicate variable names (sometimes module is used by builders)
], function (_module, os, path, config) {

  /*
   *  Runtime dynamic config changes
   */

  //Workers
  var numCPUs = os.cpus().length;
  var numWorkers = Math.min(Math.max(numCPUs - 2, config.cluster.minNumWorkers), config.cluster.maxNumWorkers);
  config.cluster.numWorkers = numWorkers;
  //Absolute paths - Need this depending on Node installation.
  var basePath = path.dirname(_module.uri).replace('config', '');
  
  if (!GLOBAL.config) GLOBAL.config = Object.freeze(config);
  else console.log('config GLOBAL name already used');
});
