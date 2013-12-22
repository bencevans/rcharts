'use strict';

require('../app');

var request = require('request');
var assert  = require('assert');
var util    = require('util');

describe('Routes', function() {

  describe('/r/:subreddit.json', function() {
    it('should provide a JSON formatted array', function(done) {
      request({
        url: 'http://localhost:3000/r/Music.json',
        json: true
      }, function(req, res, body) {
        assert.equal(res.statusCode, 200);
        assert.equal(body.id, 'Music');
        assert.ok(util.isArray(body.tracks));
        done();
      });
    });
  });

  describe('/i/:artist.png', function() {
    it('should provide a PNG image', function(done) {
      request({
        url: 'http://localhost:3000/i/The xx.png',
        json: true
      }, function(req, res) {
        assert.equal(res.statusCode, 200);
        assert.equal(res.headers['content-type'], 'image/png');
        done();
      });
    });
  });

  describe('/r/:subreddit.json', function() {
    it('should return with a 200 status code', function(done) {
      request('http://localhost:3000/r/Music.json', function(err, res) {
        assert.equal(err, null);
        assert.equal(res.statusCode, 200);
        done();
      });
    });
  });

  describe('/r/:subreddit.jspf', function() {
    it('should return with a 200 status code', function(done) {
      request('http://localhost:3000/r/Music.jspf', function(err, res) {
        assert.equal(err, null);
        assert.equal(res.statusCode, 200);
        done();
      });
    });
  });

  describe('/r/:subreddit.xml', function() {
    it('should return with a 200 status code', function(done) {
      request('http://localhost:3000/r/Music.xml', function(err, res) {
        assert.equal(err, null);
        assert.equal(res.statusCode, 200);
        done();
      });
    });
  });

  describe('/r/:subreddit.xspf', function() {
    it('should return with a 200 status code', function(done) {
      request('http://localhost:3000/r/Music.xspf', function(err, res) {
        assert.equal(err, null);
        assert.equal(res.statusCode, 200);
        done();
      });
    });
  });


});
