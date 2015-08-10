/* eslint-env mocha */

var assert = require('assert')
var rcharts = require('../lib/rcharts')

describe('lib/rcharts & lib/resolvers/*', function () {

  describe('#getResolverByDomain()', function () {

    describe('with no resolvers that domain match', function () {
      it('should return false', function () {
        assert.strictEqual(rcharts.getResolverByDomain('nodomainhere.com'), false)
      })
    })

    describe('with a domain that does match a resolver', function  () {
      it('should return a resolver with a name, domains & parseTrack attribute', function () {
        var resolver = rcharts.getResolverByDomain('youtube.com')
        assert.ok(resolver.name)
        assert.ok(resolver.domains)
        assert.ok(resolver.parseTrack)
      })
    })

  })

  describe('#parseTrack()', function () {

    describe('with a track that doesn\'t match any resolvers', function () {
      it('should return false', function (done) {
        rcharts.parseTrack({
          domain: 'nodomainhere'
        }, function (err, track) {
          assert.strictEqual(err, null)
          assert.strictEqual(track, false)
          done()
        })
      })
    })

    describe('with a track that doesn\'t match any resolvers', function () {
      it('should return false', function (done) {
        rcharts.parseTrack({
          domain: 'youtube.com',
          title: 'Newton Faulkner - Clouds '
        }, function (err, track) {
          assert.strictEqual(err, null)
          assert.deepEqual(track, {
            title: 'Clouds',
            artist: 'Newton Faulkner',
            source: 'YouTube',
            url: undefined
          })
          done()
        })
      })
    })

  })

  describe('#parseTracks()', function () {

  })

  describe('#()', function () {

  })

})
