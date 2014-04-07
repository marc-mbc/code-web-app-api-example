'use strict';
define([
  'lib-postgres',
  'models/room-type'
], function (postgresDB, roomTypeModel) {
  
  var executeDb = postgresDB.executeDb;
  var sql = postgresDB.sql;
  var sqlOptions = postgresDB.sqlOptions;

  var validators = {
    id: {
      isInt: true,
      msg: 'id must be a valid int'
    },
    from_date: {
      isDate: true,
      msg: 'from_date must be a valid date'
    },
    to_date: {
      isDate: true,
      msg: 'from_date must be a valid date'
    }
  };

  var table = 'public.hotels';

  var sqlFindAvaliable = sql.select(sqlOptions)
    .field('h.*')
    .from(table, 'h');

  var findAvaliable = function (data, cb) {
    var limit = data.count;
    var offset = data.count * data.page;
    // Build makeQuery initial data
    var makeQuery = {
      data: data,
      params: [
        limit,
        offset
      ],
      paramNum: 1,
      query: null
    };
    makeQuery.paramNum += makeQuery.params.length;

    roomTypeModel.buildSqlfindAvaliable(makeQuery);

    makeQuery.query = sqlFindAvaliable.clone()
      .where('EXISTS (' + makeQuery.query.toString() + ')');

    // Build statement
    var statement = {
      name: 'get_hotels',
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

  var sqlFindById = sql.select(sqlOptions)
    .field('h.*')
    .from(table, 'h')
    .where('h.id = $1')
    .toString();

  var findHotelById = function (data, cb) {
    // Build statement
    var statement = {
      name: 'get_hotels_by_id',
      text: sqlFindById,
      values: [data.id]
    };

    executeDb(function (db, done) {
      db.query(statement, function (err, result) {
        done();
        if (err) cb(err);
        else cb(err, result.rows[0]);
      });
    });
  };

  var sqlCreate = sql.insert(sqlOptions) // To stop auto quote
    .into(table)
    .set('name', '$1')
    .set('description', '$2')
    .set('created_at', 'NOW()')
    .set('updated_at', 'NOW()')
    .toString() + ' RETURNING *';

  var newHotel = function (data, cb) {
    // Build statement
    var statement = {
      name: 'new_hotel',
      text: sqlCreate,
      values: [data.name, data.description]
    };

    executeDb(function (db, done) {
      db.query(statement, function (err, result) {
        done();
        if (err) cb(err);
        else cb(err, result.rows[0]);
      });
    });
  };

  var sqlDelete = sql.delete(sqlOptions) // To stop auto quote
    .from(table)
    .where('id = $1')
    .toString();

  var deleteHotel = function (data, cb) {
    // Build statement
    var statement = {
      name: 'delete_hotel',
      text: sqlDelete,
      values: [data.id]
    };

    executeDb(function (db, done) {
      db.query(statement, function (err, result) {
        done();
        if (err) cb(err);
        else cb();
      });
    });
  };

  var sqlUpdate = sql.update(sqlOptions) // To stop auto quote
    .table(table)
    .set('updated_at', 'NOW()')
    .where('id = $1');

  var updateHotel = function (data, cb) {
    var query = sqlUpdate.clone();
    var params = [data.id];
    var i = 2;
    var text = 'update_hotel';
    if (data.name) {
      query.set('name', '$' + i++);
      params.push(data.name);
    }
    if (data.description) {
      query.set('description', '$' + i++);
      params.push(data.description);
    }
    // Build statement
    var statement = {
      text: query.toString() + ' RETURNING *',
      values: params
    };

    executeDb(function (db, done) {
      db.query(statement, function (err, result) {
        done();
        if (err) cb(err);
        else cb(err, result.rows[0]);
      });
    });
  };

  return {
    validators: validators,
    findAvaliable: findAvaliable,
    findHotelById: findHotelById,
    newHotel: newHotel,
    deleteHotel: deleteHotel,
    updateHotel: updateHotel
  };
});
