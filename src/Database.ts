import fs from 'fs';
import Util from './Util';
import DatabaseAction from './Action';
import { FileError, UnexpectedTypeError } from './Errors';

/**
 * The main dataset type
 */
export interface DataSet<V>{
    ID: string;
    data: V;
}

/**
 * Raw dataset type!
 */
export interface RawDataset<V>{
    [key: string]: V;
}

/**
 * All the math operators for db.math method!
 */
export type MathOperators = '+' | '-' | '/' | '*' | '**';

/**
 * Database main class
 */
class Database<V>{

    readonly filename: string;

    /**
     * The main database class!
     * 
     * @param filename Filename where the data stores!
     * @example new Database('database.json');
     */
    constructor(filename: string = 'database.json'){
        this.filename = filename;

        if(!fs.existsSync(this.filename)){
            fs.writeFileSync(this.filename, '{}');
        }else{
            try{
                this.raw();
            }catch(e){
                throw new FileError('Error happened when reading the file as json at initial attempt!');
            }
        }
    }

    /**
     * Returns the all ID's stored in the database!
     * 
     * @example db.keys
     * @readonly
     */
    get keys(): string[] {
        return Object.keys(this.raw());
    }

    /**
     * Returns the all values stored in the database!
     * 
     * @example db.values
     * @readonly
     */
    get values(): V[] {
        return Object.values(this.raw());
    }

    /**
     * Returns the number of data entries in the database
     * 
     * @example db.entries
     * @readonly
     */
    get entries(): number {
        return this.keys.length;
    }

    /**
     * Returns the database into cache
     * @example db.cache
     * @readonly
     */
    get cache(): Map<string, V> {
        let res = new Map<string, V>();
        this.all().forEach(x => res.set(x.ID, x.data));
        return res;
    }

    /**
     * Used to iterate over the database object!
     */
    * [Symbol.iterator](): IterableIterator<V> {
        let values = this.values;
        for(let i = 0; i < values.length; i++) yield values[i];
    }

    /**
     * Returns the data from db.raw() to DataSet type!
     * 
     * @example db.all()
     */
    all(): DataSet<V>[] {
        let data: RawDataset<V> = this.raw();
        let keys: string[] = Object.keys(data);
        let res: DataSet<V>[] = [];

        for(let i = 0; i < keys.length; i++) res.push({ ID: keys[i], data: data[keys[i]] });

        return res;
    }

    /**
     * Returns the data by the id!
     * 
     * @param id Id of the data
     * @example db.get('foo');
     */
    get(id: string): V {
        return this.raw()[id];
    }

    /**
     * Set data for id!
     * 
     * @param id Key
     * @param data Value of the key
     * @example db.set('foo', 'bar');
     */
    set(id: string, data: any): void {
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
    delete(...ids: string[]): void {
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
    filter(callback: (value?: V, key?: string, index?: number, thisArg?: this) => boolean): void {
        let oldData = this.all();

        for(let i = 0; i < oldData.length; i++){
            let result = callback(oldData[i].data, oldData[i].ID, i, this);
            if(result) delete oldData[i];
        }

        this._write(Util.fromDataset(oldData));
    }

    /**
     * Verify if there is the id entried!
     * 
     * @param id Id of the data
     * @example db.exisits('foo');
     */
    exists(id: string): boolean {
        return this.keys.includes(id);
    }
    
    /**
     * Returns the typeof data
     * 
     * @param id Id of the data
     * @example db.typeof('foo');
     */
    typeof(id: string): "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "array" {
        let data = this.get(id);
        return Array.isArray(data) ? 'array': typeof data;
    }

    /**
     * Returns the randomize results
     * 
     * @param limit Limit the random data
     * @example db.random();
     * db.random(5);
     */
    random(limit: number): DataSet<V>[];
    random(): DataSet<V>;
    random(limit?: number): DataSet<V> | DataSet<V>[] {
        let data = this.all();
        if(!limit) return Util.random<DataSet<V>>(data);
        else {
            let res: DataSet<V>[] = [];
            for(let i = 0; i < limit; i++) res.push(Util.random<DataSet<V>>(data));
            return res;
        }
    }

    /**
     * Clears the whole database
     * 
     * @example db.clear();
     */
    clear(): void {
        this._write({});
    }

    /**
     * Returns the raw data from the file json parsed!
     * @example db.raw();
     */
    raw(): RawDataset<V> {
        return JSON.parse(fs.readFileSync(this.filename).toString('utf-8'));
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
    math(id: string, operator: MathOperators, amount: number): number {
        if(isNaN(amount)) throw new UnexpectedTypeError(`Expected number but got ${typeof amount} to perform math!`);
        let oldData = this.raw();
        let data: any = oldData[id];
        if(isNaN(data)) throw new UnexpectedTypeError(`Expected number but got ${typeof data} to perform math!`);
        let newData = Util.MathOperations[operator](data, amount);
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
    add(id: string, amount: number): number {
        return this.math(id, '+', amount);
    }

    /**
     * Aliases for db.math but uses '-' as operator!
     * 
     * @param id Id of the data
     * @param amount Amount to subtract
     * @example db.subtract('foo', 10);
     */
    subtract(id: string, amount: number): number {
        return this.math(id, '-', amount);
    }

    /**
     * Pushes elements to an array
     * 
     * @param id Id of the data
     * @param elements Elements to push
     * @example db.push('foo', 10);
     */
    push(id: string, ...elements: V[]): this {
        let data: any = this.raw();
        if(!Array.isArray(data[id])) throw new UnexpectedTypeError('Expected an array to push data!');
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
    pull(id: string, ...elements: V[]): this {
        let data: any = this.raw();
        if(!Array.isArray(data[id])) throw new UnexpectedTypeError('Expected an array to pull data!');
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
    import(data: RawDataset<V> | string): this {
        if(typeof data == 'string'){
            let db = new Database<V>(data);
            this.import(db.raw());
            return this;
        }
        if(typeof data != 'object') throw new FileError('Given data type to import is not a object!');
        let oldData = this.raw();

        if(Array.isArray(data)) data.forEach(x => oldData[x.ID] = x.data);
        else Object.keys(data).forEach(x => oldData[x] = data[x]);

        this._write(oldData);
        return this;
    }

    /**
     * Export the data to another json file
     * 
     * @param database The Database object or filename
     * @example db.export('./some_other.json'); // Can export will filename too
     * db.export(new Database('./some_other.json')); // Can export with Database object too
     */
    export(database: Database<V>): Database<V>;
    export(database: string): Database<V>;
    export(database: string | Database<V>): Database<V> {
        if(database instanceof Database){
            database.import(this.raw());
            return database;
        }else{
            let db = new Database<V>(database);
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
    action(): DatabaseAction<V> {
        return new DatabaseAction<V>(this);
    }

    /**
     * The method to write content!
     * 
     * @param content The content to write in the file!
     * @example db._write({ foo: 'bar' });
     */
    _write(content: RawDataset<V>): void {
        try{
            fs.writeFileSync(this.filename, JSON.stringify(content));
        }catch(e){
            throw new FileError('Error occured when writing something on the database file!');
        }
    }
    
};

export default Database;