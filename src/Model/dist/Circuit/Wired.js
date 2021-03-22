"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wired = void 0;
const Wire_1 = require("./Wire");
/**
 * Wrapper class for Wire<br/>
 * if a component is connected by wire, it should only extends this class
 */
class Wired {
    constructor() {
        this.Wires = new Array();
    }
    /**
     * Add a wire to the {@link Wires}
     * @param changeSignal the signal that changes
     * @param reactSiganl this signal that should react to changes
     * @param LogicFunc the reactive function
     */
    addWire(changeSignal, reactSiganl, LogicFunc) {
        let newWire = (LogicFunc === undefined) ? new Wire_1.Wire(changeSignal, reactSiganl) : new Wire_1.Wire(changeSignal, reactSiganl, LogicFunc);
        this.Wires.push(newWire);
    }
}
exports.Wired = Wired;
//# sourceMappingURL=Wired.js.map