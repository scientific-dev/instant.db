import Database, { DataSet, RawDataset, MathOperators } from './Database';
import { UnexpectedTypeError } from './Errors';
import Util from './Util';

/**
 * A simple cache based database liked object where you do your experiments and save to the file later when you want!
 */
export default class Action<V>{

    db: Database<V>;
    data: RawDataset<V>;
    private readonly capture: RawDataset<V>;

    /**
     * A simple cache based database liked object where you do your experiments and save to the file later when you want!
     * 
     * @param db The database to do an action!
     * @example new Instant.Action(db); // or
     * db.action();
     */
    constructor(db: Database<V>){
        this.db = db;
        this.data = this.db.raw();
        this.capture = this.data;
    }

    /**
     * Returns the all ID's stored in the database!
     * 
     * @example action.keys
     * @readonly
     */
     get keys(): string[] {
        return Object.keys(this.raw());
    }

    /**
     * Returns the all values stored in the database!
     * 
     * @example action.values
     * @readonly
     */
    get values(): V[] {
        return Object.values(this.raw());
    }

    /**
     * Returns the number of data entries in the database
     * 
     * @example action.entries
     * @readonly
     */
    get entries(): number {
        return this.keys.length;
    }

    /**
     * Returns the database into cache
     * @example action.cache
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
     * Set data for id!
     * 
     * @param id Key
     * @param data Value of the key
     * @example action.set('foo', 'bar');
     */
    set(key: string, value: V): this {
        this.data[key] = value;
        return this;
    }

    /**
     * Returns the data by the id!
     * 
     * @param id Id of the data
     * @example action.get('foo');
     */
    get(key: string): V {
        return this.data[key];
    }

    /**
     * Deletes the data of the id!
     * 
     * @param ids Ids of the data to delete
     * @example action.delete('foo');
     */
    delete(...keys: string[]): this {
        keys.forEach(x => delete this.data[x]);
        return this;
    }

    /**
     * Returns the raw data from the file json parsed!
     * @example db.raw();
     */
    raw(): RawDataset<V> {
        return this.data;
    }

    /**
     * Returns the data from db.raw() to DataSet type!
     * 
     * @example action.all()
     */
    all(): DataSet<V>[] {
        return Util.toDataset<V>(this.data);
    }

    /**
     * A method which is similar to Array.prototyoe.filter but will clear the id if you return tru in callback!
     * 
     * @param callback The callback which will be ran to delete data
     * @example action.filter(key => key == 'foo');
     */
    filter(callback: (value?: V, key?: string, index?: number, thisArg?: this) => boolean): void {
        let oldData = this.all();

        for(let i = 0; i < oldData.length; i++){
            let result = callback(oldData[i].data, oldData[i].ID, i, this);
            if(result) delete oldData[i];
        }

        this.data = Util.fromDataset(oldData);
    }

    /**
     * Perform math operations
     * 
     * @param id Id of the data
     * @param operator Math operator
     * @param amount Amount to perform the math
     * @example db.set('foo', 1); // Lets set foo as 1
     * action.math('foo', '+', 5); // Returns 5+1 6
     * action.math('foo', '-', 5); // Returns 5-1 4
     * action.math('foo', '*', 5); // Returns 5*1 5
     * action.math('foo', '/', 5); // Returns 1/5
     * action.math('foo', '**', 5); // Returns 5**1 1
     */
    math(id: string, operator: MathOperators, amount: number): number {
        if(isNaN(amount)) throw new UnexpectedTypeError(`Expected number but got ${typeof amount} to perform math!`);
        let oldData = this.raw();
        let data: any = oldData[id];
        if(isNaN(data)) throw new UnexpectedTypeError(`Expected number but got ${typeof data} to perform math!`);
        let newData = Util.MathOperations[operator](data, amount);
        oldData[id] = newData;
        this.data = oldData;
        return newData;
    }

    /**
     * Pushes elements to an array
     * 
     * @param id Id of the data
     * @param elements Elements to push
     * @example action.push('foo', 10);
     */
    push(id: string, ...elements: any[]): this {
        let data: any = this.raw();
        if(!Array.isArray(data[id])) throw new UnexpectedTypeError('Expected an array to push data!');
        data[id].push(...elements);
        this.data = data;
        return this;
    }

    /**
     * Removes elements from an array
     * 
     * @param id Id of the data
     * @param elements Elements to remove
     * @example action.pull('foo', 10);
     */
    pull(id: string, ...elements: any[]): this {
        let data: any = this.raw();
        if(!Array.isArray(data[id])) throw new UnexpectedTypeError('Expected an array to pull data!');
        data[id] = data[id].filter(x => !elements.includes(x));
        this.data = data;
        return this;
    }

    /**
     * Saves your current changes!
     */
    save(): Database<V> {
        this.db._write(this.data)
        return this.db;
    }

    /**
     * Undo your changed through the capture when the database was captured!
     */
    undo(): Database<V> {
        this.db._write(this.capture);
        return this.db;
    }

};