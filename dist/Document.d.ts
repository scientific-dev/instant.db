/**
 * Simple filter function!
 */
export declare type DocumentFilter<T> = (data: T) => boolean;
export declare class Document<T = {}> {
    readonly filename: string;
    /**
     * The main database class!
     *
     * @param filename Filename where the data stores!
     * @example new Database('database.json');
     */
    constructor(filename?: string);
    /**
     * Returns the size of document records!
     */
    get size(): number;
    /**
     * Used to iterate over this document object!
     */
    [Symbol.iterator](): IterableIterator<T>;
    /**
     * Aliases for this.raw();
     */
    getAll(): T[];
    /**
     * Insert data to a document!
     *
     * @param data The data to insert it into the document!
     */
    insert(...data: T[]): this;
    /**
     * Find one dataset by iterating through it!
     *
     * @param filter The filter should be Partial of the base type or a function which will be iterated to find!
     */
    findOne(filter: Partial<T> | DocumentFilter<T>): T | null;
    /**
     * Find and delete one dataset by iterating through it!
     *
     * @param filter The filter should be Partial of the base type or a function which will be iterated to find!
     */
    deleteOne(filter: Partial<T> | DocumentFilter<T>): void;
    /**
     * Find and delete many datasets by iterating through it!
     *
     * @param filter The filter should be Partial of the base type or a function which will be iterated to find!
     */
    deleteMany(filter: Partial<T> | DocumentFilter<T>): void;
    /**
     * Find many dataset by iterating through it!
     *
     * @param filter The filter should be Partial of the base type or a function which will be iterated to find!
     */
    findMany(filter: Partial<T> | DocumentFilter<T>): T[];
    /**
     * Returns a boolean stating is the object exists or not in the document through the following filter provided!
     *
     * @param filter The filter should be Partial of the base type or a function which will be iterated to find!
     */
    exists(filter: Partial<T> | DocumentFilter<T>): boolean;
    /**
     * Clears all the data in the document!
     */
    clear(): this;
    /**
     * Write data on the database file!
     *
     * @param content The content to write
     */
    _write(content: T[]): void;
    /**
     * Returns the raw data from the file json parsed!
     * @example doc.raw();
     */
    raw(): T[];
}
