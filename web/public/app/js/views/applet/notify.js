define([
  'jquery',
  'underscore',
  'base',
  'text!templates/applet/notify.html',
  'collections/notifies',
  'views/applet/notify-item',
], function($, _, B, template, Notifies, ItemView){
  
  var view = B.View.extend({
    tagName: 'div',

    alertClass: {
      success: 'alert-success',
      warning: 'alert-warning',
      error: 'alert-danger',
      info: 'alert-info'
    },

    animationClass: {
      success: 'bounce',
      warning: 'flash',
      error: 'shake',
      info: 'tada'
    },

    initialize: function() {
      _.bindAll(this, 'add', 'remove', 'change', 'deleteAllUnsticky', 'deleteUnsticky', 'notifySuccess', 'notifyWarning', 'notifyError', 'notifyInfo', 'notify');
      this.collection = new Notifies();
      this.listenTo(this.collection, 'add', this.add);
      this.listenTo(this.collection, 'remove', this.remove);
      this.listenTo(this.collection, 'change', this.change);

      this.listenTo(B.history, 'route', this.changeRoute);
      
      this.listenTo(B, 'notify:success', this.notifySuccess);
      this.listenTo(B, 'notify:warning', this.notifyWarning);
      this.listenTo(B, 'notify:error', this.notifyError);
      this.listenTo(B, 'notify:info', this.notifyInfo);
      this.listenTo(B, 'notify', this.notify);
    },
    
    render: function() {
      $(this.el).html(template);
      return this;
    },

    //Types
    notifySuccess: function(options) {
      options.type = 'success';
      this.notify(options);
    },

    notifyWarning: function(options) {
      options.type = 'warning';
      this.notify(options);
    },

    notifyError: function(options) {
      options.type = 'error';
      this.notify(options);
    },

    notifyInfo: function(options) {
      options.type = 'info';
      this.notify(options);
    },

    notify: function(options) {
      options = _.extend({
        type: 'info',
        title: '',
        msg: '',
        timestamp: new Date(),
        sticky: false,
        duration: null,
        alertClass: this.alertClass[options.type],
      }, options);

      this.collection.add(options, {merge: true});
    },

    changeRoute: function(router, route, params) {
      this.deleteAllUnsticky();
    },

    //List
    add: function(item, collection, options) {
      // log('add');
      var view = new ItemView({ model: item });
      item.view = view;
      this.slideIn(view.render().el);
      this.deleteDelayed(item);
    },

    remove: function(item, collection, options) {
      // log('remove');
      if(options.wipe) this.wipeOut(item.view.el);
      else this.slideOut(item.view.el);
    },

    change: function(item, collection, options) {
      // log('change');
      this.deleteDelayed(item);
      this.changeUp(item.view.el, item.get('type'));
    },

    //Cleaning
    deleteDelayed: function(model) {
      if(model.has('duration')) {
        if(typeof this._timeoutDelayed !== 'undefined') {
          window.clearTimeout(this._timeoutDelayed);
          delete this._timeoutDelayed;
        }

        var that = this;
        var _delete = function() {
          that.collection.remove(model);
        };
        this._timeoutDelayed = window.setTimeout(_delete, model.get('duration'));
      }
    },

    deleteUnsticky: function(item, index, list) {
      if(!item.get('sticky')) this.collection.remove(item, {wipe: false});
    },

    deleteAllUnsticky: function() {
      this.collection.each(this.deleteUnsticky);
    },

    //Animation
    slideIn: function(selector) {
      $(selector).hide().prependTo(this.el).slideDown();
    },

    slideOut: function(selector) {
      $(selector).slideUp('fast').promise().done(function() {
          $(selector).remove();
      });
    },

    wipeOut: function(selector) {
      $(selector).remove();
    },

    changeUp: function(selector, type) {
      var animationClass = this.animationClass[type];
      $(selector).addClass('animated');
      $(selector).addClass(animationClass);
      //http://blog.teamtreehouse.com/using-jquery-to-detect-when-css3-animations-and-transitions-end
      //http://stackoverflow.com/questions/18592933/how-to-wait-for-css-transition-to-finish-before-applying-next-class
      $(selector).one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
        function(e) {
          $(selector).removeClass(animationClass);
        });
    },
  });
  return view;
});