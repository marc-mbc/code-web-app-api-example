define([
  'underscore',
  'base',
  'collections/_pager',
  'models/hotel'
], function (_, B, Collection, Model) {

  var collection = Collection.extend({
    
    url: B.Global.api_url + '/hotels',
    
    model: Model,

    //Streaming
    streamOptions: null,

    setStreamOptions: function (options) {
      this.streamOptions = options;
    },

    stream: function (options) {
      // Cancel any potential previous stream
      this.unstream();

      //Save new options
      this.streamOptions = options;

      var _update = _.bind(function (skip) {
        if (!skip) this.fetch(this.streamOptions);
        this._intervalFetch = window.setTimeout(_update, this.streamOptions.interval || 1000);
      }, this);

      _update(true);
    },

    unstream: function () {
      window.clearTimeout(this._intervalFetch);
      delete this._intervalFetch;
      this.streamOptions = null;
    },

    isStreaming : function () {
      return typeof this._intervalFetch !== 'undefined';
    },

  });
  return collection;
});