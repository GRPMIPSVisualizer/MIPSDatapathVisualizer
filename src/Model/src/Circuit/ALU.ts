import {Adder} from "./Adder"
import {AND32} from "../Logic/AND32"
import {OR32} from "../Logic/OR32"
import {intArrayToString, stringToIntArray,decToSignedBin32, bin2dec,decToUnsignedBin32}from "../Library/StringHandle";
import { NOT32 } from "../Logic/NOT32";
import { Mux4Way32 } from "../Conponent/Mux4Way32";
import { Mux32 } from "../Conponent/Mux32";
import { ExceptionReporter } from "./ExceptionReporter";
import { init_bits } from "../Library/BItsGenerator";
import { num2bool } from "../Library/BooleanHandler";
/**
 * Class ALU simulates some basic function of ALU. This is a core component for building a CPU.<br/>
 * 8 functions are fulfilled in this ALU:<br/>
 * or<br/>
 * and<br/>
 * add32<br/>
 * sub32<br/>
 * set on less than<br/>
 * nor<br/>
 * shiftLeftLogic<br/>
 * shiftRightLogic
 */
export class ALU{
    /**
     * As the name indicates, this is 32bits inPinA of the ALU
     */
    protected inPin32A:string;
    /**
     * As the name indicates, this is 32bits inPinB of the ALU
     */
    protected inPin32B:string;
    /**
     * As the name indicates, this is 32bits outPin of the ALU
     */
    private outPin32:string = "";
    /**
     * As the name indicates, this is control bits for the ALU
     */
    private controlBits:string;
    /**
     * As the name indicates, this is a 32bits adder object
     */
    private Adder32:Adder;
    /**
     * This is a boolean value that indicates whether the ALU is doing unsign operation
     */
    isUnsign:boolean;
    /**
     * This field records the shamt bits of a machine code
     */
    protected shamt:string = init_bits(5);
    /**
     * This is a boolean value that indicates whether the outpin is 0
     */
    isZero:boolean;
    /**
     * This is a boolean value that indicates whether the outpin is overflow
     */
    isOverflow:boolean;
    /**
     * This is a boolean value that indicates whether the instruction is bne
     */
    bne:boolean = false;
    /**
     * This is a boolean value which indicates whether the overflow should be reported.
     */
    private reportOverflow:boolean = false;
    /**
     * The Constructor initializes {@link inPin32A} and {@link inPin32B} and {@link controlBits}
     * @param inPinA the binary string that will assigned to {@link inPin32A}
     * @param inPinB the binary string that will assigned to {@link inPin32B}
     * @param control the 4-bits string that will assigned to {@link controlBits}
     */
    constructor(inPinA:string,inPinB:string,control:string){
        this.inPin32A = inPinA;
        this.inPin32B = inPinB;
        this.controlBits = control;
        this.isUnsign = false;
        this.isOverflow = false;
        this.isZero = false;
        this.Adder32 = new Adder(inPinA,inPinB);
        this.outPin32 = decToUnsignedBin32(0);
        
    }
    /**
     * get {@link outPin32}
     * @returns binary string that stored in outPin32
     */
    public getOutPin32():string{
        return this.outPin32;
    }

    /**
     * this method is the most critical method in this class.<br/>
     * It simulates the workflow of ALU and set {@link outPin32} and other boolean variables according to inputs<br/>
     * @returns nothing
     */
    protected ALU():void{
        if (this.controlBits == "1111" || this.controlBits == "1110" || this.controlBits == "1101"){
            let right:boolean = (this.controlBits[3] == '0')?false:true;
            let shiftIndex:number = bin2dec(init_bits(27)+this.shamt,true);
            let newStr = "";
            if (right){
                if (this.controlBits[2] == '0' && this.inPin32B[0] == '1'){
                    for(let i = 0;i<shiftIndex;++i){
                        newStr = newStr + "1";
                    }
                }else{
                    for(let i = 0;i<shiftIndex;++i){
                        newStr = newStr + "0";
                    }
                }
                newStr = newStr + this.inPin32B.slice(0,32-shiftIndex);
            }else{
                newStr = newStr + this.inPin32B.slice(shiftIndex,32);
                for(let i = 0;i<shiftIndex;++i){
                    newStr = newStr + "0";
                }
            }
            this.setOutPin(newStr);
            return;
        }


        let control:number[] = stringToIntArray(this.controlBits);
        let pinA:number[] = stringToIntArray(this.inPin32A);
        let pinB:number[] = stringToIntArray(this.inPin32B);
        if (control[0])
            pinA = NOT32.Not32(pinA);
        if (control[1])
            pinB = NOT32.Not32(pinB);

        if (intArrayToString(control).slice(0,3)  == "011"){
            if (!this.isUnsign){
                pinB = stringToIntArray(decToSignedBin32(bin2dec(intArrayToString(pinB),this.isUnsign)+1));
            }else{
                pinB = stringToIntArray(decToUnsignedBin32(bin2dec(intArrayToString(pinB),this.isUnsign)+1));
            }
        }
            
        let or32:number[] = OR32.Or32(pinA,pinB);
        let and32:number[] = AND32.And32(pinA,pinB);
        this.Adder32.newInPin(pinA,pinB);
        this.overflowDetect(this.Adder32.getInpinAAt(0),this.Adder32.getInpinBAt(0),this.Adder32.getOutputAt(0),this.Adder32.carry);
        let slt:number[] = [];
        if (this.isUnsign){
            let numA:number = bin2dec(this.inPin32A,this.isUnsign);
            let numB:number = bin2dec(this.inPin32B,this.isUnsign);
            if (numA < numB){
                slt = stringToIntArray(decToSignedBin32(1));
            }else{
                slt = stringToIntArray(decToSignedBin32(0));
            }
        }else {
            if (this.inPin32A[0] == '0' && this.inPin32B[0] == '1'){
                slt = stringToIntArray(decToSignedBin32(0));
            }
            if (this.inPin32A[0] == '1' && this.inPin32B[0] == '0'){
                slt = stringToIntArray(decToSignedBin32(1));
            }
            if (this.inPin32A[0] == '1' && this.inPin32B[0] == '1'){
                slt = stringToIntArray(decToSignedBin32(this.Adder32.getOutputAt(0)));
            }
            if (this.inPin32A[0] == '0' && this.inPin32B[0] == '0'){
                slt = stringToIntArray(decToSignedBin32(this.Adder32.getOutputAt(0)));
            }
        }
        let inpin:number[][] = [and32,or32,stringToIntArray(this.Adder32.getOutput()),slt];
        // console.log(inpin[0],and32);
        if (this.getReportOverflow()){
            this.reportOverflowException();
        }
        this.setOutPin(intArrayToString(Mux4Way32.Mux4Way32(inpin,[control[2],control[3]])));
        
        this.detectZero();

        
    }

    /**
     * This method add an error message to {@link ExceptionReporter} if {@link isOverflow} is true<br/>
     * @returns nothing
     */
    private reportOverflowException():void{
        if (!this.isOverflow)
            return;
        let exceptionReporter = ExceptionReporter.getReporter();
        exceptionReporter.addException("ALU Overflow Exception!");
    }
    /**
     * This method detect overflow and set {@link isOverflow} according to last bit of {@link inPin32A} and {@link inPin32B} as well as the output of {@link Adder32}
     * @param lastPinA last bit of {@link inPin32A}
     * @param lastPinB last bit of {@link inPin32B}
     * @param lastOut last bit of output of {@link Adder32}
     * @param carry carry?
     */
    private overflowDetect(lastPinA:number,lastPinB:number,lastOut:number,carry:number):void{
        // console.log(lastPinA,lastPinB,!lastOut);
        if (this.isUnsign){
            if( carry ){
                this.isOverflow = true;
            }else{
                this.isOverflow = false;
            }
        } else{
            if ((lastPinA && lastPinB && !lastOut) || (!lastPinA && !lastPinB && lastOut)){
                this.isOverflow = true;
            }else{
                this.isOverflow = false;
            }
        }
    }
    /**
     * detect whether the {@link outPin32} is zero
     * if it is zero, set {@link isZero} to true
     * @returns nothing
     */
    protected detectZero():void{
        for (let i:number = 0;i < this.outPin32.length;++i){
            if (parseInt(this.outPin32.charAt(i)) != 0){
                this.isZero = false;
                return;
            }
        }
        this.isZero = true;
    }
    /**
     * reset both {@link inPin32A} and {@link inPin32B} and {@link controlBits}
     * @param inPinA new binary string that will assigned to {@link inPin32A}
     * @param inPinB new binary string that will assigned to {@link inPin32B}
     * @param controlBits new 4-bits control string that will assigned to {@link controlBits}
     */
    public newSignal(inPinA:string,inPinB:string,controlBits:string):void{
        this.inPin32A = inPinA;
        this.inPin32B = inPinB;
        this.controlBits = controlBits;
        this.ALU();
    }
    /**
     * assign a new 4-bits control string to {@link controlBits}
     * @param conBits 
     */
    public setControlBits(conBits:string):void{
        this.controlBits = conBits;
        this.ALU();
    }
    /**
     * assign a new 32-bits binary value to {@link inPin32A}
     * @param inPin 
     */
    public setInpinA(inPin:string):void{
        this.inPin32A = inPin;
        this.ALU();
    }
    /**
     * the ALU Mux32 component will watch the change of its outPin32 and will set {@link inPin32B} accordingly.
     * @param MUX the ALU Mux32 component
     */
    public setMuxInpinB(MUX:Mux32):void{
        this.inPin32B = MUX.outPin32;
        this.ALU();
    }
    /**
     * assign a new value to {@link outPin32}
     * @param outPin 
     */
    protected setOutPin(outPin:string):void{
        this.outPin32 = outPin;
    }

    /**
     * This method sets {@link reportOverflow}
     * @param b the boolean number that will be assigned to {@link reportOverflow}
     */
    public setReportOverflow(b:boolean):void{
        this.reportOverflow = b;
    }
    
    /**
     * This method return a boolean indicates whether overflow should be reported
     * @returns a boolean indicates whether overflow should be reported
     */
    public getReportOverflow():boolean{
        return this.reportOverflow;
    }
}