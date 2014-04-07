define([
  'jquery',
  'underscore',
  'base',
  'views/app/main'
], function($, _, B, MainAppView){
  
  var router = B.Router.extend({
    mainView: new MainAppView({el: $('#main')}).render(),
    
    routes: {
      '':                                     'default',
      'home(/)':                              'home',
      '*actions':                             'undefined',
    },

    default: function() {
      B.history.navigate('#home', { trigger: true, replace: true });
    },

    home: function() {
      this.load('home');
    },
    
    undefined: function(action) {
      this.load('undefined', { action: action });
    },

    //UTILS
    load: function(id, args) {
      this.mainView.setPage(id, args);
    },

    start: function () {
      //TODO This is some really cool shit to make urls /something rather than /#something
      // Backbone.history.start({pushState: true}); //TODO Remember to review Backbone.Analytics for pushState and uncomment trackPage on index.html
      // $(document).on('click', 'a:not([data-bypass])', function (e) {
      //   var href = $(this).attr('href');
      //   var protocol = this.protocol + '//';

      //   if (href.slice(protocol.length) !== protocol) {
      //     e.preventDefault();
      //     Backbone.history.navigate(href, { trigger: true });
      //   }
      // });
      
      B.history.start();
    },

  });
  return router;
});