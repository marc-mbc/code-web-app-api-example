define([
  'jquery',
  'underscore',
  'base',
  'text!templates/page/undefined.html',
], function($, _, B, template){
  
  var view = B.View.extend({
    tagName: 'div',

    // template: _.template(template),

    animationClass: ['bounce', 'shake', 'tada'],

    events: {
      'click #img-meerkat': 'clickMeerkat'
    },

    initialize: function(options) {
      this.options = options;
      _.bindAll(this, 'clickMeerkat');
    },
    
    render: function() {
      $(this.el).html(template);
      this.initViews();
      return this;
    },

    initViews: function() {
      var action = this.options.args.action;
      action = this.$('#mode-'+action).length === 0 ? 'error-notfound' : action;
      this.$('#mode-'+action).show();
    },

    //Events
    clickMeerkat: function(e) {
      e.preventDefault();

      var type = Math.floor(Math.random() * this.animationClass.length);
      var animationClass = this.animationClass[type];
      $(e.target).addClass('animated');
      $(e.target).addClass(animationClass);
      //http://blog.teamtreehouse.com/using-jquery-to-detect-when-css3-animations-and-transitions-end
      $(e.target).one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
        function(e) {
          $(e.target).removeClass(animationClass);
      });
    },

  });
  return view;
});