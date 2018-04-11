/**
 * Dependencies
 */

var request = require('request')
var qs = require('querystring')

/**
 * Redis/Cache
 */

var redis, rtg
if (process.env.REDISTOGO_URL) {
  rtg = require('url').parse(process.env.REDISTOGO_URL)
  redis = require('redis').createClient(rtg.port, rtg.hostname)
  redis.auth(rtg.auth.split(':')[1])
} else {
  redis = require('redis').createClient()
}

var cachey = require('cachey')({ redisClient: redis })

/**
 * GET /i/:artist.png
 */
module.exports = function (req, res, next) {
  cachey.cache('i:' + req.params[0], 60 * 60, function (callback) {
    request({
      uri: 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&api_key=3ded6e3f4bfc780abecea04808abdd70&format=json&autocorrect=1&artist=' + qs.escape(req.params[0]),
      json: true
    }, function (err, ress, body) {
      if (err) {
        return callback(err)
      }
      callback(null, body)
    })
  }, function (err, body) {
    if (err) {
      return next(err)
    } else if (body && body.artist && body.artist.image && body.artist.image[2] && body.artist.image[2]['#text']) {
      return res.redirect(body.artist.image[4]['#text'])
    }
    res.redirect('/img/genericart.png')
  })
}
