import {OR} from "./OR"
import {stringToIntArray,intArrayToString} from "../Library/StringHandle"
/**
 * This is an integrated 32-bits OR Logic Components.The ALU will use this to caculate logic or
 * <br/>The inpinA and inpinB are both 32-bits
 * @category 32Logic
*/
export class OR32{
    /**
     * The inpin32A should only accepts an binary encoding string
     */
    inPin32A:string;
    /**
     * The inpin32B should only accepts an binary encoding string
     */
    inPin32B:string;
    /**
     * The outpin of this components will be the outcome of 32 bit-wise logic OR operation to inpinA and inpinB
     */
    outPin32:string;
    /**
     * @param inputPin1 the initial value for inpinA.<br/>Note: only 32 binary encoding string, such as "00111100101011000011110010101100", can be accepted
     * @param inputPin2 the initial value for inpinB<br/>Note: only 32 binary encoding string, such as "00111100101011000011110010101100", can be accepted<br/>
     * 
     * the constructor will then set the outpin according to bit-wise or operation of inpinA and inpinB.
     * This is done by call static method Or32 {@link Or32}
    */
    constructor(inSignalA:string,inSignalB:string){
        this.inPin32A = inSignalA;
        this.inPin32B = inSignalB;
        let bitA:number[] = stringToIntArray(this.inPin32A);
        let bitB:number[] = stringToIntArray(this.inPin32B);
        this.outPin32 = intArrayToString(OR32.Or32(bitA,bitB));
    }

    /**
     * this method will caculate the correct outcome of bitwise or operation of two 32 bits inputs
     * @param BitsA Note that the type of this is array of number
     * @param BitsB Note that the type of this is array of number
     * @returns the return value of this method is also a array of number.<br/> The outcome of bit-wise or is stored in this array
    */
    public static Or32(BitsA:number[],BitsB:number[]):number[]{
        let outBits:number[] = [];
        let i:number = 0;
        BitsA.forEach((bit)=>{
            outBits[i] = OR.Or(bit,BitsB[i])
            ++i;
        });
        return outBits;
    }
}