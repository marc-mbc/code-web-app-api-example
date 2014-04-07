'use strict';
define([
  'lib-postgres'
], function (postgresDB) {
  
  var sql = postgresDB.sql;
  var sqlOptions = postgresDB.sqlOptions;

  var validators = {};

  var table = 'public.bookings';

  var sqlFindOccupiedRoom = sql.select(sqlOptions)
    .field('b.room_id')
    .from(table, 'b')
    .where('b.room_id = r.id')
    .limit(1);

  var buildSqlFindOccupiedRoom = function (makeQuery) {
    makeQuery.params.push(makeQuery.data.to_date);
    makeQuery.params.push(makeQuery.data.from_date);
    return sqlFindOccupiedRoom.clone()
      .where('b.from_date < $' + makeQuery.paramNum++ + '::date AND b.to_date > $' + makeQuery.paramNum++ + '::date');
  };

  return {
    validators: validators,
    buildSqlFindOccupiedRoom: buildSqlFindOccupiedRoom
  };
});
