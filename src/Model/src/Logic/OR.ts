import Logic from "./Logic"
import { NAND } from "./NAND";
/**
 * This is the OR logic. This components provide or function for the circuit components
 * 
 * @category Logic
*/
export class OR extends Logic{
    /**
     * @param inputPin1 the initial value for inpin 1
     * @param inputPin2 the initial value for inpin 2<br/>
     * 
     * the constructor will then set the outpin according to inpin 1 and inpin 2.
     * This is done by call static method Or {@link Or}
    */
    constructor(inputPin1:number,inputPin2:number){
        super(inputPin1,inputPin2);
        this.outpin = OR.Or(this.pin1,this.pin2);
    }

    /**
     * the logic code that fulfill the function of or
    */
    public static Or(inputPin1:number,inputPin2:number):number{
        let nand1:NAND = new NAND(inputPin1,inputPin1);
        let nand2:NAND = new NAND(inputPin2,inputPin2);
        return NAND.Nand(nand1.outpin,nand2.outpin);
    }
}