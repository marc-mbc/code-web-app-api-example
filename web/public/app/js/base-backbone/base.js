define([
  'underscore',
  'backbone',
  'base-backbone/model',
  'base-backbone/view',
  'base-backbone/validation',
  'base-backbone/binding',
  'commons-utils',
  'commons-global',
  'commons-cookie',
], function(_, Backbone, BaseModel, BaseView, BaseValidation, BaseBinding, Utils, Global, Cookie) {

	var Base = {};
	_.extend(Base, Backbone); //Copy Backbone's source

	//Attach Backbone libs
	Base.Model = BaseModel;
	//Attach Base as eventAggregator to extended BaseView
	BaseView.prototype.eventAggregator = Base;
	Base.View = BaseView;
	Base.Validation = BaseValidation;
	Base.Binding = BaseBinding;

	//Attach cross-compatible libs
	Base.Utils = Utils;
	Base.Global = Global;
	Base.Cookie = Cookie;

	return Base;
});