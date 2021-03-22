import { bool2num, num2bool } from "../Library/BooleanHandler";
import { NOT } from "../Logic/NOT";
import { Latch } from "./Latch";
import { Signal, signalType } from "./Signal";
import { Wire } from "./Wire";
import {Wired} from "./Wired"
/**
 * Class DFlipFlop is an abstract model of real DFlipFlap
 * This is a down-edge trigger DFlipFlop,which means the data in D signal will only stored into this DFlipFlop when clock signal is changed from high to low<br/>
 * DFlipFlop is the basic unit of 32bits register.<br/>
 * 1 DFlipFlop can store 1 bit data
 */
export class DFlipFlop extends Wired{
    /**
     * the signal of clock
     */
    private clockSigal:Signal;
    /**
     * the signal of D inpin
     */
    private DSiganl:Signal;
    /**
     * the signal of outPinA
     */
    private OutPinA:Signal;
    /**
     * the signal of outPinB
     */
    private OutPinB:Signal;
    /**
     * Latch A in this DFlipFlop
     */
    private LatchA:Latch;
    /**
     * Lacth B in this DFlipFlop
     */
    private LatchB:Latch;
    /**
     * The constructor initializes all fields
     */
    constructor(){
        super();
        this.LatchA = new Latch();
        this.LatchB = new Latch();
        this.clockSigal = this.LatchA.getClockSignal();
        this.DSiganl = this.LatchA.getDSignal();
        this.OutPinA = this.LatchB.getOutPinA();
        this.OutPinB = this.LatchB.getOutPinB();
        this.addWire(this.LatchA.getOutPinA(),this.LatchB.getDSignal());
        this.addWire(this.clockSigal,this.LatchB.getClockSignal(),(signal:signalType)=>{
            return num2bool(NOT.Not(bool2num(signal))); 
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
    public changeDSiganl():void{
        this.DSiganl.changeSiganl();
        this.clockSigalKeep();
    }

    /**
     * set the DSignal
     * @param signal the signal that will assigned to DSignal
     */
    public setDSiganl(signal:signalType):void{
        this.DSiganl.setSignal(signal);
        this.clockSigalKeep();
    }

    /**
     * set the clock signal
     * @param signal the signal that will assigned to clock signal
     */
    public setClockSiganl(signal:signalType):void{
        this.clockSigal.setSignal(signal);
        this.clockSigalKeep();
    }

    /**
     * change the value of clock signal
     */
    public changeClockSiganl():void{
        this.clockSigal.changeSiganl();
        this.clockSigalKeep();
    }

    /**
     * get the value of DSignal
     * @returns the value of DSignal
     */
    public getDSignal():Signal{
        return this.DSiganl;
    }

    /**
     * keep the orignal clock signal and call corresponding reactive function
     */
    public clockSigalKeep():void{
        this.clockSigal.SignalKeep();
    }

    /**
     * get the outPinA of this DFlipFlop 
     * @returns the value of outPinA of this DFlipFlop
     */
    public getOutPinA():Signal{
        return this.OutPinA;
    }

    /**
     * get the outPinB of this DFlipFlop
     * @returns the value of outPinB of this DFlipFlop
     */
    public getOutPinB():Signal{
        return this.OutPinB;
    }


}