"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

var AbstractCursor = require("springbokjs-db/lib/AbstractCursor").AbstractCursor;

var Cursor = (function (AbstractCursor) {
  var Cursor = function Cursor(cursor, store, query) {
    this._cursor = cursor;
    this._store = store;
    this._query = query;
  };

  _extends(Cursor, AbstractCursor);

  _classProps(Cursor, null, {
    query: {
      get: function () {
        return this._query;
      }
    },
    advance: {
      writable: true,
      value: function (count) {
        this._cursor.skip(count);
        return this;
      }
    },
    next: {
      writable: true,
      value: function () {
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
      writable: true,
      value: function (newLimit) {
        var _this2 = this;
        return new Promise(function (resolve, reject) {
          _this2._cursor.limit(newLimit, function (err) {
            if (err) {
              return reject(err);
            }
            resolve();
          });
        });
      }
    },
    count: {
      writable: true,
      value: function (applyLimit) {
        var _this3 = this;
        return new Promise(function (resolve, reject) {
          _this3._cursor.count(applyLimit, function (err, result) {
            if (err) {
              return reject(err);
            }
            resolve(result);
          });
        });
      }
    },
    result: {
      writable: true,
      value: function () {
        return Promise.resolve(this._result);
      }
    },
    remove: {
      writable: true,
      value: function () {
        return this._store.deleteByKey(this.key);
      }
    },
    forEach: {
      writable: true,
      value: function (callback) {
        var _this4 = this;
        return this.forEachResults(function (result) {
          return callback(_this4._store.toVO(result));
        });
      }
    },
    forEachResults: {
      writable: true,
      value: function (callback) {
        var _this5 = this;
        return new Promise(function (resolve, reject) {
          _this5._cursor.each(function (err, result) {
            if (err) {
              return reject(err);
            }
            if (result === null) {
              // end !
              return _this5.close().then(resolve);
            }
            try {
              callback(result);
            } catch (err) {
              reject(err);
            }
          });
        });
      }
    },
    toArray: {
      writable: true,
      value: function () {
        var _this6 = this;
        return new Promise(function (resolve, reject) {
          _this6._cursor.toArray(function (err, results) {
            if (err) {
              return reject(err);
            }
            try {
              resolve(results.map((function (v) {
                return _this6._store.toVO(v);
              })));
            } catch (err) {
              reject(err);
            }
          });
        });
      }
    },
    close: {
      writable: true,
      value: function () {
        var _this7 = this;
        return new Promise(function (resolve, reject) {
          _this7._cursor.close(resolve);
          _this7._cursor = _this7._store = _this7._result = undefined;
        });
      }
    }
  });

  return Cursor;
})(AbstractCursor);

exports.Cursor = Cursor;
//# sourceMappingURL=Cursor.js.map