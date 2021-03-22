"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signal = void 0;
const BooleanHandler_1 = require("../Library/BooleanHandler");
/**
 * Class Signal is an abstract model for pin signal
 */
class Signal {
    //debug
    // public name:string="";
    /**
     * the constructor initializes the value of this signal and set the reactive function
     * @param signal the initial value of this signal class
     * @param reactFunc the initial reactive function
     */
    constructor(signal, reactFunc = function () { }) {
        this.signal = signal;
        this.reactFunc = reactFunc;
        this.notifyChangeFuncs = new Array();
    }
    /**
     * get the value of this signal
     * @returns the value of this signal
     */
    getSignal() {
        return this.signal;
    }
    /**
     * change the value of this signal
     */
    changeSiganl() {
        if (typeof this.signal === "boolean")
            this.signal = !this.signal;
        if (typeof this.signal === "number")
            this.signal = BooleanHandler_1.bool2num(!BooleanHandler_1.num2bool(this.signal));
        this.SignalKeep();
    }
    /**
     * set tje react Function of this signal
     * @param reactFunc the reactive function being set
     */
    setReactFunc(reactFunc) {
        this.reactFunc = reactFunc;
    }
    /**
     * set the value of this signal
     * @param signal the new value being set
     */
    setSignal(signal) {
        this.signal = signal;
        this.SignalKeep();
    }
    /**
     * keey the original signal
     */
    SignalKeep() {
        this.notifyChange();
        this.reactFunc();
    }
    /**
     * Add a new notifying function to this signal object
     * @param notifychangeFunc a new notifying signal
     */
    addNotifyChangeFunc(notifychangeFunc) {
        this.notifyChangeFuncs.push(notifychangeFunc);
    }
    /**
     * if the value of this signal changes, call all the notifying method in this {@link notifyChangeFuncs}
     * @returns
     */
    notifyChange() {
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
    syncSignal(changedSignal, LogicFunc) {
        this.setSignal(LogicFunc(changedSignal.getSignal()));
    }
}
exports.Signal = Signal;
//# sourceMappingURL=Signal.js.map