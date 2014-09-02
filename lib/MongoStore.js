"use strict";
Object.defineProperties(exports, {
  MongoStore: {get: function() {
      return MongoStore;
    }},
  __esModule: {value: true}
});
var $__Object$defineProperty = Object.defineProperty;
var $__Object$create = Object.create;
var $__Object$getPrototypeOf = Object.getPrototypeOf;
var AbstractStore = require('springbokjs-db/lib/AbstractStore').AbstractStore;
var Cursor = require('./Cursor').Cursor;
var mongodb = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var regexpObjectId = /^[a-f\d]{24}$/i;
var MongoStore = function($__super) {
  "use strict";
  function MongoStore() {
    var $__0 = $__Object$getPrototypeOf(MongoStore.prototype);
    if ($__0 !== null)
      $__0.constructor.apply(this, arguments);
  }
  MongoStore.__proto__ = ($__super !== null ? $__super : Function.prototype);
  MongoStore.prototype = $__Object$create(($__super !== null ? $__super.prototype : null));
  $__Object$defineProperty(MongoStore.prototype, "constructor", {value: MongoStore});
  $__Object$defineProperty(MongoStore.prototype, "initialize", {
    value: function() {
      this.manager.VO.keyPath = '_id';
      return new Promise(function(resolve, reject) {
        if (!this.manager.VO.name || this.manager.VO.name.toLowerCase() === 'function') {
          throw new Error('Unable to find model name');
        }
        this.db.connection.collection(this.manager.VO.name, {w: 1}, function(err, collection) {
          if (err) {
            return reject(err);
          }
          this.collection = collection;
          resolve();
        }.bind(this));
      }.bind(this));
    },
    enumerable: false,
    writable: true
  });
  $__Object$defineProperty(MongoStore.prototype, "store", {
    value: function() {
      return this.collection;
    },
    enumerable: false,
    writable: true
  });
  $__Object$defineProperty(MongoStore.prototype, "toId", {
    value: function(id) {
      if (id instanceof ObjectID) {
        return id;
      }
      if (typeof id === 'string' && id.length === 24 && regexpObjectId.test(id)) {
        return new ObjectID(id);
      }
      return id;
    },
    enumerable: false,
    writable: true
  });
  $__Object$defineProperty(MongoStore.prototype, "createMongoId", {
    value: function(vo) {
      if (!vo.id) {
        vo.data._id = new ObjectID();
      }
    },
    enumerable: false,
    writable: true
  });
  $__Object$defineProperty(MongoStore.prototype, "insert", {
    value: function(options) {
      return new Promise(function(resolve, reject) {
        this.collection.insert(options.data, options, function(err, item) {
          if (err) {
            return reject(err);
          }
          resolve(item);
        });
      }.bind(this));
    },
    enumerable: false,
    writable: true
  });
  $__Object$defineProperty(MongoStore.prototype, "update", {
    value: function(options) {
      return new Promise(function(resolve, reject) {
        this.collection.update(options.criteria, options.data, options, function(err, count) {
          if (err) {
            return reject(err);
          }
          resolve(count);
        });
      }.bind(this));
    },
    enumerable: false,
    writable: true
  });
  $__Object$defineProperty(MongoStore.prototype, "delete", {
    value: function(options) {
      return new Promise(function(resolve, reject) {
        this.collection.remove(options.criteria, options, function(err, count) {
          if (err) {
            return reject(err);
          }
          resolve(count);
        });
      }.bind(this));
    },
    enumerable: false,
    writable: true
  });
  $__Object$defineProperty(MongoStore.prototype, "findOne", {
    value: function(query, options) {
      return new Promise(function(resolve, reject) {
        this.collection.findOne(query, options, function(err, result) {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      }.bind(this));
    },
    enumerable: false,
    writable: true
  });
  $__Object$defineProperty(MongoStore.prototype, "cursor", {
    value: function(query, options) {
      return new Promise(function(resolve, reject) {
        this.collection.find(query, options, function(err, cursor) {
          if (err) {
            return reject(err);
          }
          resolve(new Cursor(cursor, this));
        }.bind(this));
      }.bind(this));
    },
    enumerable: false,
    writable: true
  });
  return MongoStore;
}(AbstractStore);
;
MongoStore.ObjectID = ObjectID;
MongoStore.initialize = function(db) {
  return new Promise(function(resolve, reject) {
    var options = Object.assign(db.options, {
      host: 'localhost',
      port: '27017'
    });
    var connectionString = 'mongodb://' + options.host + ':' + options.port + '/' + db.dbName;
    mongodb.MongoClient.connect(connectionString, function(err, connection) {
      if (err) {
        console.error('connection error:', err);
        return reject(err);
      }
      db.connection = connection;
      resolve();
    });
  });
};

//# sourceMappingURL=MongoStore.js.map