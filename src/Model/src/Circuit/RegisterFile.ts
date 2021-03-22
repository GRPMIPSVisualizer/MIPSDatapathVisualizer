import { DMux4Way } from "../Conponent/DMux4Way";
import { DMux8Way } from "../Conponent/DMux8Way";
import { Mux32 } from "../Conponent/Mux32";
import { Mux4Way32 } from "../Conponent/Mux4Way32";
import { Mux8Way32 } from "../Conponent/Mux8Way32";
import { init_bits } from "../Library/BItsGenerator";
import { bool2num, num2bool } from "../Library/BooleanHandler";
import { bin2dec, binaryDetect, bitsMapping, decToUnsignedBin32, intArrayToString, stringToIntArray } from "../Library/StringHandle";
import { Memory } from "./Memory";
import { _32BitsRegister } from "./Register";
import { Signal, signalType } from "./Signal";
import { Wired } from "./Wired";
/**
 * A register File is an array of 32 registers<br/>
 * This class is the abstract model of a real register file
 */
export class RegisterFile extends Wired{
    /**
     * the readNumber and writeNumber bitWidth
     */
    private static bitWidth = 5;
    /**
     * the number of register that will be read in outDataA in the form of 5bit binary string
     */
    private readNumberA:string;
    /**
     * the number of register that will be read in outDataA in the form of 5bit binary string
     */
    private readNumberB:string;
    /**
     * the number of register that will be write in the form of 5bit binary string
     */
    private writeNumber:string;
    /**
     * the data that will be writtem into designated register.
     */
    private writeData:string;
    /**
     * the write enable signal
     */
    private writeEnable:Signal;
    /**
     * clock signal of all registers
     */
    private clockSignal:Signal;
    /**
     * the data being read at this outPin
     */
    private outDataA:string = "";
    /**
     * the data being read at this outPin
     */
    private outDataB:string = "";
    /**
     * The write mux decides which bits to read in.
     */
    private WriteMux:Mux32;
    /**
     * An array of 32 registers. The data is stored here
     */
    private registers:_32BitsRegister[] = new Array<_32BitsRegister>();
    /**
     * initialize all fields of this class
     */
    constructor(){
        super();
        this.readNumberA = init_bits(RegisterFile.bitWidth);
        this.readNumberB = init_bits(RegisterFile.bitWidth);
        this.writeNumber = init_bits(RegisterFile.bitWidth);
        this.writeData = init_bits(Math.pow(2,RegisterFile.bitWidth));
        this.clockSignal = new Signal(false);
        this.writeEnable = new Signal(false);
        this.WriteMux = new Mux32(init_bits(32),init_bits(32),0);
        for(let i:number=0;i<Math.pow(2,RegisterFile.bitWidth);++i){
            this.registers[i] = new _32BitsRegister();
            // this.addWire(this.clockSignal,this.registers[i].getClockSignal());
        }

        this.registers[29].setInpin32(decToUnsignedBin32(2147479548));
        this.registers[29].changeClockSignal();
        this.registers[29].changeClockSignal();

        this.registers[28].setInpin32(decToUnsignedBin32(268468224));
        this.registers[28].changeClockSignal();
        this.registers[28].changeClockSignal();
    


        let data:string[] = new Array<string>();
        this.registers.forEach(register => {
            data.push(register.getOutPin32());
        });
        this.outDataA = this.Mux32Way32(this.readNumberA,data);
        this.outDataB = this.Mux32Way32(this.readNumberB,data);
    }

    /**
     * Store data at the register indicates by index.<br/>
     * @param index the index of register that will store new data
     * @param datum the datum being stored
     */
    public storeADataAt(index:number,datum:string):void{
        this.registers[index].setInpin32(datum);
        this.registers[index].changeClockSignal();
        this.registers[index].changeClockSignal();
    }

    /**
     * get the outPinA
     * @returns the value of outPinA
     */
    public getOutDataA():string{
        return this.outDataA;
    }

    /**
     * get the outPinB
     * @returns the value of outPinB
     */
    public getOutDataB():string{
        return this.outDataB;
    }
    /**
     * set write enable signal
     * @param siganl the new signal
     */
    public setWriteEnable(siganl:signalType):void{
        this.writeEnable.setSignal(siganl);
        this.registerWrite();
    }

    /**
     * set data being written into register
     * @param data the data that will be stored in the register
     */
    public setWriteData(data:string):void{
        this.writeData = data;
        this.registerWrite();
    }

    /**
     * set register destination signal
     * @param signal the new signal
     */
    public setRegDes(signal:boolean){
        this.WriteMux.setSel(bool2num(signal));
        this.writeNumber = this.WriteMux.outPin32.slice(27,32);
    }

    /**
     * change the value of clock signal
     */
    public changeClockSignal():void{
        this.clockSignal.changeSiganl();
        this.registers.forEach(register=>{
            register.changeClockSignal();
        });
    }
    /**
     * set the value of clock signal
     * @param signal the new signal that will be assigned to clock signal
     */
    public setClockSignal(signal:signalType):void{
        this.clockSignal.setSignal(signal);
        this.registers.forEach(register=>{
            register.setClockSignal(signal);
        });
    }

    /**
     * memory set the read number A and B's value
     * @param InsMem the Memory component that will change the value of read number
     */
    public setInstructionCode(InsMem:Memory):void{
        let InsCode:string = InsMem.getTextOutpin();
        if (InsCode.length != 32)
            throw Error("The length of Instruction code is not 32");
        binaryDetect(InsCode);
        this.readNumberA = bitsMapping(InsCode,21,26);
        this.readNumberB = bitsMapping(InsCode,16,21);
        this.setWriteNumber(bitsMapping(InsCode,16,21),bitsMapping(InsCode,11,16));
        this.registerRead();
    }

    /**
     * set two write index of mux
     * @param InpinA the first inpin 
     * @param InpinB the second inpin
     */
    private setWriteNumber(InpinA:string,InpinB:string):void{
        this.WriteMux.setInpin32A("000000000000000000000000000"+InpinA);
        this.WriteMux.setInpin32B("000000000000000000000000000"+InpinB);
        this.writeNumber = this.WriteMux.outPin32.slice(27,32);
    }

    
    /**
     * the logic of register read
     */
    protected registerRead():void{
        let data:string[] = new Array<string>();
        this.registers.forEach(register => {
            data.push(register.getOutPin32());
        });
        this.outDataA = this.Mux32Way32(this.readNumberA,data);
        this.outDataB = this.Mux32Way32(this.readNumberB,data);
    }

    /**
     * the logic of register write
     * @returns nothing
     */
    private registerWrite():void{
        this.registers.forEach(register=>{
            register.resetInput();
        });
        // let clockSignals:number[] = this.DMux32Way(this.writeNumber,this.writeEnable);
        // this.registers.forEach(register=>{
        //     register.setClockSignal(num2bool(clockSignals.shift() as number));
        // });
        if (!this.writeEnable.getSignal())
            return;
        let index:number = bin2dec("000000000000000000000000000"+this.writeNumber,true);
        this.registers[index].setInpin32(this.writeData);
    }

    /**
     * mux32way32
     * @param index the 5-bits selector 
     * @param data the 32 input data of mux32way32
     * @returns 
     */
    private Mux32Way32(index:string,data:string[]):string{
        let Muxes:number[][] = new Array<number[]>();
        Muxes.push(Mux8Way32.Mux8Way32(data.slice(0,8),index.slice(2,5)));
        Muxes.push(Mux8Way32.Mux8Way32(data.slice(8,16),index.slice(2,5)));
        Muxes.push(Mux8Way32.Mux8Way32(data.slice(16,24),index.slice(2,5)));
        Muxes.push(Mux8Way32.Mux8Way32(data.slice(24,32),index.slice(2,5)));
        
        return intArrayToString(Mux4Way32.Mux4Way32(Muxes,stringToIntArray(index.slice(0,2))));

    }

    private DMux32Way(index:string,signal:Signal):number[]{
        let clockSignal = signal.getSignal();
        let innerOut:number[] = DMux4Way.DMux4Way(bool2num(clockSignal),stringToIntArray(index.slice(0,2)));
        let out32:number[] = new Array<number>();
        for(let i:number=0;i<4;++i){
            out32.concat(DMux8Way.DMux8Way(innerOut[i],stringToIntArray(index.slice(2,5))));
        }
        return out32;
    }

    /**
     * get all the registers
     * @returns all registers
     */
    public getRegisters():_32BitsRegister[]{
        return this.registers;
    }

    /**
     * get the write number
     * @returns a binary string represents write number
     */
    public getWriteNumber():string{
        return this.writeNumber;
    }
    
}