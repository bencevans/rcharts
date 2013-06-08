
/**
 * Dependencies
 */

var express = require('express'),
    app = express(),
    requireDir = require('requiredir'),
    routes = requireDir('./routes'),
    hbs = require('hbs');

hbs.registerHelper('escape', function(data) {
  return require('querystring').escape(data);
});


/**
 * Express Config
 */

app.configure('development', function() {
  app.use(express.logger('dev'));
});

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.engine('html', hbs.__express);
  app.set('view engine', 'html');
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

/**
 * Routes
 */

app.get('/', function(req, res, next) {
  res.render('index');
});

app.post('/', function(req, res, next) {
  res.redirect('/r/' + req.body.subreddit);
});

app.get('/r/:subreddit.json', routes.charts.json);
app.get('/r/:subreddit.jspf', routes.charts.jspf);
app.get('/r/:subreddit.xml', routes.charts.xml);
app.get('/r/:subreddit.xspf', routes.charts.xspf);
app.get('/r/:subreddit', routes.charts);
app.get(/^\/i\/(.+)\.png$/, routes.image);

/**
 * Listen Up
 */

require('http').createServer(app).listen(process.env.PORT || 3000);