import { Signal,signalType } from "./Signal";
/**
 * Class Wire is the base class for DFlipFlop and Register<br/>
 * if two components are connected by a wire object, then if the some values of component wrapped at changePin changes,
 * the component connected to reactPin will call reactive functions to change its state.
 */
export class Wire{
    private changePin:Signal;
    private reactPin:Signal;
    /**
     * initialize a wire and add a notifying function
     * @param changePin the changing signal
     * @param reactPin the signal that should react to the change
     * @param LogicFunc the notifying function
     */
    constructor(changePin:Signal,reactPin:Signal,LogicFunc:(Signal:signalType)=>signalType = function(signal:signalType){return signal}){
        this.changePin = changePin;
        this.reactPin = reactPin;
        this.reactPin.setSignal(LogicFunc(this.changePin.getSignal()));
        this.changePin.addNotifyChangeFunc(this.reactPin.syncSignal.bind(this.reactPin,this.changePin,LogicFunc));
    }
}