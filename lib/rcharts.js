
/**
 * Module Dependencies
 */

var _       = require('underscore');
var request = require('request');
var async   = require('async');
var util    = require('util');

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

var defaultResolver = require('./resolvers/defaults');

var soundCloudResolver = require('./resolvers/soundcloud');
var youtubeResolver = require('./resolvers/youtube');

util.inherits(soundCloudResolver, defaultResolver),
util.inherits(youtubeResolver, defaultResolver)

var resolvers = [ new soundCloudResolver, new youtubeResolver];


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

    var tracks = body.data.children;

    tracks = _.map(tracks, function(track) {
      return track.data;
    });

    parseTracks(tracks, function(error, tracks) {
      if(error) {
        return callback(error);
      }

      tracks = _.filter(tracks, function(track) {
        return track;
      });

      callback(null, tracks);

    });
  });
}

var getResolverByDomain = module.exports.getResolverByDomain = function(domain) {
  for (var i = 0; i < resolvers.length; i++) {
    if(resolvers[i].domains.indexOf(domain) !== -1) {
      if(!resolvers[i].parseTrack) {
        resolvers[i].parseTrack = defaultResolver.parseTrack;
      }
      return resolvers[i];
    }
  };
  return false;
};

var parseTrack = module.exports.parseTrack = function(track, callback) {
  var resolver = getResolverByDomain(track.domain);
  if(!resolver) {
    return callback(null, false);
  };
  resolver.parseTrack(track, callback);
};

var parseTracks = module.exports.parseTracks = function(tracks, callback) {
  async.map(tracks, parseTrack, callback);
};