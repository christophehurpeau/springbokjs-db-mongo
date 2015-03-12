"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var AbstractCursor = require("springbokjs-db/lib/AbstractCursor").AbstractCursor;

var Cursor = exports.Cursor = (function (AbstractCursor) {
    function Cursor(cursor, store, query) {
        _classCallCheck(this, Cursor);

        this._cursor = cursor;
        this._store = store;
        this._query = query;
    }

    _inherits(Cursor, AbstractCursor);

    _prototypeProperties(Cursor, null, {
        query: {
            get: function () {
                return this._query;
            },
            configurable: true
        },
        advance: {
            value: function advance(count) {
                this._cursor.skip(count);
                return this;
            },
            writable: true,
            configurable: true
        },
        next: {
            value: function next() {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    _this._cursor.nextObject(function (err, value) {
                        if (err) {
                            return reject(err);
                        }
                        _this._result = value;
                        _this.key = value && value._id;
                        resolve(_this.key);
                    });
                });
            },
            writable: true,
            configurable: true
        },
        limit: {
            value: function limit(newLimit) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    _this._cursor.limit(newLimit, function (err) {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    });
                });
            },
            writable: true,
            configurable: true
        },
        count: {
            value: function count(applyLimit) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    _this._cursor.count(applyLimit, function (err, result) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(result);
                    });
                });
            },
            writable: true,
            configurable: true
        },
        result: {
            value: function result() {
                return Promise.resolve(this._result);
            },
            writable: true,
            configurable: true
        },
        remove: {
            value: function remove() {
                return this._store.deleteByKey(this.key);
            },
            writable: true,
            configurable: true
        },
        forEach: {
            value: function forEach(callback) {
                var _this = this;
                return this.forEachResults(function (result) {
                    return callback(_this._store.toVO(result));
                });
            },
            writable: true,
            configurable: true
        },
        forEachResults: {
            value: function forEachResults(callback) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    _this._cursor.each(function (err, result) {
                        if (err) {
                            return reject(err);
                        }
                        if (result === null) {
                            // end !
                            _this.close();
                            return resolve();
                        }
                        try {
                            callback(result);
                        } catch (err) {
                            reject(err);
                        }
                    });
                });
            },
            writable: true,
            configurable: true
        },
        toArray: {
            value: function toArray() {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    _this._cursor.toArray(function (err, results) {
                        if (err) {
                            return reject(err);
                        }
                        try {
                            resolve(results.map(function (v) {
                                return _this._store.toVO(v);
                            }));
                        } catch (err) {
                            reject(err);
                        }
                    });
                });
            },
            writable: true,
            configurable: true
        },
        close: {
            value: function close() {
                if (this._cursor) {
                    this._cursor.close();
                    this._cursor = this._store = this._result = undefined;
                }
                return Promise.resolve();
            },
            writable: true,
            configurable: true
        }
    });

    return Cursor;
})(AbstractCursor);
Object.defineProperty(exports, "__esModule", {
    value: true
});
//# sourceMappingURL=Cursor.js.map