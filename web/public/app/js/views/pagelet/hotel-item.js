define([
  'jquery',
  'underscore',
  'utils/format',
  'base',
  'text!templates/pagelet/hotel-item.html',
  'views/pagelet/room-types'
], function ($, _, f, B, template, RoomTypesView) {
  
  var view = B.View.extend({
    tagName: 'div',

    template: _.template(template),

    events: {
      'click #btn-room-types':  'clickRoomTypes'
    },

    bindings: {
      
    },

    initialize: function (options) {
      this.range = options.range;
      _.bindAll(this, 'render', 'clickRoomTypes');
    },
    
    render: function () {
      $(this.el).html(this.template({data: this.model.toJSON()}));
      this.initVars();
      this.initViews();
      return this;
    },

    initVars: function () {
      var data = {
        hotel_id: this.model.get('id'),
        to_date: this.range.get('to_date'),
        from_date: this.range.get('from_date')
      };
      this.params = { data: data, collection: this.model.get('room_types') };
    },

    initViews: function () {
      this.initRoomTypes();
    },

    initRoomTypes: function () {
      this.roomTypesView = new RoomTypesView(this.params);
      this.$('#room-types').append(this.roomTypesView.el);
    },

    clickRoomTypes: function (e) {
      if (!this.$('#room-types').is(':visible')) {
        this.reloadRoomTypes();
      }
      this.$('#room-types').toggle();
      if (e) e.stopPropagation();
    },

    reloadRoomTypes: function () {
      this.roomTypesView.render();
    }

  });
  return view;
});