// Require.js allows us to configure shortcut alias
require.config({
  paths: {
    //CORE
    'backbone':                 '../../js/libs/backbone/backbone.min',
    'bootstrap':                '../../js/libs/bootstrap/bootstrap.min',
    'jquery':                   '../../js/libs/jquery/jquery.min',
    'moment':                   '../../js/libs/moment/moment-with-langs.min',
    'underscore':               '../../js/libs/underscore/underscore.min',

    //PLUGINS
    'jquery.autosize':          '../../js/libs/jquery/jquery.autosize.min',
    'jquery.cookie':            '../../js/libs/jquery/jquery.cookie',
    'jquery.fileupload':        '../../js/libs/jquery/jquery.fileupload',
    'jquery.fileupload-process':'../../js/libs/jquery/jquery.fileupload-process',
    'jquery.fileupload-image':  '../../js/libs/jquery/jquery.fileupload-image',
    'jquery.iframe-transport':  '../../js/libs/jquery/jquery.iframe-transport',
    'jquery.ui':                '../../js/libs/jquery/jquery.ui.min',
    'jquery.ui.touch':          '../../js/libs/jquery/jquery.ui.touch-punch.min',
    'jquery.cssemoticons':      '../../js/libs/jquery/jquery.cssemoticons.min',
    'moment.compact':           '../../js/libs/moment/moment.compact',
    'relational':               '../../js/libs/backbone/backbone-relational',
    'stickit':                  '../../js/libs/backbone/backbone.stickit',
    'spin':                     '../../js/libs/spin/spin.min',
    'supermodel':               '../../js/libs/backbone/backbone-supermodel',
    'text':                     '../../js/libs/require/text',
    'validation':               '../../js/libs/backbone/backbone-validation',

    //COMMONS
    'commons-cookie':           '../../js/commons/cookie',
    'commons-utils':            '../../js/commons/utils',
    'commons-global':           '../../js/commons/global',

    //UTILS
    'canvas-to-blob':           '../../js/libs/canvas-to-blob/canvas-to-blob.min',
    'load-image':               '../../js/libs/load-image/load-image',
    'load-image-exif-map':      '../../js/libs/load-image/load-image-exif-map',
    'load-image-exif':          '../../js/libs/load-image/load-image-exif',
    'load-image-ios':           '../../js/libs/load-image/load-image-ios',
    'load-image-meta':          '../../js/libs/load-image/load-image-meta',
    'load-image-orientation':   '../../js/libs/load-image/load-image-orientation',

    //APP
    'base':                     './base-backbone/base',
    'templates':                '../templates',
  },
  shim: {
    //CORE
      'backbone': {
        deps: ['jquery', 'underscore'],
        exports: 'Backbone'
      },
      'bootstrap': {
        deps: ['jquery'],
        exports: 'Bootstrap'
      },
      'jquery': {
        exports: 'jQuery'
      },
      'underscore': {
        exports: '_'
      },

    //PLUGINS
      'jquery.autosize': {
        deps: ['jquery'],
        exports: 'jQuery.fn.autosize'
      },
      'jquery.cookie': {
        deps: ['jquery'],
        exports: 'jQuery.fn.cookie'
      },
      'jquery.ui': {
        deps: ['jquery'],
        exports: 'jQuery.ui'
      },
      'jquery.ui.touch': {
        deps: ['jquery.ui'],
        exports: 'jQuery.ui.touch'
      },
      'moment.compact': {
        deps: ['moment'],
        exports: 'moment.compact'
      },
      'relational': {
        deps: ['jquery', 'underscore', 'backbone'],
        exports: 'Backbone.RelationalModel'
      },
      'stickit': {
        deps: ['jquery', 'underscore', 'backbone'],
        exports: 'Backbone.Stickit'
      },
      'supermodel': {
        deps: ['underscore', 'backbone'],
        exports: 'Supermodel.Model'
      },
      'validation': {
        deps: ['jquery', 'underscore', 'backbone'],
        exports: 'Backbone.Validation'
      },

    //COMMONS
      'commons-cookie': {
        deps: ['jquery', 'jquery.cookie'],
        exports: 'Cookie'
      },
      'commons-global': {
        deps: ['commons-utils'],
        exports: 'Global'
      },

    //APP
      'base': {
        deps: ['underscore', 'backbone'],
        exports: 'Base'
      }
  }
});

require([

  // Load app module and pass it to our definition function
  'app',

  //Omnipresent libraries
  'bootstrap',
  'moment',
  'moment.compact'

  // Because these scripts are not "modules" they do not pass any values to the definition function below
], function (App) {
  // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
  App.render();
});