"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Memory = void 0;
const BItsGenerator_1 = require("../Library/BItsGenerator");
const StringHandle_1 = require("../Library/StringHandle");
const Signal_1 = require("./Signal");
class Memory {
    constructor(MemorySize = Math.pow(2, 30)) {
        this.notifyFuncText = new Array();
        this.notifyFuncData = new Array();
        this.readSignal = new Signal_1.Signal(false);
        this.writeSignal = new Signal_1.Signal(false);
        this.clockSignal = new Signal_1.Signal(false);
        this.addedData = new Map();
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
    getMemorySize() {
        return this.MemorySize;
    }
    addInsAt(data, addr) {
        if ((addr % 4) != 0)
            throw Error("The Instruction Address must be multiple of 4!");
        if (addr >= Math.pow(16, 7) || addr < 4 * Math.pow(16, 5))
            throw Error("Instruction Index Cross 0x1000,0000 or below 0x 0040,0000");
        let retIns = this.MemoryArray[addr / 4];
        this.MemoryArray[addr / 4] = data;
        return retIns;
    }
    setDataAddress(newAddr) {
        this.addressPin = newAddr;
        this.judgeReadCondition();
    }
    getTextAddress() {
        return this.textReadAddress;
    }
    setTextAddress(newAddr) {
        this.dataFormatDetect(newAddr);
        this.textReadAddress = newAddr;
        this.textOutpin = this.readDataAt(this.textReadAddress);
        this.notifychange();
    }
    setInpin32(newInpin) {
        if (this.inPin32 == newInpin)
            return;
        this.dataFormatDetect(newInpin);
        this.inPin32 = newInpin;
    }
    getTextOutpin() {
        if (this.textOutpin == undefined)
            return BItsGenerator_1.init_bits(32);
        return this.textOutpin;
    }
    isEnd() {
        if (this.textOutpin == undefined)
            return true;
        return false;
    }
    dataFormatDetect(binData) {
        if (binData.length != 32)
            throw Error("The length of data in memory is not 32 bits");
        StringHandle_1.binaryDetect(binData);
    }
    readDataAt(binIndex) {
        return this.MemoryArray[Math.floor(StringHandle_1.bin2dec(this.textReadAddress, true) / 4)];
    }
    readData() {
        let address = StringHandle_1.bin2dec(this.addressPin, true);
        let data1 = this.MemoryArray[Math.floor(address / 4)];
        let data2 = this.MemoryArray[Math.floor(address / 4) + 1];
        this.setOutPin32(data1.slice(8 * (address % 4)) + data2.slice(0, (address % 4)));
    }
    writeData() {
        let address = StringHandle_1.bin2dec(this.addressPin, true);
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
    clockSiganlChange() {
        this.clockSignal.changeSiganl();
        this.dataReact();
    }
    setclockSiganl(signal) {
        if (this.isSignalSame(signal))
            return;
        this.clockSignal.setSignal(signal);
        this.dataReact();
    }
    isSignalSame(signal) {
        if (this.clockSignal.getSignal() == signal)
            return true;
        return false;
    }
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
    notifychange() {
        this.notifyFuncText.forEach(FuncText => {
            FuncText();
        });
    }
    addTextNotifyFunc(newFunc) {
        this.notifyFuncText.push(newFunc);
    }
    dataChange() {
        this.notifyFuncData.forEach(FuncData => {
            FuncData();
        });
    }
    addDataNotifyFunc(newFunc) {
        this.notifyFuncData.push(newFunc);
    }
    setOutPin32(newOutPin32) {
        this.outPin32 = newOutPin32;
        if (newOutPin32 == undefined)
            return;
        this.dataChange();
    }
    getOutPin32() {
        return this.outPin32;
    }
    setReadWriteEnable(ReadEn, WriteEn) {
        this.readSignal.setSignal(ReadEn);
        this.judgeReadCondition();
        this.writeSignal.setSignal(WriteEn);
        this.dataChange();
    }
    judgeReadCondition() {
        if (this.readSignal.getSignal()) {
            this.readData();
        }
        else {
            this.setOutPin32(undefined);
        }
    }
    getAddedData() {
        return this.addedData;
    }
    storeWordStaticData(datum) {
        let staticDataIndex = +datum[0] / 4;
        this.staticData.set(StringHandle_1.decToUnsignedBin32(+datum[0]), datum[1]);
        this.MemoryArray[staticDataIndex] = datum[1];
    }
    storeByteStaticData(datum) {
        let staticDataIndex = Math.floor(+datum[0] / 4);
        let position = +datum[0] % 4;
        let data1 = this.MemoryArray[staticDataIndex];
        if (data1 == undefined) {
            data1 = BItsGenerator_1.init_bits(32);
        }
        data1 = data1.slice(0, 8 * (3 - position)) + datum + data1.slice(8 * (3 - position) + 8, 32);
        this.MemoryArray[staticDataIndex] = data1;
        this.staticData.set(StringHandle_1.decToUnsignedBin32(staticDataIndex * 4), data1);
    }
    getStaticData() {
        return this.staticData;
    }
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