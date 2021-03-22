import {AND} from "../Logic/AND";
import {XOR} from "../Logic/XOR";
import {OR} from "../Logic/OR";
import {Mux} from "../Conponent/Mux";
import {stringToIntArray,intArrayToString} from "../Library/StringHandle";
/**
 * Class Adder implements some basic the functionalities of a adder.<br/>
 * This component is used for PC and branch as well as ALU to get correct data
 */
export class Adder{
    // [key:string]:any;
    /**
     * As the name indicates, this is 32bits inPinA of an Adder
     */
    protected inPin32A:string;
    /**
     * As the name indicates, this is 32bits inPinB of an Adder
     */
    protected inPin32B:string;
    /**
     * As the name indicates, this is 32bits outPin of an Adder
     */
    protected outPin32:string;
    /**
     * This field record whether the final result of two 32 bits input carry 
     */
    public carry:number;
    
    /**
     * The Constructor initialize {@link inPin32A} and {@link inPin32B}<br/>
     * The adder will then set the {@link outPin32} according to two inputs.
     * @param inSignalA a binary string that will assign to {@link inPin32A}
     * @param inSignalB a binary string that will assign to {@link inPin32A}
     */
    constructor(inSignalA:string,inSignalB:string){
        this.inPin32A = inSignalA;
        this.inPin32B = inSignalB;
        let bitA:number[] = stringToIntArray(this.inPin32A);
        let bitB:number[] = stringToIntArray(this.inPin32B);
        this.outPin32 = intArrayToString(this.Adder32(bitA,bitB));
        this.carry = 0;
    }
    /**
     * A half adder will do add logic but only for 1-bit,and it does not take carry into consideration
     * @param inPin1 1-bit data
     * @param inPin2 1-bit data
     * @returns a array of number indicates carry and the result of sum
     */
    public static halfAdder(inPin1:number,inPin2:number):number[]{
        let carry = AND.And(inPin1,inPin2);
        let sum = XOR.Xor(inPin1,inPin2);
        return [carry,sum];
    }

    /**
     * get {@link inPin32B}
     * @returns a binary string which {@link inPin32B} stores
     */
    public getInpinB():string{
        return this.inPin32B;
    }

    /**
     * A full adder will do add logic but only for 1-bit,and it takes carry into consideration.
     * @param inPin1 1-bit data
     * @param inPin2 1-bit data
     * @param carry carry
     * @returns a array of number indicates new carry and the result of sum
     */
    public static fullAdder(inPin1:number,inPin2:number,carry:number):number[]{
        let Pin0:number = OR.Or(inPin1,inPin2);
        let Pin1:number = AND.And(inPin1,inPin2);
        let Pin2:number = XOR.Xor(inPin1,inPin2);
        let sum = XOR.Xor(Pin2,carry);
        let newCarry = Mux.Mux(Pin1,Pin0,carry);
        return [newCarry,sum];
    }
    /**
     * This method do 32-bits add logic by recurring call {@link halfAdder} and {@link fullAdder}
     * @param inSignalA the first input pin of an adder
     * @param inSignalB the second input pin of an adder
     * @returns the sum of two 32bits input, but in the form of number array
     */
    public Adder32(inSignalA:number[],inSignalB:number[]):number[]{
        let outPin:number[] = new Array(32);
        let carry:number = 0;
        [carry,outPin[31]] = Adder.halfAdder(inSignalA[31],inSignalB[31]);
        for (let i:number =1; i < inSignalA.length;++i){
            [carry,outPin[31-i]] = Adder.fullAdder(inSignalA[31-i],inSignalB[31-i],carry);
            // console.log(carry,outPin[i]);
        }
        this.carry = carry;
        return outPin;
    }
    /**
     * assign new value to two inpin {@link inPin32A} and {@link inPin32B}<br/>
     * the {@link outPin32} will be set accordingly.
     * @param inSignalA a array of 32-bits that will be assigned to {@link inPin32A}
     * @param inSignalB a array of 32-bits that will be assigned to {@link inPin32B}
     */
    public newInPin(inSignalA:number[],inSignalB:number[]):void{
        this.inPin32A = intArrayToString(inSignalA);
        this.inPin32B = intArrayToString(inSignalB);
        this.outPin32 = intArrayToString(this.Adder32(inSignalA,inSignalB));
    }

    /**
     * get i-th bit of {@link outPin32}
     * @param i index of bit
     * @returns the i-th bit of {@link outPin32}
     */
    public getOutputAt(i:number):number{
        return parseInt(this.outPin32.charAt(i));
    }
    /**
     * get {@link outPin32}
     * @returns the outPin32 will be return
     */
    public getOutput():string{
        return this.outPin32;
    }

    /**
     * get i-th bit of {@link inPin32A}
     * @param i index of bit
     * @returns the i-th bit of {@link inPin32A}
     */
    public getInpinAAt(i:number):number{
        return parseInt(this.inPin32A.charAt(i));
    }

    /**
     * get i-th bit of {@link inPin32B}
     * @param i index of bit
     * @returns the i-th bit of {@link inPin32B}
     */
    public getInpinBAt(i:number):number{
        return parseInt(this.inPin32B.charAt(i));
    }
}