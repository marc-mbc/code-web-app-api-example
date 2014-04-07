define([
  'underscore',
  'base',
], function (_, B) {
  var model = B.Model.extend({

    url: B.Global.api_url + '/room_type',

    actionUrl: {
      'create':   '/new',
    },

  });
  return model;
});