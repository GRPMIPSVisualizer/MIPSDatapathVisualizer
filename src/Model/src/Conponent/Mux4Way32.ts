import {Mux32} from "./Mux32"
import {stringToIntArray,intArrayToString} from "../Library/StringHandle"
/**
 * This is the 4-way 32bits Multiplexer in the cpu circuits<br/>
 * The class simulates how 32bits Multiplexer works and fulfills some basic function of it<br/>
 * Note this is a 4-way 32bits Mux
 */
export class Mux4Way32{
    /**
     * The inPin32 is an array of 4 32-bits binary string
     */
    inPin32:string[];
    /**
     * the encoding string if selector of mux4way32<br/>
     * Since there may be more than one selector,the selectors should be encoding as a string.<br/>
     * e.g. selector1 = 0 selector2 = 1 sel ="01".
     * if set to 00, {@link outPin32} = {@link inPin32}[0]<br/>
     * if set to 01, {@link outPin32} = {@link inPin32}[1]<br/>
     * if set to 10, {@link outPin32} = {@link inPin32}[2]<br/>
     * if set to 11, {@link outPin32} = {@link inPin32}[3]
     */
    sel:string;
    /**
     * The encoding outpin of this components will be set according to sel and inpin<br/>
     * e.g. {@link inPin32}[0]= "00000000000000000000000000000000"<br/>
     *      {@link inPin32}[1]= "01010101010101010001111110010111"<br/>
     *      {@link inPin32}[2]= "11110101111011010101010101010110"<br/>
     *      {@link inPin32}[3]= "11110101110010111110101101111010"<br/>
     *      {@link sel} = "01"<br/>
     *      {@link outPin32} = {@link inPin32}[1]= "01010101010101010001111110010111"
     */
    outPin32:string;
    /**
     * The constructor initializes all inpin32 and select and set the outPin32 accordingly<br/>
     * if set to 00, {@link outPin32} = {@link inPin32}[0]<br/>
     * if set to 01, {@link outPin32} = {@link inPin32}[1]<br/>
     * if set to 10, {@link outPin32} = {@link inPin32}[2]<br/>
     * if set to 11, {@link outPin32} = {@link inPin32}[3]
     * the {@link outPin32} is set by static method {@link Mux4Way32}
     * @param inSignal a array of four initial binary string for four inpin pins stored in {@link inPin32}
     * @param Select the initial encoding string of selector
     */
    constructor(inSignal:string[],Select:string){
        this.inPin32 = inSignal;
        this.sel = Select;
        
        let bits:number[][] = [];
        let index:number = 0;
        this.inPin32.forEach( pin => {
            bits[index] = stringToIntArray(pin);
            ++index;
        });
    
        let selBit:number[] = stringToIntArray(this.sel);
        this.outPin32 = intArrayToString(Mux4Way32.Mux4Way32(bits,selBit));
    }

    /**
     * This method implements the 4way-mux32 by combine two 2way-mux32 and add a new selector to determine which 2way-mux32's output is set to output
     * @param inPin an array of arrays of integers that represents four 32bits binary data
     * @param Select2Way the 2 way selector
     * @returns an array of integers which indicates what the {@link outPin32} will be set.
     */
    public static Mux4Way32(inPin:number[][],Select2Way:number[]):number[]{
        let mux32A:Mux32 = new Mux32(intArrayToString(inPin[0]),intArrayToString(inPin[1]),Select2Way[1]);
        let mux32B:Mux32 = new Mux32(intArrayToString(inPin[2]),intArrayToString(inPin[3]),Select2Way[1]);
        return Mux32.Mux32(stringToIntArray(mux32A.outPin32),stringToIntArray(mux32B.outPin32),Select2Way[0]);
    }
}