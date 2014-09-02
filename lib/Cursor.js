"use strict";
Object.defineProperties(exports, {
  Cursor: {get: function() {
      return Cursor;
    }},
  __esModule: {value: true}
});
var $__Object$defineProperty = Object.defineProperty;
var $__Object$create = Object.create;
var AbstractCursor = require('springbokjs-db/lib/AbstractCursor').AbstractCursor;
var Cursor = function($__super) {
  "use strict";
  function Cursor(cursor, store) {
    this._cursor = cursor;
    this._store = store;
  }
  Cursor.__proto__ = ($__super !== null ? $__super : Function.prototype);
  Cursor.prototype = $__Object$create(($__super !== null ? $__super.prototype : null));
  $__Object$defineProperty(Cursor.prototype, "constructor", {value: Cursor});
  $__Object$defineProperty(Cursor.prototype, "advance", {
    value: function(count) {
      this._cursor.skip(count);
      return this;
    },
    enumerable: false,
    writable: true
  });
  $__Object$defineProperty(Cursor.prototype, "next", {
    value: function() {
      return new Promise(function(resolve, reject) {
        this._cursor.nextObject(function(err, value) {
          if (err) {
            return reject(err);
          }
          this._result = value;
          this.key = value && value._id;
          resolve(this.key);
        }.bind(this));
      }.bind(this));
    },
    enumerable: false,
    writable: true
  });
  $__Object$defineProperty(Cursor.prototype, "limit", {
    value: function(newLimit) {
      return new Promise(function(resolve, reject) {
        this._cursor.limit(newLimit, function(err) {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      }.bind(this));
    },
    enumerable: false,
    writable: true
  });
  $__Object$defineProperty(Cursor.prototype, "count", {
    value: function(applyLimit) {
      return new Promise(function(resolve, reject) {
        this._cursor.count(applyLimit, function(err) {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      }.bind(this));
    },
    enumerable: false,
    writable: true
  });
  $__Object$defineProperty(Cursor.prototype, "result", {
    value: function() {
      return Promise.resolve(this._result);
    },
    enumerable: false,
    writable: true
  });
  $__Object$defineProperty(Cursor.prototype, "model", {
    value: function() {
      return Promise.resolve(this._store.toVO(this._result));
    },
    enumerable: false,
    writable: true
  });
  $__Object$defineProperty(Cursor.prototype, "remove", {
    value: function() {
      return this._store.deleteByKey(this.key);
    },
    enumerable: false,
    writable: true
  });
  $__Object$defineProperty(Cursor.prototype, "forEach", {
    value: function(callback) {
      return this.forEachResults(function(result) {
        callback(this._store.toVO(result));
      }.bind(this));
    },
    enumerable: false,
    writable: true
  });
  $__Object$defineProperty(Cursor.prototype, "forEachResults", {
    value: function(callback) {
      return new Promise(function(resolve, reject) {
        this._cursor.each(function(err, result) {
          if (err) {
            return reject(err);
          }
          if (result === null) {
            return resolve();
          }
          callback(result);
        });
      }.bind(this));
    },
    enumerable: false,
    writable: true
  });
  $__Object$defineProperty(Cursor.prototype, "toArray", {
    value: function() {
      return new Promise(function(resolve, reject) {
        this._cursor.toArray(function(err, results) {
          if (err) {
            return reject(err);
          }
          try {
            resolve(results.map(function(v) {
              return this._store.toVO(v);
            }.bind(this)));
          } catch (err) {
            reject(err);
          }
        }.bind(this));
      }.bind(this));
    },
    enumerable: false,
    writable: true
  });
  $__Object$defineProperty(Cursor.prototype, "close", {
    value: function() {
      return new Promise(function(resolve, reject) {
        this._cursor.close(resolve);
        this._cursor = this._store = this._result = undefined;
      }.bind(this));
    },
    enumerable: false,
    writable: true
  });
  return Cursor;
}(AbstractCursor);
;

//# sourceMappingURL=Cursor.js.map