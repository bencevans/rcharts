
/**
 * Module Dependencies
 */

var rcharts = require('../lib/rcharts'),
    _ = require('underscore'),
    libxml = require('libxmljs');

/**
 * XML Escape Helper
 */
function xmlEscape(str) {
  return str.replace('"', '&quot;').replace('\'',  '&apos;').replace('&', '&amp;').replace('<', '&lt;').replace('>',  '&gt;');
}

/**
 * Routes
 */

/**
 * GET /r/:subreddit
 */
module.exports = function(req, res, next) {
  rcharts(req.params.subreddit, function(err, results) {
    if(err && err.message && err.message.match(/200/)) return next();
    if(err) return next(err);
    res.render('chart', {
      subreddit: req.params.subreddit,
      layout: false,
      results: results
    });
  });
}

/**
 * GET /r/:subreddit.xml
 */
module.exports.xml = function(req, res, next) {
  res.redirect('/r/' + req.params.subreddit + '.xspf');
}

/**
 * GET /r/:subreddit.xspf
 */
module.exports.xspf = function(req, res, next) {
  res.type('text/xml;charset=UTF-8');

  rcharts(req.params.subreddit, function(err, results) {
    if(err) return next(err);

    var doc = new libxml.Document();
    var curser = doc.node('playlist').attr({ version: 1, xmlns: 'http://xspf.org/ns/0/'})
      .node('title', 'r/' + req.params.subreddit)
      .parent()
      .node('trackList');

    for (var i = 0; i < results.length; i++) {
      curser.node('track')
      .node('creator', results[i].artist)
      .parent()
      .node('title', results[i].title)
      .parent()
      .parent();
    };

    res.send(doc.toString());
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

/**
 * GET /r/:subreddit.jspf
 */
module.exports.jspf = function(req, res, next) {
  rcharts(req.params.subreddit, function(err, results) {
    if(err) return next(err);
    res.send({
      playlist: {
        title: 'r/' + req.params.subreddit,
        track: [_.map(results, function(t) {
          return {
            title: t.title,
            creator: t.artist,
          }
        })]
      }
    });
  });
}