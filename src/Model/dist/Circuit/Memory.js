"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Memory = void 0;
const BItsGenerator_1 = require("../Library/BItsGenerator");
const StringHandle_1 = require("../Library/StringHandle");
const ExceptionReporter_1 = require("./ExceptionReporter");
const Signal_1 = require("./Signal");
/**
 * This class is an abstract model of real Memory component<br/>
 * A memory has two parts. The first part is instruction memory, the second part is data memory.
 */
class Memory {
    /**
     * the constructor initialize all the fields
     * @param MemorySize the size of this memory
     */
    constructor(MemorySize = Math.pow(2, 30)) {
        /**
         * when the {@link textOutpin} changes,all the notifying function stored in this array will be called.
         */
        this.notifyFuncText = new Array();
        /**
         * when the {@link outPin32} changes, all the  notifying function stored in this array will be called.
         */
        this.notifyFuncData = new Array();
        /**
         * the signal indicates read
         */
        this.readSignal = new Signal_1.Signal(false);
        /**
         * the signal indicates write
         */
        this.writeSignal = new Signal_1.Signal(false);
        /**
         * the clock signal of this memory
         */
        this.clockSignal = new Signal_1.Signal(false);
        /**
         * the added data
         */
        this.addedData = new Map();
        /**
         * the static data being added to this memory
         */
        this.staticData = new Map();
        this.MemorySize = MemorySize;
        this.MemoryArray = new Array(MemorySize);
        this.addressPin = "00000000000000000000000000000000";
        this.inPin32 = "00000000000000000000000000000000";
        this.outPin32 = undefined;
        // default = 0x00400000;
        this.textReadAddress = "00000000010000000000000000000000";
        this.textOutpin = this.readDataAt(this.textReadAddress);
    }
    /**
     * get the size of memory
     * @returns the size of memory
     */
    getMemorySize() {
        return this.MemorySize;
    }
    /**
     * add new instruction at designated address
     * @param data the data that will be added to the memory
     * @param addr the address of this added instruction
     * @returns the added data.
     */
    addInsAt(data, addr) {
        if ((addr % 4) != 0)
            throw Error("The Instruction Address must be multiple of 4!");
        if (addr >= Math.pow(16, 7) || addr < 4 * Math.pow(16, 5))
            throw Error("Instruction Index Cross 0x1000,0000 or below 0x 0040,0000");
        let retIns = this.MemoryArray[addr / 4];
        this.MemoryArray[addr / 4] = data;
        return retIns;
    }
    /**
     * set the address of added data
     * @param newAddr the address that will be set
     */
    setDataAddress(newAddr) {
        this.addressPin = newAddr;
        this.judgeReadCondition();
    }
    /**
     * get the current address of instruction
     * @returns the value of current address of instruction
     */
    getTextAddress() {
        return this.textReadAddress;
    }
    /**
     * set the current address of instruction
     * @param newAddr the text address that will be set
     */
    setTextAddress(newAddr) {
        this.dataFormatDetect(newAddr);
        this.textReadAddress = newAddr;
        this.textOutpin = this.readDataAt(this.textReadAddress);
        this.notifychange();
    }
    /**
     * set the data memory inPin32
     * @param newInpin the new binary value that will be assigned to inPin32
     * @returns nothing
     */
    setInpin32(newInpin) {
        if (this.inPin32 == newInpin)
            return;
        this.dataFormatDetect(newInpin);
        this.inPin32 = newInpin;
    }
    /**
     * get the machine code pointed by current instruction address
     * @returns the machine code pointed by current instruction address
     */
    getTextOutpin() {
        if (this.textOutpin == undefined)
            return BItsGenerator_1.init_bits(32);
        return this.textOutpin;
    }
    /**
     * whether the current instruction address is pointed at the end of instruction memory
     * @returns a boolean value indicates whether the current instruction address is pointed at the end of instruction memory
     */
    isEnd() {
        if (this.textOutpin == undefined)
            return true;
        return false;
    }
    /**
     * detect whether the input value is in correct format
     * @param binData the data that should be detected
     */
    dataFormatDetect(binData) {
        if (binData.length != 32)
            throw Error("The length of data in memory is not 32 bits");
        StringHandle_1.binaryDetect(binData);
    }
    /**
     * read data at designated index
     * @param binIndex the index in binary form
     * @returns the data at designated index
     */
    readDataAt(binIndex) {
        return this.MemoryArray[Math.floor(StringHandle_1.bin2dec(this.textReadAddress, true) / 4)];
    }
    /**
     * the logic if read data
     */
    readData() {
        let address = StringHandle_1.bin2dec(this.addressPin, true);
        if (this.outOfRangeException(address)) {
            return;
        }
        let data1 = this.MemoryArray[Math.floor(address / 4)];
        let data2 = this.MemoryArray[Math.floor(address / 4) + 1];
        if (data1 == undefined) {
            data1 = BItsGenerator_1.init_bits(32);
        }
        if (data2 == undefined) {
            data2 = BItsGenerator_1.init_bits(32);
        }
        this.setOutPin32(data1.slice(8 * (address % 4)) + data2.slice(0, (address % 4)));
    }
    /**
     * the logic of write data
     */
    writeData() {
        let address = StringHandle_1.bin2dec(this.addressPin, true);
        if (this.outOfRangeException(address)) {
            return;
        }
        let data1 = this.MemoryArray[Math.floor(address / 4)];
        let data2 = this.MemoryArray[Math.floor(address / 4) + 1];
        let has2 = (address % 4 == 0) ? false : true;
        if (data1 == undefined) {
            data1 = BItsGenerator_1.init_bits(32);
        }
        if (data2 == undefined) {
            data2 = BItsGenerator_1.init_bits(32);
        }
        data1 = data1.slice(0, 8 * (address % 4)) + this.inPin32.slice(0, 8 * (4 - (address % 4)));
        data2 = this.inPin32.slice(8 * (4 - (address % 4))) + data2.slice(8 * (address % 4));
        this.MemoryArray[Math.floor(address / 4)] = data1;
        if (has2) {
            this.MemoryArray[Math.floor(address / 4) + 1] = data2;
            this.addedData.set(StringHandle_1.decToUnsignedBin32(Math.floor(address / 4) * 4), data1);
            this.addedData.set(StringHandle_1.decToUnsignedBin32(Math.floor(address / 4) * 4 + 4), data2);
        }
        else {
            this.addedData.set(this.addressPin, this.inPin32);
        }
    }
    /**
     * change the clock signal of this memory
     */
    clockSiganlChange() {
        this.clockSignal.changeSiganl();
        this.dataReact();
    }
    /**
     * report out of range exceptions
     * @param addr the accessing address
     * @returns boolean value indicates whether the accessed address is out of range.
     */
    outOfRangeException(addr) {
        if (addr < 268435456 || addr > 2147483644) {
            let reporter = ExceptionReporter_1.ExceptionReporter.getReporter();
            reporter.addException("Memory: access memory out of range!");
            return true;
        }
        return false;
    }
    /**
     * set the clock signal of this memory
     * @param signal the new signal that will be assigned to clock signal of the memory
     * @returns nothing
     */
    setclockSiganl(signal) {
        if (this.isSignalSame(signal))
            return;
        this.clockSignal.setSignal(signal);
        this.dataReact();
    }
    /**
     * if the signal does not change,return true,false otherwise
     * @param signal the signal that will be detect changes
     * @returns a boolean value indicates whether the input signal changes
     */
    isSignalSame(signal) {
        if (this.clockSignal.getSignal() == signal)
            return true;
        return false;
    }
    /**
     * the logic if react to data changes
     * @returns
     */
    dataReact() {
        if (this.writeSignal.getSignal() && this.readSignal.getSignal()) {
            throw Error("Memory can't be read and write at the same time!");
        }
        if (this.writeSignal.getSignal()) {
            if (this.clockSignal.getSignal() == true)
                return;
            this.writeData();
        }
        this.judgeReadCondition();
    }
    /**
     * call all the notifying instruction change functions stored
     */
    notifychange() {
        this.notifyFuncText.forEach(FuncText => {
            FuncText();
        });
    }
    /**
     * add a new instruction memory change notifying function
     * @param newFunc the new instruction notifying function that will be added.
     */
    addTextNotifyFunc(newFunc) {
        this.notifyFuncText.push(newFunc);
    }
    /**
     * call all the notifying data memory change functions stored
     */
    dataChange() {
        this.notifyFuncData.forEach(FuncData => {
            FuncData();
        });
    }
    /**
     * add a new data memory change notifying function
     * @param newFunc the new data memory change notifying function that will be added.
     */
    addDataNotifyFunc(newFunc) {
        this.notifyFuncData.push(newFunc);
    }
    /**
     * set the outPin32
     * @param newOutPin32 the binary sring that will be assigned to {@link outPin32}
     * @returns nothing
     */
    setOutPin32(newOutPin32) {
        this.outPin32 = newOutPin32;
        if (newOutPin32 == undefined)
            return;
        this.dataChange();
    }
    /**
     * get {@link outPin32}
     * @returns the value of {@link outPin32}
     */
    getOutPin32() {
        return this.outPin32;
    }
    /**
     * set {@link readSignal} and {@link writeSignal}
     * @param ReadEn the new {@link readSignal} that will be set
     * @param WriteEn the new {@link writeSignal} that will be set
     */
    setReadWriteEnable(ReadEn, WriteEn) {
        this.readSignal.setSignal(ReadEn);
        this.judgeReadCondition();
        this.writeSignal.setSignal(WriteEn);
        this.dataChange();
    }
    /**
     * judge whether the memory meets the conditions of read data
     */
    judgeReadCondition() {
        if (this.readSignal.getSignal()) {
            this.readData();
        }
        else {
            this.setOutPin32(undefined);
        }
    }
    /**
     * get all added data in the memory
     * @returns a map of address data pair
     */
    getAddedData() {
        return this.addedData;
    }
    /**
     * store static data in the form of a word
     * @param datum the 32 bits static data that will be stored in the memory
     */
    storeWordStaticData(datum) {
        let staticDataIndex = +datum[0] / 4;
        this.staticData.set(StringHandle_1.decToUnsignedBin32(+datum[0]), datum[1]);
        this.MemoryArray[staticDataIndex] = datum[1];
    }
    /**
     * store static data in the form of a byte
     * @param datum the 8 bits static data that will be stored in the memory
     */
    storeByteStaticData(datum) {
        let staticDataIndex = Math.floor(+datum[0] / 4);
        let position = +datum[0] % 4;
        let data1 = this.MemoryArray[staticDataIndex];
        if (data1 == undefined) {
            data1 = BItsGenerator_1.init_bits(32);
        }
        data1 = data1.slice(0, 8 * (3 - position)) + datum[1] + data1.slice(8 * (3 - position) + 8, 32);
        this.MemoryArray[staticDataIndex] = data1;
        this.staticData.set(StringHandle_1.decToUnsignedBin32(staticDataIndex * 4), data1);
    }
    /**
     * get all stored static data.
     * @returns a map of address data pair
     */
    getStaticData() {
        return this.staticData;
    }
    /**
     * get 8 bits character
     * @param addr the address of that char
     * @returns the char.
     */
    CharAt(addr) {
        let rtn = this.MemoryArray[Math.floor(addr / 4)];
        let position = addr % 4;
        if (rtn == undefined) {
            rtn = BItsGenerator_1.init_bits(32);
        }
        rtn = rtn.slice(position * 8, position * 8 + 8);
        return rtn;
    }
}
exports.Memory = Memory;
//# sourceMappingURL=Memory.js.map