
var request = require('request');

module.exports = function(req, res, next) {
  request({
    uri: 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&api_key=3ded6e3f4bfc780abecea04808abdd70&format=json&autocorrect=1&artist=' + require('querystring').escape(req.params[0]),
    json: true
  }, function(err, ress, body) {
    if(body && body.artist && body.artist.image && body.artist.image[2] && body.artist.image[2]['#text']) {
      return res.redirect(body.artist.image[2]['#text']);
    }
    res.redirect('/img/genericart.png');
  });
}