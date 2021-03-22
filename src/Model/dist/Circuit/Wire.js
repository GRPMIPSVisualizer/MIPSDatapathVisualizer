"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wire = void 0;
/**
 * Class Wire is the base class for DFlipFlop and Register<br/>
 * if two components are connected by a wire object, then if the some values of component wrapped at changePin changes,
 * the component connected to reactPin will call reactive functions to change its state.
 */
class Wire {
    /**
     * initialize a wire and add a notifying function
     * @param changePin the changing signal
     * @param reactPin the signal that should react to the change
     * @param LogicFunc the notifying function
     */
    constructor(changePin, reactPin, LogicFunc = function (signal) { return signal; }) {
        this.changePin = changePin;
        this.reactPin = reactPin;
        this.reactPin.setSignal(LogicFunc(this.changePin.getSignal()));
        this.changePin.addNotifyChangeFunc(this.reactPin.syncSignal.bind(this.reactPin, this.changePin, LogicFunc));
    }
}
exports.Wire = Wire;
//# sourceMappingURL=Wire.js.map