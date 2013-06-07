
/**
 * Module Dependencies
 */

var _ = require('underscore'),
    request = require('request');

/**
 * Redis/Cache
 */

var redis, rtg;
if (process.env.REDISTOGO_URL) {
  rtg = require('url').parse(process.env.REDISTOGO_URL);
  redis = require('redis').createClient(rtg.port, rtg.hostname);
  redis.auth(rtg.auth.split(':')[1]);
} else {
  redis = require('redis').createClient();
}

var cachey = require('cachey')({redisClient:redis});

/**
 * Collect charts
 * @param  {String}   subreddit e.g 'folk'
 * @param  {Function} callback  (err, results)
 */
module.exports = function(subreddit, callback) {
  cachey.cache(subreddit, 60 * 60, function(callback) {
    request({
      uri: 'http://www.reddit.com/r/' + subreddit + '.json',
      json: true,
      followRedirect: false
    }, function(err, res, body) {
      if(err || body.error) return callback(err || body.error);
      if(res.statusCode !== 200) return callback(new Error('non 200 statusCode'));
      callback(null, body);
    });
  }, function(err, body) {
    if(err || body.error) return callback(err || body.error);

    var items = body.data.children;

    items = _.filter(items, function(item) {
      return item.data.domain.match('youtube.com') || item.data.domain.match('youtu.be') || item.data.domain.match('soundcloud.com');
    });

    var tracks = _.map(items, function(item) {
      var match = item.data.title.match(/(.+) - (.+)[(|\.]?/);
        if(!match) return false;

        return {
          title: _.unescape(match[2]),
          artist: _.unescape(match[1]),
          url: item.data.url
        };
      });

    tracks = _.filter(tracks, function(track) {
      return track;
    });

    callback(null, tracks);
  });
}