define([
  'jquery',
  'underscore',
  'base',
  'text!templates/applet/notify-item.html',
], function($, _, B, template){
  
  var view = B.View.extend({
    tagName: 'div',

    template: _.template(template),

    events: {
      'click #close': 'clickClose'
    },

    initialize: function() {
      _.bindAll(this, 'render', 'clickClose');
      this.listenTo(this.model, 'change', this.render);
    },
    
    render: function() {
      $(this.el).html(this.template({data:this.model.toJSON()}));
      this.applyStyle();
      return this;
    },

    clickClose: function(e) {
      this.onClose();
    },

    //Utils
    applyStyle: function() {
      var title = this.model.get('title');
      var msg = this.model.get('msg');
      if((title && title.length > 60 ) ||
         (msg &&  msg.length > 60) ||
         (title && msg && title.length + msg.length > 60)) {
        this.$('.alert').addClass('alert-block');
      }
    },

    //Extensions
    onClose: function() {
      if(this.model && this.model.collection) this.model.collection.remove(this.model);
    },

  });
  return view;
});