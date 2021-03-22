"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.num2bool = exports.bool2num = void 0;
/**
 * This is the function transfering bool to number
 * @param bool the bool need to be transfered.
 * @returns 1 if true, 0 if false
 */
function bool2num(bool) {
    if (bool)
        return 1;
    else
        return 0;
}
exports.bool2num = bool2num;
/**
 * This is the function transfering number to boolean
 * @param num the number need transfering
 * @returns true if not 0 ,false if 0
 */
function num2bool(num) {
    if (num != 0)
        return true;
    else
        return false;
}
exports.num2bool = num2bool;
//# sourceMappingURL=BooleanHandler.js.map