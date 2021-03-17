import { Adder } from "../Circuit/Adder";
import { ALU } from "../Circuit/ALU";
import { ALUControl, ControlUnits } from "../Circuit/ControlUnits";
import { Memory } from "../Circuit/Memory";
import { _32BitsRegister } from "../Circuit/Register";
import { RegisterFile } from "../Circuit/RegisterFile";
import { SignExtend } from "../Circuit/Sign-extend";
import { Signal, signalType } from "../Circuit/Signal";
import { Wired } from "../Circuit/Wired";
import { Mux } from "../Conponent/Mux";
import { Mux32 } from "../Conponent/Mux32";
import { bool2num } from "../Library/BooleanHandler";
import { binaryDetect, decToUnsignedBin32, shiftLeftBinary32Bits, stringToIntArray,intArrayToString, bitsMapping, bin2dec, decToSignedBin32 } from "../Library/StringHandle";
import { AND } from "../Logic/AND";
import {Assembler} from "../Assembler/Assembler";
import {InstructionI} from "../Assembler/InstructionI";
import { init_bits } from "../Library/BItsGenerator";
import {ArrayList} from "../Assembler/ArrayList"
import { ExceptionReporter } from "../Circuit/ExceptionReporter";

class PC extends _32BitsRegister{
    private InstructionMem:Memory;
    private PCAdder:PCAdder;
    constructor(InsMem:Memory,PCAdder:PCAdder){
        super();
        this.InstructionMem = InsMem;
        this.setInpin32(InsMem.getTextAddress());
        this.PCAdder = PCAdder;
        this.oneClockCycle();
    }

    public oneClockCycle():void{
        if (this.getClockSignal().getSignal()){
            throw Error("One clock should start from false");
        }
        this.setClockSignal(true);
        this.setClockSignal(false);
    }

    public muxChange(MUX:Mux32):void{  
        this.setInpin32(MUX.outPin32);
    }

    protected setOutpin32():void{
        super.setOutpin32();
        this.InstructionMem.setTextAddress(this.getOutPin32());
        this.PCAdder.newInPin(stringToIntArray(this.getOutPin32()) ,stringToIntArray(decToUnsignedBin32(4)));
    }

}


class PCAdder extends Adder{
    private ALUAdder:ALUAdder;
    private MUX:Mux32;
    constructor(ALUAdder:ALUAdder,MUX:Mux32){
        super(decToUnsignedBin32(0),decToUnsignedBin32(4));
        this.ALUAdder = ALUAdder;
        this.MUX = MUX;
    }

    public connectConponents(ALUAdder:ALUAdder,Mux:Mux32){
        this.ALUAdder = ALUAdder;
        this.MUX = Mux;
    }

    public newInPin(inSignalA:number[],inSignalB:number[]):void{
        super.newInPin(inSignalA,inSignalB);
        this.ALUAdder.setInpinA(this.getOutput());
        this.MUX.setInpin32A(this.getOutput());
    }
}

// export class ConnectedMemory extends Memory{
//     private bindedControlUnit:ControlUnits;
//     private bindedRegisterFile:RegisterFile;
//     private bindedSignExtend:SignExtend;
//     constructor(bc:ControlUnits,br:RegisterFile,bs:SignExtend){
//         super();
//         this.bindedControlUnit = bc;
//         this.bindedRegisterFile = br;
//         this.bindedSignExtend = bs;
//     }



    
// }

class ALUAdder extends Adder{
    private MUX1:Mux32;
    
    constructor(inSignalA:string,inSignalB:string,MUX:Mux32){
        super(inSignalA,inSignalB);
        this.MUX1 = MUX;
    }

    private setOutpin32():void{
        this.outPin32 = intArrayToString(this.Adder32(stringToIntArray(this.inPin32A),stringToIntArray(this.inPin32B)));
        this.MUX1.setInpin32B(this.outPin32);
    }

    public setInpinA(binBits:string):void{
        if (binBits.length != 32)
            throw Error("The length of ALU Adder Input A is not 32");
        binaryDetect(binBits);
        this.inPin32A = binBits;
        this.setOutpin32();
    }

    public setInpinB(binBits:string):void{
        if (binBits.length != 32)
            throw Error("The length of ALU Adder Input B is not 32");
        binaryDetect(binBits);
        this.inPin32B = binBits;
        this.setOutpin32();
    }
}



class ConSignExtend extends SignExtend{
    private ALUResultAdder:ALUAdder;
    private ALUInpinBMux:Mux32;
    
    constructor(ALUResultAdder:ALUAdder,ALUMux:Mux32){
        super();
        this.ALUResultAdder = ALUResultAdder;
        this.ALUInpinBMux = ALUMux;
    }

    public setInPin16(inPin:string,ALUOp:boolean[]):void{
        super.setInPin16(inPin,ALUOp);
        let shiftedInput:string = shiftLeftBinary32Bits(this.getOutPin32());
        this.ALUResultAdder.setInpinB(shiftedInput);
        this.ALUInpinBMux.setInpin32B(this.getOutPin32());
    }

    public memSetInpin16(Mem:Memory,con:ConControlUnits):void{
        this.opCode = Mem.getTextOutpin().slice(0,6);
        this.setInPin16(bitsMapping(Mem.getTextOutpin(),0,16),con.getALUOp());
    }
}

class conALUControl extends ALUControl{
    public reportOverflow:boolean = false;
    constructor(ALU:ALU) {
        super(ALU);
    }

    public memSetIns(mem:Memory):void{
        this.setBne(this.bne);
        if (this.ALUOp0 && this.ALUOp1){
            return;
        }
        super.setIns(bitsMapping(mem.getTextOutpin(),0,6));
        this.changeOverflowReport();
        this.setALUReportOverflow();
        this.ALU.setControlBits(this.getOperationCode());
        this.reportOverflow = false;
        this.setALUReportOverflow();
        
    }

    public setALUOp(controlUnits:ControlUnits):void{
        super.setALUOp(controlUnits);
        this.ALU.setControlBits(this.getOperationCode());
    }

    private changeOverflowReport():void{
        let Inscode:string = this.getInsCodeStr();
        let InsIndex:number = bin2dec("00000000000000000000000000"+Inscode,true);
        if (!this.ALUOp1 || this.ALUOp0){
            return
        }

        if (InsIndex == 8 ||InsIndex == 32 || InsIndex == 34){
            this.reportOverflow = true;
        }else{
            this.reportOverflow = false;
        }

    }

    private setBne(ben:boolean):void{
        this.ALU.bne = ben;
    }

    private setALUReportOverflow():void{
        this.ALU.setReportOverflow(this.reportOverflow);
    }
}


class conRegisterFile extends RegisterFile{
    private ALU:conALU;
    private ALUInpinBMUX:Mux32;
    private DataMemory:Memory;
    constructor(ALU:conALU,aluInpinBMux:Mux32,dataMem:Memory){
        super();
        this.ALU = ALU;
        this.ALUInpinBMUX = aluInpinBMux;
        this.DataMemory = dataMem;
    }

    protected registerRead():void{
        super.registerRead();
        this.ALU.setInpinA(this.getOutDataA());
        this.ALUInpinBMUX.setInpin32A(this.getOutDataB());
        this.DataMemory.setInpin32(this.getOutDataB());
    }

    public setMuxWriteData(MemMux:Mux32):void{
        this.setWriteData(MemMux.outPin32);
    }
}

class ZeroAnd extends AND{
    private MuxA:Mux32;
    constructor(MuxA:Mux32){
        super(0,0);
        this.MuxA = MuxA;
    }

    public setInpinA(inpin:boolean):void{
        this.pin1 = bool2num(inpin);
        this.setOutpin();
    }

    public setInpinB(inpin:boolean):void{
        this.pin2 = bool2num(inpin);
        this.setOutpin();
    }

    private setOutpin():void{
        this.outpin = AND.And(this.pin1,this.pin2);
        this.MuxA.setSel(this.outpin);
    }
}

class conALU extends ALU{
    private dataMemory:Memory;
    private MemoryMux:Mux32;
    private zeroAnd:ZeroAnd;

    constructor(dataMem:Memory,MemMux:Mux32,zeroAnd:ZeroAnd){
        super(decToUnsignedBin32(0),decToUnsignedBin32(0),"0000");
        this.dataMemory = dataMem;
        this.MemoryMux = MemMux;
        this.zeroAnd = zeroAnd;
    }

    protected detectZero():void{
        super.detectZero();
        if (this.bne){
            this.isZero = !this.isZero;
        }
        this.zeroAnd.setInpinB(this.isZero);
    }

    protected setOutPin(outPin:string):void{
        super.setOutPin(outPin);
        this.dataMemory.setDataAddress(this.getOutPin32());
        this.MemoryMux.setInpin32A(this.getOutPin32());
    }

    protected ALU():void{
        this.shamt = this.dataMemory.getTextOutpin().slice(21,26);
        if (this.dataMemory.getTextOutpin().slice(0,6) == "001111"){
            this.inPin32A = init_bits(16) + this.inPin32A.slice(16,32);
        }
        if (this.dataMemory.getTextOutpin().slice(0,6) == "001011"){
            this.isUnsign = true;
        }else{
            if (this.dataMemory.getTextOutpin().slice(0,6) == "000000" && this.dataMemory.getTextOutpin().slice(26,32) == "101011"){
                this.isUnsign = true;
            }else{
                this.isUnsign = false;
            }
        }
        super.ALU();
    }
}

class ConControlUnits extends ControlUnits{
    private bindedRegFile:RegisterFile;
    private bindedALUControl:conALUControl;
    private MUXB:Mux32;
    private ALUMUX:Mux32;
    private MemMUX:Mux32;
    private zeroAnd:ZeroAnd;
    private dataMem:Memory;
    // private bi
    constructor(bindedRegFile:RegisterFile,conALUctl:conALUControl,muxb:Mux32,aluMux:Mux32,zeroAnd:ZeroAnd,MemMux:Mux32,dataMem:Memory) {
        super();
        this.bindedRegFile = bindedRegFile;
        this.bindedALUControl = conALUctl;
        this.MUXB = muxb;
        this.ALUMUX = aluMux;
        this.zeroAnd = zeroAnd;
        this.MemMUX = MemMux;
        this.dataMem = dataMem;
    }

    protected setOp(code:string):void{
        super.setOp(code);
        this.setOverflow(code);


        this.bindedRegFile.setWriteEnable(false);
        this.dataMem.setReadWriteEnable(false,false);


        this.bindedRegFile.setRegDes(this.RegDes);
        this.bindedALUControl.setALUOp(this);
        this.MUXB.setSel(bool2num(this.Jump));
        this.ALUMUX.setSel(bool2num(this.ALUSrc));
        this.zeroAnd.setInpinA(this.Branch);
        this.MemMUX.setSel(bool2num(this.MemtoReg));
        this.bindedRegFile.setWriteEnable(this.RegWrite);
        this.dataMem.setReadWriteEnable(this.MemRead,this.MemWrite);
    }

    private setOverflow(code:string):void{
        let decCode:number = bin2dec("00000000000000000000000000"+code,true);
        if (decCode == 0){
            return;
        }
        if (decCode == 4 || decCode == 5 || decCode == 8){
            this.bindedALUControl.reportOverflow = true;
        }else{
            this.bindedALUControl.reportOverflow = false;
        }
    }

}


export class singleCycleCpu{
    private MUXA:Mux32 = new Mux32(decToUnsignedBin32(0),decToUnsignedBin32(0),0);
    private MUXB:Mux32 = new Mux32(decToUnsignedBin32(0),decToUnsignedBin32(0),0);
    private ALUMUX:Mux32 = new Mux32(decToUnsignedBin32(0),decToUnsignedBin32(0),0);
    private MemMUX:Mux32  = new Mux32(decToUnsignedBin32(0),decToUnsignedBin32(0),0); 
    private _zeroAnd:ZeroAnd = new ZeroAnd(this.MUXA);
    private ALUADD:ALUAdder = new ALUAdder(decToUnsignedBin32(0),decToUnsignedBin32(0),this.MUXA);
    private _PCAdder:PCAdder = new PCAdder(this.ALUADD,this.MUXA);
    private _Memory:Memory = new Memory();
    private _PC:PC = new PC(this._Memory,this._PCAdder);
    private _signExtend:ConSignExtend = new ConSignExtend(this.ALUADD,this.ALUMUX);
    private _alu:conALU = new conALU(this._Memory,this.MemMUX,this._zeroAnd);
    private _aluControl:conALUControl = new conALUControl(this._alu);
    private _registerFile:conRegisterFile = new conRegisterFile(this._alu,this.ALUMUX,this._Memory);
    private _controlUnits:ConControlUnits = new ConControlUnits(this._registerFile,this._aluControl,this.MUXB,this.ALUMUX,this._zeroAnd,this.MemMUX,this._Memory);
    private clockSignal:Signal = new Signal(false);
    private _insMemData:Map<number,string> = new Map();
    private machCode:string[] = [];
    private currentInsAddr:string = init_bits(32);
    private asciiString:Map<string,string> = new Map<string,string>();
    StdOut:string = "";
    Errormsg:string = "";
    // private _dataMemData:Map<number,string> = new Map();
    // data
    PCOut:string = init_bits(32);
    PCAdderOut:string = init_bits(32);
    InsMemOut:string = init_bits(32);
    writeNumberMuxOut:string = init_bits(32);
    registerFileOutPin1:string = init_bits(32);
    registerFileOutPin2:string = init_bits(32);
    aluAdderOut:string = init_bits(32);
    muxAOut:string = init_bits(32);
    muxBOut:string = init_bits(32);
    aluMuxOut:string = init_bits(32);
    memMuxOut:string = init_bits(32);
    ALUResultOut:string = init_bits(32);
    ALUIsZeroOut:boolean = true;
    ControlOut:boolean[] = [];
    DMOut:string|undefined = init_bits(32);
    ALUAdderB:string = init_bits(32);
    signExtendOUT:string = init_bits(32);

    constructor(){
        this.MUXB.addNotifyFunc(this._PC.muxChange.bind(this._PC,this.MUXB));
        this.MUXA.addNotifyFunc(this.MUXB.setMuxInpin32A.bind(this.MUXB,this.MUXA));
        this.ALUMUX.addNotifyFunc(this._alu.setMuxInpinB.bind(this._alu,this.ALUMUX));
        this.MemMUX.addNotifyFunc(this._registerFile.setMuxWriteData.bind(this._registerFile,this.MemMUX));


        this._Memory.addTextNotifyFunc(this._controlUnits.changeOp.bind(this._controlUnits,this._Memory));
        this._Memory.addTextNotifyFunc(this._registerFile.setInstructionCode.bind(this._registerFile,this._Memory));
        this._Memory.addTextNotifyFunc(this.MUXB.memSetInpin32B.bind(this.MUXB,this._Memory,this._PCAdder));
        this._Memory.addTextNotifyFunc(this._signExtend.memSetInpin16.bind(this._signExtend,this._Memory,this._controlUnits));
        this._Memory.addTextNotifyFunc(this._aluControl.memSetIns.bind(this._aluControl,this._Memory));

        this._Memory.addDataNotifyFunc(this.MemMUX.dataMemSetInpin32B.bind(this.MemMUX,this._Memory));



        
    }

    public changeClockSignal():void{
        this.clockSignal.changeSiganl();
        this._Memory.clockSiganlChange();
        this._registerFile.changeClockSignal();
        this._PC.changeClockSignal();

        // this._PC.changeClockSignal();
        // this._registerFile.changeClockSignal();
        // this._Memory.clockSiganlChange();
        
    }

    public setClockSignal(signal:signalType):void{
        if (this.clockSignal.getSignal() == signal)
            return;
        this.setClockSignal(signal);
        this._Memory.setclockSiganl(signal);
        this._registerFile.setClockSignal(signal);
        this._PC.setClockSignal(signal);
    }

    private syscall():void{
        let registers:string[] = this.debugReg();
        let v0:number = bin2dec(registers[2],true);
        if (v0 == 1){
            this.StdOut = bin2dec(registers[4],false) + "";
            return;
        }
        if (v0 == 4){
            let a0:string = bin2dec(registers[4],true) + "";
            let print_str:string|undefined = this.asciiString.get(a0);
            if (print_str == undefined){
                let excepReporter:ExceptionReporter = ExceptionReporter.getReporter();
                excepReporter.addException("syscall print_str error: no such address!");
                this.Errormsg =  this.reportExceptions();
            }else{
                this.StdOut = print_str;
            }
            return;
        }
        if (v0 == 5){
            let read_int:string = this.readFromConsole(v0);
            let isDigit:boolean = /^-?\d+$/.test(read_int);
            if(!isDigit){
                let excepReporter:ExceptionReporter = ExceptionReporter.getReporter();
                excepReporter.addException("your input is not a number!");
                this.Errormsg =  this.reportExceptions();
            }else{
                let binCode:string = decToSignedBin32(+read_int);
                this._registerFile.storeADataAt(2,binCode);
            }
            return;
        }

        if (v0 == 8){
            let read_str:string = this.readFromConsole(v0);
            let max_length:number = bin2dec(registers[5],true);
            if (max_length < read_str.length){
                let excepReporter:ExceptionReporter = ExceptionReporter.getReporter();
                excepReporter.addException("Buffer size is not enough!!");
                this.Errormsg =  this.reportExceptions();
            }

            for(let i:number = 0;i<read_str.length;++i){
                let asciiCode:number = read_str.charCodeAt(i);
                let binCode:string = decToUnsignedBin32(asciiCode).slice(24,32);
                this._Memory.storeByteStaticData([bin2dec(registers[4],true)+"",binCode]);
            }
            return;
        } 

        if (v0 == 10){
            let excepReporter:ExceptionReporter = ExceptionReporter.getReporter();
            excepReporter.addException("Program Exit!");
            this.Errormsg =  this.reportExceptions();
            return;
        } 

        if (v0 == 11){
            let a0:number = bin2dec(registers[4],true);
            let print_char:string = String.fromCharCode(bin2dec(init_bits(24)+this._Memory.CharAt(a0),true));
            this.StdOut = print_char;
            return;
        }

        if (v0 == 12){
            let read_char:string = this.readFromConsole(v0);
            let asciiCode:number = read_char.charCodeAt(0);

            let binCode:string = decToUnsignedBin32(asciiCode);
            this._registerFile.storeADataAt(2,binCode);
            return;
        }
        let excepReporter:ExceptionReporter = ExceptionReporter.getReporter();
        excepReporter.addException("sys code in v0 is not supported!");
        this.Errormsg =  this.reportExceptions();
    }

    public readFromConsole(readCode:number):string{
        // 你们来写，把用户输入在console上的东西作为一个string返回
        return "";
    }

    public oneClockCycle():void{
        this.StdOut = "";
        if (this._Memory.getTextOutpin() == "00000000000000000000000000001100"){
            this.syscall();
        }


        this.changeClockSignal();
        this.PCOut = this._PC.getOutPin32();
        this.PCAdderOut = this._PCAdder.getOutput();
        this.InsMemOut = this._Memory.getTextOutpin();
        this.writeNumberMuxOut = this._registerFile.getWriteNumber();
        this.registerFileOutPin1 = this._registerFile.getOutDataA();
        this.registerFileOutPin2 = this._registerFile.getOutDataB();
        this.aluAdderOut = this.ALUADD.getOutput();
        this.muxAOut = this.MUXA.outPin32;
        this.muxBOut = this.MUXB.outPin32;
        this.aluMuxOut = this.ALUMUX.outPin32;
        this.memMuxOut = this.MemMUX.outPin32;
        this.ALUResultOut = this._alu.getOutPin32();
        this.ALUIsZeroOut = this._alu.isZero;
        this.ControlOut = this._controlUnits.getAllSignal();
        this.DMOut = this._Memory.getOutPin32();
        this.ALUAdderB = this.ALUADD.getInpinB();
        this.signExtendOUT = this._signExtend.getOutPin32();
        this.currentInsAddr = this._Memory.getTextAddress();
        this.Errormsg =  this.reportExceptions();
        
        this.changeClockSignal();
    }

    private reportExceptions():string{
        let ExcepReporter:ExceptionReporter = ExceptionReporter.getReporter();
        if (!ExcepReporter.isEmpty()){
            let Errors:String[] = ExcepReporter.reportException();
            let ErrorInOneLine:string = "";
            ExcepReporter.clearException();
            Errors.forEach(error=>{
                ErrorInOneLine = ErrorInOneLine + error + "\n";
            })
            return ErrorInOneLine;
        }else{
            return "";
        }

    }

    public debugCPU(InsNum:number):void{
        this.changeClockSignal();
        console.log(InsNum);
        console.log("PC: The inPin is: ",this._PC.getinPin32(),".The OutPin is",this._PC.getOutPin32());
        console.log("The address of Memory is ",this._Memory.getTextAddress());
        console.log("The code is ",this._Memory.getTextOutpin());
        console.log(this.debugReg());

        this.changeClockSignal();
        console.log(InsNum);
        console.log("PC: The inPin is: ",this._PC.getinPin32(),".The OutPin is",this._PC.getOutPin32());
        console.log("The address of Memory is ",this._Memory.getTextAddress());
        console.log("The code is ",this._Memory.getTextOutpin());
        console.log(this.debugReg());
        
        for (let [key, value] of this._Memory.getAddedData()) {
            console.log(key, value);            
        }
    }

    public runWhole():void{
        let i:number = 0;
        do {
            this.oneClockCycle();
            console.log(i);
            console.log("PC: The inPin is: ",this._PC.getinPin32(),".The OutPin is",this._PC.getOutPin32());
            console.log("The address of Memory is ",this._Memory.getTextAddress());
            console.log("The code is ",this._Memory.getTextOutpin());
            console.log(this.debugReg());
            i++;
            for (let [key, value] of this._Memory.getAddedData()) {
                console.log(key, value);            
            }
        }while(!this._Memory.isEnd());
    }
    

    public debugReg():string[]{
        let regs:_32BitsRegister[] = this._registerFile.getRegisters();
        let Regs:string[] = [];
        regs.forEach(
            reg=>{
                Regs.push(reg.getOutPin32());
            }
        )
        return Regs;
    }

    public storeIns(Ins:string[]):void{
        let pcPtr:number = bin2dec("00000000010000000000000000000000",true);
        Ins.forEach(In=>{
            if (In.length !=32)
                throw new Error("Adding Instruction Length must be 32!");
            binaryDetect(In);
            this._Memory.addInsAt(In,pcPtr);
            this._insMemData.set(pcPtr,In);
            pcPtr = pcPtr + 4;
        }
        );
    }

    public getMachineCode():string[]{
        return this.machCode;
    }

    public getCurrentInsAddr():string{
        return this.currentInsAddr;
    }

    public getStaticData():[string,string][]{
        let StatData:[string,string][] = new Array<[string,string]>();
        for (let [key, value] of this._Memory.getStaticData()) {
            StatData.push([key, value]);            
        }
        return StatData;
    }

    public getDynamicData():[string,string][]{
        let DynamicData:[string,string][] = new Array<[string,string]>();
        for (let [key, value] of this._Memory.getAddedData()) {
            DynamicData.push([key, value]);            
        }
        return DynamicData;
    }


    public Assemble(Ins:string):void{
        let machCode:string[] = [];
        let assembler: Assembler = Assembler.getAssembler();
        assembler.setSources(Ins);

        if (assembler.preprocess()) {
            let wordMap:Map<string,number> = assembler.getMapForWord();
            let byteMap:Map<string,number> = assembler.getMapForByte();
            let asciiMap:Map<string,string> = assembler.getMapForAscii();
            if (wordMap.size != 0){
                for (let key of wordMap.keys()){
                    let tempNum:number = wordMap.get(key) as number;
                    let datum:string = decToSignedBin32(tempNum);
                    this._Memory.storeWordStaticData([key,datum]);
                }
            }
            if (byteMap.size != 0){
                for (let key of wordMap.keys()){
                    let tempNum:number = byteMap.get(key) as number;
                    let datum:string = decToSignedBin32(tempNum);
                    this._Memory.storeByteStaticData([key,datum.slice(24,32)]);
                }
            }
            if (asciiMap.size != 0){
                this.asciiString = asciiMap;
                for (let key of asciiMap.keys()){
                    let tempChars:string = asciiMap.get(key) as string;
                    let datum:string = "";
                    let currentAddr:number = +key;
                    for (let i:number = 0;i < tempChars.length;++i){
                        datum = decToSignedBin32(tempChars.charCodeAt(i));
                        this._Memory.storeByteStaticData([currentAddr+"",datum.slice(24,32)]);
                        ++currentAddr;
                    }
                }
            }
            if (assembler.assemble()) {
                let i: number;
                let bin: ArrayList<string> = new ArrayList<string>(10);
                bin = assembler.getBin();
                for (i = 0; i < bin.size(); i++) {
                    machCode.push((bin.get(i).toString()));
                }
            } else {
                let excepReporter:ExceptionReporter = ExceptionReporter.getReporter();
                excepReporter.addException(assembler.getErrMsg());
                this.Errormsg =  this.reportExceptions();
            }
        }else{
            let excepReporter:ExceptionReporter = ExceptionReporter.getReporter();
            excepReporter.addException(assembler.getErrMsg());
            this.Errormsg =  this.reportExceptions();
        }
        this.storeIns(machCode);
        this.machCode = machCode;
    }

    public resetAll():void{

    }

}