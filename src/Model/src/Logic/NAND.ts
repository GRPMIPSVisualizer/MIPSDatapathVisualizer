import Logic from "./Logic"
/**
 * This is the NAND logic. This components provide NAND function for the circuit components
 * 
 * @category Logic
*/
export class NAND extends Logic{

    /**
     * @param inputPin1 the initial value for inpin 1
     * @param inputPin2 the initial value for inpin 2<br/>
     * 
     * the constructor will then set the outpin according to inpin 1 and inpin 2.
     * This is done by call static method Nand {@link Nand}
    */
    constructor(inputPin1:number,inputPin2:number){
        super(inputPin1,inputPin2);
        this.outpin = NAND.Nand(this.pin1,this.pin2);
    }

    /**
     * the logic code that fulfill the function of nand
    */
    public static Nand(inputPin1:number,inputPin2:number):number{
            return  Math.abs((inputPin1 & inputPin2) - 1);
    }

}