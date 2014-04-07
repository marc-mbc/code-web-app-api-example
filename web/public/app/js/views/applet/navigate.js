define([
  'jquery',
  'underscore',
  'base',
], function ($, _, B) {
  
  var view = B.View.extend({
    tagName: 'div',

    events: {
      'click #btn-position-connect': 'clickPositionConnect'
    },

    initialize: function () {
      _.bindAll(this, 'changeRoute', 'changeMe', 'clickPositionConnect');
      this.listenTo(B.history, 'route', this.changeRoute);
      this.listenTo(B.app.me, 'change', this.changeMe);
    },
    
    //Events
    changeRoute: function (router, route, params) {
      log('changeRoute', router, route, params);
      if (route !== 'default') {
        this.updateActiveTab(route);
        this.trackPage();
      }
      this.cleanUi();
    },

    changeMe: function (model, options) {
      log('changeMe', model, options);
      this.updateProfileTitle(model);
    },

    clickPositionConnect: function (e) {
      log('clickPositionConnect');
      e.preventDefault();
      B.trigger('position:request');
    },

    //Utils
    updateActiveTab: function (route) {
      // Collapse navbar if expanded
      $('.navbar-collapse.in').collapse('hide');
      
      this.$el.find('a:not([href*="' + route + '"])').parent('li').removeClass('active');
      this.$el.find('a[href*="' + route + '"]').parent('li').addClass('active');
      
      var title = this.$el.find('a[href*="' + route + '"]').attr('data-page-title');
      B.trigger('dom:title:update', title);
    },

    updateProfileTitle: function (model) {
      log('updateProfileTitle', model.get('username'));
      var dom = this.$el.find('a[href*="profile"]');

      var href = '#profile';
      dom.attr('href', href);

      var title = dom.attr('data-page-title-pattern')
        .replace('#fullname', model.get('fullname'))
        .replace('#username', model.get('username'));
      log('updateProfileTitle', title);
      dom.attr('data-page-title', title);
    },

    //Google Analytics tracking page
    trackPage: function () {
      var url = Backbone.history.getFragment();
      if (ga) ga('send', 'pageview', '#' + url);
    },

    cleanUi: function () {
      //Clean dialogs backdrops
      $('.modal-backdrop').remove();
    }
    
  });
  return view;
});