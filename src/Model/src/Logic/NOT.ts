import Logic from "./Logic"
import { NAND } from "./NAND";
/**
 * This is NOT Logic. This components provide NOT function for the circuit components
 */
export class NOT extends Logic{
    /**
     * @param inputPin1 the initial value for inpin 1
     * 
     * the constructor will set the outpin according to inpin 1.
     * This is done by call static method Not {@link Not}
    */
    constructor(inputPin1:number){
        super(inputPin1,0);
        this.outpin = NOT.Not(this.pin1);
    }

    /**
     * the logic code that fulfill the function of not
    */
    public static Not(inputPin1:number):number{
        let nand:NAND = new NAND(inputPin1,inputPin1);
        return nand.outpin;
    }
}