"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Adder = void 0;
const AND_1 = require("../Logic/AND");
const XOR_1 = require("../Logic/XOR");
const OR_1 = require("../Logic/OR");
const Mux_1 = require("../Conponent/Mux");
const StringHandle_1 = require("../Library/StringHandle");
/**
 * Class Adder implements some basic the functionalities of a adder.<br/>
 * This component is used for PC and branch as well as ALU to get correct data
 */
class Adder {
    /**
     * The Constructor initialize {@link inPin32A} and {@link inPin32B}<br/>
     * The adder will then set the {@link outPin32} according to two inputs.
     * @param inSignalA a binary string that will assign to {@link inPin32A}
     * @param inSignalB a binary string that will assign to {@link inPin32A}
     */
    constructor(inSignalA, inSignalB) {
        this.inPin32A = inSignalA;
        this.inPin32B = inSignalB;
        let bitA = StringHandle_1.stringToIntArray(this.inPin32A);
        let bitB = StringHandle_1.stringToIntArray(this.inPin32B);
        this.outPin32 = StringHandle_1.intArrayToString(this.Adder32(bitA, bitB));
        this.carry = 0;
    }
    /**
     * A half adder will do add logic but only for 1-bit,and it does not take carry into consideration
     * @param inPin1 1-bit data
     * @param inPin2 1-bit data
     * @returns a array of number indicates carry and the result of sum
     */
    static halfAdder(inPin1, inPin2) {
        let carry = AND_1.AND.And(inPin1, inPin2);
        let sum = XOR_1.XOR.Xor(inPin1, inPin2);
        return [carry, sum];
    }
    /**
     * get {@link inPin32B}
     * @returns a binary string which {@link inPin32B} stores
     */
    getInpinB() {
        return this.inPin32B;
    }
    /**
     * A full adder will do add logic but only for 1-bit,and it takes carry into consideration.
     * @param inPin1 1-bit data
     * @param inPin2 1-bit data
     * @param carry carry
     * @returns a array of number indicates new carry and the result of sum
     */
    static fullAdder(inPin1, inPin2, carry) {
        let Pin0 = OR_1.OR.Or(inPin1, inPin2);
        let Pin1 = AND_1.AND.And(inPin1, inPin2);
        let Pin2 = XOR_1.XOR.Xor(inPin1, inPin2);
        let sum = XOR_1.XOR.Xor(Pin2, carry);
        let newCarry = Mux_1.Mux.Mux(Pin1, Pin0, carry);
        return [newCarry, sum];
    }
    /**
     * This method do 32-bits add logic by recurring call {@link halfAdder} and {@link fullAdder}
     * @param inSignalA the first input pin of an adder
     * @param inSignalB the second input pin of an adder
     * @returns the sum of two 32bits input, but in the form of number array
     */
    Adder32(inSignalA, inSignalB) {
        let outPin = new Array(32);
        let carry = 0;
        [carry, outPin[31]] = Adder.halfAdder(inSignalA[31], inSignalB[31]);
        for (let i = 1; i < inSignalA.length; ++i) {
            [carry, outPin[31 - i]] = Adder.fullAdder(inSignalA[31 - i], inSignalB[31 - i], carry);
            // console.log(carry,outPin[i]);
        }
        this.carry = carry;
        return outPin;
    }
    /**
     * assign new value to two inpin {@link inPin32A} and {@link inPin32B}<br/>
     * the {@link outPin32} will be set accordingly.
     * @param inSignalA a array of 32-bits that will be assigned to {@link inPin32A}
     * @param inSignalB a array of 32-bits that will be assigned to {@link inPin32B}
     */
    newInPin(inSignalA, inSignalB) {
        this.inPin32A = StringHandle_1.intArrayToString(inSignalA);
        this.inPin32B = StringHandle_1.intArrayToString(inSignalB);
        this.outPin32 = StringHandle_1.intArrayToString(this.Adder32(inSignalA, inSignalB));
    }
    /**
     * get i-th bit of {@link outPin32}
     * @param i index of bit
     * @returns the i-th bit of {@link outPin32}
     */
    getOutputAt(i) {
        return parseInt(this.outPin32.charAt(i));
    }
    /**
     * get {@link outPin32}
     * @returns the outPin32 will be return
     */
    getOutput() {
        return this.outPin32;
    }
    /**
     * get i-th bit of {@link inPin32A}
     * @param i index of bit
     * @returns the i-th bit of {@link inPin32A}
     */
    getInpinAAt(i) {
        return parseInt(this.inPin32A.charAt(i));
    }
    /**
     * get i-th bit of {@link inPin32B}
     * @param i index of bit
     * @returns the i-th bit of {@link inPin32B}
     */
    getInpinBAt(i) {
        return parseInt(this.inPin32B.charAt(i));
    }
}
exports.Adder = Adder;
//# sourceMappingURL=Adder.js.map