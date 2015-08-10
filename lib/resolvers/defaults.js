var _ = require('underscore')

var DefaultResolver = function () {

  return this

}

DefaultResolver.prototype.parseTrack = function (track, callback) {

  var match = track.title.match(/(.+) - (.+)[(|\.]?/)

  if (!match) {
    return callback(null, false)
  }

  callback(null, {
    title: _.unescape(match[2]).trim(),
    artist: _.unescape(match[1]).trim(),
    source: this.name
  })

}

module.exports = DefaultResolver
