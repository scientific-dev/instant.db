import { DataSet } from './Database';
/**
 * Utility class
 */
declare class Util {
    /**
     * All the mathematical operations in an object!
     */
    static MathOperations: {
        '+': (a: any, b: any) => any;
        '-': (a: any, b: any) => number;
        '/': (a: any, b: any) => number;
        '*': (a: any, b: any) => number;
        '**': (a: any, b: any) => number;
    };
    static Types: {};
    /**
     * Returns a random element in an array
     *
     * @param arr The array
     * @example db.random([1, 2, 3]); // -> 2
     */
    static random<T>(arr: T[]): T;
    /**
     * Converts dataset type to raw data object!
     *
     * @param items Dataset items to be converted
     * @example Util.fromDataset([ { ID: 'foo', data: 'bar' }]); // Returns { foo: 'bar' };
     */
    static fromDataset(items: DataSet<any>[]): any;
    /**
     * COnverts object to dataset
     *
     * @param obj Object to be converted
     * @example Util.toDataset({ foo: 'bar' });
     */
    static toDataset<V>(obj: any): DataSet<V>[];
}
export default Util;
