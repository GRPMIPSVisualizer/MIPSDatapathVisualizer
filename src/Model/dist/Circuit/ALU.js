"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALU = void 0;
const Adder_1 = require("./Adder");
const AND32_1 = require("../Logic/AND32");
const OR32_1 = require("../Logic/OR32");
const StringHandle_1 = require("../Library/StringHandle");
const NOT32_1 = require("../Logic/NOT32");
const Mux4Way32_1 = require("../Conponent/Mux4Way32");
const ExceptionReporter_1 = require("./ExceptionReporter");
const BItsGenerator_1 = require("../Library/BItsGenerator");
/**
 * Class ALU simulates some basic function of ALU. This is a core component for building a CPU.<br/>
 * 8 functions are fulfilled in this ALU:<br/>
 * or<br/>
 * and<br/>
 * add32<br/>
 * sub32<br/>
 * set on less than<br/>
 * nor<br/>
 * shiftLeftLogic<br/>
 * shiftRightLogic
 */
class ALU {
    /**
     * The Constructor initializes {@link inPin32A} and {@link inPin32B} and {@link controlBits}
     * @param inPinA the binary string that will assigned to {@link inPin32A}
     * @param inPinB the binary string that will assigned to {@link inPin32B}
     * @param control the 4-bits string that will assigned to {@link controlBits}
     */
    constructor(inPinA, inPinB, control) {
        /**
         * As the name indicates, this is 32bits outPin of the ALU
         */
        this.outPin32 = "";
        /**
         * This field records the shamt bits of a machine code
         */
        this.shamt = BItsGenerator_1.init_bits(5);
        /**
         * This is a boolean value that indicates whether the instruction is bne
         */
        this.bne = false;
        /**
         * This is a boolean value which indicates whether the overflow should be reported.
         */
        this.reportOverflow = false;
        this.inPin32A = inPinA;
        this.inPin32B = inPinB;
        this.controlBits = control;
        this.isUnsign = false;
        this.isOverflow = false;
        this.isZero = false;
        this.Adder32 = new Adder_1.Adder(inPinA, inPinB);
        this.outPin32 = StringHandle_1.decToUnsignedBin32(0);
    }
    /**
     * get {@link outPin32}
     * @returns binary string that stored in outPin32
     */
    getOutPin32() {
        return this.outPin32;
    }
    /**
     * this method is the most critical method in this class.<br/>
     * It simulates the workflow of ALU and set {@link outPin32} and other boolean variables according to inputs<br/>
     * @returns nothing
     */
    ALU() {
        if (this.controlBits == "1111" || this.controlBits == "1110" || this.controlBits == "1101") {
            let right = (this.controlBits[3] == '0') ? false : true;
            let shiftIndex = StringHandle_1.bin2dec(BItsGenerator_1.init_bits(27) + this.shamt, true);
            let newStr = "";
            if (right) {
                if (this.controlBits[2] == '0' && this.inPin32B[0] == '1') {
                    for (let i = 0; i < shiftIndex; ++i) {
                        newStr = newStr + "1";
                    }
                }
                else {
                    for (let i = 0; i < shiftIndex; ++i) {
                        newStr = newStr + "0";
                    }
                }
                newStr = newStr + this.inPin32B.slice(0, 32 - shiftIndex);
            }
            else {
                newStr = newStr + this.inPin32B.slice(shiftIndex, 32);
                for (let i = 0; i < shiftIndex; ++i) {
                    newStr = newStr + "0";
                }
            }
            this.setOutPin(newStr);
            return;
        }
        let control = StringHandle_1.stringToIntArray(this.controlBits);
        let pinA = StringHandle_1.stringToIntArray(this.inPin32A);
        let pinB = StringHandle_1.stringToIntArray(this.inPin32B);
        if (control[0])
            pinA = NOT32_1.NOT32.Not32(pinA);
        if (control[1])
            pinB = NOT32_1.NOT32.Not32(pinB);
        if (StringHandle_1.intArrayToString(control).slice(0, 3) == "011") {
            if (!this.isUnsign) {
                pinB = StringHandle_1.stringToIntArray(StringHandle_1.decToSignedBin32(StringHandle_1.bin2dec(StringHandle_1.intArrayToString(pinB), this.isUnsign) + 1));
            }
            else {
                pinB = StringHandle_1.stringToIntArray(StringHandle_1.decToUnsignedBin32(StringHandle_1.bin2dec(StringHandle_1.intArrayToString(pinB), this.isUnsign) + 1));
            }
        }
        let or32 = OR32_1.OR32.Or32(pinA, pinB);
        let and32 = AND32_1.AND32.And32(pinA, pinB);
        this.Adder32.newInPin(pinA, pinB);
        this.overflowDetect(this.Adder32.getInpinAAt(0), this.Adder32.getInpinBAt(0), this.Adder32.getOutputAt(0), this.Adder32.carry);
        let slt = [];
        if (this.isUnsign) {
            let numA = StringHandle_1.bin2dec(this.inPin32A, this.isUnsign);
            let numB = StringHandle_1.bin2dec(this.inPin32B, this.isUnsign);
            if (numA < numB) {
                slt = StringHandle_1.stringToIntArray(StringHandle_1.decToSignedBin32(1));
            }
            else {
                slt = StringHandle_1.stringToIntArray(StringHandle_1.decToSignedBin32(0));
            }
        }
        else {
            if (this.inPin32A[0] == '0' && this.inPin32B[0] == '1') {
                slt = StringHandle_1.stringToIntArray(StringHandle_1.decToSignedBin32(0));
            }
            if (this.inPin32A[0] == '1' && this.inPin32B[0] == '0') {
                slt = StringHandle_1.stringToIntArray(StringHandle_1.decToSignedBin32(1));
            }
            if (this.inPin32A[0] == '1' && this.inPin32B[0] == '1') {
                slt = StringHandle_1.stringToIntArray(StringHandle_1.decToSignedBin32(this.Adder32.getOutputAt(0)));
            }
            if (this.inPin32A[0] == '0' && this.inPin32B[0] == '0') {
                slt = StringHandle_1.stringToIntArray(StringHandle_1.decToSignedBin32(this.Adder32.getOutputAt(0)));
            }
        }
        let inpin = [and32, or32, StringHandle_1.stringToIntArray(this.Adder32.getOutput()), slt];
        // console.log(inpin[0],and32);
        if (this.getReportOverflow()) {
            this.reportOverflowException();
        }
        this.setOutPin(StringHandle_1.intArrayToString(Mux4Way32_1.Mux4Way32.Mux4Way32(inpin, [control[2], control[3]])));
        this.detectZero();
    }
    /**
     * This method add an error message to {@link ExceptionReporter} if {@link isOverflow} is true<br/>
     * @returns nothing
     */
    reportOverflowException() {
        if (!this.isOverflow)
            return;
        let exceptionReporter = ExceptionReporter_1.ExceptionReporter.getReporter();
        exceptionReporter.addException("ALU Overflow Exception!");
    }
    /**
     * This method detect overflow and set {@link isOverflow} according to last bit of {@link inPin32A} and {@link inPin32B} as well as the output of {@link Adder32}
     * @param lastPinA last bit of {@link inPin32A}
     * @param lastPinB last bit of {@link inPin32B}
     * @param lastOut last bit of output of {@link Adder32}
     * @param carry carry?
     */
    overflowDetect(lastPinA, lastPinB, lastOut, carry) {
        // console.log(lastPinA,lastPinB,!lastOut);
        if (this.isUnsign) {
            if (carry) {
                this.isOverflow = true;
            }
            else {
                this.isOverflow = false;
            }
        }
        else {
            if ((lastPinA && lastPinB && !lastOut) || (!lastPinA && !lastPinB && lastOut)) {
                this.isOverflow = true;
            }
            else {
                this.isOverflow = false;
            }
        }
    }
    /**
     * detect whether the {@link outPin32} is zero
     * if it is zero, set {@link isZero} to true
     * @returns nothing
     */
    detectZero() {
        for (let i = 0; i < this.outPin32.length; ++i) {
            if (parseInt(this.outPin32.charAt(i)) != 0) {
                this.isZero = false;
                return;
            }
        }
        this.isZero = true;
    }
    /**
     * reset both {@link inPin32A} and {@link inPin32B} and {@link controlBits}
     * @param inPinA new binary string that will assigned to {@link inPin32A}
     * @param inPinB new binary string that will assigned to {@link inPin32B}
     * @param controlBits new 4-bits control string that will assigned to {@link controlBits}
     */
    newSignal(inPinA, inPinB, controlBits) {
        this.inPin32A = inPinA;
        this.inPin32B = inPinB;
        this.controlBits = controlBits;
        this.ALU();
    }
    /**
     * assign a new 4-bits control string to {@link controlBits}
     * @param conBits
     */
    setControlBits(conBits) {
        this.controlBits = conBits;
        this.ALU();
    }
    /**
     * assign a new 32-bits binary value to {@link inPin32A}
     * @param inPin
     */
    setInpinA(inPin) {
        this.inPin32A = inPin;
        this.ALU();
    }
    /**
     * the ALU Mux32 component will watch the change of its outPin32 and will set {@link inPin32B} accordingly.
     * @param MUX the ALU Mux32 component
     */
    setMuxInpinB(MUX) {
        this.inPin32B = MUX.outPin32;
        this.ALU();
    }
    /**
     * assign a new value to {@link outPin32}
     * @param outPin
     */
    setOutPin(outPin) {
        this.outPin32 = outPin;
    }
    /**
     * This method sets {@link reportOverflow}
     * @param b the boolean number that will be assigned to {@link reportOverflow}
     */
    setReportOverflow(b) {
        this.reportOverflow = b;
    }
    /**
     * This method return a boolean indicates whether overflow should be reported
     * @returns a boolean indicates whether overflow should be reported
     */
    getReportOverflow() {
        return this.reportOverflow;
    }
}
exports.ALU = ALU;
//# sourceMappingURL=ALU.js.map