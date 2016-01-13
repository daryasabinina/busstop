(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['_localStorageReplacement_'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('_localStorageReplacement_'));
    } else {


        function sizeofAllStorage() {  // provide the size in bytes of the data currently stored
            var size = 0, key;
            for (var i = 0; i <= localStorage.length - 1; i++) {
                key = localStorage.key(i);
                size += lengthInUtf8Bytes(localStorage.getItem(key));
            }
            return size / 1024 / 1024;
        }

        function lengthInUtf8Bytes(str) {
            // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
            var m = encodeURIComponent(str).match(/%[89ABab]/g);
            return str.length + (m ? m.length : 0);
        }


        (function (isStorage) {

            if (!isStorage) {
                var data = {}, undef;

                root.fakeStorage = {
                    setItem: function (id, val) {
                        return data[id] = String(val);
                    },
                    getItem: function (id) {
                        return data.hasOwnProperty(id) ? data[id] : undef;
                    },
                    removeItem: function (id) {
                        return delete data[id];
                    },
                    clear: function () {
                        return data = {};
                    }
                };
            } else {

                if (sizeofAllStorage() > 4) {
                    root.localStorage.clear();
                }
                root.fakeStorage = root.localStorage;
            }
        })((function () {
            try {
                return "localStorage" in root
                    && root.localStorage != null;
            } catch (e) {
                return false;
            }
        })());


        root.CacheManagerFactory = factory(root.fakeStorage);
    }
}(this, function (localStorage) {


    /**
     *
     * @param {string} strategyName
     * @param {string} cacheKey
     * @param {number} expiration
     * @constructor
     */
    function CacheManagerFactory(strategyName, cacheKey, expiration) {

        this.CACHE_VERSION_KEY = cacheKey;
        this.expiration = expiration;

        if (strategyName === 'localStorage') {
            this._storage = localStorage;
        } else {
            throw new Error('Storage Strategy is not implemented');
        }

    }

    function hasItem(key) {
        var _exp = this._storage.getItem(this.makeKey(key));
        return _exp && _exp > 0;
    }

    function getItem(key) {
        var _key, _exp;

        _exp = this._storage.getItem(this.makeKey(key));
        _key = this.makeKey(key);

        return JSON.parse(this._storage.getItem(_key + _exp));
    }

    function setItem(key, val, expiration) {
        var _key, _exp;

        expiration = expiration || this.expiration;

        _key = this.makeKey(key);
        _exp = Date.now() + expiration;

        this._storage.setItem(_key, _exp);

        return this._storage.setItem(_key + _exp, JSON.stringify(val));
    }

    function makeKey(key) {

        return [this.CACHE_VERSION_KEY, key].join('::');
    }

    function clear() {
        this._storage.clear();
    }


    CacheManagerFactory.prototype.hasItem = hasItem;
    CacheManagerFactory.prototype.getItem = getItem;
    CacheManagerFactory.prototype.setItem = setItem;
    CacheManagerFactory.prototype.makeKey = makeKey;
    CacheManagerFactory.prototype.clear = clear;


    return CacheManagerFactory;
}));
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'data-cache-manager'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {

        root.DataApiUtil = factory(root.jQuery, root.CacheManagerFactory);
    }
}(this, function ($, CacheManagerFactory) {


    /**
     * Data Api Utils to do requests against api.consumerreports.org
     * @param options
     * @constructor
     */
    function DataApiUtil(options) {
        this.options = this.options = $.extend({

            apiKey: '__KEY__',
            apiURL: '__URL__',
            cacheKey: 'CacheManagerVersion',
            expiration: 30 * DataApiUtil.MINUTE

        }, options);


        this.__cacheManager = new CacheManagerFactory('localStorage', this.options.cacheKey);
    }

    DataApiUtil.SECOND = 1000;
    DataApiUtil.MINUTE = DataApiUtil.SECOND * 60;
    DataApiUtil.HOUR = DataApiUtil.MINUTE * 60;


    /**
     * Query to API service.
     * @param path
     * @param params
     * @param {Function} next
     */
    function apiQuery(path, params, next) {

        var url = this.options.apiURL + path || '';
        var data = $.extend({
            api_key: this.options.apiKey,
            numResults: -1
        }, params || {});

        url = [url, '?', $.param(data, true)].join('');

        this.cachedJSONQuery(url, next);
    }


    /**
     * Perform an ajax call and store results in-memory
     * Caching strategy could be implemented here
     * @param path
     * @param next
     */
    function cachedJSONQuery(path, next) {
        this.cachedQuery(path, {dataType: 'json'}, next);
    }

    function cachedQuery(url, options, next) {
        var _this;

        _this = this;

        if (_this.__cacheManager.hasItem(url) && false) {
            next(null, _this.__cacheManager.getItem(url));

        } else {

            $.ajax($.extend({url: url, crossDomain: true}, options)).always(function (response, status) {

                if (status === 'success') {
                    //   _this.__cacheManager.setItem(url, response, _this.options.expiration);
                    next(null, response);
                } else {
                    response.url = url;
                    next('API Error', response);
                }
            });
        }
    }

    //Expose Public API

    DataApiUtil.prototype.apiQuery = apiQuery;
    DataApiUtil.prototype.cachedJSONQuery = cachedJSONQuery;
    DataApiUtil.prototype.cachedQuery = cachedQuery;


    return DataApiUtil;
}));
