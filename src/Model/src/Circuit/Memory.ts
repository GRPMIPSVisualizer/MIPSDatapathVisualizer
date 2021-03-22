import { init_bits } from "../Library/BItsGenerator";
import { bin2dec, binaryDetect, decToUnsignedBin32, lengthDetect, stringToIntArray } from "../Library/StringHandle";
import { Signal, signalType } from "./Signal";
/**
 * This class is an abstract model of real Memory component<br/>
 * A memory has two parts. The first part is instruction memory, the second part is data memory.
 */
export class Memory{
    /**
     * when the {@link textOutpin} changes,all the notifying function stored in this array will be called.
     */
    private notifyFuncText:Function[] = new Array<Function>();
    /**
     * when the {@link outPin32} changes, all the  notifying function stored in this array will be called.
     */
    private notifyFuncData:Function[] = new Array<Function>();
    /**
     * the data will be stored in this array in the form of 32 bits binary string
     */
    private MemoryArray:string[];
    /**
     * the size(storage) of this memory
     */
    private MemorySize:number;
    /**
     * the address Pin of instruction memory
     */
    private addressPin:string;
    /**
     * the data inPin of data memory
     */
    private inPin32:string;
    /**
     * the outPin of data memory
     */
    private outPin32:string|undefined;

    /**
     * the signal indicates read
     */
    private readSignal:Signal = new Signal(false);
    /**
     * the signal indicates write
     */
    private writeSignal:Signal = new Signal(false);
    /**
     * the clock signal of this memory
     */
    private clockSignal:Signal = new Signal(false);

    /**
     * the address of instruction memory
     */
    private textReadAddress:string;
    /**
     * the outPin of the instruction Memory
     */
    private textOutpin:string;
    /**
     * the added data
     */
    private addedData:Map<string,string> = new Map();
    /**
     * the static data being added to this memory
     */
    private staticData:Map<string,string> = new Map();

    /**
     * the constructor initialize all the fields
     * @param MemorySize the size of this memory
     */
    constructor(MemorySize:number = Math.pow(2,30)){
        this.MemorySize = MemorySize;
        this.MemoryArray = new Array<string>(MemorySize);
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
    public getMemorySize():number{
        return this.MemorySize;
    }

    /**
     * add new instruction at designated address
     * @param data the data that will be added to the memory
     * @param addr the address of this added instruction
     * @returns the added data.
     */
    public addInsAt(data:string,addr:number):string{
        if ((addr % 4) != 0)
            throw Error("The Instruction Address must be multiple of 4!");

        if (addr >= Math.pow(16,7) || addr < 4*Math.pow(16,5))
            throw Error("Instruction Index Cross 0x1000,0000 or below 0x 0040,0000");
        let retIns:string = this.MemoryArray[addr/4];
        this.MemoryArray[addr/4] = data;
        return retIns;
    }

    /**
     * set the address of added data
     * @param newAddr the address that will be set
     */
    public setDataAddress(newAddr:string):void{
        this.addressPin = newAddr;
        this.judgeReadCondition();
    }

    /**
     * get the current address of instruction
     * @returns the value of current address of instruction
     */
    public getTextAddress():string{
        return this.textReadAddress;
    }
    /**
     * set the current address of instruction
     * @param newAddr the text address that will be set
     */
    public setTextAddress(newAddr:string):void{
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
    public setInpin32(newInpin:string):void{
        if (this.inPin32 == newInpin)
            return;
        this.dataFormatDetect(newInpin);
        this.inPin32 = newInpin;
    }

    /**
     * get the machine code pointed by current instruction address
     * @returns the machine code pointed by current instruction address
     */
    public getTextOutpin():string{
        if (this.textOutpin == undefined)
            return init_bits(32);
        return this.textOutpin;
    }

    /**
     * whether the current instruction address is pointed at the end of instruction memory
     * @returns a boolean value indicates whether the current instruction address is pointed at the end of instruction memory
     */
    public isEnd():boolean{
        if (this.textOutpin == undefined)
            return true;
        return false;
    }

    /**
     * detect whether the input value is in correct format
     * @param binData the data that should be detected
     */
    private dataFormatDetect(binData:string):void{
        if (binData.length != 32)
            throw Error("The length of data in memory is not 32 bits");
        binaryDetect(binData);
    }

    /**
     * read data at designated index
     * @param binIndex the index in binary form
     * @returns the data at designated index
     */
    private readDataAt(binIndex:string):string{
        return this.MemoryArray[Math.floor(bin2dec(this.textReadAddress,true)/4)];
    }

    /**
     * the logic if read data
     */
    private readData():void{
        let address:number = bin2dec(this.addressPin,true);
        let data1:string = this.MemoryArray[Math.floor(address / 4)];
        let data2:string = this.MemoryArray[Math.floor(address / 4)+1];
        if (data2 == undefined){
            data2 = init_bits(32);
        }

        this.setOutPin32(data1.slice(8*(address % 4)) + data2.slice(0,(address % 4)));
    }
    /**
     * the logic of write data
     */
    private writeData():void{
        let address:number = bin2dec(this.addressPin,true);
        let data1:string = this.MemoryArray[Math.floor(address / 4)];
        let data2:string = this.MemoryArray[Math.floor(address / 4)+1];
        let has2:boolean = (address % 4 == 0)?false:true;

        if(data1 == undefined){
            data1 = init_bits(32);
        }

        if(data2 == undefined){
            data2 = init_bits(32);
        }
        
        data1 = data1.slice(0,8*(address % 4)) + this.inPin32.slice(0,8*(4 - (address % 4)));
        data2 = this.inPin32.slice(8*(4 - (address % 4))) + data2.slice(8*(address % 4));
        this.MemoryArray[Math.floor(address / 4)] = data1;
        if (has2){
            this.MemoryArray[Math.floor(address / 4)+1] = data2;
            this.addedData.set(decToUnsignedBin32(Math.floor(address / 4)*4),data1);
            this.addedData.set(decToUnsignedBin32(Math.floor(address / 4)*4+4),data2);
        }else{
            this.addedData.set(this.addressPin,this.inPin32);
        }
    }

    /**
     * change the clock signal of this memory
     */
    public clockSiganlChange():void{
        this.clockSignal.changeSiganl();
        this.dataReact();
    }

    /**
     * set the clock signal of this memory
     * @param signal the new signal that will be assigned to clock signal of the memory
     * @returns nothing
     */
    public setclockSiganl(signal:signalType):void{
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
    private isSignalSame(signal:signalType):boolean{
        if (this.clockSignal.getSignal() == signal)
            return true;
        return false;
    }

    /**
     * the logic if react to data changes
     * @returns 
     */
    private dataReact():void{
        if (this.writeSignal.getSignal() && this.readSignal.getSignal()){
            throw Error("Memory can't be read and write at the same time!");
        }

        if (this.writeSignal.getSignal()){
            if (this.clockSignal.getSignal() == true)
                return;
            this.writeData();
        }

        this.judgeReadCondition();
    }

    /**
     * call all the notifying instruction change functions stored
     */
    private notifychange():void{
        this.notifyFuncText.forEach(FuncText=>{
                FuncText();
            }
        )
    }

    /**
     * add a new instruction memory change notifying function
     * @param newFunc the new instruction notifying function that will be added.
     */
    public addTextNotifyFunc(newFunc:Function):void{
        this.notifyFuncText.push(newFunc);
    }

    
    /**
     * call all the notifying data memory change functions stored
     */
    private dataChange():void{
        this.notifyFuncData.forEach(FuncData=>{
            FuncData();
        })
    }

    /**
     * add a new data memory change notifying function
     * @param newFunc the new data memory change notifying function that will be added.
     */
    public addDataNotifyFunc(newFunc:Function):void{
        this.notifyFuncData.push(newFunc);
    }
    
    /**
     * set the outPin32
     * @param newOutPin32 the binary sring that will be assigned to {@link outPin32}
     * @returns nothing
     */
    private setOutPin32(newOutPin32:string|undefined):void{
        this.outPin32 = newOutPin32;
        if (newOutPin32 == undefined)
            return;
        this.dataChange();
    }

    /**
     * get {@link outPin32}
     * @returns the value of {@link outPin32}
     */
    public getOutPin32():string|undefined{
        return this.outPin32;
    }

    /**
     * set {@link readSignal} and {@link writeSignal}
     * @param ReadEn the new {@link readSignal} that will be set
     * @param WriteEn the new {@link writeSignal} that will be set
     */
    public setReadWriteEnable(ReadEn:boolean,WriteEn:boolean){
        this.readSignal.setSignal(ReadEn);
        this.judgeReadCondition();
        this.writeSignal.setSignal(WriteEn);
        this.dataChange();
    }

    /**
     * judge whether the memory meets the conditions of read data
     */
    private judgeReadCondition():void{
        if (this.readSignal.getSignal()){
            this.readData();
        }else{
            this.setOutPin32(undefined);
        }
    }

    /**
     * get all added data in the memory
     * @returns a map of address data pair
     */
    public getAddedData():Map<string,string>{
        return this.addedData;
    }

    /**
     * store static data in the form of a word
     * @param datum the 32 bits static data that will be stored in the memory
     */
    public storeWordStaticData(datum:[string,string]):void{
        let staticDataIndex:number = +datum[0]/4;
        this.staticData.set(decToUnsignedBin32(+datum[0]),datum[1]);
        this.MemoryArray[staticDataIndex] = datum[1];
    }

    /**
     * store static data in the form of a byte
     * @param datum the 8 bits static data that will be stored in the memory
     */
    public storeByteStaticData(datum:[string,string]):void{
        let staticDataIndex:number = Math.floor(+datum[0]/4);
        let position:number = +datum[0] % 4;
        let data1:string = this.MemoryArray[staticDataIndex];
        if(data1 == undefined){
            data1 = init_bits(32);
        }
        
        data1 = data1.slice(0,8*(3-position)) + datum[1] + data1.slice(8*(3-position)+8,32);
        this.MemoryArray[staticDataIndex] = data1;
        this.staticData.set(decToUnsignedBin32(staticDataIndex*4),data1);
    }

    /**
     * get all stored static data.
     * @returns a map of address data pair
     */
    public getStaticData():Map<string,string>{
        return this.staticData;
    }

    /**
     * get 8 bits character
     * @param addr the address of that char
     * @returns the char.
     */
    public CharAt(addr:number):string{
        let rtn:string|undefined = this.MemoryArray[Math.floor(addr/4)];
        let position:number = addr % 4;
        if (rtn == undefined){
            rtn = init_bits(32);
        }
        rtn = rtn.slice(position*8,position*8+8);
        return rtn;
    }
}