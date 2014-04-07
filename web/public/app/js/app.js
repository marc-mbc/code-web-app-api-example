define([
  'jquery',
  'moment',
  'base',
  'utils/log',
  'router',
], function ($, moment, B, Log, Router) {

  var view = B.View.extend({
    tagName: 'div',

    initialize: function () {
      //Document
      this.listenTo(B, 'dom:title:update', this.updateDomTitle);

      //App
      B.app = { };

      //ROUTER ---------------
      B.app.router = new Router();
      B.app.router.start();

      //MODELS ---------------


      //VIEWS ----------------


      //INIT -----------------
      
    },

    //Events


    updateDomTitle: function(title) {
      log('title', title);
      title = title || B.Global.app_title;
      $('title').html(title);
    }
  });

  return new view;
});