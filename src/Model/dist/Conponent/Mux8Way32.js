"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mux8Way32 = void 0;
const Mux4Way32_1 = require("./Mux4Way32");
const Mux32_1 = require("./Mux32");
const StringHandle_1 = require("../Library/StringHandle");
/**
 * This is the 8-way 32bits Multiplexer in the cpu circuits<br/>
 * The class simulates how 32bits Multiplexer works and fulfills some basic function of it<br/>
 * Note this is a 8-way 32bits Mux
 */
class Mux8Way32 {
    /**
     * The constructor initializes all inpin32 and select and set the outPin32 accordingly<br/>
     * if set to 000, {@link outPin32} = {@link inPin32}[0]<br/>
     * if set to 001, {@link outPin32} = {@link inPin32}[1]<br/>
     * if set to 010, {@link outPin32} = {@link inPin32}[2]<br/>
     * if set to 011, {@link outPin32} = {@link inPin32}[3]<br/>
     * if set to 100, {@link outPin32} = {@link inPin32}[4]<br/>
     * if set to 101, {@link outPin32} = {@link inPin32}[5]<br/>
     * if set to 110, {@link outPin32} = {@link inPin32}[6]<br/>
     * if set to 111, {@link outPin32} = {@link inPin32}[7]<br/>
     * the {@link outPin32} is set by static method {@link Mux8Way32}
     * @param inSignal a array of eight initial binary string for four inpin pins stored in {@link inPin32}
     * @param Select the initial encoding string of selector
     */
    constructor(inSignal, Select) {
        this.inPin32 = inSignal;
        this.sel = Select;
        this.outPin32 = StringHandle_1.intArrayToString(Mux8Way32.Mux8Way32(this.inPin32, this.sel));
    }
    /**
     * This method implements the 8way-mux32 by combine two 4way-mux32 and add a new selector to determine which 4way-mux32's output is set to output
     * @param inPin an array of arrays of integers that represents eight 32bits binary data
     * @param Select2Way the 3 way selector
     * @returns an array of integers which indicates what the {@link outPin32} will be set.
     */
    static Mux8Way32(inPin, Select2Way) {
        let mux4Way32A = new Mux4Way32_1.Mux4Way32(inPin.slice(0, 4), Select2Way.slice(1, 3));
        let mux4Way32B = new Mux4Way32_1.Mux4Way32(inPin.slice(4, 8), Select2Way.slice(1, 3));
        // console.log(mux4Way32A);
        // console.log(mux4Way32B);
        return Mux32_1.Mux32.Mux32(StringHandle_1.stringToIntArray(mux4Way32A.outPin32), StringHandle_1.stringToIntArray(mux4Way32B.outPin32), parseInt(Select2Way.charAt(0)));
    }
}
exports.Mux8Way32 = Mux8Way32;
//# sourceMappingURL=Mux8Way32.js.map