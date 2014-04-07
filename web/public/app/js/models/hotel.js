define([
  'underscore',
  'base',
  'supermodel',
  'collections/room-types'
], function (_, B, S, RoomTypes) {
  var Hypermodel = Supermodel.Model.extend(B.Model.prototype);
  var model = Hypermodel.extend({

    url: B.Global.api_url + '/hotel',

    initialize: function () {
      this.set('room_types', new RoomTypes());
    },

    actionUrl: {
      'read':           '/show',
    },

  });
  model.has().many('room_types', {
    collection: RoomTypes,
    inverse: 'hotel'
  });
  return model;
});