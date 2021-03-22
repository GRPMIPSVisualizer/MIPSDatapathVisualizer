"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AND32 = void 0;
const AND_1 = require("./AND");
const StringHandle_1 = require("../Library/StringHandle");
/**
 * This is an integrated 32-bits AND Logic Components.The ALU will use this to caculate logic and
 * <br/>The inpinA and inpinB are both 32-bits
 * @category 32Logic
*/
class AND32 {
    /**
     * @param inputPin1 the initial value for inpinA.<br/>Note: only 32 binary encoding string, such as "00111100101011000011110010101100", can be accepted
     * @param inputPin2 the initial value for inpinB<br/>Note: only 32 binary encoding string, such as "00111100101011000011110010101100", can be accepted<br/>
     *
     * the constructor will then set the outpin according to bit-wise and operation of inpinA and inpinB.
     * This is done by call static method And32 {@link And32}
    */
    constructor(inSignalA, inSignalB) {
        this.inPin32A = inSignalA;
        this.inPin32B = inSignalB;
        let bitA = StringHandle_1.stringToIntArray(this.inPin32A);
        let bitB = StringHandle_1.stringToIntArray(this.inPin32B);
        this.outPin32 = StringHandle_1.intArrayToString(AND32.And32(bitA, bitB));
    }
    /**
     * this method will caculate the correct outcome of bitwise and operation of two inputs
     * @param BitsA Note that the type of this is array of number
     * @param BitsB Note that the type of this is array of number
     * @returns the return value of this method is also a array of number.<br/> The outcome of bit-wise and is stored in this array
    */
    static And32(BitsA, BitsB) {
        let outBits = [];
        let i = 0;
        BitsA.forEach((bit) => {
            outBits[i] = AND_1.AND.And(bit, BitsB[i]);
            ++i;
        });
        return outBits;
    }
}
exports.AND32 = AND32;
//# sourceMappingURL=AND32.js.map