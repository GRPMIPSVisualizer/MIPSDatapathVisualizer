import { bool2num, num2bool } from "../Library/BooleanHandler";
import { AND } from "../Logic/AND";
import { NOT } from "../Logic/NOT";
import { OR } from "../Logic/OR";
import { Signal } from "./Signal";
// import { Wirable } from "./Wirable";

/**
 * This class mimics an up-edge change Latch<br/>
 * Two Latches compose a DFlipFlop
 */
export class Latch {
    /**
     * the clock signal of this Latch
     */
    private clockSignal: Signal;
    /**
     * DSignal input pin of Latch
     */
    private DSiganl: Signal;
    /**
     * OutPinA of this Latch
     */
    private OutPinA: Signal;
    /**
     * OutPinB of this Latch
     */
    private OutPinB: Signal;

    /**
     * the constructor initializes all the fileds.
     */
    constructor() {
        // super();
        this.clockSignal = new Signal(false, this.Latch.bind(this));
        this.DSiganl = new Signal(false, this.Latch.bind(this));
        this.OutPinA = new Signal(false);
        this.OutPinB = new Signal(true);
    }

    /**
     * get the value of {@link OutPinA}
     * @returns the value of {@link OutPinA}
     */
    public getOutPinA():Signal{
        return this.OutPinA;
    }

    /**
     * get the value of {@link OutPinB}
     * @returns the value of {@link OutPinB} 
     */
    public getOutPinB():Signal{
        return this.OutPinB;
    }

    /**
     * get DSinal of the Latch
     * @returns the value of {@link DSiganl}
     */
    public getDSignal():Signal{
        return this.DSiganl;
    }

    /**
     * get the clock signal of this Latch
     * @returns the value of {@link clockSignal}
     */
    public getClockSignal():Signal{
        return this.clockSignal;
    }

    /**
     * changes the value of DSignal
     */
    public changeDSignal(): void {
        this.DSiganl.changeSiganl();
    }

    /**
     * change the value of clockSignal
     */
    public changeClockSignal(): void {
        this.clockSignal.changeSiganl();
    }
    /**
     * the logic of Latch<br/>
     * the {@link OutPinA} and {@link OutPinB} will be set according to {@link DSignal} and {@link clockSignal}
     */
    public Latch(): void {
        let pin1: number = AND.And(bool2num(this.clockSignal.getSignal()), NOT.Not(bool2num(this.DSiganl.getSignal())));
        let pin2: number = AND.And(bool2num(this.clockSignal.getSignal()), bool2num(this.DSiganl.getSignal()));
        let outA: boolean = this.OutPinA.getSignal() as boolean;
        let outB: boolean = this.OutPinB.getSignal() as boolean;
        this.OutPinA.setSignal(num2bool(NOT.Not(OR.Or(pin1, bool2num(outB)))));
        this.OutPinB.setSignal(num2bool(NOT.Not(OR.Or(pin2, bool2num(outA)))));
    }

}