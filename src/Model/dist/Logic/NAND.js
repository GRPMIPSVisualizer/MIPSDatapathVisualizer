"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NAND = void 0;
const Logic_1 = __importDefault(require("./Logic"));
/**
 * This is the NAND logic. This components provide NAND function for the circuit components
 *
 * @category Logic
*/
class NAND extends Logic_1.default {
    /**
     * @param inputPin1 the initial value for inpin 1
     * @param inputPin2 the initial value for inpin 2<br/>
     *
     * the constructor will then set the outpin according to inpin 1 and inpin 2.
     * This is done by call static method Nand {@link Nand}
    */
    constructor(inputPin1, inputPin2) {
        super(inputPin1, inputPin2);
        this.outpin = NAND.Nand(this.pin1, this.pin2);
    }
    /**
     * the logic code that fulfill the function of nand
    */
    static Nand(inputPin1, inputPin2) {
        return Math.abs((inputPin1 & inputPin2) - 1);
    }
}
exports.NAND = NAND;
//# sourceMappingURL=NAND.js.map