"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mux = void 0;
const AND_1 = require("../Logic/AND");
const NOT_1 = require("../Logic/NOT");
const OR_1 = require("../Logic/OR");
/**
 * This is the Multiplexer in the cpu circuits<br/>
 * The class simulates how Multiplexer works and fulfills some basic function of it<br/>
 * Note this is a 2-way Mux
 */
class Mux {
    /**
    * The constructor initializes inpin1,inpin2 and select and set the outPin accordingly<br/>
    * if set to 0, outpin = inpin1<br/>
    * if set to 1, outpin = inpin2
    * @param inPin1 the initial value of inpin1
    * @param inPin2 the initial value of inpin2
    * @param Select the initial value of selector
    */
    constructor(inPin1, inPin2, Select) {
        this.inPin1 = inPin1;
        this.inPin2 = inPin2;
        this.sel = Select;
        this.outPin = Mux.Mux(this.inPin1, this.inPin2, this.sel);
    }
    /**
     * This is a static function that imitate how mux works and thus can give correct output according to its input
     * @param inPin1 the inpin1
     * @param inPin1 the inpin2
     * @param Select the selector
     * @returns a number which indicates what the outpin will be set according to the inputs
     */
    static Mux(inPin1, inPin2, Select) {
        let nots = new NOT_1.NOT(Select);
        let and1 = new AND_1.AND(inPin2, Select);
        let and2 = new AND_1.AND(inPin1, nots.outpin);
        return OR_1.OR.Or(and1.outpin, and2.outpin);
    }
}
exports.Mux = Mux;
//# sourceMappingURL=Mux.js.map