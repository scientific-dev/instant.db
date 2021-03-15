"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Document = void 0;
const fs_1 = __importDefault(require("fs"));
const Errors_1 = require("./Errors");
class Document {
    /**
     * The main database class!
     *
     * @param filename Filename where the data stores!
     * @example new Database('database.json');
     */
    constructor(filename = 'database.json') {
        this.filename = filename;
        if (!fs_1.default.existsSync(this.filename)) {
            fs_1.default.writeFileSync(this.filename, '[]');
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
     * Returns the size of document records!
     */
    get size() {
        return this.raw().length;
    }
    /**
     * Used to iterate over this document object!
     */
    *[Symbol.iterator]() {
        let values = this.raw();
        for (let i = 0; i < values.length; i++)
            yield values[i];
    }
    /**
     * Aliases for this.raw();
     */
    getAll() {
        return this.raw();
    }
    /**
     * Insert data to a document!
     *
     * @param data The data to insert it into the document!
     */
    insert(...data) {
        let oldData = this.raw();
        oldData.push(...data);
        this._write(oldData);
        return this;
    }
    /**
     * Find one dataset by iterating through it!
     *
     * @param filter The filter should be Partial of the base type or a function which will be iterated to find!
     */
    findOne(filter) {
        let data = this.raw();
        if (filter instanceof Function) {
            for (let i = 0; i < data.length; i++) {
                if (filter(data[i]))
                    return data[i];
            }
        }
        else {
            let keys = Object.keys(filter);
            for (let i = 0; i < data.length; i++) {
                if (keys.find(x => filter[x] == data[i][x]))
                    return data[i];
            }
        }
        return null;
    }
    /**
     * Find and delete one dataset by iterating through it!
     *
     * @param filter The filter should be Partial of the base type or a function which will be iterated to find!
     */
    deleteOne(filter) {
        let data = this.raw();
        if (filter instanceof Function) {
            for (let i = 0; i < data.length; i++) {
                if (filter(data[i])) {
                    this._write(data.splice(i + 1));
                    return;
                }
                ;
            }
        }
        else {
            let keys = Object.keys(filter);
            for (let i = 0; i < data.length; i++) {
                if (keys.find(x => filter[x] == data[i][x])) {
                    this._write(data.splice(i + 1));
                    return;
                }
                ;
            }
        }
    }
    /**
     * Find and delete many datasets by iterating through it!
     *
     * @param filter The filter should be Partial of the base type or a function which will be iterated to find!
     */
    deleteMany(filter) {
        let data = this.raw();
        if (filter instanceof Function) {
            for (let i = 0; i < data.length; i++) {
                if (filter(data[i]))
                    data.splice(i + 1);
            }
        }
        else {
            let keys = Object.keys(filter);
            for (let i = 0; i < data.length; i++) {
                if (keys.find(x => filter[x] == data[i][x]))
                    data.splice(i + 1);
            }
        }
    }
    /**
     * Find many dataset by iterating through it!
     *
     * @param filter The filter should be Partial of the base type or a function which will be iterated to find!
     */
    findMany(filter) {
        let data = this.raw();
        let results = [];
        if (filter instanceof Function) {
            for (let i = 0; i < data.length; i++) {
                if (filter(data[i]))
                    results.push(data[i]);
            }
        }
        else {
            let keys = Object.keys(filter);
            for (let i = 0; i < data.length; i++) {
                if (keys.find(x => filter[x] == data[i][x]))
                    results.push(data[i]);
            }
        }
        return results;
    }
    /**
     * Returns a boolean stating is the object exists or not in the document through the following filter provided!
     *
     * @param filter The filter should be Partial of the base type or a function which will be iterated to find!
     */
    exists(filter) {
        return Boolean(this.findOne(filter));
    }
    /**
     * Clears all the data in the document!
     */
    clear() {
        this._write([]);
        return this;
    }
    /**
     * Write data on the database file!
     *
     * @param content The content to write
     */
    _write(content) {
        fs_1.default.writeFileSync(this.filename, JSON.stringify(content));
    }
    /**
     * Returns the raw data from the file json parsed!
     * @example doc.raw();
     */
    raw() {
        return JSON.parse(fs_1.default.readFileSync(this.filename).toString('utf-8'));
    }
}
exports.Document = Document;
