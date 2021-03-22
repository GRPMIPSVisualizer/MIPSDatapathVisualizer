import { Adder } from "../Circuit/Adder";
import { Memory } from "../Circuit/Memory";
import {stringToIntArray,intArrayToString, bitsMapping, shiftLeftBinary32Bits} from "../Library/StringHandle";
import {Mux} from "./Mux";
/**
 * This is the 32bits Multiplexer in the cpu circuits<br/>
 * The class simulates how 32bits Multiplexer works and fulfills some basic function of it<br/>
 * Note this is a 2-way 32bits Mux
 */
export class Mux32{
    /**
     * a notify function is the function should be called when the value of outpin32 changed<br/>
     * This implements a observer design pattern
     */
    private notifyFunc:Function[] = new Array<Function>();
    /**
     * The inputA is a 32bits binary string
     */
    inPin32A:string;
    /**
     * The inputB is a 32bits binary string
     */
    inPin32B:string;
    /**
     * selector of dmux<br/>
     * if set to 0, {@link outPin32}= {@link inPin32A}<br/>
     * if set to 1, {@link outPin32} = {@link inPin32B}
     */
    sel:number;
    /**
     * The outpin of this components will be set according to sel and inpin1 and inpin2<br/>
     * The outpin32 is also a 32-bits binary string
     */
    outPin32:string;
     /**
     * The constructor initializes inpin32A,inpin32B and select and set the outPin32 accordingly<br/>
     * if set to 0, {@link outPin32} = {@link inPin32A}<br/>
     * if set to 1, {@link outPin32} = {@link inPin32B}<br/>
     * the {@link outPin32} is set by static method {@link Mux32}
     * @param inSignalA the initial binary string of inpin32A
     * @param inSignalB the initial binary string of inpin32B
     * @param Select the initial value of selector
     */
    constructor(inSignalA:string,inSignalB:string,Select:number){
        this.inPin32A = inSignalA;
        this.inPin32B = inSignalB;
        this.sel = Select;
        let bitA:number[] = stringToIntArray(this.inPin32A);
        let bitB:number[] = stringToIntArray(this.inPin32B);
        this.outPin32 = intArrayToString(Mux32.Mux32(bitA,bitB,this.sel));
    }

    /**
     * This is a static method that imitate how mux32 works and thus can give correct output according to its input
     * @param inSignalA an array of integers that represents a 32bits binary data
     * @param inSignalB an array of integers that represents a 32bits binary data
     * @param Select the selector
     * @returns an array of integers which indicates what the outpin32 will be set according to two inputs
     */
    public static Mux32(inSignalA:number[],inSignalB:number[],Select:number):number[]{
        let i:number = 0;
        let outPin:number[] = [];
        inSignalA.forEach((bit) => {
            outPin.push(Mux.Mux(bit,inSignalB[i],Select));
            ++i;
        })
        return outPin;
    }

    /**
     * This method set the {@link inPin32A}.<br/>
     * Note that the output32 will be refreshed once the {@link inPin32A} being set.
     * @param newInPin the 32bits binary string that will be assigned to {@link inPin32A}
     */
    public setInpin32A(newInPin:string):void{
        this.inPin32A = newInPin;
        this.setOutPin();
    }

    /**
     * The Memory and PCAdder components assign combination of part of their outpin bits to {@link inpin32B}
     * @param _Memory the {@link Memory} components
     * @param _PCAdder the pc {@link Adder} components
     */
    public memSetInpin32B(_Memory:Memory,_PCAdder:Adder):void{
        let newInpin = bitsMapping(_PCAdder.getOutput(),28,32) + bitsMapping(shiftLeftBinary32Bits(_Memory.getTextOutpin()),0,28);
        this.setInpin32B(newInpin);
    }

    /**
     * The Memory components assigns part of its outpin bits to {@link inPin32B}
     * @param _Memory a {@link Memory} object that will set {@link inpin32B} of this {@link Mux32} component.
     * @returns void
     */
    public dataMemSetInpin32B(_Memory:Memory):void{
        if (_Memory.getOutPin32() == undefined)
            return;
        this.setInpin32B(_Memory.getOutPin32() as string);
    }

    /**
     * This method set the {@link inpin32B}.<br/>
     * Note that the output32 will be refreshed once the {@link inpin32B} being set.
     * @param newInPin the 32bits binary string that will be assigned to {@link inpin32B}
     */
    public setInpin32B(newInPin:string):void{
        this.inPin32B = newInPin;
        this.setOutPin();
    }

    /**
     * The {@link inpin32A} is set by another {@link Mux32} component
     * @param MUX the {@link Mux32} component that will set this {@link Mux32}'s {@link inpin32A}
     */
    public setMuxInpin32A(MUX:Mux32):void{
        this.setInpin32A(MUX.outPin32);
    }

    /**
     * This method set the selector of this Mux32 component.
     * @param newSel the new selector signal that will be assigned to this {@link Mux32}'s {@link sel}
     */
    public setSel(newSel:number):void{
        this.sel = newSel;
        this.setOutPin();
    }

    /**
     * This method set the {@link outPin32} of this {@link Mux32} component according to
     * {@link inPin32A} and {@link inPin32B} and {@link sel} 
     */
    protected setOutPin():void{
        this.outPin32 = intArrayToString(Mux32.Mux32(stringToIntArray(this.inPin32A),stringToIntArray(this.inPin32B),this.sel));
        this.notifychange();
    }
    /**
     * This method calls all the notifying functions stored in {@link notifyFunc}<br/>
     * Note that this is an obeserver design pattern
     */
    private notifychange():void{
        this.notifyFunc.forEach(Func=>{
                Func();
            }
        )
    }
    /**
     * This method adds a new notifying function to {@link notifyFunc}<br/>
     * When the {@link outPin32} changes, the functions stored in {@link notifyFunc} will be called.
     * @param newFunc a new notifying function
     */
    public addNotifyFunc(newFunc:Function):void{
        this.notifyFunc.push(newFunc);
    }
}