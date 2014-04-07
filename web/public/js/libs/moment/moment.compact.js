/*
 * ORIGINAL SOURCE
 * https://github.com/SpiderStrategies/moment.twitter/blob/master/index.js
 */

 (function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as anonymous module.
    define(['moment'], factory);
  } else {
    // Browser globals.
    factory(jQuery);
  }
}(function (moment) {

  // Times in millisecond
  var second = 1e3
    , minute = 6e4
    , hour = 36e5
    , day = 864e5
    , week = 6048e5
    , formats = {
      seconds: {
        short: 's',
        long: ' sec'
      },
      minutes: {
        short: 'm',
        long: ' min'
      },
      hours: {
        short: 'h',
        long: ' hr'
      },
      days: {
        short: 'd',
        long: ' day'
      }
    }

  var format = function (format) {
    var diff = Math.abs(this.diff(moment()))
      , unit = null
      , num = null

    if (diff <= second) {
      unit = 'seconds'
      num = 1
    } else if (diff < minute) {
      unit = 'seconds'
    } else if (diff < hour) {
      unit = 'minutes'
    } else if (diff < day) {
      unit = 'hours'
    } else if (format === 'short') {
      if (diff < week) {
        unit = 'days'
      } else {
        return this.format('l')
      }
    } else {
      return this.format('MMM D') //TODO this is not localized!
    }

    if (!(num && unit)) {
      num = moment.duration(diff)[unit]()
    }
    var unitStr = unit = formats[unit][format]

    if (format === 'long' && num > 1) {
      unitStr += 's'
    }
    return num + unitStr
  }

  moment.fn.compactLong = function () {
    return format.call(this, 'long')
  }

  moment.fn.compact = moment.fn.compactShort = function () {
    return format.call(this, 'short')
  }

  // Save a reference to the global object (`window` in the browser, `exports`
  // on the server).
  var root = this;

  // The top-level namespace. All public classes and modules will
  // be attached to this. Exported for both the browser and the server.
  var moment;
  if(typeof exports !== 'undefined') {
    moment = exports;
  }else {
    moment = root.moment = moment;
  }

  // Return object for define callers
  return moment;
}));