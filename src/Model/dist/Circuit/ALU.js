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
class ALU {
    constructor(inPinA, inPinB, control) {
        this.outPin32 = "";
        this.shamt = BItsGenerator_1.init_bits(5);
        this.bne = false;
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
    getOutPin32() {
        return this.outPin32;
    }
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
    reportOverflowException() {
        if (!this.isOverflow)
            return;
        let exceptionReporter = ExceptionReporter_1.ExceptionReporter.getReporter();
        exceptionReporter.addException("ALU Overflow Exception!");
    }
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
    detectZero() {
        for (let i = 0; i < this.outPin32.length; ++i) {
            if (parseInt(this.outPin32.charAt(i)) != 0) {
                this.isZero = false;
                return;
            }
        }
        this.isZero = true;
    }
    newSignal(inPinA, inPinB, controlBits) {
        this.inPin32A = inPinA;
        this.inPin32B = inPinB;
        this.controlBits = controlBits;
        this.ALU();
    }
    setControlBits(conBits) {
        this.controlBits = conBits;
        this.ALU();
    }
    setInpinA(inPin) {
        this.inPin32A = inPin;
        this.ALU();
    }
    setMuxInpinB(MUX) {
        this.inPin32B = MUX.outPin32;
        this.ALU();
    }
    setOutPin(outPin) {
        this.outPin32 = outPin;
    }
    setReportOverflow(b) {
        this.reportOverflow = b;
    }
    getReportOverflow() {
        return this.reportOverflow;
    }
}
exports.ALU = ALU;
//# sourceMappingURL=ALU.js.map