"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DMux4Way = void 0;
const DMux_1 = require("./DMux");
const StringHandle_1 = require("../Library/StringHandle");
/**
 * This is the 4-way-Demultiplexer in the cpu circuits<br/>
 * The class simulates how Demultiplexer works and fulfills some basic function of it<br/>
 * Note this is a 4-way Dmux
 */
class DMux4Way {
    /**
     * The constructor initializes inpin and encoding elect and set encoding outPin accordingly<br/>
     * if set to 00, outpin1 = inpin,outpin2-4 = 0<br/>
     * if set to 01, outpin2 = inpin,outpin1,3,4 = 0<br/>
     * if set to 10, outpin3 = inpin,outpin1,2,4 = 0<br/>
     * if set to 11, outpin4 = inpin,outpin1-3 = 0
     * @param inPin the initial value of inpin
     * @param Select the initial encoding string of selector
     */
    constructor(inPin, Select) {
        this.inPin = inPin;
        this.sel = Select;
        this.outPin = StringHandle_1.intArrayToString(DMux4Way.DMux4Way(this.inPin, StringHandle_1.stringToIntArray(this.sel)));
    }
    /**
     * This method implements the 4way-dmux by combine two 2way dmux and add a new selector to determine which 2way-dmux's output is set to output
     * @param inPin the inpin number
     * @param Select the encoding selector
     * @returns a array of 4 number that indicates 4 outpin respectively
     */
    static DMux4Way(inPin, Select) {
        let temp = [];
        let dmux1 = new DMux_1.DMux(inPin, Select[0]);
        temp = DMux_1.DMux.DMux(dmux1.outPin1, Select[1]).concat(DMux_1.DMux.DMux(dmux1.outPin2, Select[1]));
        return temp;
    }
}
exports.DMux4Way = DMux4Way;
//# sourceMappingURL=DMux4Way.js.map