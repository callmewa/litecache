liteCache
===========


# Synchronous NodeJS internal cache.

A purely synchronous lightweight cache module with constant-time `set`, `get` and `del` methods that works like a dictionary map.
Cache supports ttl for expired value removal.  Expired keyValue pairs are only pruned on `get` or `del`.  No tasks are scheduled  in the node event loop.
Built-in support for `null` value and `integer` keys.
If you want stale key-removal scheduler, multi-key support, or event handling then look at [node-cache](https://www.npmjs.com/package/node-cache).
If you do not need nor want to "pay" for those features then **liteCache** is for you.
LiteCache has no external dependencies.  Feel free to comment and contribute!

# Install

```bash
  npm install litecache
```

Or just require the `lite_cache.js` file to get the superclass

# Examples:

## Initialize:

```js
var LiteCache = require( "litecache" );
var cache = new LiteCache();
```

## Store a key (SET):

`cache.set( key, val, [ ttl ] )`

Sets a `key` to `value`. Optionally provide `ttl` (in seconds).

```js
obj = { aNumber: 42 };
cache.set( "aKey", obj, 10);
cache.set( 123, 123);
cache.set('null', null);
```


## Retrieve a key (GET):

`cache.get( key )`

Gets the stored value from cache.
Returns `undefined` if not found or expired.  If expired, the keyValue will be removed from the cache before returning.


## Delete a key (DEL):

`cache.del( key )`

Delete a key. Returns the value for the given key if exist.


## List keys (KEYS)

`cache.keys()`

Returns an array of all existing keys.  


## Statistics (STATS):

`cache.getStats()`

Returns the statistics.  

```js
cache.getStats();
  /*
    {
      keys: 0,    // key count
      hits: 0,    // hit count
      misses: 0,  // miss count
    }
  */
```

## Flush data (FLUSH):

`cache.flush()`

Flush all data.  Reset internal counters.

