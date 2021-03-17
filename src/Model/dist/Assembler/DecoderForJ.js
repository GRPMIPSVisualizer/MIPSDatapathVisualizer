"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecoderForJ = void 0;
const Decoder_1 = require("./Decoder");
const InstructionJ_1 = require("./InstructionJ");
class DecoderForJ extends Decoder_1.Decoder {
    constructor() {
        super();
        this.errMsg = "";
    }
    static getDecoder() {
        return this.decoder;
    }
    validate() {
        let posOfSpace = this.ins.indexOf(" ");
        let operandADDRESS = this.ins.substring(posOfSpace + 1, this.ins.length);
        let patt1 = /^[0-9]+$/;
        if (!patt1.test(operandADDRESS)) {
            this.errMsg = this.errMsg + "Error 208: Invalid address. -- " + this.getIns() + "\n";
            return false;
        }
        return true;
    }
    decode() {
        let instruction = new InstructionJ_1.InstructionJ(this.ins);
        this.binIns = instruction.getBinIns();
    }
    getErrMsg() {
        return this.errMsg;
    }
}
exports.DecoderForJ = DecoderForJ;
DecoderForJ.decoder = new DecoderForJ();
//# sourceMappingURL=DecoderForJ.js.map