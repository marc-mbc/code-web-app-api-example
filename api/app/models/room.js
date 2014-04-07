'use strict';
define([
  'lib-postgres',
  'models/booking'
], function (postgresDB, bookingModel) {
  
  var sql = postgresDB.sql;
  var sqlOptions = postgresDB.sqlOptions;

  var validators = {};

  var table = 'public.rooms';

  var makeJoin = function (makeQuery) {
    makeQuery.query
      .join(table, 'r', 'r.room_type_id = rt.id')
      .where('r.id NOT IN (' + bookingModel.buildSqlFindOccupiedRoom(makeQuery) + ')');
  };

  var buildSqlfindAvaliable = function (makeQuery) {
    makeQuery.query
      .field('r.id');
    makeJoin(makeQuery);
  };

  var makeFindAvaliable = function (makeQuery) {
    makeQuery.query
      .field('COUNT(r.id)', 'total_avaliable');
    makeJoin(makeQuery);
  };

  return {
    validators: validators,
    buildSqlfindAvaliable: buildSqlfindAvaliable,
    makeFindAvaliable: makeFindAvaliable
  };
});
