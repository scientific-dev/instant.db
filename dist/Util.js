"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Utility class
 */
class Util {
    static random(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    /**
     * Converts dataset type to raw data object!
     *
     * @param items Dataset items to be converted
     * @example Util.fromDataset([ { ID: 'foo', data: 'bar' }]); // Returns { foo: 'bar' };
     */
    static fromDataset(items) {
        let res = {};
        items.forEach(x => res[x.ID] = x.data);
        return res;
    }
    static toDataset(obj) {
        let keys = Object.keys(obj);
        let res = [];
        keys.forEach(x => res.push({ ID: x, data: obj[x] }));
        return res;
    }
}
/**
 * All the mathematical operations in an object!
 */
Util.MathOperations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '/': (a, b) => a / b,
    '*': (a, b) => a * b,
    '**': (a, b) => a ** b
};
Util.Types = {};
;
exports.default = Util;
