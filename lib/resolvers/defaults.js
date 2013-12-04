
var _       = require('underscore');

module.exports.parseTrack = function(track, callback) {

  var match = track.title.match(/(.+) - (.+)[(|\.]?/);

  if(!match) {
    return callback(null, false);
  }

  callback(null, {
    title: _.unescape(match[2]),
    artist: _.unescape(match[1]),
  });

};