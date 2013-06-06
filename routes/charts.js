
/**
 * Module Dependencies
 */

var rcharts = require('../lib/rcharts');


/**
 * Routes
 */

/**
 * GET /r/:subreddit
 */
module.exports = function(req, res, next) {

}

/**
 * GET /r/:subreddit.xml
 * GET /r/:subreddit.xspf
 */
module.exports.xml = function(req, res, next) {
  res.type('text/xml');

  rcharts(req.params.subreddit, function(err, results) {
    if(err) return next(err);

    var output = ['<?xml version="1.0" encoding="UTF-8"?>',
      '<playlist version="1" xmlns="http://xspf.org/ns/0/">',
      '<title>r/' + req.params.subreddit + '</title>', '<trackList>'];
    for (var i = 0; i < results.length; i++) {
      output.push('<track><creator>' + results[i].artist + '</creator><title>' + results[i].title + '</title><location>' + results[i].url + '</location></track>');
    };
    output.push('</trackList>');
    output.push('</playlist>');
    res.send(output.join('\n'));
  });

}

/**
 * GET /r/:subreddit.json
 */
module.exports.json = function(req, res, next) {
  rcharts(req.params.subreddit, function(err, results) {
    if(err) return next(err);
    res.send({error: false, results: results });
  });
}