import fs from 'fs';
import { FileError } from './Errors';

/**
 * Simple filter function!
 */
export type DocumentFilter<T> = (data: T) => boolean;

export class Document<T = {}>{

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
            fs.writeFileSync(this.filename, '[]');
        }else{
            try{
                this.raw();
            }catch(e){
                throw new FileError('Error happened when reading the file as json at initial attempt!');
            }
        }
    }

    /**
     * Returns the size of document records!
     */
    get size(): number {
        return this.raw().length;
    }

    /**
     * Used to iterate over this document object!
     */
    * [Symbol.iterator](): IterableIterator<T> {
        let values = this.raw();
        for(let i = 0; i < values.length; i++) yield values[i];
    }

    /**
     * Aliases for this.raw();
     */
    getAll(): T[] {
        return this.raw();
    }

    /**
     * Insert data to a document!
     * 
     * @param data The data to insert it into the document!
     */
    insert(...data: T[]): this {
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
    findOne(filter: Partial<T> | DocumentFilter<T>): T | null {
        let data = this.raw();

        if(filter instanceof Function){
            for(let i = 0; i < data.length; i++){
                if(filter(data[i])) return data[i];
            }
        }else{
            let keys = Object.keys(filter);
            for(let i = 0; i < data.length; i++){
                if(keys.find(x => filter[x] == data[i][x])) return data[i];
            }
        }

        return null;
    }

    /**
     * Find and delete one dataset by iterating through it!
     * 
     * @param filter The filter should be Partial of the base type or a function which will be iterated to find!
     */
    deleteOne(filter: Partial<T> | DocumentFilter<T>): void {
        let data = this.raw();

        if(filter instanceof Function){
            for(let i = 0; i < data.length; i++){
                if(filter(data[i])){
                    this._write(data.splice(i+1))
                    return;
                };
            }
        }else{
            let keys = Object.keys(filter);
            for(let i = 0; i < data.length; i++){
                if(keys.find(x => filter[x] == data[i][x])){
                    this._write(data.splice(i+1))
                    return;
                };
            }
        }
    }

    /**
     * Find and delete many datasets by iterating through it!
     * 
     * @param filter The filter should be Partial of the base type or a function which will be iterated to find!
     */
    deleteMany(filter: Partial<T> | DocumentFilter<T>): void {
        let data = this.raw();

        if(filter instanceof Function){
            for(let i = 0; i < data.length; i++){
                if(filter(data[i])) data.splice(i+1);
            }
        }else{
            let keys = Object.keys(filter);
            for(let i = 0; i < data.length; i++){
                if(keys.find(x => filter[x] == data[i][x])) data.splice(i+1);
            }
        }
    }

    /**
     * Find many dataset by iterating through it!
     * 
     * @param filter The filter should be Partial of the base type or a function which will be iterated to find!
     */
    findMany(filter: Partial<T> | DocumentFilter<T>): T[] {
        let data = this.raw();
        let results = [] as T[];

        if(filter instanceof Function){
            for(let i = 0; i < data.length; i++){
                if(filter(data[i])) results.push(data[i]);
            }
        }else{
            let keys = Object.keys(filter);
            for(let i = 0; i < data.length; i++){
                if(keys.find(x => filter[x] == data[i][x])) results.push(data[i]);
            }
        }

        return results;
    }

    /**
     * Returns a boolean stating is the object exists or not in the document through the following filter provided!
     * 
     * @param filter The filter should be Partial of the base type or a function which will be iterated to find!
     */
    exists(filter: Partial<T> | DocumentFilter<T>): boolean {
        return Boolean(this.findOne(filter));
    }

    /**
     * Clears all the data in the document!
     */
    clear(): this {
        this._write([]);
        return this;
    }

    /**
     * Write data on the database file!
     * 
     * @param content The content to write
     */
    _write(content: T[]): void {
        fs.writeFileSync(this.filename, JSON.stringify(content));
    }

    /**
     * Returns the raw data from the file json parsed!
     * @example doc.raw();
     */
    raw(): T[] {
        return JSON.parse(fs.readFileSync(this.filename).toString('utf-8'));
    }

}