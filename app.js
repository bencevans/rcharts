
/**
 * Dependencies
 */

var express = require('express'),
    app = express(),
    requireDir = require('requiredir'),
    routes = requireDir('./routes');

/**
 * Routes
 */

app.get('/', function(req, res, next) {
  res.send('/r/&lt;sub reddit&gt;.json<br/>e.g <a href="/r/folk.json">/r/folk.json</a>');
});

app.get('/r/:subreddit.json', routes.charts.json);
app.get('/r/:subreddit.xml', routes.charts.xml);
app.get('/r/:subreddit.xspf', routes.charts.xml);
app.get('/r/:subreddit', routes.charts);

/**
 * Listen Up
 */

require('http').createServer(app).listen(process.env.PORT || 3000);