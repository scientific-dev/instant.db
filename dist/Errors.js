"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnexpectedTypeError = exports.FileError = void 0;
class FileError extends Error {
    /**
     * This error occurs when error occurs on the fs module
     *
     * @param message Error message
     */
    constructor(message) {
        super(message);
        this.name = 'FileError';
    }
    ;
}
exports.FileError = FileError;
;
class UnexpectedTypeError extends Error {
    /**
     * This error occurs when error occurs on the fs module
     *
     * @param message Error message
     */
    constructor(message) {
        super(message);
        this.name = 'UnexpectedTypeError';
    }
    ;
}
exports.UnexpectedTypeError = UnexpectedTypeError;
;
