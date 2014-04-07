define([
  'jquery',
  'underscore',
  'base',
  'text!templates/page/home.html',
  'collections/hotels',
  'views/pagelet/hotel-search',
  'views/pagelet/hotels',
], function ($, _, B, template, Hotels, HotelSearchView, HotelsView) {
  
  var view = B.View.extend({
    tagName: 'div',

    initialize: function () {
      _.bindAll(this, 'render');
      this.collection = new Hotels();
    },
    
    render: function () {
      $(this.el).html(template);
      var range = new B.Model();

      this.hotelSearchView = new HotelSearchView({ model: range });
      this.$('#hotel-search').append(this.hotelSearchView.render().el);


      this.hotelsView = new HotelsView({ model: range, collection: this.collection });
      this.$('#hotels').append(this.hotelsView.render().el);

      return this;
    },

    //Events

    //Extensions
    onClose: function () {
      if (this.hotelSearchView) this.hotelSearchView.close();
      if (this.hotelsView) this.hotelsView.close();
    }
  });
  return view;
});