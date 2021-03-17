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
export class ALU{
    protected inPin32A:string;
    protected inPin32B:string;
    private outPin32:string = "";
    private controlBits:string;
    private Adder32:Adder;
    isUnsign:boolean;
    protected shamt:string = init_bits(5);
    isZero:boolean;
    isOverflow:boolean;
    bne:boolean = false;
    private reportOverflow:boolean = false;

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

    public getOutPin32():string{
        return this.outPin32;
    }

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

    private reportOverflowException():void{
        if (!this.isOverflow)
            return;
        let exceptionReporter = ExceptionReporter.getReporter();
        exceptionReporter.addException("ALU Overflow Exception!");
    }

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

    protected detectZero():void{
        for (let i:number = 0;i < this.outPin32.length;++i){
            if (parseInt(this.outPin32.charAt(i)) != 0){
                this.isZero = false;
                return;
            }
        }
        this.isZero = true;
    }

    public newSignal(inPinA:string,inPinB:string,controlBits:string):void{
        this.inPin32A = inPinA;
        this.inPin32B = inPinB;
        this.controlBits = controlBits;
        this.ALU();
    }

    public setControlBits(conBits:string):void{
        this.controlBits = conBits;
        this.ALU();
    }

    public setInpinA(inPin:string):void{
        this.inPin32A = inPin;
        this.ALU();
    }

    public setMuxInpinB(MUX:Mux32):void{
        this.inPin32B = MUX.outPin32;
        this.ALU();
    }

    protected setOutPin(outPin:string):void{
        this.outPin32 = outPin;
    }


    public setReportOverflow(b:boolean):void{
        this.reportOverflow = b;
    }

    public getReportOverflow():boolean{
        return this.reportOverflow;
    }
}