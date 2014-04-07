define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var model = Backbone.Model.extend({

    //Syncs on url + actionUrl
    sync: function(method, model, options) {
      if(options) method = options.action || method;
      if(model.actionUrl && model.actionUrl[method.toLowerCase()]) {
        options = options || {};
        url = options.url || model.url;
        options.url = url + model.actionUrl[method.toLowerCase()];
      }
      method = method.split('.')[0].toLowerCase();
      Backbone.sync(method, model, options);
    },

    //Handle getter & setter (Modified by Albert)
    //https://github.com/berzniz/backbone.getters.setters.git
    getters: {},
    setters: {},
    unsetters: {},
    hassers: {},

    get: function(attr) {
      // Call the getter if available
      if (typeof this[this.getters[attr]] == 'function') {
        return this[this.getters[attr]].call(this, attr);
      }
      return Backbone.Model.prototype.get.call(this, attr);
    },

    set: function(key, value, options) {
      var attrs, attr;
      // Normalize the key-value into an object
      if (_.isObject(key) || key === null) {
        attrs = key;
        options = value;
      } else {
        attrs = {};
        attrs[key] = value;
      }
      // Go over all the set attributes and call the setter if available
      for (attr in attrs) {
        if (typeof this[this.setters[attr]] == 'function') {
          attrs[attr] = this[this.setters[attr]].call(this, attrs[attr], options);
        }
      }
      return Backbone.Model.prototype.set.call(this, attrs, options);
    },

    unset: function(attr, options) {
      if (typeof this[this.unsetters[attr]] == 'function') {
        return this[this.unsetters[attr]].call(this, attr, options);
      }
      return Backbone.Model.prototype.unset.call(this, attr, options);
    },

    has: function(attr) {
      // Call the hasser if available
      if (typeof this[this.hassers[attr]] == 'function') {
        return this[this.hassers[attr]].call(this, attr);
      }
      return Backbone.Model.prototype.has.call(this, attr);
    },

  });
  return model;
});