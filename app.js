'use strict';

/**
 * Dependencies
 */

var express    = require('express');
var app        = express();
var requireDir = require('requiredir');
var routes     = requireDir('./routes');
var hbs        = require('hbs');

hbs.registerHelper('escape', function(data) {
  return require('querystring').escape(data);
});


/**
 * Express Config
 */

if (process.env.NODE_ENV !== 'production') {
  app.use(require('morgan')('dev'));
}

app.set('views', __dirname + '/views');
app.engine('html', hbs.__express);
app.set('view engine', 'html');
// app.use(require('body-parser')());


/**
 * Routes
 */

app.get('/', function(req, res) {
  res.redirect('/r/Music');
});

app.post('/', function(req, res) {
  res.redirect('/r/' + req.body.subreddit);
});

app.get('/r/:subreddit.json', routes.charts.json);
app.get('/r/:subreddit.jspf', routes.charts.jspf);
app.get('/r/:subreddit.xml', routes.charts.xml);
app.get('/r/:subreddit.xspf', routes.charts.xspf);
app.get('/r/:subreddit', function(req, res) {
  res.sendFile('public/index.html');
});
app.get(/^\/i\/(.+)\.png$/, routes.image);

app.use(express.static(__dirname + '/public'));

/**
 * Listen Up
 */

require('http').createServer(app).listen(process.env.PORT || 3000);