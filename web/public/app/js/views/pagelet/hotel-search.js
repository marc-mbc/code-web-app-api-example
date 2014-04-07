define([
  'jquery',
  'underscore',
  'utils/format',
  'base',
  'text!templates/pagelet/hotel-search.html'
], function ($, _, f, B, template) {
  
  var view = B.View.extend({
    tagName: 'div',

    template: _.template(template),


    bindings: {
      '#from-date': 'from_date',
      '#to-date': 'to_date'
    },

    initialize: function (options) {
      _.bindAll(this, 'render');
      this.model = options.model;
    },
    
    render: function () {
      $(this.el).html(this.template({data: this.model.toJSON()}));
      this.stickit(this.model, this.bindings);
      this.initViews();
      return this;
    },

    initViews: function () {
      
      var now = new Date();
      var today = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) +
        '-' + ('0' + now.getDate()).slice(-2);
      var fromInput = this.$('#from-date');
      var toInput = this.$('#to-date');
      fromInput.attr('min', today);
      fromInput.change(function () {
        toInput.attr('min', fromInput.val());
      });
    },

  });
  return view;
});