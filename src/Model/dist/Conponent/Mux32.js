"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mux32 = void 0;
const StringHandle_1 = require("../Library/StringHandle");
const Mux_1 = require("./Mux");
/**
 * This is the 32bits Multiplexer in the cpu circuits<br/>
 * The class simulates how 32bits Multiplexer works and fulfills some basic function of it<br/>
 * Note this is a 2-way 32bits Mux
 */
class Mux32 {
    /**
    * The constructor initializes inpin32A,inpin32B and select and set the outPin32 accordingly<br/>
    * if set to 0, {@link outPin32} = {@link inPin32A}<br/>
    * if set to 1, {@link outPin32} = {@link inPin32B}<br/>
    * the {@link outPin32} is set by static method {@link Mux32}
    * @param inSignalA the initial binary string of inpin32A
    * @param inSignalB the initial binary string of inpin32B
    * @param Select the initial value of selector
    */
    constructor(inSignalA, inSignalB, Select) {
        /**
         * a notify function is the function should be called when the value of outpin32 changed<br/>
         * This implements a observer design pattern
         */
        this.notifyFunc = new Array();
        this.inPin32A = inSignalA;
        this.inPin32B = inSignalB;
        this.sel = Select;
        let bitA = StringHandle_1.stringToIntArray(this.inPin32A);
        let bitB = StringHandle_1.stringToIntArray(this.inPin32B);
        this.outPin32 = StringHandle_1.intArrayToString(Mux32.Mux32(bitA, bitB, this.sel));
    }
    /**
     * This is a static method that imitate how mux32 works and thus can give correct output according to its input
     * @param inSignalA an array of integers that represents a 32bits binary data
     * @param inSignalB an array of integers that represents a 32bits binary data
     * @param Select the selector
     * @returns an array of integers which indicates what the outpin32 will be set according to two inputs
     */
    static Mux32(inSignalA, inSignalB, Select) {
        let i = 0;
        let outPin = [];
        inSignalA.forEach((bit) => {
            outPin.push(Mux_1.Mux.Mux(bit, inSignalB[i], Select));
            ++i;
        });
        return outPin;
    }
    /**
     * This method set the {@link inPin32A}.<br/>
     * Note that the output32 will be refreshed once the {@link inPin32A} being set.
     * @param newInPin the 32bits binary string that will be assigned to {@link inPin32A}
     */
    setInpin32A(newInPin) {
        this.inPin32A = newInPin;
        this.setOutPin();
    }
    /**
     * The Memory and PCAdder components assign combination of part of their outpin bits to {@link inpin32B}
     * @param _Memory the {@link Memory} components
     * @param _PCAdder the pc {@link Adder} components
     */
    memSetInpin32B(_Memory, _PCAdder) {
        let newInpin = StringHandle_1.bitsMapping(_PCAdder.getOutput(), 28, 32) + StringHandle_1.bitsMapping(StringHandle_1.shiftLeftBinary32Bits(_Memory.getTextOutpin()), 0, 28);
        this.setInpin32B(newInpin);
    }
    /**
     * The Memory components assigns part of its outpin bits to {@link inPin32B}
     * @param _Memory a {@link Memory} object that will set {@link inpin32B} of this {@link Mux32} component.
     * @returns void
     */
    dataMemSetInpin32B(_Memory) {
        if (_Memory.getOutPin32() == undefined)
            return;
        this.setInpin32B(_Memory.getOutPin32());
    }
    /**
     * This method set the {@link inpin32B}.<br/>
     * Note that the output32 will be refreshed once the {@link inpin32B} being set.
     * @param newInPin the 32bits binary string that will be assigned to {@link inpin32B}
     */
    setInpin32B(newInPin) {
        this.inPin32B = newInPin;
        this.setOutPin();
    }
    /**
     * The {@link inpin32A} is set by another {@link Mux32} component
     * @param MUX the {@link Mux32} component that will set this {@link Mux32}'s {@link inpin32A}
     */
    setMuxInpin32A(MUX) {
        this.setInpin32A(MUX.outPin32);
    }
    /**
     * This method set the selector of this Mux32 component.
     * @param newSel the new selector signal that will be assigned to this {@link Mux32}'s {@link sel}
     */
    setSel(newSel) {
        this.sel = newSel;
        this.setOutPin();
    }
    /**
     * This method set the {@link outPin32} of this {@link Mux32} component according to
     * {@link inPin32A} and {@link inPin32B} and {@link sel}
     */
    setOutPin() {
        this.outPin32 = StringHandle_1.intArrayToString(Mux32.Mux32(StringHandle_1.stringToIntArray(this.inPin32A), StringHandle_1.stringToIntArray(this.inPin32B), this.sel));
        this.notifychange();
    }
    /**
     * This method calls all the notifying functions stored in {@link notifyFunc}<br/>
     * Note that this is an obeserver design pattern
     */
    notifychange() {
        this.notifyFunc.forEach(Func => {
            Func();
        });
    }
    /**
     * This method adds a new notifying function to {@link notifyFunc}<br/>
     * When the {@link outPin32} changes, the functions stored in {@link notifyFunc} will be called.
     * @param newFunc a new notifying function
     */
    addNotifyFunc(newFunc) {
        this.notifyFunc.push(newFunc);
    }
}
exports.Mux32 = Mux32;
//# sourceMappingURL=Mux32.js.map