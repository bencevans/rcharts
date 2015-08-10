/**
 * Module Dependencies
 */

var _ = require('underscore')
var request = require('request')
var async = require('async')
var util = require('util')

var redis = require('redis').createClient()
var cachey = require('cachey')({ redisClient: redis })

var DefaultResolver = require('./resolvers/defaults')

var SoundCloudResolver = require('./resolvers/soundcloud')
var YoutubeResolver = require('./resolvers/youtube')

util.inherits(SoundCloudResolver, DefaultResolver)
util.inherits(YoutubeResolver, DefaultResolver)

var resolvers = [ new SoundCloudResolver(), new YoutubeResolver() ]

var getResolverByDomain = function (domain) {
  for (var i = 0; i < resolvers.length; i++) {
    if (resolvers[i].domains.indexOf(domain) !== -1) {
      return resolvers[i]
    }
  }
  return false
}

var parseTrack = function (track, callback) {
  var resolver = getResolverByDomain(track.domain)
  if (!resolver) {
    return callback(null, false)
  }
  resolver.parseTrack(track, callback)
}

var parseTracks = function (tracks, callback) {
  async.map(tracks, parseTrack, callback)
}

/**
 * Collect charts
 * @param  {String}   subreddit e.g 'folk'
 * @param  {Function} callback  (err, results)
 */
module.exports = function (subreddit, callback) {
  cachey.cache(subreddit, 60 * 60, function (callback) {
    request({
      uri: 'http://www.reddit.com/r/' + subreddit + '.json',
      json: true,
      followRedirect: false
    }, function (err, res, body) {
      if (err || body.error) {
        return callback(err || body.error)
      } else if (res.statusCode !== 200) {
        return callback(new Error('non 200 statusCode'))
      }
      callback(null, body)
    })
  }, function (err, body) {
    if (err || body.error) {
      return callback(err || body.error)
    }

    var tracks = body.data.children

    tracks = _.map(tracks, function (track) {
      return track.data
    })

    parseTracks(tracks, function (error, tracks) {
      if (error) {
        return callback(error)
      }

      tracks = _.filter(tracks, function (track) {
        return track
      })

      callback(null, tracks)

    })
  })
}

module.exports.getResolverByDomain = getResolverByDomain
module.exports.parseTrack = parseTrack
module.exports.parseTracks = parseTracks
