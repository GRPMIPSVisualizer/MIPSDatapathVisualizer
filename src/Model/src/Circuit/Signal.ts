import { bool2num, num2bool } from "../Library/BooleanHandler";
/**
 * a data type for signal
 */
export type signalType = number|boolean;
/**
 * Class Signal is an abstract model for pin signal
 */
export class Signal{
    /**
     * This is the value of class Signal
     */
    private signal:signalType;
    /**
     * This is the reaction function being called when the value of signal changes
     */
    private reactFunc:Function;
    /**
     * all notifying functions will be stored in this array
     */
    private notifyChangeFuncs:Function[];
    //debug
    // public name:string="";
    /**
     * the constructor initializes the value of this signal and set the reactive function
     * @param signal the initial value of this signal class
     * @param reactFunc the initial reactive function
     */
    constructor(signal:signalType,reactFunc:Function = function(){}){
        this.signal = signal;
        this.reactFunc = reactFunc;
        this.notifyChangeFuncs = new Array<Function>();
    }
    /**
     * get the value of this signal
     * @returns the value of this signal
     */
    public getSignal():signalType{
        return this.signal;
    }
    
    /**
     * change the value of this signal
     */
    public changeSiganl():void{
        if (typeof this.signal === "boolean")
            this.signal = !this.signal;
        if (typeof this.signal === "number")
            this.signal = bool2num(!num2bool(this.signal));
        this.SignalKeep();
    }

    /**
     * set tje react Function of this signal
     * @param reactFunc the reactive function being set
     */
    public setReactFunc(reactFunc:Function):void{
        this.reactFunc = reactFunc;
    }

    /**
     * set the value of this signal
     * @param signal the new value being set
     */
    public setSignal(signal:signalType):void{
        this.signal = signal;
        this.SignalKeep();
    }

    /**
     * keey the original signal
     */
    public SignalKeep():void{
        this.notifyChange();
        this.reactFunc();
    }
    /**
     * Add a new notifying function to this signal object
     * @param notifychangeFunc a new notifying signal
     */
    public addNotifyChangeFunc(notifychangeFunc:Function):void{
        this.notifyChangeFuncs.push(notifychangeFunc);
    }

    /**
     * if the value of this signal changes, call all the notifying method in this {@link notifyChangeFuncs}
     * @returns 
     */
    private notifyChange():void{
        if (this.notifyChangeFuncs.length === 0)
            return;
        this.notifyChangeFuncs.forEach(changeFuncs => {
            changeFuncs();
        });
    }

    /**
     * synchronize signal
     * @param changedSignal the changed signal
     * @param LogicFunc the calling function
     */
    public syncSignal(changedSignal:Signal,LogicFunc:(Signal:signalType)=>signalType):void{
        this.setSignal(LogicFunc(changedSignal.getSignal()));
    }

}