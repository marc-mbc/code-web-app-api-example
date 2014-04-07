define([
  'jquery',
  'underscore',
  'base',
  'text!templates/app/main.html',
  'views/page/home',
  'views/page/undefined',
], function($, _, B, template, HomePageView, UndefinedPageView){

  var view = B.View.extend({
    tagName: 'div',
    pageView: null,

    pages: {
      'home':       HomePageView,
      'undefined':  UndefinedPageView
    },

    render: function () {
      $(this.el).html(template);
      return this;
    },

    setPage: function(id, args) {
      if(this.pageView) this.clearPage();
      var params = {model: this.model, args: args};
      var View = this.pages[id] || this.pages['undefined'];
      this.pageView = new View(params);
      this.$('#page').html(this.pageView.render().el);
    },

    clearPage: function() {
      this.pageView.close();
    }
  });
  return view;
});