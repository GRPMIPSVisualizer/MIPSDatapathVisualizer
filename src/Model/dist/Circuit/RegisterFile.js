"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterFile = void 0;
const DMux4Way_1 = require("../Conponent/DMux4Way");
const DMux8Way_1 = require("../Conponent/DMux8Way");
const Mux32_1 = require("../Conponent/Mux32");
const Mux4Way32_1 = require("../Conponent/Mux4Way32");
const Mux8Way32_1 = require("../Conponent/Mux8Way32");
const BItsGenerator_1 = require("../Library/BItsGenerator");
const BooleanHandler_1 = require("../Library/BooleanHandler");
const StringHandle_1 = require("../Library/StringHandle");
const Register_1 = require("./Register");
const Signal_1 = require("./Signal");
const Wired_1 = require("./Wired");
/**
 * A register File is an array of 32 registers<br/>
 * This class is the abstract model of a real register file
 */
class RegisterFile extends Wired_1.Wired {
    /**
     * initialize all fields of this class
     */
    constructor() {
        super();
        /**
         * the data being read at this outPin
         */
        this.outDataA = "";
        /**
         * the data being read at this outPin
         */
        this.outDataB = "";
        /**
         * An array of 32 registers. The data is stored here
         */
        this.registers = new Array();
        this.readNumberA = BItsGenerator_1.init_bits(RegisterFile.bitWidth);
        this.readNumberB = BItsGenerator_1.init_bits(RegisterFile.bitWidth);
        this.writeNumber = BItsGenerator_1.init_bits(RegisterFile.bitWidth);
        this.writeData = BItsGenerator_1.init_bits(Math.pow(2, RegisterFile.bitWidth));
        this.clockSignal = new Signal_1.Signal(false);
        this.writeEnable = new Signal_1.Signal(false);
        this.WriteMux = new Mux32_1.Mux32(BItsGenerator_1.init_bits(32), BItsGenerator_1.init_bits(32), 0);
        for (let i = 0; i < Math.pow(2, RegisterFile.bitWidth); ++i) {
            this.registers[i] = new Register_1._32BitsRegister();
            // this.addWire(this.clockSignal,this.registers[i].getClockSignal());
        }
        this.registers[29].setInpin32(StringHandle_1.decToUnsignedBin32(2147479548));
        this.registers[29].changeClockSignal();
        this.registers[29].changeClockSignal();
        this.registers[28].setInpin32(StringHandle_1.decToUnsignedBin32(268468224));
        this.registers[28].changeClockSignal();
        this.registers[28].changeClockSignal();
        let data = new Array();
        this.registers.forEach(register => {
            data.push(register.getOutPin32());
        });
        this.outDataA = this.Mux32Way32(this.readNumberA, data);
        this.outDataB = this.Mux32Way32(this.readNumberB, data);
    }
    /**
     * Store data at the register indicates by index.<br/>
     * @param index the index of register that will store new data
     * @param datum the datum being stored
     */
    storeADataAt(index, datum) {
        this.registers[index].setInpin32(datum);
        this.registers[index].changeClockSignal();
        this.registers[index].changeClockSignal();
    }
    /**
     * get the outPinA
     * @returns the value of outPinA
     */
    getOutDataA() {
        return this.outDataA;
    }
    /**
     * get the outPinB
     * @returns the value of outPinB
     */
    getOutDataB() {
        return this.outDataB;
    }
    /**
     * set write enable signal
     * @param siganl the new signal
     */
    setWriteEnable(siganl) {
        this.writeEnable.setSignal(siganl);
        this.registerWrite();
    }
    /**
     * set data being written into register
     * @param data the data that will be stored in the register
     */
    setWriteData(data) {
        this.writeData = data;
        this.registerWrite();
    }
    /**
     * set register destination signal
     * @param signal the new signal
     */
    setRegDes(signal) {
        this.WriteMux.setSel(BooleanHandler_1.bool2num(signal));
        this.writeNumber = this.WriteMux.outPin32.slice(27, 32);
    }
    /**
     * change the value of clock signal
     */
    changeClockSignal() {
        this.clockSignal.changeSiganl();
        this.registers.forEach(register => {
            register.changeClockSignal();
        });
    }
    /**
     * set the value of clock signal
     * @param signal the new signal that will be assigned to clock signal
     */
    setClockSignal(signal) {
        this.clockSignal.setSignal(signal);
        this.registers.forEach(register => {
            register.setClockSignal(signal);
        });
    }
    /**
     * memory set the read number A and B's value
     * @param InsMem the Memory component that will change the value of read number
     */
    setInstructionCode(InsMem) {
        let InsCode = InsMem.getTextOutpin();
        if (InsCode.length != 32)
            throw Error("The length of Instruction code is not 32");
        StringHandle_1.binaryDetect(InsCode);
        this.readNumberA = StringHandle_1.bitsMapping(InsCode, 21, 26);
        this.readNumberB = StringHandle_1.bitsMapping(InsCode, 16, 21);
        this.setWriteNumber(StringHandle_1.bitsMapping(InsCode, 16, 21), StringHandle_1.bitsMapping(InsCode, 11, 16));
        this.registerRead();
    }
    /**
     * set two write index of mux
     * @param InpinA the first inpin
     * @param InpinB the second inpin
     */
    setWriteNumber(InpinA, InpinB) {
        this.WriteMux.setInpin32A("000000000000000000000000000" + InpinA);
        this.WriteMux.setInpin32B("000000000000000000000000000" + InpinB);
        this.writeNumber = this.WriteMux.outPin32.slice(27, 32);
    }
    /**
     * the logic of register read
     */
    registerRead() {
        let data = new Array();
        this.registers.forEach(register => {
            data.push(register.getOutPin32());
        });
        this.outDataA = this.Mux32Way32(this.readNumberA, data);
        this.outDataB = this.Mux32Way32(this.readNumberB, data);
    }
    /**
     * the logic of register write
     * @returns nothing
     */
    registerWrite() {
        this.registers.forEach(register => {
            register.resetInput();
        });
        // let clockSignals:number[] = this.DMux32Way(this.writeNumber,this.writeEnable);
        // this.registers.forEach(register=>{
        //     register.setClockSignal(num2bool(clockSignals.shift() as number));
        // });
        if (!this.writeEnable.getSignal())
            return;
        let index = StringHandle_1.bin2dec("000000000000000000000000000" + this.writeNumber, true);
        this.registers[index].setInpin32(this.writeData);
    }
    /**
     * mux32way32
     * @param index the 5-bits selector
     * @param data the 32 input data of mux32way32
     * @returns
     */
    Mux32Way32(index, data) {
        let Muxes = new Array();
        Muxes.push(Mux8Way32_1.Mux8Way32.Mux8Way32(data.slice(0, 8), index.slice(2, 5)));
        Muxes.push(Mux8Way32_1.Mux8Way32.Mux8Way32(data.slice(8, 16), index.slice(2, 5)));
        Muxes.push(Mux8Way32_1.Mux8Way32.Mux8Way32(data.slice(16, 24), index.slice(2, 5)));
        Muxes.push(Mux8Way32_1.Mux8Way32.Mux8Way32(data.slice(24, 32), index.slice(2, 5)));
        return StringHandle_1.intArrayToString(Mux4Way32_1.Mux4Way32.Mux4Way32(Muxes, StringHandle_1.stringToIntArray(index.slice(0, 2))));
    }
    DMux32Way(index, signal) {
        let clockSignal = signal.getSignal();
        let innerOut = DMux4Way_1.DMux4Way.DMux4Way(BooleanHandler_1.bool2num(clockSignal), StringHandle_1.stringToIntArray(index.slice(0, 2)));
        let out32 = new Array();
        for (let i = 0; i < 4; ++i) {
            out32.concat(DMux8Way_1.DMux8Way.DMux8Way(innerOut[i], StringHandle_1.stringToIntArray(index.slice(2, 5))));
        }
        return out32;
    }
    /**
     * get all the registers
     * @returns all registers
     */
    getRegisters() {
        return this.registers;
    }
    /**
     * get the write number
     * @returns a binary string represents write number
     */
    getWriteNumber() {
        return this.writeNumber;
    }
}
exports.RegisterFile = RegisterFile;
/**
 * the readNumber and writeNumber bitWidth
 */
RegisterFile.bitWidth = 5;
//# sourceMappingURL=RegisterFile.js.map