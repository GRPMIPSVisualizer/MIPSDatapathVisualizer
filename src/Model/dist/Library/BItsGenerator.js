"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init_bits = void 0;
const StringHandle_1 = require("./StringHandle");
/**
 * This function initialize a binary string of given length with 0
 * @param bitWidth the length of initialized string
 * @returns the initialized string
 */
function init_bits(bitWidth) {
    let bits = new Array();
    for (let i = 0; i < bitWidth; ++i) {
        bits.push(0);
    }
    return StringHandle_1.intArrayToString(bits);
}
exports.init_bits = init_bits;
//# sourceMappingURL=BItsGenerator.js.map