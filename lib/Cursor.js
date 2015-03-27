"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});
var AbstractCursor = require("springbokjs-db/lib/AbstractCursor").AbstractCursor;

var Cursor = exports.Cursor = (function (_AbstractCursor) {
    function Cursor(cursor, store, query) {
        _classCallCheck(this, Cursor);

        this._cursor = cursor;
        this._store = store;
        this._query = query;
    }

    _inherits(Cursor, _AbstractCursor);

    _createClass(Cursor, {
        query: {
            get: function () {
                return this._query;
            }
        },
        advance: {
            value: function advance(count) {
                this._cursor.skip(count);
                return this;
            }
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
            }
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
            }
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
            }
        },
        result: {
            value: function result() {
                return Promise.resolve(this._result);
            }
        },
        remove: {
            value: function remove() {
                return this._store.deleteByKey(this.key);
            }
        },
        forEach: {
            value: function forEach(callback) {
                var _this = this;

                return this.forEachResults(function (result) {
                    return callback(_this._store.toVO(result));
                });
            }
        },
        forEachResults: {
            value: function forEachResults(callback) {
                var _this = this;

                return new Promise(function (resolve, reject) {
                    var waitFor = 0;
                    _this._cursor.each(function (err, result) {
                        if (err) {
                            return reject(err);
                        }
                        if (result === null) {
                            // end !
                            _this.close();
                            if (waitFor === 0) {
                                console.log("resolve");
                                resolve();
                            }
                            return;
                        }
                        try {
                            var result = callback(result);
                            if (result && typeof result.then === "function") {
                                waitFor++;
                                result.then(function () {
                                    console.log(waitFor);
                                    if (--waitFor === 0) {
                                        resolve();
                                    }
                                })["catch"](reject);
                            }
                        } catch (err) {
                            console.log(err.stack || err.message);
                            reject(err);
                        }
                    });
                });
            }
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
            }
        },
        close: {
            value: function close() {
                if (this._cursor) {
                    this._cursor.close();
                    this._cursor = this._store = this._result = undefined;
                }
                return Promise.resolve();
            }
        }
    });

    return Cursor;
})(AbstractCursor);
//# sourceMappingURL=Cursor.js.map