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
class PC extends Register_1._32BitsRegister {
    constructor(InsMem, PCAdder) {
        super();
        this.InstructionMem = InsMem;
        this.setInpin32(InsMem.getTextAddress());
        this.PCAdder = PCAdder;
        this.oneClockCycle();
    }
    oneClockCycle() {
        if (this.getClockSignal().getSignal()) {
            throw Error("One clock should start from false");
        }
        this.setClockSignal(true);
        this.setClockSignal(false);
    }
    muxChange(MUX) {
        this.setInpin32(MUX.outPin32);
    }
    setOutpin32() {
        super.setOutpin32();
        this.InstructionMem.setTextAddress(this.getOutPin32());
        this.PCAdder.newInPin(StringHandle_1.stringToIntArray(this.getOutPin32()), StringHandle_1.stringToIntArray(StringHandle_1.decToUnsignedBin32(4)));
    }
}
class PCAdder extends Adder_1.Adder {
    constructor(ALUAdder, MUX) {
        super(StringHandle_1.decToUnsignedBin32(0), StringHandle_1.decToUnsignedBin32(4));
        this.ALUAdder = ALUAdder;
        this.MUX = MUX;
    }
    connectConponents(ALUAdder, Mux) {
        this.ALUAdder = ALUAdder;
        this.MUX = Mux;
    }
    newInPin(inSignalA, inSignalB) {
        super.newInPin(inSignalA, inSignalB);
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
class ALUAdder extends Adder_1.Adder {
    constructor(inSignalA, inSignalB, MUX) {
        super(inSignalA, inSignalB);
        this.MUX1 = MUX;
    }
    setOutpin32() {
        this.outPin32 = StringHandle_1.intArrayToString(this.Adder32(StringHandle_1.stringToIntArray(this.inPin32A), StringHandle_1.stringToIntArray(this.inPin32B)));
        this.MUX1.setInpin32B(this.outPin32);
    }
    setInpinA(binBits) {
        if (binBits.length != 32)
            throw Error("The length of ALU Adder Input A is not 32");
        StringHandle_1.binaryDetect(binBits);
        this.inPin32A = binBits;
        this.setOutpin32();
    }
    setInpinB(binBits) {
        if (binBits.length != 32)
            throw Error("The length of ALU Adder Input B is not 32");
        StringHandle_1.binaryDetect(binBits);
        this.inPin32B = binBits;
        this.setOutpin32();
    }
}
class ConSignExtend extends Sign_extend_1.SignExtend {
    constructor(ALUResultAdder, ALUMux) {
        super();
        this.ALUResultAdder = ALUResultAdder;
        this.ALUInpinBMux = ALUMux;
    }
    setInPin16(inPin, ALUOp) {
        super.setInPin16(inPin, ALUOp);
        let shiftedInput = StringHandle_1.shiftLeftBinary32Bits(this.getOutPin32());
        this.ALUResultAdder.setInpinB(shiftedInput);
        this.ALUInpinBMux.setInpin32B(this.getOutPin32());
    }
    memSetInpin16(Mem, con) {
        this.opCode = Mem.getTextOutpin().slice(0, 6);
        this.setInPin16(StringHandle_1.bitsMapping(Mem.getTextOutpin(), 0, 16), con.getALUOp());
    }
}
class conALUControl extends ControlUnits_1.ALUControl {
    constructor(ALU) {
        super(ALU);
        this.reportOverflow = false;
    }
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
    setALUOp(controlUnits) {
        super.setALUOp(controlUnits);
        this.ALU.setControlBits(this.getOperationCode());
    }
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
    setBne(ben) {
        this.ALU.bne = ben;
    }
    setALUReportOverflow() {
        this.ALU.setReportOverflow(this.reportOverflow);
    }
}
class conRegisterFile extends RegisterFile_1.RegisterFile {
    constructor(ALU, aluInpinBMux, dataMem) {
        super();
        this.ALU = ALU;
        this.ALUInpinBMUX = aluInpinBMux;
        this.DataMemory = dataMem;
    }
    registerRead() {
        super.registerRead();
        this.ALU.setInpinA(this.getOutDataA());
        this.ALUInpinBMUX.setInpin32A(this.getOutDataB());
        this.DataMemory.setInpin32(this.getOutDataB());
    }
    setMuxWriteData(MemMux) {
        this.setWriteData(MemMux.outPin32);
    }
}
class ZeroAnd extends AND_1.AND {
    constructor(MuxA) {
        super(0, 0);
        this.MuxA = MuxA;
    }
    setInpinA(inpin) {
        this.pin1 = BooleanHandler_1.bool2num(inpin);
        this.setOutpin();
    }
    setInpinB(inpin) {
        this.pin2 = BooleanHandler_1.bool2num(inpin);
        this.setOutpin();
    }
    setOutpin() {
        this.outpin = AND_1.AND.And(this.pin1, this.pin2);
        this.MuxA.setSel(this.outpin);
    }
}
class conALU extends ALU_1.ALU {
    constructor(dataMem, MemMux, zeroAnd) {
        super(StringHandle_1.decToUnsignedBin32(0), StringHandle_1.decToUnsignedBin32(0), "0000");
        this.dataMemory = dataMem;
        this.MemoryMux = MemMux;
        this.zeroAnd = zeroAnd;
    }
    detectZero() {
        super.detectZero();
        if (this.bne) {
            this.isZero = !this.isZero;
        }
        this.zeroAnd.setInpinB(this.isZero);
    }
    setOutPin(outPin) {
        super.setOutPin(outPin);
        this.dataMemory.setDataAddress(this.getOutPin32());
        this.MemoryMux.setInpin32A(this.getOutPin32());
    }
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
class ConControlUnits extends ControlUnits_1.ControlUnits {
    // private bi
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
class singleCycleCpu {
    constructor() {
        this.MUXA = new Mux32_1.Mux32(StringHandle_1.decToUnsignedBin32(0), StringHandle_1.decToUnsignedBin32(0), 0);
        this.MUXB = new Mux32_1.Mux32(StringHandle_1.decToUnsignedBin32(0), StringHandle_1.decToUnsignedBin32(0), 0);
        this.ALUMUX = new Mux32_1.Mux32(StringHandle_1.decToUnsignedBin32(0), StringHandle_1.decToUnsignedBin32(0), 0);
        this.MemMUX = new Mux32_1.Mux32(StringHandle_1.decToUnsignedBin32(0), StringHandle_1.decToUnsignedBin32(0), 0);
        this._zeroAnd = new ZeroAnd(this.MUXA);
        this.ALUADD = new ALUAdder(StringHandle_1.decToUnsignedBin32(0), StringHandle_1.decToUnsignedBin32(0), this.MUXA);
        this._PCAdder = new PCAdder(this.ALUADD, this.MUXA);
        this._Memory = new Memory_1.Memory();
        this._PC = new PC(this._Memory, this._PCAdder);
        this._signExtend = new ConSignExtend(this.ALUADD, this.ALUMUX);
        this._alu = new conALU(this._Memory, this.MemMUX, this._zeroAnd);
        this._aluControl = new conALUControl(this._alu);
        this._registerFile = new conRegisterFile(this._alu, this.ALUMUX, this._Memory);
        this._controlUnits = new ConControlUnits(this._registerFile, this._aluControl, this.MUXB, this.ALUMUX, this._zeroAnd, this.MemMUX, this._Memory);
        this.clockSignal = new Signal_1.Signal(false);
        this._insMemData = new Map();
        this.machCode = [];
        this.currentInsAddr = BItsGenerator_1.init_bits(32);
        this.asciiString = new Map();
        this.StdOut = "";
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
    changeClockSignal() {
        this.clockSignal.changeSiganl();
        this._Memory.clockSiganlChange();
        this._registerFile.changeClockSignal();
        this._PC.changeClockSignal();
        // this._PC.changeClockSignal();
        // this._registerFile.changeClockSignal();
        // this._Memory.clockSiganlChange();
    }
    setClockSignal(signal) {
        if (this.clockSignal.getSignal() == signal)
            return;
        this.setClockSignal(signal);
        this._Memory.setclockSiganl(signal);
        this._registerFile.setClockSignal(signal);
        this._PC.setClockSignal(signal);
    }
    syscall() {
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
                this.StdOut = print_str;
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
    readFromConsole(readCode) {
        // 你们来写，把用户输入在console上的东西作为一个string返回
        return "";
    }
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
        this.Errormsg = this.reportExceptions();
        this.changeClockSignal();
    }
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
    debugReg() {
        let regs = this._registerFile.getRegisters();
        let Regs = [];
        regs.forEach(reg => {
            Regs.push(reg.getOutPin32());
        });
        return Regs;
    }
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
    getMachineCode() {
        return this.machCode;
    }
    getCurrentInsAddr() {
        return this.currentInsAddr;
    }
    getStaticData() {
        let StatData = new Array();
        for (let [key, value] of this._Memory.getStaticData()) {
            StatData.push([key, value]);
        }
        return StatData;
    }
    getDynamicData() {
        let DynamicData = new Array();
        for (let [key, value] of this._Memory.getAddedData()) {
            DynamicData.push([key, value]);
        }
        return DynamicData;
    }
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
                        datum = StringHandle_1.decToSignedBin32(tempChars.charCodeAt(i));
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
    resetAll() {
    }
}
exports.singleCycleCpu = singleCycleCpu;
//# sourceMappingURL=Single-CycleCPU.js.map