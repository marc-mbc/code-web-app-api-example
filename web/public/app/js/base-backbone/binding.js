define([
  'underscore',
  'backbone',
  'stickit'
], function(_, Backbone, Stickit) {

	Backbone.Stickit.addHandler({
		selector: 'img',
		update: function($el, val, model, options) {
			$el.attr('src', val);
		},
		getVal: function($el) {
			return $el.attr('src');
		}
	});

  return Backbone.Stickit;
});