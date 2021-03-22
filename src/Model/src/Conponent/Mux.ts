import { AND } from "../Logic/AND";
import { NOT } from "../Logic/NOT"
import {OR} from "../Logic/OR"
/**
 * This is the Multiplexer in the cpu circuits<br/>
 * The class simulates how Multiplexer works and fulfills some basic function of it<br/>
 * Note this is a 2-way Mux
 */
export class Mux{
    /**
     * input pin1 for this circuit components
    */
    inPin1:number;
    /**
     * input pin2 for this circuit components
    */
    inPin2:number;
    /**
     * selector of dmux<br/>
     * if set to 0, outpin = inpin1<br/>
     * if set to 1, outpin = inpin2
     */
    sel:number;
    /**
     * The outpin of this components will be set according to sel and inpin1 and inpin2
     */
    outPin:number;
     /**
     * The constructor initializes inpin1,inpin2 and select and set the outPin accordingly<br/>
     * if set to 0, outpin = inpin1<br/>
     * if set to 1, outpin = inpin2
     * @param inPin1 the initial value of inpin1
     * @param inPin2 the initial value of inpin2
     * @param Select the initial value of selector
     */
    constructor(inPin1:number,inPin2:number,Select:number){
        this.inPin1 = inPin1;
        this.inPin2 = inPin2;
        this.sel = Select;
        this.outPin =  Mux.Mux(this.inPin1,this.inPin2,this.sel);
    }
    /**
     * This is a static function that imitate how mux works and thus can give correct output according to its input
     * @param inPin1 the inpin1
     * @param inPin1 the inpin2
     * @param Select the selector
     * @returns a number which indicates what the outpin will be set according to the inputs
     */
    public static Mux(inPin1:number,inPin2:number,Select:number):number{
        let nots:NOT = new NOT(Select);
        let and1:AND = new AND(inPin2,Select);
        let and2:AND = new AND(inPin1,nots.outpin);
        return OR.Or(and1.outpin,and2.outpin);
    }
}