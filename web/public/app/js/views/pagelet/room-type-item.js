define([
  'jquery',
  'underscore',
  'utils/format',
  'base',
  'text!templates/pagelet/room-type-item.html',
], function ($, _, f, B, template) {
  
  var view = B.View.extend({
    tagName: 'div',

    template: _.template(template),

    events: {
    },

    initialize: function() {
      _.bindAll(this, 'render');
    },
    
    render: function() {
      $(this.el).html(this.template({data: this.model.toJSON()}));
      this.initViews();
      return this;
    },

    initViews: function() {
      
    },

  });
  return view;
});