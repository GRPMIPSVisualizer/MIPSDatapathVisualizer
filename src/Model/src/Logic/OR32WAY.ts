import {OR} from "./OR"
import {stringToIntArray,intArrayToString} from "../Library/StringHandle"

/**
 * This is an integrated 32-bits OR32Way Logic Components.
 * <br/>The inpinA are 32-bits
 * <br/>Basically,this conponent will do or operation with each bits in inpinA, the outpin is a number setting accordly.
 * @category 32Logic
*/
export class OR32WAY{
     /**
     * The inpin32A should only accepts an binary encoding string
     */
    inPin32:string;
    /**
     * The outpin of this conponent is a number which indicates the result of Or32Way
     */
    outPin32:number;
    /**
     * @param inSignalA the initial value for inpinA<br/>Note: only 32 binary encoding string, such as "00111100101011000011110010101100", can be accepted<br/>
     * 
     * the constructor will then set the outpin according to bit-wise or operation of each bits in inpinA.
     * This is done by call static method Or32Way {@link Or32Way}
    */
    constructor(inSignalA:string){
        this.inPin32 = inSignalA;
        let bitA:number[] = stringToIntArray(this.inPin32);
        this.outPin32 = OR32WAY.Or32Way(bitA);
    }

    /**
     * this method will caculate the correct outcome of bitwise or operation of inputA
     * @param BitsA Note that the type of this is array of number
     * @returns the return value of this method is also a array of number.<br/> The outcome of bit-wise or is stored in this array
    */
    public static Or32Way(BitsA:number[]):number{
        let outPin:number = 0;
        BitsA.forEach((bit)=>{
            outPin = OR.Or(outPin,bit);
        });
        return outPin;
    }
}