'use strict';
define([
  'underscore',
  'squel'
], function (_, squel) {

  var squelDefaultOptions = {
    autoQuoteAliasNames: false,
    usingValuePlaceholders: true
  };

  // Custom Update for postgres
  squel.pg_update = function (options) {
    return squel.update(options, [
      new squel.cls.StringBlock(options, 'UPDATE'),
      new squel.cls.UpdateTableBlock(options),
      new squel.cls.SetFieldBlock(options),
      new squel.cls.FromTableBlock(_.extend({}, options, { singleTable: true })),
      new squel.cls.WhereBlock(options),
      new squel.cls.OrderByBlock(options),
      new squel.cls.OffsetBlock(options),
      new squel.cls.LimitBlock(options)
    ]);
  };

  return {
    sql: squel,
    sqlOptions: squelDefaultOptions
  };
});
