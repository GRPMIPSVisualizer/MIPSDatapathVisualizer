import Logic from "./Logic"
import { NAND } from "./NAND";
/**
 * This is the AND logic. This components provide AND function for the circuit components
 */
export class AND extends Logic{
    /**
     * @param inputPin1 the initial value for inpin 1
     * @param inputPin2 the initial value for inpin 2<br/>
     * 
     * the constructor will then set the outpin according to inpin 1 and inpin 2.
     * This is done by call static method And {@link And}
    */
    constructor(inputPin1:number,inputPin2:number){
        super(inputPin1,inputPin2);
        this.outpin = AND.And(this.pin1,this.pin2);
    }

    /**
     * the logic code that fulfill the function of and
    */
    public static And(inputPin1:number,inputPin2:number):number{
        let nand:NAND = new NAND(inputPin1,inputPin2);
        return NAND.Nand(nand.outpin,nand.outpin);
    }
}