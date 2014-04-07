'use strict';
define([
  'lib-postgres',
  'models/room'
], function (postgresDB, roomModel) {
  
  var executeDb = postgresDB.executeDb;
  var sql = postgresDB.sql;
  var sqlOptions = postgresDB.sqlOptions;

  var validators = {
    hotel_id: {
      isInt: true,
      msg: 'hotel_id must be a valid integer'
    },
  };

  var table = 'public.room_types';

  var sqlFindOneAvaliable = sql.select(sqlOptions)
    .from(table, 'rt')
    .limit(1);

  var buildSqlfindAvaliable = function (makeQuery) {
    makeQuery.query = sqlFindOneAvaliable.clone();
    roomModel.buildSqlfindAvaliable(makeQuery);
  };

  var sqlFindAvaliable = sql.select(sqlOptions)
    .field('rt.*')
    .field('(rt.price * ($5::date - $4::date))', 'total_price')
    .from(table, 'rt')
    .where('rt.hotel_id = $3')
    .group('rt.id')
    .order('total_price');

  var findAvaliable = function (data, cb) {
    var limit = data.count;
    var offset = data.count * data.page;
    // Build makeQuery initial data
    var makeQuery = {
      data: data,
      params: [
        limit,
        offset,
        data.hotel_id,
        data.from_date,
        data.to_date
      ],
      paramNum: 1,
      query: sqlFindAvaliable.clone()
    };
    makeQuery.paramNum += makeQuery.params.length;
    roomModel.makeFindAvaliable(makeQuery);

    // Build statement
    var statement = {
      name: 'get_room_types',
      text: makeQuery.query.toString() + ' LIMIT $1 OFFSET $2',
      values: makeQuery.params
    };

    executeDb(function (db, done) {
      db.query(statement, function (err, result) {
        done();
        if (err) cb(err);
        else cb(err, result.rows);
      });
    });
  };

  return {
    validators: validators,
    buildSqlfindAvaliable: buildSqlfindAvaliable,
    findAvaliable: findAvaliable
  };
});
