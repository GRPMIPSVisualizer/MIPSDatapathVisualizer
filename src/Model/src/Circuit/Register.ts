import { bool2num, num2bool } from "../Library/BooleanHandler";
import { intArrayToString, stringToIntArray } from "../Library/StringHandle";
import { DFlipFlop } from "./DFlipFlop";
import { Signal, signalType } from "./Signal";
/**
 * This class is an abstract model of 32 bits register<br/>
 * The fileds of this class contain all the necessary data of a register<br/>
 * The methods of this class implement basic functionalities of a register
 */
export class _32BitsRegister{
    /**
     * The number of bits in this register
     */
    private static bitsCount = 32;
    /**
     * the bits are stored in 32 DFFs.A DFF store one bit.
     */
    private DFFs:DFlipFlop[];
    /**
     * 32 bits input pin this register
     */
    private inPin32:string | undefined;

    /**
     * The 32bits output Pin of this register
     */
    private outPin32:string = "00000000000000000000000000000000";

    /**
     * The clock signal of this register
     */
    private clockSignal:Signal = new Signal(false);

    /**
     * constructor initializes all DFFs
     */
    constructor(){
        this.DFFs = new Array<DFlipFlop>();
        for (let i:number=0;i<_32BitsRegister.bitsCount;++i){
            this.DFFs[i] = new DFlipFlop();
        }
    }

    /**
     * set the inPin32 of this register
     * @param newInPins the new binary string that will be assigned to this register.
     */
    public setInpin32(newInPins:string):void{
        this.inputDetect(newInPins);
        this.inPin32 = newInPins;
        this.setDSiganls();
        // this.setOutpin32();
    }

    /**
     * reset the inPin32 of this register
     */
    public resetInput():void{
        this.inPin32 = undefined;
        this.resetDSignals();
    }

    /**
     * reset the Dsignal of all DFFs
     */
    private resetDSignals():void{
        let bits:number[] = stringToIntArray(this.outPin32);
        this.DFFs.forEach(DFF => {
            DFF.setDSiganl(num2bool(<number>bits.shift()));
        });
    }

    /**
     * change the value of clock signal
     */
    public changeClockSignal():void{
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
    public setClockSignal(signal:signalType):void{
        if (typeof signal == "number")
            signal = num2bool(signal);
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
    private inputDetect(input:string){
        if (input.length !=32){
            throw new Error("Invalid Input!");
        }
        let bits:number[]= stringToIntArray(input);
        bits.forEach(bit => {
            if (bit !== 0 && bit !== 1)
                throw new Error("Invalid data "+bit+"!");            
        });
    }

    /**
     * set the DSignals of DFFs
     * @returns nothing
     */
    private setDSiganls():void{
        if (this.inPin32 == undefined)
            return;

        let bits:number[] = stringToIntArray(this.inPin32);
        this.DFFs.forEach(DFF => {
            DFF.setDSiganl(num2bool(<number>bits.shift()));
        });
    }

    /**
     * set the value of {@link outPin32}
     */
    protected setOutpin32(){
        let OutPins:number[] = new Array<number>();
        this.DFFs.forEach(flipflop => {
            OutPins.push(bool2num(flipflop.getOutPinA().getSignal()));
        });
        this.outPin32 = intArrayToString(OutPins);
    }

    /**
     * get inPin32
     * @returns the value of {@link inPin32}
     */
    public getinPin32():string|undefined{
        return this.inPin32;
    }

    /**
     * get the outPin32 of this register.
     * @returns the value of {@link outPin32}
     */
    public getOutPin32():string{
        return this.outPin32;
    }
    /**
     * get the clock signal of this register
     * @returns the clock signal of this register
     */
    public getClockSignal():Signal{
        return this.clockSignal;
    }
    
}