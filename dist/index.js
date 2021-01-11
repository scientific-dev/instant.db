"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = exports.Database = exports.version = void 0;
const Database_1 = __importDefault(require("./Database"));
exports.Database = Database_1.default;
const Util_1 = __importDefault(require("./Util"));
exports.Util = Util_1.default;
exports.version = '0.0.1';
__exportStar(require("./Database"), exports);
__exportStar(require("./Errors"), exports);
exports.default = Database_1.default;
