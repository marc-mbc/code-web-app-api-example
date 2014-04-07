define([
  'jquery',
  'underscore',
  'base',
  'text!templates/pagelet/room-types.html',
  'views/pagelet/room-type-item',
], function($, _, B, template, ItemView) {
  
  var view = B.View.extend({
    tagName: 'div',

    PAGE_COUNT: 5,

    events: {
      'click  #btn-more':   'clickMore',
    },
    
    initialize: function (options) {
      this.options = options;
      _.bindAll(this, 'render', 'addPage', 'addNew', 'addCreate', 'addBefore', 'addAfter',
        'successFetchPage', 'errorFetchPage', 'clickMore');
      this.listenTo(this.collection, 'add:create', this.addCreate);
      this.listenTo(this.collection, 'add:page', this.addPage);
      this.listenTo(this.collection, 'add:new', this.addNew);
    },

    render: function () {
      $(this.el).html(template);
      this.initModels();
      return this;
    },

    initModels: function () {
      this.fetchPage(false, true);
    },

    initViews: function () {

    },

    //Page
    fetchPage: function (next, reset) {
      this.options.data.count = this.PAGE_COUNT;
      this.collection.fetchPage({ next: next, reset: reset, fire: 'add:page', data: this.options.data, success: this.successFetchPage, error: this.errorFetchPage });
      this.showLoading();
    },

    successFetchPage: function (collection, response, options) {
      log('successFetchPage', collection, response, options);
      if(response && response.length >= this.PAGE_COUNT) {
        this.showMore();
      }
      else {
        this.hideMore();
      }
    },

    errorFetchPage: function(error, xhr, options) {
      log('errorFetchPage', error, xhr, options);
      B.trigger('notify:error', { id: 'service:connect', title: 'Error de conexión' });
    },

    //List
    addPage: function(collection, response, options) {
      log('addPage', collection, response, options);
      collection.each(this.addAfter);
    },

    addNew: function(collection, response, options) {
      collection.each(this.addBefore);
    },

    addCreate: function(collection, response, options) {
      this.addBefore(response);
    },

    addAfter: function(item, collection, options) {
      var view = new ItemView({ model: item });
      var that = this;
      $(':animated').promise().done(function() { //Wait until other animations have finished
        $(view.render().el).hide().appendTo(that.$('#room-types-list')).show();
      });
    },

    addBefore: function(item, collection, options) {
      var view = new ItemView({ model: item });
      var that = this;
      $(':animated').promise().done(function() { //Wait until other animations have finished
        $(view.render().el).hide().prependTo(that.$('#room-types-list')).show();
      });
    },

    //Events
    clickMore: function (e) {
      this.fetchPage(true);
    },

    hideMore: function() {
      this.$('#btn-more').hide();
    },
    showLoading: function() {

    },


  });
  return view;
});