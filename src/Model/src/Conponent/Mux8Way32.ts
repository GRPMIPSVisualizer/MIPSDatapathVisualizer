import {Mux4Way32} from "./Mux4Way32"
import {Mux32} from "./Mux32"
import {stringToIntArray,intArrayToString} from "../Library/StringHandle"
/**
 * This is the 8-way 32bits Multiplexer in the cpu circuits<br/>
 * The class simulates how 32bits Multiplexer works and fulfills some basic function of it<br/>
 * Note this is a 8-way 32bits Mux
 */
export class Mux8Way32{
    /**
     * The inPin32 is an array of 8 32-bits binary string
     */
    inPin32:string[];
    /**
     * the encoding string if selector of mux4way32<br/>
     * Since there may be more than one selector,the selectors should be encoding as a string.<br/>
     * e.g. selector1 = 0 selector2 = 1 sel ="01".
     * if set to 000, {@link outPin32} = {@link inPin32}[0]<br/>
     * if set to 001, {@link outPin32} = {@link inPin32}[1]<br/>
     * if set to 010, {@link outPin32} = {@link inPin32}[2]<br/>
     * if set to 011, {@link outPin32} = {@link inPin32}[3]<br/>
     * if set to 100, {@link outPin32} = {@link inPin32}[4]<br/>
     * if set to 101, {@link outPin32} = {@link inPin32}[5]<br/>
     * if set to 110, {@link outPin32} = {@link inPin32}[6]<br/>
     * if set to 111, {@link outPin32} = {@link inPin32}[7]<br/>
     */
    sel:string;
    /**
     * The encoding outpin of this components will be set according to sel and inpin<br/>
     * e.g. {@link inPin32}[0]= "00000000000000000000000000000000"<br/>
     *      {@link inPin32}[1]= "01010101010101010001111110010111"<br/>
     *      {@link inPin32}[2]= "11110101111011010101010101010110"<br/>
     *      {@link inPin32}[3]= "11110101110010111110101101111010"<br/>
     *      {@link inPin32}[4]= "10111011101001010101010101011111"<br/>
     *      {@link inPin32}[5]= "10101010111011111101110101000000"<br/>
     *      {@link inPin32}[6]= "10101011111100000111010101011110"<br/>
     *      {@link inPin32}[7]= "11110100101010101010100100111110"<br/>
     *      {@link sel} = "101"<br/>
     *      {@link outPin32} = {@link inPin32}[5]= "10101010111011111101110101000000"
     */
    outPin32:string;

    /**
     * The constructor initializes all inpin32 and select and set the outPin32 accordingly<br/>
     * if set to 000, {@link outPin32} = {@link inPin32}[0]<br/>
     * if set to 001, {@link outPin32} = {@link inPin32}[1]<br/>
     * if set to 010, {@link outPin32} = {@link inPin32}[2]<br/>
     * if set to 011, {@link outPin32} = {@link inPin32}[3]<br/>
     * if set to 100, {@link outPin32} = {@link inPin32}[4]<br/>
     * if set to 101, {@link outPin32} = {@link inPin32}[5]<br/>
     * if set to 110, {@link outPin32} = {@link inPin32}[6]<br/>
     * if set to 111, {@link outPin32} = {@link inPin32}[7]<br/>
     * the {@link outPin32} is set by static method {@link Mux8Way32}
     * @param inSignal a array of eight initial binary string for four inpin pins stored in {@link inPin32}
     * @param Select the initial encoding string of selector
     */
    constructor(inSignal:string[],Select:string){
        this.inPin32 = inSignal;
        this.sel = Select;
        this.outPin32 = intArrayToString(Mux8Way32.Mux8Way32(this.inPin32,this.sel));
    }

    /**
     * This method implements the 8way-mux32 by combine two 4way-mux32 and add a new selector to determine which 4way-mux32's output is set to output
     * @param inPin an array of arrays of integers that represents eight 32bits binary data
     * @param Select2Way the 3 way selector
     * @returns an array of integers which indicates what the {@link outPin32} will be set.
     */
    public static Mux8Way32(inPin:string[],Select2Way:string):number[]{
        let mux4Way32A:Mux4Way32 = new Mux4Way32(inPin.slice(0,4),Select2Way.slice(1,3));
        let mux4Way32B:Mux4Way32 = new Mux4Way32(inPin.slice(4,8),Select2Way.slice(1,3));
        // console.log(mux4Way32A);
        // console.log(mux4Way32B);
        return Mux32.Mux32(stringToIntArray(mux4Way32A.outPin32),stringToIntArray(mux4Way32B.outPin32),parseInt(Select2Way.charAt(0)));
    }
}