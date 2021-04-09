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
/**
 * A PC is a register.Therefore class PC exends {@link _32BitsRegister}<br/>
 * some methods of {@link _32BitsRegister} are override to support some functions of PC
 * There are also some new methods which can help class PC works.
 */
class PC extends _32BitsRegister{
    /**
     * the Instruction Memory that is connected with this PC
     */
    private InstructionMem:Memory;
    /**
     * the PCAdder which manipulates the inPin32 of this PCAdder
     */
    private PCAdder:PCAdder;
    /**
     * The constructor initializes all fields of this PC
     * @param InsMem the Memory object that will be connected by this PC
     * @param PCAdder the PCAdder that connects this PC
     */
    constructor(InsMem:Memory,PCAdder:PCAdder){
        super();
        this.InstructionMem = InsMem;
        this.setInpin32(InsMem.getTextAddress());
        this.PCAdder = PCAdder;
        this.oneClockCycle();
    }

    /**
     * a cycle of clock signal pass
     */
    public oneClockCycle():void{
        if (this.getClockSignal().getSignal()){
            throw Error("One clock should start from false");
        }
        this.setClockSignal(true);
        this.setClockSignal(false);
    }

    /**
     * the connected MUX set the Inpin32
     * @param MUX the connected MUX32 object
     */
    public muxChange(MUX:Mux32):void{  
        this.setInpin32(MUX.outPin32);
    }

    /**
     * overwrite of setOutPin32<br/>
     * trigger Instruction Memory and PCAdder changes when outPin32 is reset
     */
    protected setOutpin32():void{
        super.setOutpin32();
        this.InstructionMem.setTextAddress(this.getOutPin32());
        this.PCAdder.newInPin(stringToIntArray(this.getOutPin32()) ,stringToIntArray(decToUnsignedBin32(4)));
    }

}

/**
 * PCAdder is the address Adder of PC
 * this clas extends Adder and has all the functionalities of an adder
 */
class PCAdder extends Adder{
    /**
     * ALUAdder is the adder that caculate the branch equal address according to ALU's outPin32<br/>
     * The PCAdder is connected with the inPinA of ALUAdder
     */
    private ALUAdder:ALUAdder;
    /**
     * This MUX decides whether to jump or branch
     */
    private MUX:Mux32;
    /**
     * the constructor connects this PCAdder with other componets
     * @param ALUAdder the ALU object that will be connected with this PC Adder
     * @param MUX the Mux32 object that will connect with this PC Adder
     */
    constructor(ALUAdder:ALUAdder,MUX:Mux32){
        super(decToUnsignedBin32(0),decToUnsignedBin32(4));
        this.ALUAdder = ALUAdder;
        this.MUX = MUX;
    }
    /**
     * reconnect all componets.
     * @param ALUAdder the ALU object that will be connected with this PC Adder
     * @param MUX the Mux32 object that will connect with this PC Adder
     */
    public connectConponents(ALUAdder:ALUAdder,Mux:Mux32){
        this.ALUAdder = ALUAdder;
        this.MUX = Mux;
    }

    /**
     * Set new inpin signals for inpin32A and inpin32B<br/>
     * And trigger the change of inPin32A of both ALU Adder and MUX
     * @param inSignalA new signal for inpin32A
     * @param inSignalB new signal for inpin32B
     */
    public newInPin(inSignalA:number[],inSignalB:number[]):void{
        super.newInPin(inSignalA,inSignalB);
        this.ALUAdder.setInpinA(this.getOutput());
        this.MUX.setInpin32A(this.getOutput());
    }
}

/**
 * ALU adder is the adder that caculates the branch address according to the outPin32 of ALU<br/>
 * The ALU adder is connected with mux1
 */
class ALUAdder extends Adder{
    /**
     * This is a mux32 object that chooses from pc + 4 and branch address
     */
    private MUX1:Mux32;
    
    /**
     * The constructor initializes inPin32A and inPin32B and Mux object
     * @param inSignalA new signal for inpin32A
     * @param inSignalB new signal for inpin32B
     * @param MUX the connected mux32 object
     */
    constructor(inSignalA:string,inSignalB:string,MUX:Mux32){
        super(inSignalA,inSignalB);
        this.MUX1 = MUX;
    }

    /**
     * This method set the outPin32 of this Adder<br/>
     * Trigger the change of inPin32B of connected mux32
     */
    private setOutpin32():void{
        this.outPin32 = intArrayToString(this.Adder32(stringToIntArray(this.inPin32A),stringToIntArray(this.inPin32B)));
        this.MUX1.setInpin32B(this.outPin32);
    }

    /**
     * set the inPin32A of this ALU Adder
     * @param binBits The new binary value that will assigned to the InPin32A of this ALU adder.
     */
    public setInpinA(binBits:string):void{
        if (binBits.length != 32)
            throw Error("The length of ALU Adder Input A is not 32");
        binaryDetect(binBits);
        this.inPin32A = binBits;
        this.setOutpin32();
    }

    /**
     * set the inPin32B of this ALU Adder
     * @param binBits The new binary value that will assigned to the InPin32B of this ALU adder.
     */
    public setInpinB(binBits:string):void{
        if (binBits.length != 32)
            throw Error("The length of ALU Adder Input B is not 32");
        binaryDetect(binBits);
        this.inPin32B = binBits;
        this.setOutpin32();
    }
}


/**
 * The connected sign extend components<br/>
 * the branch mux32 object and alu adder object will be connected with this sign extend component.
 */
class ConSignExtend extends SignExtend{
    /**
     * The alu adder that will be connected with this component.
     */
    private ALUResultAdder:ALUAdder;
    /**
     * This is a mux32 object that chooses from pc + 4 and branch address
     */
    private ALUInpinBMux:Mux32;
    
    /**
     * Initialize all the fields of this class
     * @param ALUResultAdder the connected ALU adder
     * @param ALUMux the connected ALU Mux32
     */
    constructor(ALUResultAdder:ALUAdder,ALUMux:Mux32){
        super();
        this.ALUResultAdder = ALUResultAdder;
        this.ALUInpinBMux = ALUMux;
    }

    /**
     * Set the 16bits inPin of this sign extend object
     * @param inPin the new 16 bits binary input that will be assigned to inPin16
     * @param ALUOp the ALUOp get from control unit
     */
    public setInPin16(inPin:string,ALUOp:boolean[]):void{
        super.setInPin16(inPin,ALUOp);
        let shiftedInput:string = shiftLeftBinary32Bits(this.getOutPin32());
        this.ALUResultAdder.setInpinB(shiftedInput);
        this.ALUInpinBMux.setInpin32B(this.getOutPin32());
    }

    /**
     * Memory set the inpin16 of this sign extend class.<br/>
     * the change of Memory's TextOutPin will trigger the change of inPin16 of this component
     * @param Mem The connected memory
     * @param con the connected control unit
     */
    public memSetInpin16(Mem:Memory,con:ConControlUnits):void{
        this.opCode = Mem.getTextOutpin().slice(0,6);
        this.setInPin16(bitsMapping(Mem.getTextOutpin(),0,16),con.getALUOp());
    }
}

/**
 * The connected ALU Control component.<br/>
 * the ALU will be connected with this ALU Control
 */
class conALUControl extends ALUControl{
    /**
     * A boolean value indicates whether the alu should report its overflow
     */
    public reportOverflow:boolean = false;
    /**
     * initialize all th fields and the connected ALU object
     * @param ALU the ALU object that will be connected with this ALU Control
     */
    constructor(ALU:ALU) {
        super(ALU);
    }

    /**
     * This method provides a way for memory to set ALU's control bits and the InsCode of this component
     * @param mem the connected Memory
     * @returns nothing
     */
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
    
    /**
     * As the name indicates, this method will set two ALUOp by getting ALUOp from input controlUnits<br/>
     * The ALU will also get the immediate code by calling this method
     * @param controlUnits the control units that connect to this alu control
     * @returns nothing
     */
    public setALUOp(controlUnits:ControlUnits):void{
        super.setALUOp(controlUnits);
        this.ALU.setControlBits(this.getOperationCode());
    }

    /**
     * change the state of overflow reporter
     * @returns nothing
     */
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

    /**
     * set bne field of ALU
     * @param ben the value that will assign to ALU's bne
     */
    private setBne(ben:boolean):void{
        this.ALU.bne = ben;
    }

    /**
     * synchronize the ALU's overflow report's state with that of this component
     */
    private setALUReportOverflow():void{
        this.ALU.setReportOverflow(this.reportOverflow);
    }
}

/**
 * The connected Register File<br/>
 * This component is connected with ALU and the mux32 of ALU inPinB and the data Memory.
 */
class conRegisterFile extends RegisterFile{
    /**
     * the connected ALU component
     */
    private ALU:conALU;

    /**
     * the Mux32 that is connected with ALU inPinB 
     */
    private ALUInpinBMUX:Mux32;

    /**
     * the connected data Memory object
     */
    private DataMemory:Memory;

    /**
     * The constructor initialize all the fields
     * @param ALU the alu object that will be connected with this register file
     * @param aluInpinBMux the mux32 of alu inpinB that will be connected with this register file
     * @param dataMem the data memory that will be connected with this register file.
     */
    constructor(ALU:conALU,aluInpinBMux:Mux32,dataMem:Memory){
        super();
        this.ALU = ALU;
        this.ALUInpinBMUX = aluInpinBMux;
        this.DataMemory = dataMem;
    }

    /**
     * override of logic of register read<br/>
     * Not only read data but also trigger the change of all connected components' inPin32
     */
    protected registerRead():void{
        super.registerRead();
        this.ALU.setInpinA(this.getOutDataA());
        this.ALUInpinBMUX.setInpin32A(this.getOutDataB());
        this.DataMemory.setInpin32(this.getOutDataB());
    }

    /**
     * The memory mux32 set the write data pin of this register file
     * @param MemMux the setter memory outPin Mux32
     */
    public setMuxWriteData(MemMux:Mux32):void{
        this.setWriteData(MemMux.outPin32);
    }
}

/**
 * This is the and of isZero of ALU and the branch signal from control unit 
 */
class ZeroAnd extends AND{
    /**
     * The mux32 that this zero and connected with
     */
    private MuxA:Mux32;
    /**
     * The constructor initializes the connected mux32
     * @param MuxA the mux32 object that is being connected with this register file
     */
    constructor(MuxA:Mux32){
        super(0,0);
        this.MuxA = MuxA;
    }

    /**
     * set the InpinA of this and object.
     * @param inpin 
     */
    public setInpinA(inpin:boolean):void{
        this.pin1 = bool2num(inpin);
        this.setOutpin();
    }

    /**
     * set the inPinB of this and object.
     * @param inpin the value that will be assigned to inPinB of this and object
     */
    public setInpinB(inpin:boolean):void{
        this.pin2 = bool2num(inpin);
        this.setOutpin();
    }

    /**
     * set the outPin of this and object and trigger the change of selector of the connected mux32
     */
    private setOutpin():void{
        this.outpin = AND.And(this.pin1,this.pin2);
        this.MuxA.setSel(this.outpin);
    }
}

/**
 * the connected ALU<br/>
 * This class is connected with Memory mux and data Mememory and zeroAnd object
 */
class conALU extends ALU{
    /**
     * The data Memory that is connected with this ALU class
     */
    private dataMemory:Memory;
    /**
     * The connected Memory Mux32
     */
    private MemoryMux:Mux32;
    /**
     * the connected zeroAnd.
     */
    private zeroAnd:ZeroAnd;

    /**
     * initialize all the fields
     * @param dataMem 
     * @param MemMux 
     * @param zeroAnd 
     */
    constructor(dataMem:Memory,MemMux:Mux32,zeroAnd:ZeroAnd){
        super(decToUnsignedBin32(0),decToUnsignedBin32(0),"0000");
        this.dataMemory = dataMem;
        this.MemoryMux = MemMux;
        this.zeroAnd = zeroAnd;
    }

    /**
     * Override of detect zero<br/>
     * the change of isZero field will trigger the change of inPinB of zeroAnd
     */
    protected detectZero():void{
        super.detectZero();
        if (this.bne){
            this.isZero = !this.isZero;
        }
        this.zeroAnd.setInpinB(this.isZero);
    }

    /**
     * override of setOutPin<br/>
     * the change of outPin32 will trigger the change of the address of data memory and the inpin32A of memory mux
     * @param outPin 
     */
    protected setOutPin(outPin:string):void{
        super.setOutPin(outPin);
        this.dataMemory.setDataAddress(this.getOutPin32());
        this.MemoryMux.setInpin32A(this.getOutPin32());
    }

    /**
     * override of ALU logic<br/>
     * Additional logic of ALU is added to this method.
     */
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

/**
 * The connected Control Unit<br/>
 * This object is connected with register file and alu control and jump mux32 and alu mux and memory mux and zeroAnd and data memory
 */
class ConControlUnits extends ControlUnits{
    /**
     * The connected register file
     */
    private bindedRegFile:RegisterFile;
    /**
     * The connected ALU Control
     */
    private bindedALUControl:conALUControl;
    /**
     * The connected jump mux32
     */
    private MUXB:Mux32;
    /**
     * The connected alu mux32
     */
    private ALUMUX:Mux32;
    /**
     * The connected memory mux
     */
    private MemMUX:Mux32;
    /**
     * the connected zeroAnd
     */
    private zeroAnd:ZeroAnd;
    /**
     * the connected data Memory
     */
    private dataMem:Memory;
    // private bi
    /**
     * initialize all the connected components.
     * @param bindedRegFile 
     * @param conALUctl 
     * @param muxb 
     * @param aluMux 
     * @param zeroAnd 
     * @param MemMux 
     * @param dataMem 
     */
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

    /**
     * override of setOp<br/>
     * the change of operation code will also change the value connected with out signal of this control unit
     * @param code the code being set
     */
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

    /**
     * if OPCode indicates that this is an unsign instruction<br/>
     * then the overflow report function of alu will be turned on
     * @param code the 6 bits OPCode
     * @returns nothing
     */
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

/**
 * This is the real CPU of MIPS<br/>
 * Assembler and all circuit's components are integrated in this class<br/>
 * The functionalities of this class simulates a real MIPS CPU.<br/>
 * The pipeline is not realized is this class so we gave it name singleCycleCPU
 * which means the cpu will only run one instruction in one cycle.
 */
export class singleCycleCpu{
    /**
     * The branch mux32 of this MIPS CPU
     */
    private MUXA:Mux32 = new Mux32(decToUnsignedBin32(0),decToUnsignedBin32(0),0);
    /**
     * The jump mux32 of this MIPS CPU
     */
    private MUXB:Mux32 = new Mux32(decToUnsignedBin32(0),decToUnsignedBin32(0),0);
    /**
     * The alu mux of this MIPS CPU
     */
    private ALUMUX:Mux32 = new Mux32(decToUnsignedBin32(0),decToUnsignedBin32(0),0);
    /**
     * The memory mux32 of this MIPS CPU
     */
    private MemMUX:Mux32  = new Mux32(decToUnsignedBin32(0),decToUnsignedBin32(0),0);
    /**
     * The zeroAnd of this MIPS CPU
     */
    private _zeroAnd:ZeroAnd = new ZeroAnd(this.MUXA);
    /**
     * The branch address adder.
     */
    private ALUADD:ALUAdder = new ALUAdder(decToUnsignedBin32(0),decToUnsignedBin32(0),this.MUXA);
    /**
     * The PC + 4 address Adder
     */
    private _PCAdder:PCAdder = new PCAdder(this.ALUADD,this.MUXA);
    /**
     * The instruction Memory and data Memory of this MIPS CPU
     */
    private _Memory:Memory = new Memory();
    /**
     * The PC of this MIPS CPU
     */
    private _PC:PC = new PC(this._Memory,this._PCAdder);
    /**
     * The sign Extend component of this MIPS CPU
     */
    private _signExtend:ConSignExtend = new ConSignExtend(this.ALUADD,this.ALUMUX);
    /**
     * The alu of this MIPS CPU
     */
    private _alu:conALU = new conALU(this._Memory,this.MemMUX,this._zeroAnd);
    /**
     * The alu control of this MIPS CPU
     */
    private _aluControl:conALUControl = new conALUControl(this._alu);
    /**
     * The register file of this MIPS CPU
     */
    private _registerFile:conRegisterFile = new conRegisterFile(this._alu,this.ALUMUX,this._Memory);
    /**
     * The control unit of this MIPS CPU
     */
    private _controlUnits:ConControlUnits = new ConControlUnits(this._registerFile,this._aluControl,this.MUXB,this.ALUMUX,this._zeroAnd,this.MemMUX,this._Memory);
    /**
     * The clock signal of this CPU
     */
    private clockSignal:Signal = new Signal(false);
    /**
     * record of all the added data to the memory
     */
    private _insMemData:Map<number,string> = new Map();
    /**
     * The assembled machince code
     */
    private machCode:string[] = [];
    /**
     * the current pointed pc address
     */
    private currentInsAddr:string = init_bits(32);
    /**
     * the added ascii string to the memory
     */
    private asciiString:Map<string,string> = new Map<string,string>();
    /**
     * the out message of console
     */
    StdOut:string = "";
    /**
     * the reported error message
     */
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
    assembler:Assembler = Assembler.getAssembler();

    /**
     * The constructor initializes all the fields
     */
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

    /**
     * change the clock siganl of this CPU<br/>
     * trigger the change of clock signal of all composed components
     */
    public changeClockSignal():void{
        this.clockSignal.changeSiganl();
        this._Memory.clockSiganlChange();
        this._registerFile.changeClockSignal();
        this._PC.changeClockSignal();

        // this._PC.changeClockSignal();
        // this._registerFile.changeClockSignal();
        // this._Memory.clockSiganlChange();
        
    }

    /**
     * set the clock signal of this CPU<br/>
     * set the clock signal of all composed components
     * @param signal the signal being set
     * @returns nothing
     */
    public setClockSignal(signal:signalType):void{
        if (this.clockSignal.getSignal() == signal)
            return;
        this.setClockSignal(signal);
        this._Memory.setclockSiganl(signal);
        this._registerFile.setClockSignal(signal);
        this._PC.setClockSignal(signal);
    }

    /**
     * The logic of syscall instruction
     * @returns nothing
     */
    private syscall():void{
        this.StdOut = "";
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
                this.StdOut = print_str.slice(0,print_str.length-1);
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

    /**
     * The logic of read from console
     * @param readCode the syscall code
     * @returns the string user input on console
     */
    public readFromConsole(readCode:number):string{
        let ret:string|null = null;
        if(readCode == 5){
            ret = prompt("Please input an integer");
        }
        else if(readCode == 8){
            ret = prompt("Please input a string");
        }
        else if(readCode == 12){
            ret = prompt("Please input a character");
        }
        if (ret == null){
            let excepReporter:ExceptionReporter = ExceptionReporter.getReporter();
            excepReporter.addException("No input detected!");
            this.Errormsg =  this.reportExceptions();
            return "";
        }
        return ret;
    }

    /**
     * change clock signal twice<br/>
     * This means the clock of this signal passes a clock cycle
     */
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
        if (this.Errormsg == ""){
            this.Errormsg =  this.reportExceptions();
        }
        
        this.changeClockSignal();
    }

    /**
     * The logic of report exception
     * @returns the exception message
     */
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

    /**
     * test method of this class<br/>
     * used for debugging this class
     * @param InsNum The index of instructions
     */
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

    /**
     * run all the instructions stored in this model in one turn<br/>
     */
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
    
    /**
     * get the binary string data of all the registers
     * @returns a array of 32 strings, each represents the data of a register
     */
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

    /**
     * store machine code into Instruction Memory
     * @param Ins the machine code that will be stored into instrucion memory
     */
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

    /**
     * get all stored machine code
     * @returns all the machine code
     */
    public getMachineCode():string[]{
        return this.machCode;
    }

    /**
     * get the current pointed pc address
     * @returns 
     */
    public getCurrentInsAddr():string{
        return this.currentInsAddr;
    }

    /**
     * get all static stored data
     * @returns an array of index data pair
     */
    public getStaticData():[string,string][]{
        let StatData:[string,string][] = new Array<[string,string]>();
        for (let [key, value] of this._Memory.getStaticData()) {
            StatData.push([key, value]);            
        }
        return StatData;
    }

    /**
     * get all dynamic stored data
     * @returns an array of index data pair 
     */
    public getDynamicData():[string,string][]{
        let DynamicData:[string,string][] = new Array<[string,string]>();
        for (let [key, value] of this._Memory.getAddedData()) {
            DynamicData.push([key, value]);            
        }
        return DynamicData;
    }

    /**
     * Assemble the instructions into machine codes
     * @param Ins the instructions in the form of one string
     */
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
                        if (tempChars.charCodeAt(i) == 92){
                            i++;
                            datum = decToSignedBin32(tempChars.charCodeAt(i));
                            if (tempChars.charAt(i) == 'n'){
                                datum = decToSignedBin32(10);
                            }
                            if (tempChars.charAt(i) == 'r'){
                                datum = decToSignedBin32(13);
                            }
                            if (tempChars.charAt(i) == 't'){
                                datum = decToSignedBin32(9);
                            }
                            if (tempChars.charAt(i) == 'b'){
                                datum = decToSignedBin32(8);
                            }
                            if (tempChars.charAt(i) == 'f'){
                                datum = decToSignedBin32(12);
                            }
                            if (tempChars.charAt(i) == 'v'){
                                datum = decToSignedBin32(11);
                            }
                            if (tempChars.charAt(i) == '0'){
                                datum = decToSignedBin32(0);
                            }
                            let newStr:string = asciiMap.get(key) as string;
                            newStr = newStr.slice(0,i-1) + String.fromCharCode(bin2dec(datum,true)) + newStr.slice(i+1,newStr.length);
                            asciiMap.set(key,newStr);
                        }else{
                            datum = decToSignedBin32(tempChars.charCodeAt(i));
                        }

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

    /**
     * reset this CPU
     */
    public resetAll():void{

    }

}