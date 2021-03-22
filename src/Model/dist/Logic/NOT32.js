"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOT32 = void 0;
const NOT_1 = require("./NOT");
const StringHandle_1 = require("../Library/StringHandle");
/**
 * This is an integrated 32-bits NOT Logic Components.
 * <br/>There is only one input pin called inpin32A since not is a unary operator
 * @category 32Logic
*/
class NOT32 {
    /**
     * @param inSignalA the initial value for inpinA<br/>Note: only 32 binary encoding string, such as "00111100101011000011110010101100", can be accepted<br/>
     *
     * the constructor will then set the outpin according to bit-wise not operation of inpinA.
     * This is done by call static method Not32 {@link Not32}
    */
    constructor(inSignalA) {
        this.inPin32A = inSignalA;
        let bitA = StringHandle_1.stringToIntArray(this.inPin32A);
        this.outPin32 = StringHandle_1.intArrayToString(NOT32.Not32(bitA));
    }
    /**
     * this method will caculate the correct outcome of bitwise not operation of inputA
     * @param BitsA Note that the type of this is array of number
     * @returns the return value of this method is also a array of number.<br/> The outcome of bit-wise not is stored in this array
    */
    static Not32(BitsA) {
        let outBits = [];
        let i = 0;
        BitsA.forEach((bit) => {
            outBits[i] = NOT_1.NOT.Not(bit);
            ++i;
        });
        return outBits;
    }
}
exports.NOT32 = NOT32;
//# sourceMappingURL=NOT32.js.map