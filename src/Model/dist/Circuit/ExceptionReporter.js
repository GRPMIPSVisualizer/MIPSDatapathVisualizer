"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionReporter = void 0;
/**
 * This class accepts singleton design pattern
 */
class ExceptionReporter {
    /**
     * the constructor is set to private. So this class can't be instantiated outside this class
     */
    constructor() {
        /**
         * an array of string which stores the exception information
         */
        this.ExceptionArray = new Array();
    }
    /**
     * get the instantiated object of an exception reportor
     * @returns the instantiated object of this class
     */
    static getReporter() {
        return this.exceptionReporter;
    }
    /**
     * Add a new exception information to {@link ExceptionArray}<br/>
     * This message will be passed to console and render on the screen
     * @param newExcp new exception information message
     */
    addException(newExcp) {
        this.ExceptionArray.push(newExcp);
    }
    /**
     * a boolean value which indicates whether the exception array is empty
     * @returns true if empty, false otherwise
     */
    isEmpty() {
        if (this.ExceptionArray.length == 0)
            return true;
        return false;
    }
    /**
     * report exception by passing exception messages to console
     */
    reportException() {
        return this.ExceptionArray;
    }
    /**
     * clear exceptions
     */
    clearException() {
        this.ExceptionArray = new Array();
    }
}
exports.ExceptionReporter = ExceptionReporter;
/**
 * the only instantiated object of this class.
 */
ExceptionReporter.exceptionReporter = new ExceptionReporter();
//# sourceMappingURL=ExceptionReporter.js.map