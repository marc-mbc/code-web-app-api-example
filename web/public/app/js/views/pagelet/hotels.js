define([
  'jquery',
  'underscore',
  'base',
  'text!templates/pagelet/hotels.html',
  'views/pagelet/hotel-item'
], function ($, _, B, template, ItemView) {
  
  var view = B.View.extend({
    tagName: 'div',

    PAGE_COUNT: 20,

    events: {
      
    },

    bindings: {
      '#hotels-list': {
        observe: ['from_date', 'to_date'],
        onGet: function (value, options) {
          this.initViews();
        }
      }
    },

    initialize: function(options) {
      this.model = options.model;
      _.bindAll(this, 'render', 'addPage', 'addNew', 'addCreate', 'addBefore', 'addAfter',
        'successFetchPage', 'errorFetchPage', 'scrollWindow');
      this.listenTo(this.collection, 'add:create', this.addCreate);
      this.listenTo(this.collection, 'add:page', this.addPage);
      this.listenTo(this.collection, 'add:new', this.addNew);
    },
    
    render: function () {
      $(this.el).html(template);
      this.stickit(this.model, this.bindings);
      this.initViews();
      return this;
    },

    initViews: function () {
      this.empty();
      if (this.model.get('from_date') && this.model.get('to_date')) {
        this.fetchPage(false, true);
      }
    },

    fetchPage: function (next, reset) {
      this.disableScrollEvent();
      var params = {
        count: this.PAGE_COUNT,
        to_date: this.model.get('to_date'),
        from_date: this.model.get('from_date')
      };
      this.collection.fetchPage({ 
        next: next,
        reset: reset,
        fire: 'add:page',
        data: params,
        success: this.successFetchPage,
        error: this.errorFetchPage
      });
      this.showLoading();
    },

    successFetchPage: function (collection, response, options) {
      log('successFetchPage');
      this.hideText();
      if (response) {
        if (response.length === 0) this.showNoMore();
        else if (response.length >= this.PAGE_COUNT) {
          this.enableScrollEvent();
        }
      }
    },

    errorFetchPage: function (error) {
      log('errorFetchPage');
      this.hideText();
      B.trigger('notify:error', { id: 'service:connect', title: 'Error de conexión' });
    },

    // List
    addPage: function (collection, response, options) {
      collection.each(this.addAfter);
    },

    addNew: function (collection, response, options) {
      collection.each(this.addBefore);
    },

    addCreate: function (collection, response, options) {
      var view = new ItemView({ model: response, range: this.model });
      $(view.render().el).hide().prependTo('#hotels-list').slideDown();
    },

    addBefore: function (item, collection, options) {
      var view = new ItemView({ model: item, range: this.model });
      this.$('#hotels-list').prepend(view.render().el);
    },

    addAfter: function (item, collection, options) {
      var view = new ItemView({ model: item, range: this.model });
      this.$('#hotels-list').append(view.render().el);
    },

    //Utils
    empty: function () {
      this.$('#hotels-list').empty();
    },

    showLoading: function () {
      this.$('#text-loading').show();
    },

    hideText: function() {
      this.$('[id^="text-"]').hide();
    },

    showNoMore: function () {
      this.$('#text-no-more').show();
    },

    enableScrollEvent: function () {
      $(window).scroll(this.scrollWindow);
    },

    disableScrollEvent: function () {
      $(window).off('scroll');
    },

    //Events
    clickCompose: function (e) {
      $('#input-text').focus();
    },

    scrollWindow: function (e) {
      // log('scrollWindow', 'window.scrollTop:'+$(window).scrollTop(), 'window.height:'+$(window).height(), 'document.height:'+$(document).height());
      // if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {

      // Taking the last child
      // var lastHeight = this.$('#hotels-list').children().last().height();
      // var tHeight = (lastHeight || 300) * 2 * window.devicePixelRatio;
      // log('lastHeight', lastHeight);

      // Taking the screen size
      var tHeight = $(window).height() * 0.75 * window.devicePixelRatio;
      // log('scrollWindow', 'devicePixelRatio:'+window.devicePixelRatio, 'tHeight:'+tHeight);
      
      if ($(window).scrollTop() + $(window).height() > $(document).height() - tHeight) {
        this.fetchPage(true);
      }
    },

    //Extensions
    onClose: function () {
      this.disableScrollEvent();
    }

    //Methods

  });
  return view;
});