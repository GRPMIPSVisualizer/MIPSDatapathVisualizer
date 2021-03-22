import Logic from "./Logic"
import { NAND } from "./NAND";
import {OR} from "./OR"
import {AND} from "./AND"
/**
 * This is the XOR logic. This components provide XOR function for the circuit components
 * 
 * @category Logic
*/
export class XOR extends Logic{
    /**
     * @param inputPin1 the initial value for inpin 1
     * @param inputPin2 the initial value for inpin 2<br/>
     * 
     * the constructor will then set the outpin according to inpin 1 and inpin 2.
     * This is done by call static method Xor {@link Xor}
    */
    constructor(inputPin1:number,inputPin2:number){
        super(inputPin1,inputPin2);
        this.outpin = XOR.Xor(this.pin1,this.pin2);
    }

    /**
     * the logic code that fulfill the function of xor
    */
    public static Xor(inputPin1:number,inputPin2:number):number{
        let nand:NAND = new NAND(inputPin1,inputPin2);
        let or:OR = new OR(inputPin1,inputPin2);
        return AND.And(nand.outpin,or.outpin);
    }
}