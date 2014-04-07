define([
  'underscore',
  'base'
], function (_, B) {

  var collection = B.Collection.extend({

    //Pagination
    page: 0,

    fetchPage: function (options) {
      if (options.reset) this.page = 0;
      if (options.next) this.page++;
      options.data = options.data || {};
      options.data.page = this.page;
      this.fetch(options);
    },

    //Override
    //Catch success responses to fire custom events on success
    fetch: function (options) {
      var success = options.success;
      if (options.fire) {
        options.success = function (collection, response, options) {
          if (success) success(collection, response, options);
          collection.trigger(options.fire, collection, response, options);
        };
      }
      B.Collection.prototype.fetch.call(this, options);
    },

    //Override
    create: function (model, options) {
      var success = options.success;
      var collection = this;
      if (options.fire) {
        options.success = function (response) {
          if (success) success(collection, response, options);
          collection.trigger(options.fire, collection, response, options);
        };
      }
      B.Collection.prototype.create.call(this, model, options);
    }
  });
  return collection;
});