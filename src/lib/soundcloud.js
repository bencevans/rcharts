/**
 * Module Dependencies
 */

var request = require('request')

var CLIENT_ID = 'JoiPPk8CcQw27aLSGJaBg'

var resolve = function (url, cb) {
  request({
    url: 'http://api.soundcloud.com/resolve.json?url=' + url + '&client_id=' + CLIENT_ID,
    json: true
  }, function (err, res, body) {
    if (err) {
      return cb(err)
    }
    cb(null, body)
  })
}

var getStreamURL = function (trackId, cb) {
  request({
    url: 'http://api.soundcloud.com/tracks/' + trackId + '/stream?consumer_key=' + CLIENT_ID,
    followRedirect: false
  }, function (err, res) {
    if (err) {
      return cb(err)
    } else if (!res.headers.location) {
      return cb(new Error('Track location not provided by soundcloud'))
    }
    cb(null, res.headers.location)
  })
}

var resolveStreamURL = function (url, cb) {
  resolve(url, function (err, obj) {
    if (err) {
      return cb(err)
    } else if (obj.kind !== 'track') {
      return cb(new Error('not a track url'))
    }
    getStreamURL(obj.id, cb)
  })
}

/**
 * Exports
 */

module.exports = {}
module.exports.resolve = resolve
module.exports.getStreamURL = getStreamURL
module.exports.resolveStreamURL = resolveStreamURL
