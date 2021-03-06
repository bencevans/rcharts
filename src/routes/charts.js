/**
 * Module Dependencies
 */

var rcharts = require('../lib/rcharts')
var _ = require('underscore')
var libxml = require('libxmljs')
var async = require('async')
var soundcloud = require('../lib/soundcloud')
var subreddits = require('../public/subreddits.json')

/**
 * Routes
 */

/**
 * GET /r/:subreddit
 */
module.exports = function (req, res, next) {
  rcharts(req.params.subreddit, function (err, results) {
    if (err && err.message && err.message.match(/200/)) {
      return next()
    } else if (err) {
      return next(err)
    }
    res.render('chart', {
      name: req.params.subreddit,
      layout: false,
      results: results,
      subreddits: subreddits
    })
  })
}

/**
 * GET /r/:subreddit.xml
 */
module.exports.xml = function (req, res) {
  res.redirect('/r/' + req.params.subreddit + '.xspf')
}

/**
 * GET /r/:subreddit.xspf
 */
module.exports.xspf = function (req, res, next) {
  res.type('text/xml;charset=UTF-8')

  rcharts(req.params.subreddit, function (err, results) {
    if (err) {
      return next(err)
    }

    async.map(results, function (track, done) {
      if (track.url.match(/soundcloud/)) {
        soundcloud.resolveStreamURL(track.url, function (err, location) {
          if (err) {
            return next(err)
          }
          track.location = location
          done()
        })
      } else {
        done()
      }
    }, function () {
      var doc = new libxml.Document()
      var curser = doc.node('playlist').attr({ version: 1, xmlns: 'http://xspf.org/ns/0/' })
        .node('title', 'r/' + req.params.subreddit)
        .parent()
        .node('trackList')

      for (var i = 0; i < results.length; i++) {
        curser.node('track')
          .node('creator', results[i].artist)
          .parent()
          .node('title', results[i].title)
        curser.parent()

        if (results[i].location) {
          curser.node('location', results[i].location)
            .parent()
        }

        curser.parent()
      }

      res.send(doc.toString())
    })
  })
}

/**
 * GET /r/:subreddit.json
 */
module.exports.json = function (req, res, next) {
  rcharts(req.params.subreddit, function (err, results) {
    if (err) {
      return next(err)
    }
    res.jsonp({ id: req.params.subreddit, tracks: results })
  })
}

/**
 * GET /r/:subreddit.jspf
 */
module.exports.jspf = function (req, res, next) {
  rcharts(req.params.subreddit, function (err, results) {
    if (err) {
      return next(err)
    }
    res.send({
      playlist: {
        title: 'r/' + req.params.subreddit,
        track: [_.map(results, function (t) {
          return {
            title: t.title,
            creator: t.artist
          }
        })]
      }
    })
  })
}
