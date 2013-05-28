
/**
 * Dependencies
 */

var express = require('express');
var app = express();
var request = require('request');
var _ = require('underscore');

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

/**
 * Routes
 */

app.get('/', function(req, res, next) {
  res.send('/r/&lt;sub reddit&gt;.json<br/>e.g <a href="/r/folk.json">/r/folk.json</a>');
});

app.get('/r/:subreddit.json', function(req, res, next) {

  cachey.cache(req.path, 60 * 60, function(callback) {
    request({
      uri: 'http://www.reddit.com/' + req.path,
      json: true
    }, function(err, rres, body) {
      if(err) return callback(err);
      callback(null, body);
    });
  }, function(err, body) {
    var items = body.data.children;

    items = _.filter(items, function(item) {
      return item.data.domain.match('youtube.com');
    });

    var tracks = _.map(items, function(item) {
      var match = item.data.title.match(/(.+) - (.+)[(|\.]?/);

      if(!match) return false;

      return {
        title: match[1],
        artist: match[2]
      };
    });

    tracks = _.filter(tracks, function(track) {
      return track;
    });

    res.send({error: false, results: tracks});
  });

});

require('http').createServer(app).listen(process.env.PORT || 3000);