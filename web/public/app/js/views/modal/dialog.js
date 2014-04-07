define([
  'jquery',
  'underscore',
  'base',
  'text!templates/modal/dialog.html',
], function($, _, B, template){
  var view = B.View.extend({
    tagName: 'div',

    template: _.template(template),

    events: {
      'click .cancel':    'clickCancel',
      'click .ok':        'clickOk',
      'change .optout':   'changeOptout',
    },

    initialize: function(options){
      _.bindAll(this, 'show', 'shown', 'hide', 'hidden', 'remove', 'clickCancel', 'clickOk', 'changeOptout');
      this.options = _.extend({
        title: null,
        animate: false,
        template: this.template,
        namespace: 'dialog',
      }, options);
    },

    render: function() {
      //Optout
      if(this.options.optout_allow && this.options.id) {
        this.options.optout = this.getOptout(this.options.id);
      }
      if(this.options.optout && this.options.optout_auto_dismiss) return this.remove();

      //Render
      $(this.el).html(this.options.template({data:this.options}));

      //Insert the body if it's a view
      var body = this.options.body;
      if (body && body.$el) {
        body.render();
        this.$('.modal-body').html(body.$el);
      }
      if(this.options.animate) this.$('.modal').addClass('fade');
      this.isRendered = true;
      
      return this;
    },

    //Utils
    show: function() {
      if(!this.isRendered) this.render();
      this.$('.modal').modal(this.options);
      this.$('.modal').on('shown.bs.modal', this.shown);
      this.$('.modal').on('hide.bs.modal', this.hidden);
      this.$('.modal').on('hidden.bs.modal', this.hidden);
    },

    shown: function() {
      //TODO
    },

    hide: function() {
      // log('hide');
      this.$('.modal').modal('hide');
      this.trigger('hide');
    },

    hidden: function() {
      log('hidden');
      //Remove modal-open class on body
      //In case of overlapping transitions between show and hide of different modals
      $('.modal-open').removeClass('modal-open');

      this.trigger('hidden');
      this.remove();
    },

    //Internal
    adjustBackdrop: function() {
      //Adjust the modal and backdrop z-index; for dealing with multiple modals
      var numModals = $('.modal-backdrop').length,
          $backdrop = $('.modal-backdrop:eq('+numModals+')'),
          backdropIndex = parseInt($backdrop.css('z-index'),10),
          elIndex = parseInt($backdrop.css('z-index'), 10);

      $backdrop.css('z-index', backdropIndex + numModals);
      this.$el.css('z-index', elIndex + numModals);
    },

    //Events
    clickCancel: function(e) {
      // log('clickCancel', e);
      if (typeof this.options.cancel === 'function') this.options.cancel(e, this.options);
      this.trigger('cancel', e, this.options);
    },

    clickOk: function(e) {
      // log('clickOk', e);
      if (typeof this.options.ok === 'function') this.options.ok(e, this.options);
      this.trigger('ok', e, this.options);
    },

    changeOptout: function(e) {
      // log('changeOptout', e);
      var checked = $(e.target).is(':checked');
      var optouts = this.getOptouts();
      if(this.options.id) {
        this.setOptout(this.options.id, checked);
      }
    },

    //Optout utils
    getOptout: function(id) {
      var optouts = this.getOptouts();
      return optouts[id] || false;
    },

    setOptout: function(id, val) {
      var optouts = this.getOptouts();
      optouts[id] = val || false;
      B.Cookie.setJSON('mk_'+this.options.namespace+'_optouts', optouts, { expires: 999, path: '/' });
    },

    getOptouts: function() {
      return B.Cookie.getJSON('mk_'+this.options.namespace+'_optouts') || {};
    },

    //Extends
    remove: function() {
      log('remove:body', typeof this.options.body);
      if(this.options.body && typeof this.options.body.remove === 'function') {
        this.options.body.remove();
      }
      Backbone.View.prototype.remove.call(this);
    },
    
  });
  return view;
});