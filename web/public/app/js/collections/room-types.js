define([
  'underscore',
  'base',
  'collections/_pager',
  'models/room-type'
  ], function(_, B, Collection, Model){

  var collection = Collection.extend({
    
    url: B.Global.api_url + '/room_types',
    
    model: Model,

  });
  return collection;
});