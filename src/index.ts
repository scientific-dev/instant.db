import Database from './Database';
import DatabaseAction from './Action';
import Util from './Util';

export const version: string = '1.5.0';

export * from './Database';
export * from './Errors';
export * from './Document';
export { Util, DatabaseAction };
export default Database;