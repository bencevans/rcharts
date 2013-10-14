
/**
 * Module Dependencies
 */

var request = require('request');
var async = require('async');
var _ = require('underscore');

request({
  url: 'https://gist.github.com/bencevans/5866838/raw/3a8a332bc7cb5aaaef3b6596bceb1ae75dfbf595/scrape.json',
  json: true
}, function(err, res, body) {

  var subreddits = [];

  var q = async.queue(function (task, callback) {
    console.log(subreddits.length + '/' + body.length + ' GET ' + 'http://reddit.com' + task + '/about.json');
    request({
      url: 'http://reddit.com' + task + '/about.json',
      json: true
    }, function(err, res, body) {
      if(err) throw err;

      if(typeof body === 'object') subreddits.push(body);
      callback();
    });

  }, 9);

  q.drain = function() {
    console.log('Finished');
    subreddits = _.filter(subreddits, function(item) {
      return (!item.error);
    });
    subreddits = _.sortBy(subreddits, function(item) {
      console.log(item);
      return -item.data.subscribers;
    });
    console.log(JSON.stringify(_.map(subreddits, function(item) {
      return item.data.display_name;
    }), null));
  };

  _.each(body, function(item) {
    q.push(item);
  });


});