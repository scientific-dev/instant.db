export class FileError extends Error{
    
    name: string;

    /**
     * This error occurs when error occurs on the fs module
     * 
     * @param message Error message
     */
    constructor(message: string) {
        super(message);
        this.name = 'FileError';
    };

};

export class UnexpectedTypeError extends Error{
    
    name: string;

    /**
     * This error occurs when error occurs on the fs module
     * 
     * @param message Error message
     */
    constructor(message: string) {
        super(message);
        this.name = 'UnexpectedTypeError';
    };

};