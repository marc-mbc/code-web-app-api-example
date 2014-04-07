define([
  'jquery',
  'underscore',
  'base',
  'text!templates/modalet/info.html',
  'views/modal/dialog'
], function($, _, B, template, Modal){
  
  var view = B.View.extend({
    tagName: 'div',

    template: _.template(template),

    initialize: function(options) {
      this.options = options;
      _.bindAll(this, 'render');
      this.user = B.app.me;
      this.place = B.app.place;
      this.listenTo(this.user, 'change', this.render);
      this.listenTo(this.place, 'change', this.render);
    },
    
    render: function() {
      this.renderModal(this.template({ user: this.user.toJSON(), place: this.place.toJSON() }));
      this.initViews();
      return this;
    },

    initViews: function() {
      var action = this.options.action;
      action = this.$('#mode-'+action).length === 0 ? 'default' : action;
      this.$('#mode-'+action).show();
    },

    renderModal: function(body) {
      var title = this.options.title;
      var params = {
        title: title,
        body: body,
        footer_allow: true,
        cancel_allow: true,
        cancel_text: 'Aceptar',
      };
      this.modal = new Modal(params);
      $(this.el).append(this.modal.el);
      this.modal.show();
    },

  });
  return view;
});