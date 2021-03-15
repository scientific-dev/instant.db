"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const Util_1 = __importDefault(require("./Util"));
const Action_1 = __importDefault(require("./Action"));
const Errors_1 = require("./Errors");
/**
 * Database main class
 */
class Database {
    /**
     * The main database class!
     *
     * @param filename Filename where the data stores!
     * @example new Database('database.json');
     */
    constructor(filename = 'database.json') {
        this.filename = filename;
        if (!fs_1.default.existsSync(this.filename)) {
            fs_1.default.writeFileSync(this.filename, '{}');
        }
        else {
            try {
                this.raw();
            }
            catch (e) {
                throw new Errors_1.FileError('Error happened when reading the file as json at initial attempt!');
            }
        }
    }
    /**
     * Returns the all ID's stored in the database!
     *
     * @example db.keys
     * @readonly
     */
    get keys() {
        return Object.keys(this.raw());
    }
    /**
     * Returns the all values stored in the database!
     *
     * @example db.values
     * @readonly
     */
    get values() {
        return Object.values(this.raw());
    }
    /**
     * Returns the number of data entries in the database
     *
     * @example db.entries
     * @readonly
     */
    get entries() {
        return this.keys.length;
    }
    /**
     * Returns the database into cache
     * @example db.cache
     * @readonly
     */
    get cache() {
        let res = new Map();
        this.all().forEach(x => res.set(x.ID, x.data));
        return res;
    }
    /**
     * Used to iterate over the database object!
     */
    *[Symbol.iterator]() {
        let values = this.values;
        for (let i = 0; i < values.length; i++)
            yield values[i];
    }
    /**
     * Returns the data from db.raw() to DataSet type!
     *
     * @example db.all()
     */
    all() {
        let data = this.raw();
        let keys = Object.keys(data);
        let res = [];
        for (let i = 0; i < keys.length; i++)
            res.push({ ID: keys[i], data: data[keys[i]] });
        return res;
    }
    /**
     * Returns the data by the id!
     *
     * @param id Id of the data
     * @example db.get('foo');
     */
    get(id) {
        return this.raw()[id];
    }
    /**
     * Set data for id!
     *
     * @param id Key
     * @param data Value of the key
     * @example db.set('foo', 'bar');
     */
    set(id, data) {
        let oldData = this.raw();
        oldData[id] = data;
        this._write(oldData);
    }
    /**
     * Deletes the data of the id!
     *
     * @param ids Ids of the data to delete
     * @example db.delete('foo');
     */
    delete(...ids) {
        let data = this.raw();
        ids.forEach(id => delete data[id]);
        this._write(data);
    }
    /**
     * A method which is similar to Array.prototyoe.filter but will clear the id if you return tru in callback!
     *
     * @param callback The callback which will be ran to delete data
     * @example db.filter(key => key == 'foo');
     */
    filter(callback) {
        let oldData = this.all();
        for (let i = 0; i < oldData.length; i++) {
            let result = callback(oldData[i].data, oldData[i].ID, i, this);
            if (result)
                delete oldData[i];
        }
        this._write(Util_1.default.fromDataset(oldData));
    }
    /**
     * Verify if there is the id entried!
     *
     * @param id Id of the data
     * @example db.exisits('foo');
     */
    exists(id) {
        return this.keys.includes(id);
    }
    /**
     * Returns the typeof data
     *
     * @param id Id of the data
     * @example db.typeof('foo');
     */
    typeof(id) {
        let data = this.get(id);
        return Array.isArray(data) ? 'array' : typeof data;
    }
    random(limit) {
        let data = this.all();
        if (!limit)
            return Util_1.default.random(data);
        else {
            let res = [];
            for (let i = 0; i < limit; i++)
                res.push(Util_1.default.random(data));
            return res;
        }
    }
    /**
     * Clears the whole database
     *
     * @example db.clear();
     */
    clear() {
        this._write({});
    }
    /**
     * Returns the raw data from the file json parsed!
     * @example db.raw();
     */
    raw() {
        return JSON.parse(fs_1.default.readFileSync(this.filename).toString('utf-8'));
    }
    /**
     * Perform math operations
     *
     * @param id Id of the data
     * @param operator Math operator
     * @param amount Amount to perform the math
     * @example db.set('foo', 1); // Lets set foo as 1
     * db.math('foo', '+', 5); // Returns 5+1 6
     * db.math('foo', '-', 5); // Returns 5-1 4
     * db.math('foo', '*', 5); // Returns 5*1 5
     * db.math('foo', '/', 5); // Returns 1/5
     * db.math('foo', '**', 5); // Returns 5**1 1
     */
    math(id, operator, amount) {
        if (isNaN(amount))
            throw new Errors_1.UnexpectedTypeError(`Expected number but got ${typeof amount} to perform math!`);
        let oldData = this.raw();
        let data = oldData[id];
        if (isNaN(data))
            throw new Errors_1.UnexpectedTypeError(`Expected number but got ${typeof data} to perform math!`);
        let newData = Util_1.default.MathOperations[operator](data, amount);
        oldData[id] = newData;
        this._write(oldData);
        return newData;
    }
    /**
     * Aliases for db.math but uses '+' as operator!
     *
     * @param id Id of the data
     * @param amount Amount to add
     * @example db.add('foo', 10);
     */
    add(id, amount) {
        return this.math(id, '+', amount);
    }
    /**
     * Aliases for db.math but uses '-' as operator!
     *
     * @param id Id of the data
     * @param amount Amount to subtract
     * @example db.subtract('foo', 10);
     */
    subtract(id, amount) {
        return this.math(id, '-', amount);
    }
    /**
     * Pushes elements to an array
     *
     * @param id Id of the data
     * @param elements Elements to push
     * @example db.push('foo', 10);
     */
    push(id, ...elements) {
        let data = this.raw();
        if (!Array.isArray(data[id]))
            throw new Errors_1.UnexpectedTypeError('Expected an array to push data!');
        data[id].push(...elements);
        this._write(data);
        return this;
    }
    /**
     * Removes elements from an array
     *
     * @param id Id of the data
     * @param elements Elements to remove
     * @example db.pull('foo', 10);
     */
    pull(id, ...elements) {
        let data = this.raw();
        if (!Array.isArray(data[id]))
            throw new Errors_1.UnexpectedTypeError('Expected an array to pull data!');
        data[id] = data[id].filter(x => !elements.includes(x));
        this._write(data);
        return this;
    }
    /**
     * Import data to the database
     *
     * @param data Data to import in the database!
     * @example db.import({ foo: 'bar' }); // Object can also work
     * db.import([{ ID: 'foo', data: 'bar' }]); // Dataset type also works!
     * db.import('./some_other_db.json'); // Import from some other file
     */
    import(data) {
        if (typeof data == 'string') {
            let db = new Database(data);
            this.import(db.raw());
            return this;
        }
        if (typeof data != 'object')
            throw new Errors_1.FileError('Given data type to import is not a object!');
        let oldData = this.raw();
        if (Array.isArray(data))
            data.forEach(x => oldData[x.ID] = x.data);
        else
            Object.keys(data).forEach(x => oldData[x] = data[x]);
        this._write(oldData);
        return this;
    }
    export(database) {
        if (database instanceof Database) {
            database.import(this.raw());
            return database;
        }
        else {
            let db = new Database(database);
            db.import(this.raw());
            return db;
        }
    }
    /**
     * Make changes to the raw dataset and then finally update the file using the save method!
     *
     * @example let action = db.action();
     * action.set('foo', 'bar');
     * action.delete('baz');
     * action.save(); // Updates the file after all ur changes are done!
     */
    action() {
        return new Action_1.default(this);
    }
    /**
     * The method to write content!
     *
     * @param content The content to write in the file!
     * @example db._write({ foo: 'bar' });
     */
    _write(content) {
        try {
            fs_1.default.writeFileSync(this.filename, JSON.stringify(content));
        }
        catch (e) {
            throw new Errors_1.FileError('Error occured when writing something on the database file!');
        }
    }
}
;
exports.default = Database;
