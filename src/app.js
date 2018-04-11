/**
 * Dependencies
 */

var path = require('path')
var express = require('express')
var app = express()
var requireDir = require('requiredir')
var routes = requireDir('./routes')
var morgan = require('morgan')
var bodyParser = require('body-parser')

/**
 * Express Config
 */

if (!process.env.NODE_ENV) {
  app.use(morgan('dev'))
}

app.set('views', path.resolve(__dirname, '/views'))
app.set('view engine', 'jade')
app.use(bodyParser.urlencoded({ extended: false }))

/**
 * Routes
 */

app.get('/', function (req, res) {
  res.redirect('/r/Music')
})

app.post('/', function (req, res) {
  res.redirect('/r/' + req.body.subreddit)
})

app.get('/r/:subreddit.json', routes.charts.json)
app.get('/r/:subreddit.jspf', routes.charts.jspf)
app.get('/r/:subreddit.xml', routes.charts.xml)
app.get('/r/:subreddit.xspf', routes.charts.xspf)
app.get('/r/:subreddit', routes.charts)
app.get(/^\/i\/(.+)\.png$/, routes.image)

app.use(express.static(path.resolve(__dirname, '/public')))

/**
 * Listen Up
 */

require('http').createServer(app).listen(process.env.PORT || 3000)
