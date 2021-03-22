import { AND } from "../Logic/AND";
import { NOT } from "../Logic/NOT"
/**
 * This is the Demultiplexer in the cpu circuits<br/>
 * The class simulates how Demultiplexer works and fulfills some basic function of it<br/>
 * Note this is a 2-way Dmux
 */
export class DMux{
    /**
     * input pin for this circuit components
    */
    inPin:number;
    /**
     * selector of dmux<br/>
     * if set to 0, outpin1 = inpin,outpin2 = 0<br/>
     * if set to 1, outpin1 = 0,outpin2 = inpin
     */
    sel:number;
    /**
     * The outpin of this components will be set according to sel and inpin
     */
    outPin1:number;
    /**
     * The outpin of this components will be set according to sel and inpin
     */
    outPin2:number;
    /**
     * The constructor initializes inpin and select and set two outPin accordingly<br/>
     * if set to 0, outpin1 = inpin,outpin2 = 0<br/>
     * if set to 1, outpin1 = 0,outpin2 = inpin
     * @param inPin the initial value of inpin
     * @param Select the initial value of selector
     */
    constructor(inPin:number,Select:number){
        this.inPin = inPin;
        this.sel = Select;
        let temp:number[] = [];
        temp = DMux.DMux(this.inPin,this.sel);
        this.outPin1 = temp[0];
        this.outPin2 = temp[1];
    }
    /**
     * This is a static function that imitate how dmux works and thus can give correct output according to its input
     * @param inPin the inpin
     * @param Select the selector
     * @returns a array of integer. the first entry in this array is the outcome of outpin1 and the second is that of outpin2.
     */
    public static DMux(inPin:number,Select:number):number[]{
        let temp:number[] = [];
        let nots:NOT = new NOT(Select);
        temp.push(AND.And(nots.outpin,inPin));
        temp.push(AND.And(Select,inPin));
        return temp;
    }
}