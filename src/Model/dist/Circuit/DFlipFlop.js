"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DFlipFlop = void 0;
const BooleanHandler_1 = require("../Library/BooleanHandler");
const NOT_1 = require("../Logic/NOT");
const Latch_1 = require("./Latch");
const Wired_1 = require("./Wired");
/**
 * Class DFlipFlop is an abstract model of real DFlipFlap
 * This is a down-edge trigger DFlipFlop,which means the data in D signal will only stored into this DFlipFlop when clock signal is changed from high to low<br/>
 * DFlipFlop is the basic unit of 32bits register.<br/>
 * 1 DFlipFlop can store 1 bit data
 */
class DFlipFlop extends Wired_1.Wired {
    /**
     * The constructor initializes all fields
     */
    constructor() {
        super();
        this.LatchA = new Latch_1.Latch();
        this.LatchB = new Latch_1.Latch();
        this.clockSigal = this.LatchA.getClockSignal();
        this.DSiganl = this.LatchA.getDSignal();
        this.OutPinA = this.LatchB.getOutPinA();
        this.OutPinB = this.LatchB.getOutPinB();
        this.addWire(this.LatchA.getOutPinA(), this.LatchB.getDSignal());
        this.addWire(this.clockSigal, this.LatchB.getClockSignal(), (signal) => {
            return BooleanHandler_1.num2bool(NOT_1.NOT.Not(BooleanHandler_1.bool2num(signal)));
        });
        // debug
        // this.DSiganl.name = "A-DSignal";
        // this.clockSigal.name = "A-clockSignal";
        // this.LatchA.getOutPinA().name = "A-outASignal";
        // this.LatchB.getClockSignal().name = "B-clockSignal";
        // this.LatchB.getDSignal().name = "B-DSignal";
    }
    /**
     * change the Dsignal of this FlipFlop
     */
    changeDSiganl() {
        this.DSiganl.changeSiganl();
        this.clockSigalKeep();
    }
    /**
     * set the DSignal
     * @param signal the signal that will assigned to DSignal
     */
    setDSiganl(signal) {
        this.DSiganl.setSignal(signal);
        this.clockSigalKeep();
    }
    /**
     * set the clock signal
     * @param signal the signal that will assigned to clock signal
     */
    setClockSiganl(signal) {
        this.clockSigal.setSignal(signal);
        this.clockSigalKeep();
    }
    /**
     * change the value of clock signal
     */
    changeClockSiganl() {
        this.clockSigal.changeSiganl();
        this.clockSigalKeep();
    }
    /**
     * get the value of DSignal
     * @returns the value of DSignal
     */
    getDSignal() {
        return this.DSiganl;
    }
    /**
     * keep the orignal clock signal and call corresponding reactive function
     */
    clockSigalKeep() {
        this.clockSigal.SignalKeep();
    }
    /**
     * get the outPinA of this DFlipFlop
     * @returns the value of outPinA of this DFlipFlop
     */
    getOutPinA() {
        return this.OutPinA;
    }
    /**
     * get the outPinB of this DFlipFlop
     * @returns the value of outPinB of this DFlipFlop
     */
    getOutPinB() {
        return this.OutPinB;
    }
}
exports.DFlipFlop = DFlipFlop;
//# sourceMappingURL=DFlipFlop.js.map