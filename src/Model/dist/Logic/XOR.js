"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XOR = void 0;
const Logic_1 = __importDefault(require("./Logic"));
const NAND_1 = require("./NAND");
const OR_1 = require("./OR");
const AND_1 = require("./AND");
/**
 * This is the XOR logic. This components provide XOR function for the circuit components
 *
 * @category Logic
*/
class XOR extends Logic_1.default {
    /**
     * @param inputPin1 the initial value for inpin 1
     * @param inputPin2 the initial value for inpin 2<br/>
     *
     * the constructor will then set the outpin according to inpin 1 and inpin 2.
     * This is done by call static method Xor {@link Xor}
    */
    constructor(inputPin1, inputPin2) {
        super(inputPin1, inputPin2);
        this.outpin = XOR.Xor(this.pin1, this.pin2);
    }
    /**
     * the logic code that fulfill the function of xor
    */
    static Xor(inputPin1, inputPin2) {
        let nand = new NAND_1.NAND(inputPin1, inputPin2);
        let or = new OR_1.OR(inputPin1, inputPin2);
        return AND_1.AND.And(nand.outpin, or.outpin);
    }
}
exports.XOR = XOR;
//# sourceMappingURL=XOR.js.map