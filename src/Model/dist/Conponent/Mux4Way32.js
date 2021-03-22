"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mux4Way32 = void 0;
const Mux32_1 = require("./Mux32");
const StringHandle_1 = require("../Library/StringHandle");
/**
 * This is the 4-way 32bits Multiplexer in the cpu circuits<br/>
 * The class simulates how 32bits Multiplexer works and fulfills some basic function of it<br/>
 * Note this is a 4-way 32bits Mux
 */
class Mux4Way32 {
    /**
     * The constructor initializes all inpin32 and select and set the outPin32 accordingly<br/>
     * if set to 00, {@link outPin32} = {@link inPin32}[0]<br/>
     * if set to 01, {@link outPin32} = {@link inPin32}[1]<br/>
     * if set to 10, {@link outPin32} = {@link inPin32}[2]<br/>
     * if set to 11, {@link outPin32} = {@link inPin32}[3]
     * the {@link outPin32} is set by static method {@link Mux4Way32}
     * @param inSignal a array of four initial binary string for four inpin pins stored in {@link inPin32}
     * @param Select the initial encoding string of selector
     */
    constructor(inSignal, Select) {
        this.inPin32 = inSignal;
        this.sel = Select;
        let bits = [];
        let index = 0;
        this.inPin32.forEach(pin => {
            bits[index] = StringHandle_1.stringToIntArray(pin);
            ++index;
        });
        let selBit = StringHandle_1.stringToIntArray(this.sel);
        this.outPin32 = StringHandle_1.intArrayToString(Mux4Way32.Mux4Way32(bits, selBit));
    }
    /**
     * This method implements the 4way-mux32 by combine two 2way-mux32 and add a new selector to determine which 2way-mux32's output is set to output
     * @param inPin an array of arrays of integers that represents four 32bits binary data
     * @param Select2Way the 2 way selector
     * @returns an array of integers which indicates what the {@link outPin32} will be set.
     */
    static Mux4Way32(inPin, Select2Way) {
        let mux32A = new Mux32_1.Mux32(StringHandle_1.intArrayToString(inPin[0]), StringHandle_1.intArrayToString(inPin[1]), Select2Way[1]);
        let mux32B = new Mux32_1.Mux32(StringHandle_1.intArrayToString(inPin[2]), StringHandle_1.intArrayToString(inPin[3]), Select2Way[1]);
        return Mux32_1.Mux32.Mux32(StringHandle_1.stringToIntArray(mux32A.outPin32), StringHandle_1.stringToIntArray(mux32B.outPin32), Select2Way[0]);
    }
}
exports.Mux4Way32 = Mux4Way32;
//# sourceMappingURL=Mux4Way32.js.map