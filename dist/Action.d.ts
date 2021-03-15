import Database, { DataSet, RawDataset, MathOperators } from './Database';
/**
 * A simple cache based database liked object where you do your experiments and save to the file later when you want!
 */
export default class Action<V> {
    db: Database<V>;
    data: RawDataset<V>;
    private readonly capture;
    /**
     * A simple cache based database liked object where you do your experiments and save to the file later when you want!
     *
     * @param db The database to do an action!
     * @example new Instant.Action(db); // or
     * db.action();
     */
    constructor(db: Database<V>);
    /**
     * Returns the all ID's stored in the database!
     *
     * @example action.keys
     * @readonly
     */
    get keys(): string[];
    /**
     * Returns the all values stored in the database!
     *
     * @example action.values
     * @readonly
     */
    get values(): V[];
    /**
     * Returns the number of data entries in the database
     *
     * @example action.entries
     * @readonly
     */
    get entries(): number;
    /**
     * Returns the database into cache
     * @example action.cache
     * @readonly
     */
    get cache(): Map<string, V>;
    /**
     * Used to iterate over the database object!
     */
    [Symbol.iterator](): IterableIterator<V>;
    /**
     * Set data for id!
     *
     * @param id Key
     * @param data Value of the key
     * @example action.set('foo', 'bar');
     */
    set(key: string, value: V): this;
    /**
     * Returns the data by the id!
     *
     * @param id Id of the data
     * @example action.get('foo');
     */
    get(key: string): V;
    /**
     * Deletes the data of the id!
     *
     * @param ids Ids of the data to delete
     * @example action.delete('foo');
     */
    delete(...keys: string[]): this;
    /**
     * Returns the raw data from the file json parsed!
     * @example db.raw();
     */
    raw(): RawDataset<V>;
    /**
     * Returns the data from db.raw() to DataSet type!
     *
     * @example action.all()
     */
    all(): DataSet<V>[];
    /**
     * A method which is similar to Array.prototyoe.filter but will clear the id if you return tru in callback!
     *
     * @param callback The callback which will be ran to delete data
     * @example action.filter(key => key == 'foo');
     */
    filter(callback: (value?: V, key?: string, index?: number, thisArg?: this) => boolean): void;
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
    math(id: string, operator: MathOperators, amount: number): number;
    /**
     * Pushes elements to an array
     *
     * @param id Id of the data
     * @param elements Elements to push
     * @example action.push('foo', 10);
     */
    push(id: string, ...elements: any[]): this;
    /**
     * Removes elements from an array
     *
     * @param id Id of the data
     * @param elements Elements to remove
     * @example action.pull('foo', 10);
     */
    pull(id: string, ...elements: any[]): this;
    /**
     * Saves your current changes!
     */
    save(): Database<V>;
    /**
     * Undo your changed through the capture when the database was captured!
     */
    undo(): Database<V>;
}
