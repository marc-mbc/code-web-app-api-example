define([
], function(){

  //http://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links
  if(!String.linkify) {
    String.prototype.linkify = function(attrs, data) {
      attrs = attrs || 'target="_blank"';

      // http://, https://, ftp://
      var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

      // www. sans http:// or https://
      var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

      // Email addresses
      var emailAddressPattern = /\w+@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6})+/gim;

      return this
        .replace(urlPattern, '<a '+attrs+' href="$&">$&</a>')
        .replace(pseudoUrlPattern, '$1<a '+attrs+' href="http://$2">$2</a>')
        .replace(emailAddressPattern, '<a '+attrs+' href="mailto:$&">$&</a>');
    }
  }

  //http://stackoverflow.com/questions/784539/how-do-i-replace-all-line-breaks-in-a-string-with-br-tags
  if(!String.storify) {
    String.prototype.storify = function(attrs) {
      attrs = attrs || '<br>';

      var whitespacePattern = /\n/g;

      return this
        .replace(whitespacePattern, attrs);
    }
  }

  if (!String.tweetfy) {
    String.prototype.tweetfy = function (tweet) {
      if (!(tweet.entities)) {
        return this;
      }
      
      // This is very naive, should find a better way to parse this
      var index_map = {};

      if (tweet.entities.media && tweet.entities.media.length > 0) {
        $.each(tweet.entities.media, function (i, entry) {
          index_map[entry.indices[0]] = [
            entry.indices[1], function (text) {
              return '<a href="' + entry.url + '">' + text + '</a>';
            }
          ];
        });
      }
      
      $.each(tweet.entities.urls, function (i, entry) {
        index_map[entry.indices[0]] = [
          entry.indices[1], function (text) {
            return '<a href="' + entry.url + '">' + text + '</a>';
          }
        ];
      });
      
      $.each(tweet.entities.hashtags, function (i, entry) {
        index_map[entry.indices[0]] = [
          entry.indices[1], function (text) {
            return '<a href="http://twitter.com/search?q=' + encodeURIComponent('#' + entry.text) + '">' + text + '</a>';
          }
        ];
      });
      
      $.each(tweet.entities.user_mentions, function (i, entry) {
        index_map[entry.indices[0]] = [
          entry.indices[1], function (text) {
            return '<a title="' + entry.name + '" href="http://twitter.com/' + entry.screen_name + '">' + text + '</a>'
          }
        ];
      });
      
      var result = '';
      var last_i = 0;
      var i = 0;
      // iterate through the string looking for matches in the index_map
      for (i = 0; i < this.length; ++i) {
        var ind = index_map[i];
        if (ind) {
          var end = ind[0];
          var func = ind[1];
          if (i > last_i) {
            result += this.substring(last_i, i);
          }
          result += func(this.substring(i, end));
          i = end - 1;
          last_i = end;
        }
      }
      
      if (i > last_i) {
        result += this.substring(last_i, i);
      }
      
      return result;
    };
  }

  /*
   * Breaks neatly (by whitespace) a text
   */
  //http://stackoverflow.com/questions/18730947/regex-to-match-a-limited-number-of-characters-including-an-unlimited-number-of-w?codekitCB=410888105.851554
  if(!String.slicify) {
    String.prototype.slicify = function(min, max) {
      min = min || 0;
      max = max || 100;
      var last = this.length < max ? max : this.slice(min, max).lastIndexOf(' ');
      return this
        .slice(min, last);
    }
  }

  var format = {
    linkify: String.linkify,
    slicify: String.slicify
  };

  return format;
});