"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapForI = void 0;
/**
 * MapForI stores some type I core instructions and their corresponding 6 bits opcodes.
 */
class MapForI {
    //MapForI is a singleton
    constructor() { }
    static getMap() {
        return this.map;
    }
}
exports.MapForI = MapForI;
MapForI.map = new Map([
    ["addi", "001000"],
    ["addiu", "001001"],
    ["andi", "001100"],
    ["beq", "000100"],
    ["bne", "000101"],
    ["lbu", "100100"],
    ["lhu", "100101"],
    ["ll", "110000"],
    ["lui", "001111"],
    ["lw", "100011"],
    ["ori", "001101"],
    ["slti", "001010"],
    ["sltiu", "001011"],
    ["sb", "101000"],
    ["sc", "111000"],
    ["sh", "101001"],
    ["sw", "101011"]
]);
//# sourceMappingURL=MapForI.js.map