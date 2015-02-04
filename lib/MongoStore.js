"use strict";

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

var AbstractStore = require("springbokjs-db/lib/AbstractStore").AbstractStore;
var Cursor = require("./Cursor").Cursor;
var mongodb = require("mongodb");
var ObjectID = require("mongodb").ObjectID;

var regexpObjectId = /^[a-f\d]{24}$/i;
var MongoStore = (function (AbstractStore) {
  var MongoStore = function MongoStore() {
    AbstractStore.apply(this, arguments);
  };

  _extends(MongoStore, AbstractStore);

  MongoStore.prototype.initialize = function () {
    var _this = this;
    this.manager.VO.keyPath = "_id";
    return new Promise(function (resolve, reject) {
      if (!_this.manager.VO.name || _this.manager.VO.name.toLowerCase() === "function") {
        throw new Error("Unable to find model name");
      }
      _this.db.connection.collection(_this.manager.VO.name, { w: 1 }, function (err, collection) {
        if (err) {
          return reject(err);
        }
        _this.collection = collection;
        resolve();
      });
    });
  };

  MongoStore.prototype.store = function () {
    return this.collection;
  };

  MongoStore.prototype.toId = function (id) {
    if (id instanceof ObjectID) {
      return id;
    }
    if (typeof id === "string" && id.length === 24 && regexpObjectId.test(id)) {
      return new ObjectID(id);
    }
    return id;
  };

  MongoStore.prototype.createMongoId = function (vo) {
    if (!vo.id) {
      vo.data._id = new ObjectID();
    }
  };

  MongoStore.prototype.insert = function (options) {
    var _this2 = this;
    return new Promise(function (resolve, reject) {
      _this2.collection.insert(options.data, options, function (err, item) {
        if (err) {
          return reject(err);
        }
        resolve(item);
      });
    });
  };

  MongoStore.prototype.update = function (options) {
    var _this3 = this;
    return new Promise(function (resolve, reject) {
      var data = !options.partialUpdate ? options.data : { $set: options.data };
      _this3.collection.update(options.criteria, data, options, function (err, count) {
        if (err) {
          return reject(err);
        }
        resolve(count);
      });
    });
  };

  MongoStore.prototype["delete"] = function (options) {
    var _this4 = this;
    return new Promise(function (resolve, reject) {
      _this4.collection.remove(options.criteria, options, function (err, count) {
        if (err) {
          return reject(err);
        }
        resolve(count);
      });
    });
  };

  MongoStore.prototype.findOne = function (query, options) {
    var _this5 = this;
    return new Promise(function (resolve, reject) {
      //selector, options, callback?
      //options= limit,sort,fields,skip,hint,tailable,tailableRetryInterval,returnKey,maxScan,min,max,comment,raw
      _this5.collection.findOne(query, options, function (err, result) {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  };

  MongoStore.prototype.cursor = function (query, options) {
    var _this6 = this;
    return new Promise(function (resolve, reject) {
      //selector, options, callback?
      //options= limit,sort,fields,skip,hint,tailable,returnKey,maxScan,min,max,comment,raw
      _this6.collection.find(query, options, function (err, cursor) {
        if (err) {
          return reject(err);
        }
        resolve(new Cursor(cursor, _this6, query));
      });
    });
  };

  return MongoStore;
})(AbstractStore);

exports.MongoStore = MongoStore;


MongoStore.ObjectID = ObjectID;

MongoStore.initialize = function (db) {
  return new Promise(function (resolve, reject) {
    var options = Object.assign({
      host: "localhost",
      port: "27017"
    }, db.options);
    var connectionString = "mongodb://" + (options.user ? options.user + ":" + options.password + "@" : "") + options.host + ":" + options.port + "/" + db.dbName;
    mongodb.MongoClient.connect(connectionString, function (err, connection) {
      if (err) {
        console.error("connection error:", err);
        return reject(err);
      }
      db.connection = connection;
      resolve();
    });
  });
};

MongoStore.close = function (db) {
  db.connection.close();
};
//# sourceMappingURL=MongoStore.js.map