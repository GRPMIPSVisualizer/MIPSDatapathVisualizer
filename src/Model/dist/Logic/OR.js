"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OR = void 0;
const Logic_1 = __importDefault(require("./Logic"));
const NAND_1 = require("./NAND");
/**
 * This is the OR logic. This components provide or function for the circuit components
 *
 * @category Logic
*/
class OR extends Logic_1.default {
    /**
     * @param inputPin1 the initial value for inpin 1
     * @param inputPin2 the initial value for inpin 2<br/>
     *
     * the constructor will then set the outpin according to inpin 1 and inpin 2.
     * This is done by call static method Or {@link Or}
    */
    constructor(inputPin1, inputPin2) {
        super(inputPin1, inputPin2);
        this.outpin = OR.Or(this.pin1, this.pin2);
    }
    /**
     * the logic code that fulfill the function of or
    */
    static Or(inputPin1, inputPin2) {
        let nand1 = new NAND_1.NAND(inputPin1, inputPin1);
        let nand2 = new NAND_1.NAND(inputPin2, inputPin2);
        return NAND_1.NAND.Nand(nand1.outpin, nand2.outpin);
    }
}
exports.OR = OR;
//# sourceMappingURL=OR.js.map