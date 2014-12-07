var AbstractCursor = require('springbokjs-db/lib/AbstractCursor').AbstractCursor;

export class Cursor extends AbstractCursor {
    constructor(cursor, store, query) {
        this._cursor = cursor;
        this._store = store;
        this._query = query;
    }

    get query() {
        return this._query;
    }

    advance(count) {
        this._cursor.skip(count);
        return this;
    }

    next() {
        return new Promise((resolve, reject) => {
            this._cursor.nextObject((err, value) => {
                if (err) {
                    return reject(err);
                }
                this._result = value;
                this.key = value && value._id;
                resolve(this.key);
            });
        });
    }

    limit(newLimit) {
        return new Promise((resolve, reject) => {
            this._cursor.limit(newLimit, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    count(applyLimit) {
        return new Promise((resolve, reject) => {
            this._cursor.count(applyLimit, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    result() {
        return Promise.resolve(this._result);
    }

    remove() {
        return this._store.deleteByKey(this.key);
    }

    forEach(callback) {
        return this.forEachResults((result) => {
            return callback(this._store.toVO(result));
        });
    }

    forEachResults(callback) {
        return new Promise((resolve, reject) => {
            this._cursor.each((err, result) => {
                if (err) {
                    return reject(err);
                }
                if (result === null) {
                    // end !
                    return this.close().then(resolve);
                }
                try {
                    callback(result);
                } catch (err) {
                    reject(err);
                }
            });
        });
    }

    toArray() {
        return new Promise((resolve, reject) => {
            this._cursor.toArray((err, results) => {
                if (err) {
                    return reject(err);
                }
                try {
                    resolve(results.map((v => this._store.toVO(v))));
                } catch(err) {
                    reject(err);
                }
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this._cursor.close(resolve);
            this._cursor = this._store = this._result = undefined;
        });
    }
}
