"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionReporter = void 0;
class ExceptionReporter {
    constructor() {
        this.ExceptionArray = new Array();
    }
    static getReporter() {
        return this.exceptionReporter;
    }
    addException(newExcp) {
        this.ExceptionArray.push(newExcp);
    }
    isEmpty() {
        if (this.ExceptionArray.length == 0)
            return true;
        return false;
    }
    reportException() {
        return this.ExceptionArray;
    }
    clearException() {
        this.ExceptionArray = new Array();
    }
}
exports.ExceptionReporter = ExceptionReporter;
ExceptionReporter.exceptionReporter = new ExceptionReporter();
//# sourceMappingURL=ExceptionReporter.js.map