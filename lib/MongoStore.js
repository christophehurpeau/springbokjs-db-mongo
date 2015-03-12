"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var AbstractStore = require("springbokjs-db/lib/AbstractStore").AbstractStore;
var Cursor = require("./Cursor").Cursor;
var mongodb = require("mongodb");
var ObjectID = require("mongodb").ObjectID;

var regexpObjectId = /^[a-f\d]{24}$/i;
var MongoStore = exports.MongoStore = (function (AbstractStore) {
    function MongoStore() {
        _classCallCheck(this, MongoStore);

        if (AbstractStore != null) {
            AbstractStore.apply(this, arguments);
        }
    }

    _inherits(MongoStore, AbstractStore);

    _prototypeProperties(MongoStore, null, {
        initialize: {
            value: function initialize() {
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
            },
            writable: true,
            configurable: true
        },
        store: {
            value: function store() {
                return this.collection;
            },
            writable: true,
            configurable: true
        },
        toId: {
            value: function toId(id) {
                if (id instanceof ObjectID) {
                    return id;
                }
                if (typeof id === "string" && id.length === 24 && regexpObjectId.test(id)) {
                    return new ObjectID(id);
                }
                return id;
            },
            writable: true,
            configurable: true
        },
        createMongoId: {
            value: function createMongoId(vo) {
                if (!vo.id) {
                    vo.data._id = new ObjectID();
                }
            },
            writable: true,
            configurable: true
        },
        insert: {
            value: function insert(options) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    _this.collection.insert(options.data, options, function (err, item) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(item);
                    });
                });
            },
            writable: true,
            configurable: true
        },
        update: {
            value: function update(options) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    var data = !options.partialUpdate ? options.data : { $set: options.data };
                    _this.collection.update(options.criteria, data, options, function (err, count) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(count);
                    });
                });
            },
            writable: true,
            configurable: true
        },
        remove: {
            value: function remove(options) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    _this.collection.remove(options.criteria, options, function (err, count) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(count);
                    });
                });
            },
            writable: true,
            configurable: true
        },
        findOne: {

            /** @see http://mongodb.github.io/node-mongodb-native/api-generated/collection.html#findone */
            value: function findOne(query, options) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    //selector, options, callback?
                    //options= limit,sort,fields,skip,hint,tailable,tailableRetryInterval,returnKey,maxScan,min,max,comment,raw
                    _this.collection.findOne(query, options, function (err, result) {
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
        cursor: {

            /** @see http://mongodb.github.io/node-mongodb-native/api-generated/collection.html#find */
            value: function cursor(query, options) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    //selector, options, callback?
                    //options= limit,sort,fields,skip,hint,tailable,returnKey,maxScan,min,max,comment,raw
                    _this.collection.find(query, options, function (err, cursor) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(new Cursor(cursor, _this, query));
                    });
                });
            },
            writable: true,
            configurable: true
        }
    });

    return MongoStore;
})(AbstractStore);


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
Object.defineProperty(exports, "__esModule", {
    value: true
});
//# sourceMappingURL=MongoStore.js.map