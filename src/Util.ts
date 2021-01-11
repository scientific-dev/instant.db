import { DataSet } from './Database';

/**
 * Utility class
 */
class Util{

    /**
     * All the mathematical operations in an object!
     */
    static MathOperations = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '/': (a, b) => a / b,
        '*': (a, b) => a * b,
        '**': (a, b) => a ** b
    }

    /**
     * Returns a random element in an array
     * 
     * @param arr The array
     * @example db.random([1, 2, 3]); // -> 2
     */
    static random<T>(arr: T[]): T;
    static random(arr: any[]): any {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    /**
     * Converts dataset type to raw data object!
     * 
     * @param items Dataset items to be converted
     * @example Util.fromDataset([ { ID: 'foo', data: 'bar' }]); // Returns { foo: 'bar' };
     */
    static fromDataset(items: DataSet<any>[]): any {
        let res = {};
        items.forEach(x => res[x.ID] = x.data);
        return res;
    }

};

export default Util;