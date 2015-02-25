(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module.exports = (function() {
    function LiteCache() {
      this._isLive = __bind(this._isLive, this);
      this.flush = __bind(this.flush, this);
      this.getStats = __bind(this.getStats, this);
      this.keys = __bind(this.keys, this);
      this.del = __bind(this.del, this);
      this.set = __bind(this.set, this);
      this.get = __bind(this.get, this);
      this.data = {};
      this.stats = {
        hits: 0,
        misses: 0,
        keys: 0
      };
    }

    LiteCache.prototype.get = function(key) {
      if (this.data[key] !== undefined && this._isLive(key, this.data[key])) {
        this.stats.hits++;
        return this.data[key].v;
      } else {
        this.stats.misses++;
      }
    };

    LiteCache.prototype.set = function(key, value, ttl) {
      var existed = this.data[key];
      this.data[key] = {
        t: ttl ? Date.now() + ttl * 1000 : undefined,
        v: value
      };
      if (!existed) {
        this.stats.keys++;
      }
    };

    LiteCache.prototype.del = function(key) {
      if (this.data[key]) {
        var v = this.data[key].v;
        delete this.data[key];
        this.stats.keys--;
        return v;
      }
    };

    LiteCache.prototype.keys = function() {
      return Object.keys(this.data);
    };

    LiteCache.prototype.getStats = function() {
      return this.stats;
    };

    LiteCache.prototype.flush = function() {
      this.data = {};
      this.stats = {
        hits: 0,
        misses: 0,
        keys: 0
      };
    };

    LiteCache.prototype._isLive = function(key, data) {
      if (data.t && data.t < Date.now()) {
        this.del(key);
        return false;
      } else {
        return true;
      }
    };
    return LiteCache;

  })();

}).call(this);
