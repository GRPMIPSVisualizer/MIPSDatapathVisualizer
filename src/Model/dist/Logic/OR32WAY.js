"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OR32WAY = void 0;
const OR_1 = require("./OR");
const StringHandle_1 = require("../Library/StringHandle");
/**
 * This is an integrated 32-bits OR32Way Logic Components.
 * <br/>The inpinA are 32-bits
 * <br/>Basically,this conponent will do or operation with each bits in inpinA, the outpin is a number setting accordly.
 * @category 32Logic
*/
class OR32WAY {
    /**
     * @param inSignalA the initial value for inpinA<br/>Note: only 32 binary encoding string, such as "00111100101011000011110010101100", can be accepted<br/>
     *
     * the constructor will then set the outpin according to bit-wise or operation of each bits in inpinA.
     * This is done by call static method Or32Way {@link Or32Way}
    */
    constructor(inSignalA) {
        this.inPin32 = inSignalA;
        let bitA = StringHandle_1.stringToIntArray(this.inPin32);
        this.outPin32 = OR32WAY.Or32Way(bitA);
    }
    /**
     * this method will caculate the correct outcome of bitwise or operation of inputA
     * @param BitsA Note that the type of this is array of number
     * @returns the return value of this method is also a array of number.<br/> The outcome of bit-wise or is stored in this array
    */
    static Or32Way(BitsA) {
        let outPin = 0;
        BitsA.forEach((bit) => {
            outPin = OR_1.OR.Or(outPin, bit);
        });
        return outPin;
    }
}
exports.OR32WAY = OR32WAY;
//# sourceMappingURL=OR32WAY.js.map