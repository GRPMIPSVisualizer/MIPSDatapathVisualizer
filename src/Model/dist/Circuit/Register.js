"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._32BitsRegister = void 0;
const BooleanHandler_1 = require("../Library/BooleanHandler");
const StringHandle_1 = require("../Library/StringHandle");
const DFlipFlop_1 = require("./DFlipFlop");
const Signal_1 = require("./Signal");
/**
 * This class is an abstract model of 32 bits register<br/>
 * The fileds of this class contain all the necessary data of a register<br/>
 * The methods of this class implement basic functionalities of a register
 */
class _32BitsRegister {
    /**
     * constructor initializes all DFFs
     */
    constructor() {
        /**
         * The 32bits output Pin of this register
         */
        this.outPin32 = "00000000000000000000000000000000";
        /**
         * The clock signal of this register
         */
        this.clockSignal = new Signal_1.Signal(false);
        this.DFFs = new Array();
        for (let i = 0; i < _32BitsRegister.bitsCount; ++i) {
            this.DFFs[i] = new DFlipFlop_1.DFlipFlop();
        }
    }
    /**
     * set the inPin32 of this register
     * @param newInPins the new binary string that will be assigned to this register.
     */
    setInpin32(newInPins) {
        this.inputDetect(newInPins);
        this.inPin32 = newInPins;
        this.setDSiganls();
        // this.setOutpin32();
    }
    /**
     * reset the inPin32 of this register
     */
    resetInput() {
        this.inPin32 = undefined;
        this.resetDSignals();
    }
    /**
     * reset the Dsignal of all DFFs
     */
    resetDSignals() {
        let bits = StringHandle_1.stringToIntArray(this.outPin32);
        this.DFFs.forEach(DFF => {
            DFF.setDSiganl(BooleanHandler_1.num2bool(bits.shift()));
        });
    }
    /**
     * change the value of clock signal
     */
    changeClockSignal() {
        this.clockSignal.changeSiganl();
        this.DFFs.forEach(DFF => {
            DFF.changeClockSiganl();
        });
        this.setOutpin32();
    }
    /**
     * set the value of this clock signal
     * @param signal the new value that will be assigned to clock signal of this register
     */
    setClockSignal(signal) {
        if (typeof signal == "number")
            signal = BooleanHandler_1.num2bool(signal);
        this.clockSignal.setSignal(signal);
        this.DFFs.forEach(DFF => {
            DFF.setClockSiganl(signal);
        });
        this.setOutpin32();
    }
    /**
     * detect the value of input
     * @param input the input string
     */
    inputDetect(input) {
        if (input.length != 32) {
            throw new Error("Invalid Input!");
        }
        let bits = StringHandle_1.stringToIntArray(input);
        bits.forEach(bit => {
            if (bit !== 0 && bit !== 1)
                throw new Error("Invalid data " + bit + "!");
        });
    }
    /**
     * set the DSignals of DFFs
     * @returns nothing
     */
    setDSiganls() {
        if (this.inPin32 == undefined)
            return;
        let bits = StringHandle_1.stringToIntArray(this.inPin32);
        this.DFFs.forEach(DFF => {
            DFF.setDSiganl(BooleanHandler_1.num2bool(bits.shift()));
        });
    }
    /**
     * set the value of {@link outPin32}
     */
    setOutpin32() {
        let OutPins = new Array();
        this.DFFs.forEach(flipflop => {
            OutPins.push(BooleanHandler_1.bool2num(flipflop.getOutPinA().getSignal()));
        });
        this.outPin32 = StringHandle_1.intArrayToString(OutPins);
    }
    /**
     * get inPin32
     * @returns the value of {@link inPin32}
     */
    getinPin32() {
        return this.inPin32;
    }
    /**
     * get the outPin32 of this register.
     * @returns the value of {@link outPin32}
     */
    getOutPin32() {
        return this.outPin32;
    }
    /**
     * get the clock signal of this register
     * @returns the clock signal of this register
     */
    getClockSignal() {
        return this.clockSignal;
    }
}
exports._32BitsRegister = _32BitsRegister;
/**
 * The number of bits in this register
 */
_32BitsRegister.bitsCount = 32;
//# sourceMappingURL=Register.js.map