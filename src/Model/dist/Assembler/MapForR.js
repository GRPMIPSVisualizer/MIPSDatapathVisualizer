"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapForR = void 0;
class MapForR {
    constructor() { }
    static getMap() {
        return this.map;
    }
}
exports.MapForR = MapForR;
MapForR.map = new Map([
    ["add", "100000"],
    ["addu", "100001"],
    ["sub", "100010"],
    ["subu", "100011"],
    ["and", "100100"],
    ["or", "100101"],
    ["nor", "100111"],
    ["slt", "101010"],
    ["sltu", "101011"],
    ["sll", "000000"],
    ["srl", "000010"],
    ["jr", "001000"],
    ["sra", "000011"]
]);
//# sourceMappingURL=MapForR.js.map