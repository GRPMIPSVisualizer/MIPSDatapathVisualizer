import {DMux} from "./DMux"
import {DMux4Way} from "./DMux4Way"
import {stringToIntArray,intArrayToString} from "../Library/StringHandle"
/**
 * This is the 8-way-Demultiplexer in the cpu circuits<br/>
 * The class simulates how Demultiplexer works and fulfills some basic function of it<br/>
 * Note this is a 8-way Dmux
 */
export class DMux8Way{
    /**
     * input pin for this circuit components
    */
    inPin:number;
    /**
     * the encoding string if selector of dmux4way<br/>
     * Since there may be more than one selector,the selectors should be encoding as a string.<br/>
     * e.g. selector1 = 0 selector2 = 1 selector3 = 1 sel ="011".
     * if set to 000, outpin1 = inpin,other outpin = 0<br/>
     * if set to 001, outpin2 = inpin,other outpin = 0<br/>
     * if set to 010, outpin3 = inpin,other outpin = 0<br/>
     * if set to 011, outpin4 = inpin,other outpin = 0<br/>
     * if set to 100, outpin5 = inpin,other outpin = 0<br/>
     * if set to 101, outpin6 = inpin,other outpin = 0<br/>
     * if set to 110, outpin7 = inpin,other outpin = 0<br/>
     * if set to 111, outpin8 = inpin,other outpin = 0<br/>
     */
    sel:string;
    /**
     * The encoding outpin of this components will be set according to sel and inpin<br/>
     * e.g. outpin1= 0 outpin2=0 outpin3=1 outpin4=0 outpin5=1 outpin6=0 outpin7=1 outpin8=0. outPin="00101010" 
     */
    outPin:string;
    /**
     * The constructor initializes inpin and encoding elect and set encoding outPin accordingly<br/>
     * if set to 000, outpin1 = inpin,other outpin = 0<br/>
     * if set to 001, outpin2 = inpin,other outpin = 0<br/>
     * if set to 010, outpin3 = inpin,other outpin = 0<br/>
     * if set to 011, outpin4 = inpin,other outpin = 0<br/>
     * if set to 100, outpin5 = inpin,other outpin = 0<br/>
     * if set to 101, outpin6 = inpin,other outpin = 0<br/>
     * if set to 110, outpin7 = inpin,other outpin = 0<br/>
     * if set to 111, outpin8 = inpin,other outpin = 0<br/>
     * @param inPin the initial value of inpin
     * @param Select the initial encoding string of selector
     */
    constructor(inPin:number,Select:string){
        this.inPin = inPin;
        this.sel = Select;
        this.outPin = intArrayToString(DMux8Way.DMux8Way(this.inPin,stringToIntArray(this.sel)));
    }

    /**
     * This method implements the 8way-dmux by combine two 4way dmux and add a new selector to determine which 4way-dmux's output is set to output
     * @param inPin the inpin number 
     * @param Select the encoding selector
     * @returns a array of 8 number that indicates 8 outpin respectively
     */
    public static DMux8Way(inPin:number,Select:number[]):number[]{
        let temp:number[] = [];
        let dmux1:DMux = new DMux(inPin,Select[0]);
        temp = DMux4Way.DMux4Way(dmux1.outPin1,Select.slice(1,3)).concat(DMux4Way.DMux4Way(dmux1.outPin2,Select.slice(1,3)));
        return temp;
    }
}