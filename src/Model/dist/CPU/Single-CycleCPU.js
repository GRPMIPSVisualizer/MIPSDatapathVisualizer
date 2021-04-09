"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleCycleCpu = void 0;
const Adder_1 = require("../Circuit/Adder");
const ALU_1 = require("../Circuit/ALU");
const ControlUnits_1 = require("../Circuit/ControlUnits");
const Memory_1 = require("../Circuit/Memory");
const Register_1 = require("../Circuit/Register");
const RegisterFile_1 = require("../Circuit/RegisterFile");
const Sign_extend_1 = require("../Circuit/Sign-extend");
const Signal_1 = require("../Circuit/Signal");
const Mux32_1 = require("../Conponent/Mux32");
const BooleanHandler_1 = require("../Library/BooleanHandler");
const StringHandle_1 = require("../Library/StringHandle");
const AND_1 = require("../Logic/AND");
const Assembler_1 = require("../Assembler/Assembler");
const BItsGenerator_1 = require("../Library/BItsGenerator");
const ArrayList_1 = require("../Assembler/ArrayList");
const ExceptionReporter_1 = require("../Circuit/ExceptionReporter");
/**
 * A PC is a register.Therefore class PC exends {@link _32BitsRegister}<br/>
 * some methods of {@link _32BitsRegister} are override to support some functions of PC
 * There are also some new methods which can help class PC works.
 */
class PC extends Register_1._32BitsRegister {
    /**
     * The constructor initializes all fields of this PC
     * @param InsMem the Memory object that will be connected by this PC
     * @param PCAdder the PCAdder that connects this PC
     */
    constructor(InsMem, PCAdder) {
        super();
        this.InstructionMem = InsMem;
        this.setInpin32(InsMem.getTextAddress());
        this.PCAdder = PCAdder;
        this.oneClockCycle();
    }
    /**
     * a cycle of clock signal pass
     */
    oneClockCycle() {
        if (this.getClockSignal().getSignal()) {
            throw Error("One clock should start from false");
        }
        this.setClockSignal(true);
        this.setClockSignal(false);
    }
    /**
     * the connected MUX set the Inpin32
     * @param MUX the connected MUX32 object
     */
    muxChange(MUX) {
        this.setInpin32(MUX.outPin32);
    }
    /**
     * overwrite of setOutPin32<br/>
     * trigger Instruction Memory and PCAdder changes when outPin32 is reset
     */
    setOutpin32() {
        super.setOutpin32();
        this.InstructionMem.setTextAddress(this.getOutPin32());
        this.PCAdder.newInPin(StringHandle_1.stringToIntArray(this.getOutPin32()), StringHandle_1.stringToIntArray(StringHandle_1.decToUnsignedBin32(4)));
    }
}
/**
 * PCAdder is the address Adder of PC
 * this clas extends Adder and has all the functionalities of an adder
 */
class PCAdder extends Adder_1.Adder {
    /**
     * the constructor connects this PCAdder with other componets
     * @param ALUAdder the ALU object that will be connected with this PC Adder
     * @param MUX the Mux32 object that will connect with this PC Adder
     */
    constructor(ALUAdder, MUX) {
        super(StringHandle_1.decToUnsignedBin32(0), StringHandle_1.decToUnsignedBin32(4));
        this.ALUAdder = ALUAdder;
        this.MUX = MUX;
    }
    /**
     * reconnect all componets.
     * @param ALUAdder the ALU object that will be connected with this PC Adder
     * @param MUX the Mux32 object that will connect with this PC Adder
     */
    connectConponents(ALUAdder, Mux) {
        this.ALUAdder = ALUAdder;
        this.MUX = Mux;
    }
    /**
     * Set new inpin signals for inpin32A and inpin32B<br/>
     * And trigger the change of inPin32A of both ALU Adder and MUX
     * @param inSignalA new signal for inpin32A
     * @param inSignalB new signal for inpin32B
     */
    newInPin(inSignalA, inSignalB) {
        super.newInPin(inSignalA, inSignalB);
        this.ALUAdder.setInpinA(this.getOutput());
        this.MUX.setInpin32A(this.getOutput());
    }
}
/**
 * ALU adder is the adder that caculates the branch address according to the outPin32 of ALU<br/>
 * The ALU adder is connected with mux1
 */
class ALUAdder extends Adder_1.Adder {
    /**
     * The constructor initializes inPin32A and inPin32B and Mux object
     * @param inSignalA new signal for inpin32A
     * @param inSignalB new signal for inpin32B
     * @param MUX the connected mux32 object
     */
    constructor(inSignalA, inSignalB, MUX) {
        super(inSignalA, inSignalB);
        this.MUX1 = MUX;
    }
    /**
     * This method set the outPin32 of this Adder<br/>
     * Trigger the change of inPin32B of connected mux32
     */
    setOutpin32() {
        this.outPin32 = StringHandle_1.intArrayToString(this.Adder32(StringHandle_1.stringToIntArray(this.inPin32A), StringHandle_1.stringToIntArray(this.inPin32B)));
        this.MUX1.setInpin32B(this.outPin32);
    }
    /**
     * set the inPin32A of this ALU Adder
     * @param binBits The new binary value that will assigned to the InPin32A of this ALU adder.
     */
    setInpinA(binBits) {
        if (binBits.length != 32)
            throw Error("The length of ALU Adder Input A is not 32");
        StringHandle_1.binaryDetect(binBits);
        this.inPin32A = binBits;
        this.setOutpin32();
    }
    /**
     * set the inPin32B of this ALU Adder
     * @param binBits The new binary value that will assigned to the InPin32B of this ALU adder.
     */
    setInpinB(binBits) {
        if (binBits.length != 32)
            throw Error("The length of ALU Adder Input B is not 32");
        StringHandle_1.binaryDetect(binBits);
        this.inPin32B = binBits;
        this.setOutpin32();
    }
}
/**
 * The connected sign extend components<br/>
 * the branch mux32 object and alu adder object will be connected with this sign extend component.
 */
class ConSignExtend extends Sign_extend_1.SignExtend {
    /**
     * Initialize all the fields of this class
     * @param ALUResultAdder the connected ALU adder
     * @param ALUMux the connected ALU Mux32
     */
    constructor(ALUResultAdder, ALUMux) {
        super();
        this.ALUResultAdder = ALUResultAdder;
        this.ALUInpinBMux = ALUMux;
    }
    /**
     * Set the 16bits inPin of this sign extend object
     * @param inPin the new 16 bits binary input that will be assigned to inPin16
     * @param ALUOp the ALUOp get from control unit
     */
    setInPin16(inPin, ALUOp) {
        super.setInPin16(inPin, ALUOp);
        let shiftedInput = StringHandle_1.shiftLeftBinary32Bits(this.getOutPin32());
        this.ALUResultAdder.setInpinB(shiftedInput);
        this.ALUInpinBMux.setInpin32B(this.getOutPin32());
    }
    /**
     * Memory set the inpin16 of this sign extend class.<br/>
     * the change of Memory's TextOutPin will trigger the change of inPin16 of this component
     * @param Mem The connected memory
     * @param con the connected control unit
     */
    memSetInpin16(Mem, con) {
        this.opCode = Mem.getTextOutpin().slice(0, 6);
        this.setInPin16(StringHandle_1.bitsMapping(Mem.getTextOutpin(), 0, 16), con.getALUOp());
    }
}
/**
 * The connected ALU Control component.<br/>
 * the ALU will be connected with this ALU Control
 */
class conALUControl extends ControlUnits_1.ALUControl {
    /**
     * initialize all th fields and the connected ALU object
     * @param ALU the ALU object that will be connected with this ALU Control
     */
    constructor(ALU) {
        super(ALU);
        /**
         * A boolean value indicates whether the alu should report its overflow
         */
        this.reportOverflow = false;
    }
    /**
     * This method provides a way for memory to set ALU's control bits and the InsCode of this component
     * @param mem the connected Memory
     * @returns nothing
     */
    memSetIns(mem) {
        this.setBne(this.bne);
        if (this.ALUOp0 && this.ALUOp1) {
            return;
        }
        super.setIns(StringHandle_1.bitsMapping(mem.getTextOutpin(), 0, 6));
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
    setALUOp(controlUnits) {
        super.setALUOp(controlUnits);
        this.ALU.setControlBits(this.getOperationCode());
    }
    /**
     * change the state of overflow reporter
     * @returns nothing
     */
    changeOverflowReport() {
        let Inscode = this.getInsCodeStr();
        let InsIndex = StringHandle_1.bin2dec("00000000000000000000000000" + Inscode, true);
        if (!this.ALUOp1 || this.ALUOp0) {
            return;
        }
        if (InsIndex == 8 || InsIndex == 32 || InsIndex == 34) {
            this.reportOverflow = true;
        }
        else {
            this.reportOverflow = false;
        }
    }
    /**
     * set bne field of ALU
     * @param ben the value that will assign to ALU's bne
     */
    setBne(ben) {
        this.ALU.bne = ben;
    }
    /**
     * synchronize the ALU's overflow report's state with that of this component
     */
    setALUReportOverflow() {
        this.ALU.setReportOverflow(this.reportOverflow);
    }
}
/**
 * The connected Register File<br/>
 * This component is connected with ALU and the mux32 of ALU inPinB and the data Memory.
 */
class conRegisterFile extends RegisterFile_1.RegisterFile {
    /**
     * The constructor initialize all the fields
     * @param ALU the alu object that will be connected with this register file
     * @param aluInpinBMux the mux32 of alu inpinB that will be connected with this register file
     * @param dataMem the data memory that will be connected with this register file.
     */
    constructor(ALU, aluInpinBMux, dataMem) {
        super();
        this.ALU = ALU;
        this.ALUInpinBMUX = aluInpinBMux;
        this.DataMemory = dataMem;
    }
    /**
     * override of logic of register read<br/>
     * Not only read data but also trigger the change of all connected components' inPin32
     */
    registerRead() {
        super.registerRead();
        this.ALU.setInpinA(this.getOutDataA());
        this.ALUInpinBMUX.setInpin32A(this.getOutDataB());
        this.DataMemory.setInpin32(this.getOutDataB());
    }
    /**
     * The memory mux32 set the write data pin of this register file
     * @param MemMux the setter memory outPin Mux32
     */
    setMuxWriteData(MemMux) {
        this.setWriteData(MemMux.outPin32);
    }
}
/**
 * This is the and of isZero of ALU and the branch signal from control unit
 */
class ZeroAnd extends AND_1.AND {
    /**
     * The constructor initializes the connected mux32
     * @param MuxA the mux32 object that is being connected with this register file
     */
    constructor(MuxA) {
        super(0, 0);
        this.MuxA = MuxA;
    }
    /**
     * set the InpinA of this and object.
     * @param inpin
     */
    setInpinA(inpin) {
        this.pin1 = BooleanHandler_1.bool2num(inpin);
        this.setOutpin();
    }
    /**
     * set the inPinB of this and object.
     * @param inpin the value that will be assigned to inPinB of this and object
     */
    setInpinB(inpin) {
        this.pin2 = BooleanHandler_1.bool2num(inpin);
        this.setOutpin();
    }
    /**
     * set the outPin of this and object and trigger the change of selector of the connected mux32
     */
    setOutpin() {
        this.outpin = AND_1.AND.And(this.pin1, this.pin2);
        this.MuxA.setSel(this.outpin);
    }
}
/**
 * the connected ALU<br/>
 * This class is connected with Memory mux and data Mememory and zeroAnd object
 */
class conALU extends ALU_1.ALU {
    /**
     * initialize all the fields
     * @param dataMem
     * @param MemMux
     * @param zeroAnd
     */
    constructor(dataMem, MemMux, zeroAnd) {
        super(StringHandle_1.decToUnsignedBin32(0), StringHandle_1.decToUnsignedBin32(0), "0000");
        this.dataMemory = dataMem;
        this.MemoryMux = MemMux;
        this.zeroAnd = zeroAnd;
    }
    /**
     * Override of detect zero<br/>
     * the change of isZero field will trigger the change of inPinB of zeroAnd
     */
    detectZero() {
        super.detectZero();
        if (this.bne) {
            this.isZero = !this.isZero;
        }
        this.zeroAnd.setInpinB(this.isZero);
    }
    /**
     * override of setOutPin<br/>
     * the change of outPin32 will trigger the change of the address of data memory and the inpin32A of memory mux
     * @param outPin
     */
    setOutPin(outPin) {
        super.setOutPin(outPin);
        this.dataMemory.setDataAddress(this.getOutPin32());
        this.MemoryMux.setInpin32A(this.getOutPin32());
    }
    /**
     * override of ALU logic<br/>
     * Additional logic of ALU is added to this method.
     */
    ALU() {
        this.shamt = this.dataMemory.getTextOutpin().slice(21, 26);
        if (this.dataMemory.getTextOutpin().slice(0, 6) == "001111") {
            this.inPin32A = BItsGenerator_1.init_bits(16) + this.inPin32A.slice(16, 32);
        }
        if (this.dataMemory.getTextOutpin().slice(0, 6) == "001011") {
            this.isUnsign = true;
        }
        else {
            if (this.dataMemory.getTextOutpin().slice(0, 6) == "000000" && this.dataMemory.getTextOutpin().slice(26, 32) == "101011") {
                this.isUnsign = true;
            }
            else {
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
class ConControlUnits extends ControlUnits_1.ControlUnits {
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
    constructor(bindedRegFile, conALUctl, muxb, aluMux, zeroAnd, MemMux, dataMem) {
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
    setOp(code) {
        super.setOp(code);
        this.setOverflow(code);
        this.bindedRegFile.setWriteEnable(false);
        this.dataMem.setReadWriteEnable(false, false);
        this.bindedRegFile.setRegDes(this.RegDes);
        this.bindedALUControl.setALUOp(this);
        this.MUXB.setSel(BooleanHandler_1.bool2num(this.Jump));
        this.ALUMUX.setSel(BooleanHandler_1.bool2num(this.ALUSrc));
        this.zeroAnd.setInpinA(this.Branch);
        this.MemMUX.setSel(BooleanHandler_1.bool2num(this.MemtoReg));
        this.bindedRegFile.setWriteEnable(this.RegWrite);
        this.dataMem.setReadWriteEnable(this.MemRead, this.MemWrite);
    }
    /**
     * if OPCode indicates that this is an unsign instruction<br/>
     * then the overflow report function of alu will be turned on
     * @param code the 6 bits OPCode
     * @returns nothing
     */
    setOverflow(code) {
        let decCode = StringHandle_1.bin2dec("00000000000000000000000000" + code, true);
        if (decCode == 0) {
            return;
        }
        if (decCode == 4 || decCode == 5 || decCode == 8) {
            this.bindedALUControl.reportOverflow = true;
        }
        else {
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
class singleCycleCpu {
    /**
     * The constructor initializes all the fields
     */
    constructor() {
        /**
         * The branch mux32 of this MIPS CPU
         */
        this.MUXA = new Mux32_1.Mux32(StringHandle_1.decToUnsignedBin32(0), StringHandle_1.decToUnsignedBin32(0), 0);
        /**
         * The jump mux32 of this MIPS CPU
         */
        this.MUXB = new Mux32_1.Mux32(StringHandle_1.decToUnsignedBin32(0), StringHandle_1.decToUnsignedBin32(0), 0);
        /**
         * The alu mux of this MIPS CPU
         */
        this.ALUMUX = new Mux32_1.Mux32(StringHandle_1.decToUnsignedBin32(0), StringHandle_1.decToUnsignedBin32(0), 0);
        /**
         * The memory mux32 of this MIPS CPU
         */
        this.MemMUX = new Mux32_1.Mux32(StringHandle_1.decToUnsignedBin32(0), StringHandle_1.decToUnsignedBin32(0), 0);
        /**
         * The zeroAnd of this MIPS CPU
         */
        this._zeroAnd = new ZeroAnd(this.MUXA);
        /**
         * The branch address adder.
         */
        this.ALUADD = new ALUAdder(StringHandle_1.decToUnsignedBin32(0), StringHandle_1.decToUnsignedBin32(0), this.MUXA);
        /**
         * The PC + 4 address Adder
         */
        this._PCAdder = new PCAdder(this.ALUADD, this.MUXA);
        /**
         * The instruction Memory and data Memory of this MIPS CPU
         */
        this._Memory = new Memory_1.Memory();
        /**
         * The PC of this MIPS CPU
         */
        this._PC = new PC(this._Memory, this._PCAdder);
        /**
         * The sign Extend component of this MIPS CPU
         */
        this._signExtend = new ConSignExtend(this.ALUADD, this.ALUMUX);
        /**
         * The alu of this MIPS CPU
         */
        this._alu = new conALU(this._Memory, this.MemMUX, this._zeroAnd);
        /**
         * The alu control of this MIPS CPU
         */
        this._aluControl = new conALUControl(this._alu);
        /**
         * The register file of this MIPS CPU
         */
        this._registerFile = new conRegisterFile(this._alu, this.ALUMUX, this._Memory);
        /**
         * The control unit of this MIPS CPU
         */
        this._controlUnits = new ConControlUnits(this._registerFile, this._aluControl, this.MUXB, this.ALUMUX, this._zeroAnd, this.MemMUX, this._Memory);
        /**
         * The clock signal of this CPU
         */
        this.clockSignal = new Signal_1.Signal(false);
        /**
         * record of all the added data to the memory
         */
        this._insMemData = new Map();
        /**
         * The assembled machince code
         */
        this.machCode = [];
        /**
         * the current pointed pc address
         */
        this.currentInsAddr = BItsGenerator_1.init_bits(32);
        /**
         * the added ascii string to the memory
         */
        this.asciiString = new Map();
        /**
         * the out message of console
         */
        this.StdOut = "";
        /**
         * the reported error message
         */
        this.Errormsg = "";
        // private _dataMemData:Map<number,string> = new Map();
        // data
        this.PCOut = BItsGenerator_1.init_bits(32);
        this.PCAdderOut = BItsGenerator_1.init_bits(32);
        this.InsMemOut = BItsGenerator_1.init_bits(32);
        this.writeNumberMuxOut = BItsGenerator_1.init_bits(32);
        this.registerFileOutPin1 = BItsGenerator_1.init_bits(32);
        this.registerFileOutPin2 = BItsGenerator_1.init_bits(32);
        this.aluAdderOut = BItsGenerator_1.init_bits(32);
        this.muxAOut = BItsGenerator_1.init_bits(32);
        this.muxBOut = BItsGenerator_1.init_bits(32);
        this.aluMuxOut = BItsGenerator_1.init_bits(32);
        this.memMuxOut = BItsGenerator_1.init_bits(32);
        this.ALUResultOut = BItsGenerator_1.init_bits(32);
        this.ALUIsZeroOut = true;
        this.ControlOut = [];
        this.DMOut = BItsGenerator_1.init_bits(32);
        this.ALUAdderB = BItsGenerator_1.init_bits(32);
        this.signExtendOUT = BItsGenerator_1.init_bits(32);
        this.assembler = Assembler_1.Assembler.getAssembler();
        this.MUXB.addNotifyFunc(this._PC.muxChange.bind(this._PC, this.MUXB));
        this.MUXA.addNotifyFunc(this.MUXB.setMuxInpin32A.bind(this.MUXB, this.MUXA));
        this.ALUMUX.addNotifyFunc(this._alu.setMuxInpinB.bind(this._alu, this.ALUMUX));
        this.MemMUX.addNotifyFunc(this._registerFile.setMuxWriteData.bind(this._registerFile, this.MemMUX));
        this._Memory.addTextNotifyFunc(this._controlUnits.changeOp.bind(this._controlUnits, this._Memory));
        this._Memory.addTextNotifyFunc(this._registerFile.setInstructionCode.bind(this._registerFile, this._Memory));
        this._Memory.addTextNotifyFunc(this.MUXB.memSetInpin32B.bind(this.MUXB, this._Memory, this._PCAdder));
        this._Memory.addTextNotifyFunc(this._signExtend.memSetInpin16.bind(this._signExtend, this._Memory, this._controlUnits));
        this._Memory.addTextNotifyFunc(this._aluControl.memSetIns.bind(this._aluControl, this._Memory));
        this._Memory.addDataNotifyFunc(this.MemMUX.dataMemSetInpin32B.bind(this.MemMUX, this._Memory));
    }
    /**
     * change the clock siganl of this CPU<br/>
     * trigger the change of clock signal of all composed components
     */
    changeClockSignal() {
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
    setClockSignal(signal) {
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
    syscall() {
        this.StdOut = "";
        let registers = this.debugReg();
        let v0 = StringHandle_1.bin2dec(registers[2], true);
        if (v0 == 1) {
            this.StdOut = StringHandle_1.bin2dec(registers[4], false) + "";
            return;
        }
        if (v0 == 4) {
            let a0 = StringHandle_1.bin2dec(registers[4], true) + "";
            let print_str = this.asciiString.get(a0);
            if (print_str == undefined) {
                let excepReporter = ExceptionReporter_1.ExceptionReporter.getReporter();
                excepReporter.addException("syscall print_str error: no such address!");
                this.Errormsg = this.reportExceptions();
            }
            else {
                this.StdOut = print_str.slice(0, print_str.length - 1);
            }
            return;
        }
        if (v0 == 5) {
            let read_int = this.readFromConsole(v0);
            let isDigit = /^-?\d+$/.test(read_int);
            if (!isDigit) {
                let excepReporter = ExceptionReporter_1.ExceptionReporter.getReporter();
                excepReporter.addException("your input is not a number!");
                this.Errormsg = this.reportExceptions();
            }
            else {
                let binCode = StringHandle_1.decToSignedBin32(+read_int);
                this._registerFile.storeADataAt(2, binCode);
            }
            return;
        }
        if (v0 == 8) {
            let read_str = this.readFromConsole(v0);
            let max_length = StringHandle_1.bin2dec(registers[5], true);
            if (max_length < read_str.length) {
                let excepReporter = ExceptionReporter_1.ExceptionReporter.getReporter();
                excepReporter.addException("Buffer size is not enough!!");
                this.Errormsg = this.reportExceptions();
            }
            for (let i = 0; i < read_str.length; ++i) {
                let asciiCode = read_str.charCodeAt(i);
                let binCode = StringHandle_1.decToUnsignedBin32(asciiCode).slice(24, 32);
                this._Memory.storeByteStaticData([StringHandle_1.bin2dec(registers[4], true) + "", binCode]);
            }
            return;
        }
        if (v0 == 10) {
            let excepReporter = ExceptionReporter_1.ExceptionReporter.getReporter();
            excepReporter.addException("Program Exit!");
            this.Errormsg = this.reportExceptions();
            return;
        }
        if (v0 == 11) {
            let a0 = StringHandle_1.bin2dec(registers[4], true);
            let print_char = String.fromCharCode(StringHandle_1.bin2dec(BItsGenerator_1.init_bits(24) + this._Memory.CharAt(a0), true));
            this.StdOut = print_char;
            return;
        }
        if (v0 == 12) {
            let read_char = this.readFromConsole(v0);
            let asciiCode = read_char.charCodeAt(0);
            let binCode = StringHandle_1.decToUnsignedBin32(asciiCode);
            this._registerFile.storeADataAt(2, binCode);
            return;
        }
        let excepReporter = ExceptionReporter_1.ExceptionReporter.getReporter();
        excepReporter.addException("sys code in v0 is not supported!");
        this.Errormsg = this.reportExceptions();
    }
    /**
     * The logic of read from console
     * @param readCode the syscall code
     * @returns the string user input on console
     */
    readFromConsole(readCode) {
        let ret = null;
        if (readCode == 5) {
            ret = prompt("Please input an integer");
        }
        else if (readCode == 8) {
            ret = prompt("Please input a string");
        }
        else if (readCode == 12) {
            ret = prompt("Please input a character");
        }
        if (ret == null) {
            let excepReporter = ExceptionReporter_1.ExceptionReporter.getReporter();
            excepReporter.addException("No input detected!");
            this.Errormsg = this.reportExceptions();
            return "";
        }
        return ret;
    }
    /**
     * change clock signal twice<br/>
     * This means the clock of this signal passes a clock cycle
     */
    oneClockCycle() {
        this.StdOut = "";
        if (this._Memory.getTextOutpin() == "00000000000000000000000000001100") {
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
        if (this.Errormsg == "") {
            this.Errormsg = this.reportExceptions();
        }
        this.changeClockSignal();
    }
    /**
     * The logic of report exception
     * @returns the exception message
     */
    reportExceptions() {
        let ExcepReporter = ExceptionReporter_1.ExceptionReporter.getReporter();
        if (!ExcepReporter.isEmpty()) {
            let Errors = ExcepReporter.reportException();
            let ErrorInOneLine = "";
            ExcepReporter.clearException();
            Errors.forEach(error => {
                ErrorInOneLine = ErrorInOneLine + error + "\n";
            });
            return ErrorInOneLine;
        }
        else {
            return "";
        }
    }
    /**
     * test method of this class<br/>
     * used for debugging this class
     * @param InsNum The index of instructions
     */
    debugCPU(InsNum) {
        this.changeClockSignal();
        console.log(InsNum);
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        this.changeClockSignal();
        console.log(InsNum);
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        for (let [key, value] of this._Memory.getAddedData()) {
            console.log(key, value);
        }
    }
    /**
     * run all the instructions stored in this model in one turn<br/>
     */
    runWhole() {
        let i = 0;
        do {
            this.oneClockCycle();
            console.log(i);
            console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
            console.log("The address of Memory is ", this._Memory.getTextAddress());
            console.log("The code is ", this._Memory.getTextOutpin());
            console.log(this.debugReg());
            i++;
            for (let [key, value] of this._Memory.getAddedData()) {
                console.log(key, value);
            }
        } while (!this._Memory.isEnd());
    }
    /**
     * get the binary string data of all the registers
     * @returns a array of 32 strings, each represents the data of a register
     */
    debugReg() {
        let regs = this._registerFile.getRegisters();
        let Regs = [];
        regs.forEach(reg => {
            Regs.push(reg.getOutPin32());
        });
        return Regs;
    }
    /**
     * store machine code into Instruction Memory
     * @param Ins the machine code that will be stored into instrucion memory
     */
    storeIns(Ins) {
        let pcPtr = StringHandle_1.bin2dec("00000000010000000000000000000000", true);
        Ins.forEach(In => {
            if (In.length != 32)
                throw new Error("Adding Instruction Length must be 32!");
            StringHandle_1.binaryDetect(In);
            this._Memory.addInsAt(In, pcPtr);
            this._insMemData.set(pcPtr, In);
            pcPtr = pcPtr + 4;
        });
    }
    /**
     * get all stored machine code
     * @returns all the machine code
     */
    getMachineCode() {
        return this.machCode;
    }
    /**
     * get the current pointed pc address
     * @returns
     */
    getCurrentInsAddr() {
        return this.currentInsAddr;
    }
    /**
     * get all static stored data
     * @returns an array of index data pair
     */
    getStaticData() {
        let StatData = new Array();
        for (let [key, value] of this._Memory.getStaticData()) {
            StatData.push([key, value]);
        }
        return StatData;
    }
    /**
     * get all dynamic stored data
     * @returns an array of index data pair
     */
    getDynamicData() {
        let DynamicData = new Array();
        for (let [key, value] of this._Memory.getAddedData()) {
            DynamicData.push([key, value]);
        }
        return DynamicData;
    }
    /**
     * Assemble the instructions into machine codes
     * @param Ins the instructions in the form of one string
     */
    Assemble(Ins) {
        let machCode = [];
        let assembler = Assembler_1.Assembler.getAssembler();
        assembler.setSources(Ins);
        if (assembler.preprocess()) {
            let wordMap = assembler.getMapForWord();
            let byteMap = assembler.getMapForByte();
            let asciiMap = assembler.getMapForAscii();
            if (wordMap.size != 0) {
                for (let key of wordMap.keys()) {
                    let tempNum = wordMap.get(key);
                    let datum = StringHandle_1.decToSignedBin32(tempNum);
                    this._Memory.storeWordStaticData([key, datum]);
                }
            }
            if (byteMap.size != 0) {
                for (let key of wordMap.keys()) {
                    let tempNum = byteMap.get(key);
                    let datum = StringHandle_1.decToSignedBin32(tempNum);
                    this._Memory.storeByteStaticData([key, datum.slice(24, 32)]);
                }
            }
            if (asciiMap.size != 0) {
                this.asciiString = asciiMap;
                for (let key of asciiMap.keys()) {
                    let tempChars = asciiMap.get(key);
                    let datum = "";
                    let currentAddr = +key;
                    for (let i = 0; i < tempChars.length; ++i) {
                        if (tempChars.charCodeAt(i) == 92) {
                            i++;
                            datum = StringHandle_1.decToSignedBin32(tempChars.charCodeAt(i));
                            if (tempChars.charAt(i) == 'n') {
                                datum = StringHandle_1.decToSignedBin32(10);
                            }
                            if (tempChars.charAt(i) == 'r') {
                                datum = StringHandle_1.decToSignedBin32(13);
                            }
                            if (tempChars.charAt(i) == 't') {
                                datum = StringHandle_1.decToSignedBin32(9);
                            }
                            if (tempChars.charAt(i) == 'b') {
                                datum = StringHandle_1.decToSignedBin32(8);
                            }
                            if (tempChars.charAt(i) == 'f') {
                                datum = StringHandle_1.decToSignedBin32(12);
                            }
                            if (tempChars.charAt(i) == 'v') {
                                datum = StringHandle_1.decToSignedBin32(11);
                            }
                            if (tempChars.charAt(i) == '0') {
                                datum = StringHandle_1.decToSignedBin32(0);
                            }
                            let newStr = asciiMap.get(key);
                            newStr = newStr.slice(0, i - 1) + String.fromCharCode(StringHandle_1.bin2dec(datum, true)) + newStr.slice(i + 1, newStr.length);
                            asciiMap.set(key, newStr);
                        }
                        else {
                            datum = StringHandle_1.decToSignedBin32(tempChars.charCodeAt(i));
                        }
                        this._Memory.storeByteStaticData([currentAddr + "", datum.slice(24, 32)]);
                        ++currentAddr;
                    }
                }
            }
            if (assembler.assemble()) {
                let i;
                let bin = new ArrayList_1.ArrayList(10);
                bin = assembler.getBin();
                for (i = 0; i < bin.size(); i++) {
                    machCode.push((bin.get(i).toString()));
                }
            }
            else {
                let excepReporter = ExceptionReporter_1.ExceptionReporter.getReporter();
                excepReporter.addException(assembler.getErrMsg());
                this.Errormsg = this.reportExceptions();
            }
        }
        else {
            let excepReporter = ExceptionReporter_1.ExceptionReporter.getReporter();
            excepReporter.addException(assembler.getErrMsg());
            this.Errormsg = this.reportExceptions();
        }
        this.storeIns(machCode);
        this.machCode = machCode;
    }
    /**
     * reset this CPU
     */
    resetAll() {
    }
}
exports.singleCycleCpu = singleCycleCpu;
//# sourceMappingURL=Single-CycleCPU.js.map