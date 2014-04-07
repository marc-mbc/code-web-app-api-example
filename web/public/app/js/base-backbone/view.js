define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var view = Backbone.View.extend({

    eventAggregator: null,

  	close: function(){
      this.remove();
      this.unbind();
      if (this.onClose){
        this.onClose();
      }
      //Remove all events from aggregator
      Backbone.off(null, null, this);
      if(this.eventAggregator) { //Event aggregator
        this.eventAggregator.off(null, null, this);
      }
    }
  });
  return view;
});