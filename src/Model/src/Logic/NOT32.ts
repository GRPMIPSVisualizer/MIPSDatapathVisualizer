import {NOT} from "./NOT"
import {stringToIntArray,intArrayToString} from "../Library/StringHandle"
/**
 * This is an integrated 32-bits NOT Logic Components.
 * <br/>There is only one input pin called inpin32A since not is a unary operator
 * @category 32Logic
*/
export class NOT32{
     /**
     * The inpin32A should only accepts an binary encoding string
     */
    inPin32A:string;
    /**
     * The outpin of this components will be the outcome of 32 bit-wise logic Not operation to inpinA.
     */
    outPin32:string;
    /**
     * @param inSignalA the initial value for inpinA<br/>Note: only 32 binary encoding string, such as "00111100101011000011110010101100", can be accepted<br/>
     * 
     * the constructor will then set the outpin according to bit-wise not operation of inpinA.
     * This is done by call static method Not32 {@link Not32}
    */
    constructor(inSignalA:string){
        this.inPin32A = inSignalA;
        let bitA:number[] = stringToIntArray(this.inPin32A);
        this.outPin32 = intArrayToString(NOT32.Not32(bitA));
    }

    /**
     * this method will caculate the correct outcome of bitwise not operation of inputA
     * @param BitsA Note that the type of this is array of number
     * @returns the return value of this method is also a array of number.<br/> The outcome of bit-wise not is stored in this array
    */
    public static Not32(BitsA:number[]):number[]{
        let outBits:number[] = [];
        let i:number = 0;
        BitsA.forEach((bit)=>{
            outBits[i] = NOT.Not(bit)
            ++i;
        });
        return outBits;
    } 
}