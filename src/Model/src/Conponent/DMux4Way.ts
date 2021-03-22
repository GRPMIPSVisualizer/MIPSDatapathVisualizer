import {DMux} from "./DMux"
import {stringToIntArray,intArrayToString} from "../Library/StringHandle"
/**
 * This is the 4-way-Demultiplexer in the cpu circuits<br/>
 * The class simulates how Demultiplexer works and fulfills some basic function of it<br/>
 * Note this is a 4-way Dmux
 */
export class DMux4Way{
    /**
     * input pin for this circuit components
    */
    inPin:number;
    /**
     * the encoding string if selector of dmux4way<br/>
     * Since there may be more than one selector,the selectors should be encoding as a string.<br/>
     * e.g. selector1 = 0 selector2 = 1 sel ="01".
     * if set to 00, outpin1 = inpin,outpin2-4 = 0<br/>
     * if set to 01, outpin2 = inpin,outpin1,3,4 = 0<br/>
     * if set to 10, outpin3 = inpin,outpin1,2,4 = 0<br/>
     * if set to 11, outpin4 = inpin,outpin1-3 = 0
     */
    sel:string;
    /**
     * The encoding outpin of this components will be set according to sel and inpin<br/>
     * e.g. outpin1= 0 outpin2=0 outpin3=1 outpin4=0. outPin="0010" 
     */
    outPin:string;
    
    /**
     * The constructor initializes inpin and encoding elect and set encoding outPin accordingly<br/>
     * if set to 00, outpin1 = inpin,outpin2-4 = 0<br/>
     * if set to 01, outpin2 = inpin,outpin1,3,4 = 0<br/>
     * if set to 10, outpin3 = inpin,outpin1,2,4 = 0<br/>
     * if set to 11, outpin4 = inpin,outpin1-3 = 0
     * @param inPin the initial value of inpin
     * @param Select the initial encoding string of selector
     */
    constructor(inPin:number,Select:string){
        this.inPin = inPin;
        this.sel = Select;
        this.outPin = intArrayToString(DMux4Way.DMux4Way(this.inPin,stringToIntArray(this.sel)));
    }
    /**
     * This method implements the 4way-dmux by combine two 2way dmux and add a new selector to determine which 2way-dmux's output is set to output
     * @param inPin the inpin number 
     * @param Select the encoding selector
     * @returns a array of 4 number that indicates 4 outpin respectively
     */
    public static DMux4Way(inPin:number,Select:number[]):number[]{
        let temp:number[] = [];
        let dmux1:DMux = new DMux(inPin,Select[0]);
        temp = DMux.DMux(dmux1.outPin1,Select[1]).concat(DMux.DMux(dmux1.outPin2,Select[1]));
        return temp;
    }
}