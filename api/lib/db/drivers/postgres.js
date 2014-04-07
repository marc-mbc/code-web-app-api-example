'use strict';
define([
  'pg',
  'pg-transaction',
  'lib-sql-builder'
], function (pg, Transaction, sqlBuilder) {

  var connectSettings = config.db.postgres;

  var poolSize = 25; // Default 10

  if (config.cluster.activated) pg.defaults.poolSize = Math.floor(poolSize / config.cluster.numWorkers);
  else pg.defaults.poolSize = poolSize;

  pg.defaults.poolIdleTimeout = 5 * 60 * 1000; // Default 30 secs, now 5 min
  pg.defaults.reapIntervalMillis = 1 * 60 * 1000; // Default 1 sec, now 1 min

  var pool = pg.pools.getOrCreate(connectSettings);

  var executeDb = function (cb) {
    pg.connect(connectSettings, function (err, client, done) {

      // Help: All db client MUST use done() to return client to a pull
      // If we forget to use done this timeout should remember us that some db client 
      // were not finished with done.
      
      var started = new Date();
      var interval = false;
      var intervalForDone = setInterval(function () {
        interval = true;
        log.error('db connections error', {
          callback: cb.toString(),
          error: 'Some DB client were not returned to the pool using done()',
          poolSize: pool.getPoolSize(),
          poolAvaliable: pool.availableObjectsCount(),
          started: started
        });
      }, 60 * 1000);

      intervalForDone.unref();

      if (err) log.error('Could not connect to postgres', err);
      cb(client, function () {
        clearInterval(intervalForDone);
        done();
        if (interval) {
          log.warn('DB client returned', {
            poolSize: pool.getPoolSize(),
            poolAvaliable: pool.availableObjectsCount(),
            started: started
          });
        }
      });
    });
  };

  var transactionDb = function (cb, isolationLevel) {
    pg.connect(connectSettings, function (err, client, done) {
      if (err) log.error('Could not connect to postgres', err);
      _transaction(client, done, cb, isolationLevel);
    });
  };

  var clientTransactionDb = function (client, done, cb, isolationLevel) {
    _transaction(client, done, cb, isolationLevel);
  };

  function _transaction(client, done, cb, isolationLevel) {
    var tx = new Transaction(client);
    tx.begin(function (transactionErr) {
      if (transactionErr) log.error(transactionErr);
      else if (isolationLevel) tx.query('SET TRANSACTION ISOLATION LEVEL ' + isolationLevel, []);
      cb(tx, done);
    });
  }

  // There is race condition problem if delete stamenets are frequently done.
  var upsert = function (tx, statementUpdate, statementCreate, cb) {
    tx.query(statementUpdate, function (updateErr, updateResult) {
      if (updateErr) cb(updateErr);
      else if (updateResult.rowCount === 1) cb(updateErr, updateResult.rows[0]);
      else {
        tx.savepoint('update_done');
        tx.query(statementCreate, function (createErr, createResult) {
          if (createErr) {
            if (createErr.message.search(/duplicate/gi) !== -1) {
              tx.rollback('update_done');
              tx.query(statementUpdate, function (lastUpdateErr, lastUpdateResult) {
                if (lastUpdateErr) cb(lastUpdateErr);
                else cb(lastUpdateErr, lastUpdateResult.rows[0]);
              });
            }
            else cb(createErr);
          }
          else cb(createErr, createResult.rows[0]);
        });
      }
    });
  };

  var closeInterval;
  var closeAllClients = function (force, cb) {
    if (force) pg.end();
    else {
      var tries = 0;
      // Close all connections as soon as possible
      clearInterval(closeInterval);
      closeInterval = setInterval(function () {
        if (pool.getPoolSize() == pool.availableObjectsCount()) {
          tries++;
          if (tries >= 4) {
            pg.end();
            clearInterval(closeInterval);
          }
        }
        else tries = 0;
      }, 250);
      closeInterval.unref();
    }
    if (cb) cb();
  };

  return {
    sql: sqlBuilder.sql,
    sqlOptions: sqlBuilder.sqlOptions,
    transactionDb: transactionDb,
    clientTransactionDb: clientTransactionDb,
    upsert: upsert,
    executeDb: executeDb,
    closeAllClients: closeAllClients
  };
});
