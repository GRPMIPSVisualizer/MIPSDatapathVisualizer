"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DMux = void 0;
const AND_1 = require("../Logic/AND");
const NOT_1 = require("../Logic/NOT");
/**
 * This is the Demultiplexer in the cpu circuits<br/>
 * The class simulates how Demultiplexer works and fulfills some basic function of it<br/>
 * Note this is a 2-way Dmux
 */
class DMux {
    /**
     * The constructor initializes inpin and select and set two outPin accordingly<br/>
     * if set to 0, outpin1 = inpin,outpin2 = 0<br/>
     * if set to 1, outpin1 = 0,outpin2 = inpin
     * @param inPin the initial value of inpin
     * @param Select the initial value of selector
     */
    constructor(inPin, Select) {
        this.inPin = inPin;
        this.sel = Select;
        let temp = [];
        temp = DMux.DMux(this.inPin, this.sel);
        this.outPin1 = temp[0];
        this.outPin2 = temp[1];
    }
    /**
     * This is a static function that imitate how dmux works and thus can give correct output according to its input
     * @param inPin the inpin
     * @param Select the selector
     * @returns a array of integer. the first entry in this array is the outcome of outpin1 and the second is that of outpin2.
     */
    static DMux(inPin, Select) {
        let temp = [];
        let nots = new NOT_1.NOT(Select);
        temp.push(AND_1.AND.And(nots.outpin, inPin));
        temp.push(AND_1.AND.And(Select, inPin));
        return temp;
    }
}
exports.DMux = DMux;
//# sourceMappingURL=DMux.js.map