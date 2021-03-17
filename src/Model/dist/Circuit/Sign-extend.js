"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignExtend = void 0;
const BItsGenerator_1 = require("../Library/BItsGenerator");
const StringHandle_1 = require("../Library/StringHandle");
class SignExtend {
    constructor() {
        this.opCode = BItsGenerator_1.init_bits(6);
        this.inPin16 = "0000000000000000";
        this.outPin32 = "";
        this.signExtend([false, false]);
    }
    setInPin16(inPin, ALUOp) {
        if (inPin.length != 16)
            throw Error("Sign Extend Input length is not 16.");
        StringHandle_1.binaryDetect(inPin);
        this.inPin16 = inPin;
        this.signExtend(ALUOp);
    }
    signExtend(ALUOp) {
        if (this.opCode == "001111") {
            this.outPin32 = this.inPin16 + "0000000000000000";
            return;
        }
        if (this.inPin16.charAt(0) == '0' || (ALUOp[0] && ALUOp[1] && this.opCode != "000101" && this.opCode != "001010" && this.opCode != "001011")) {
            this.outPin32 = "0000000000000000" + this.inPin16;
            return;
        }
        if (this.inPin16.charAt(0) == '1') {
            this.outPin32 = "1111111111111111" + this.inPin16;
        }
    }
    getOutPin32() {
        return this.outPin32;
    }
}
exports.SignExtend = SignExtend;
//# sourceMappingURL=Sign-extend.js.map