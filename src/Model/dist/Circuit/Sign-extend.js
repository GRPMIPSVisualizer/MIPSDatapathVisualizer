"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignExtend = void 0;
const BItsGenerator_1 = require("../Library/BItsGenerator");
const StringHandle_1 = require("../Library/StringHandle");
/**
 * This class is the abstract model of a real sign extend componet
 */
class SignExtend {
    /**
     * The construcor initializes all the fields
     */
    constructor() {
        /**
         * the operation code will decides how the input data being sign extended
         */
        this.opCode = BItsGenerator_1.init_bits(6);
        this.inPin16 = "0000000000000000";
        this.outPin32 = "";
        this.signExtend([false, false]);
    }
    /**
     * set the 16bits inPin and set the outPin32 accordingto ALUOp
     * @param inPin the 16bits input Pin
     * @param ALUOp the ALUOp
     */
    setInPin16(inPin, ALUOp) {
        if (inPin.length != 16)
            throw Error("Sign Extend Input length is not 16.");
        StringHandle_1.binaryDetect(inPin);
        this.inPin16 = inPin;
        this.signExtend(ALUOp);
    }
    /**
     * the logic of sign extend.
     * @param ALUOp the ALUOp
     * @returns nothing
     */
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
    /**
     * get the OutPin32 of this SignExtend class
     * @returns the value of {@link outPin32}
     */
    getOutPin32() {
        return this.outPin32;
    }
}
exports.SignExtend = SignExtend;
//# sourceMappingURL=Sign-extend.js.map