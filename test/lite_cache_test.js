var should = require("should");
var LiteCache = require("../lib/lite_cache");
var assert = require("assert");
var _ = require("lodash");

var cache = new LiteCache();

describe('Cache tests', function() {
  describe('set, get, del, keys, getStats, flush', function(){
    it('should get correct values', function() {
      var stats;
      // set 'a' to 3
      cache.set('a', 3);
      // create a value object
      var vObj = { b: '123' };
      // set 3 with object
      cache.set(3, vObj);
      // set 'null' with null
      cache.set('null', null);

      // get stats
      stats = cache.getStats();
      //  get 'a' hit
      cache.get('a').should.equal(3);
      // get 3 hit
      cache.get(3).should.equal(vObj);
      // get x miss should return undefined
      assert(cache.get('x') === undefined);
      // get 'null' should return null
      assert(cache.get('null') === null);
      // check that stats match
      stats.keys.should.equal(3);
      stats.hits.should.equal(3);
      stats.misses.should.equal(1);
      cache.keys().should.have.lengthOf(3);
      // all keys should be present
      _.difference(cache.keys(), ['3', 'a', 'null']).should.have.lengthOf(0);

      // overwrite 3
      cache.set(3, 'abc');
      cache.get(3).should.equal('abc');
      // refresh stats
      stats = cache.getStats();
      // key count should remain unchanged
      stats.keys.should.equal(3);

      // delete 'null' key
      cache.del('null');

      var deleted = cache.del(3);
      deleted.should.equal('abc');
      // refresh stats
      stats = cache.getStats();
      // key count should remain unchanged
      stats.keys.should.equal(1);
      cache.keys().should.have.lengthOf(1);
    });

    after('flush cache', function() {
      cache.flush();
      var stats;
      stats = cache.getStats();
      stats.keys.should.equal(0);
      stats.hits.should.equal(0);
      stats.misses.should.equal(0);
      cache.keys().should.have.lengthOf(0);
    })
  });


  describe('time to live tests', function(){
    it('time to live should work', function(done) {

      // set 'a' to 3 expiration in .05 seconds
      cache.set('a', 3, .05);
      // create a value object
      var vObj = { b: '123' };
      // set 3 with object
      cache.set(3, vObj, 1);

      // set 'a' to 3 without expiration
      cache.set('sync', vObj);

      setTimeout(function() {
        // key 'a' should have expired
        assert(cache.get('a') === undefined);
        // key 3 should not have expired
        cache.get(3).should.equal(vObj);
        // make sure the sync value is still around
        cache.get('sync').should.equal(vObj);
        var stats = cache.getStats();
        stats.misses.should.equal(1);
        stats.keys.should.equal(2);
        cache.keys().should.eql(['3', 'sync']);
        done();
      }, 55);
    });
  });
});