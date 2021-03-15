import DatabaseAction from './Action';
/**
 * The main dataset type
 */
export interface DataSet<V> {
    ID: string;
    data: V;
}
/**
 * Raw dataset type!
 */
export interface RawDataset<V> {
    [key: string]: V;
}
/**
 * All the math operators for db.math method!
 */
export declare type MathOperators = '+' | '-' | '/' | '*' | '**';
/**
 * Database main class
 */
declare class Database<V> {
    readonly filename: string;
    /**
     * The main database class!
     *
     * @param filename Filename where the data stores!
     * @example new Database('database.json');
     */
    constructor(filename?: string);
    /**
     * Returns the all ID's stored in the database!
     *
     * @example db.keys
     * @readonly
     */
    get keys(): string[];
    /**
     * Returns the all values stored in the database!
     *
     * @example db.values
     * @readonly
     */
    get values(): V[];
    /**
     * Returns the number of data entries in the database
     *
     * @example db.entries
     * @readonly
     */
    get entries(): number;
    /**
     * Returns the database into cache
     * @example db.cache
     * @readonly
     */
    get cache(): Map<string, V>;
    /**
     * Used to iterate over the database object!
     */
    [Symbol.iterator](): IterableIterator<V>;
    /**
     * Returns the data from db.raw() to DataSet type!
     *
     * @example db.all()
     */
    all(): DataSet<V>[];
    /**
     * Returns the data by the id!
     *
     * @param id Id of the data
     * @example db.get('foo');
     */
    get(id: string): V;
    /**
     * Set data for id!
     *
     * @param id Key
     * @param data Value of the key
     * @example db.set('foo', 'bar');
     */
    set(id: string, data: any): void;
    /**
     * Deletes the data of the id!
     *
     * @param ids Ids of the data to delete
     * @example db.delete('foo');
     */
    delete(...ids: string[]): void;
    /**
     * A method which is similar to Array.prototyoe.filter but will clear the id if you return tru in callback!
     *
     * @param callback The callback which will be ran to delete data
     * @example db.filter(key => key == 'foo');
     */
    filter(callback: (value?: V, key?: string, index?: number, thisArg?: this) => boolean): void;
    /**
     * Verify if there is the id entried!
     *
     * @param id Id of the data
     * @example db.exisits('foo');
     */
    exists(id: string): boolean;
    /**
     * Returns the typeof data
     *
     * @param id Id of the data
     * @example db.typeof('foo');
     */
    typeof(id: string): "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "array";
    /**
     * Returns the randomize results
     *
     * @param limit Limit the random data
     * @example db.random();
     * db.random(5);
     */
    random(limit: number): DataSet<V>[];
    random(): DataSet<V>;
    /**
     * Clears the whole database
     *
     * @example db.clear();
     */
    clear(): void;
    /**
     * Returns the raw data from the file json parsed!
     * @example db.raw();
     */
    raw(): RawDataset<V>;
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
    math(id: string, operator: MathOperators, amount: number): number;
    /**
     * Aliases for db.math but uses '+' as operator!
     *
     * @param id Id of the data
     * @param amount Amount to add
     * @example db.add('foo', 10);
     */
    add(id: string, amount: number): number;
    /**
     * Aliases for db.math but uses '-' as operator!
     *
     * @param id Id of the data
     * @param amount Amount to subtract
     * @example db.subtract('foo', 10);
     */
    subtract(id: string, amount: number): number;
    /**
     * Pushes elements to an array
     *
     * @param id Id of the data
     * @param elements Elements to push
     * @example db.push('foo', 10);
     */
    push(id: string, ...elements: V[]): this;
    /**
     * Removes elements from an array
     *
     * @param id Id of the data
     * @param elements Elements to remove
     * @example db.pull('foo', 10);
     */
    pull(id: string, ...elements: V[]): this;
    /**
     * Import data to the database
     *
     * @param data Data to import in the database!
     * @example db.import({ foo: 'bar' }); // Object can also work
     * db.import([{ ID: 'foo', data: 'bar' }]); // Dataset type also works!
     * db.import('./some_other_db.json'); // Import from some other file
     */
    import(data: RawDataset<V> | string): this;
    /**
     * Export the data to another json file
     *
     * @param database The Database object or filename
     * @example db.export('./some_other.json'); // Can export will filename too
     * db.export(new Database('./some_other.json')); // Can export with Database object too
     */
    export(database: Database<V>): Database<V>;
    export(database: string): Database<V>;
    /**
     * Make changes to the raw dataset and then finally update the file using the save method!
     *
     * @example let action = db.action();
     * action.set('foo', 'bar');
     * action.delete('baz');
     * action.save(); // Updates the file after all ur changes are done!
     */
    action(): DatabaseAction<V>;
    /**
     * The method to write content!
     *
     * @param content The content to write in the file!
     * @example db._write({ foo: 'bar' });
     */
    _write(content: RawDataset<V>): void;
}
export default Database;
