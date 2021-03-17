"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALUControl = exports.ControlUnits = void 0;
const BooleanHandler_1 = require("../Library/BooleanHandler");
const StringHandle_1 = require("../Library/StringHandle");
class ControlUnits {
    constructor() {
        this.Op0 = false;
        this.Op1 = false;
        this.Op2 = false;
        this.Op3 = false;
        this.Op4 = false;
        this.Op5 = false;
        this.RegDes = false;
        this.Jump = false;
        this.Branch = false;
        this.MemRead = false;
        this.MemtoReg = false;
        this.ALUOp0 = false;
        this.ALUOp1 = false;
        this.MemWrite = false;
        this.ALUSrc = false;
        this.RegWrite = false;
        this.ImCode = "0000";
    }
    setOp(code) {
        if (code.length != 6)
            throw Error("The length of Op fields is not 6");
        StringHandle_1.binaryDetect(code);
        let codeBits = StringHandle_1.stringToIntArray(code);
        this.Op0 = BooleanHandler_1.num2bool(codeBits[5]);
        this.Op1 = BooleanHandler_1.num2bool(codeBits[4]);
        this.Op2 = BooleanHandler_1.num2bool(codeBits[3]);
        this.Op3 = BooleanHandler_1.num2bool(codeBits[2]);
        this.Op4 = BooleanHandler_1.num2bool(codeBits[1]);
        this.Op5 = BooleanHandler_1.num2bool(codeBits[0]);
        this.conLogic();
        this.iType(code);
        // this.addedIns(code);
    }
    changeOp(conMem) {
        this.setOp(StringHandle_1.bitsMapping(conMem.getTextOutpin(), 26, 32));
    }
    addedIns(code) {
        let decCode = StringHandle_1.bin2dec("00000000000000000000000000" + code, true);
        // if (decCode == )
        // jal
        if (decCode == 3) {
            this.RegDes = false;
            this.ALUSrc = true;
            this.MemtoReg = false;
            this.RegWrite = true;
            this.MemRead = false;
            this.MemWrite = false;
            this.Branch = false;
            this.ALUOp1 = false;
            this.ALUOp0 = false;
            this.Jump = true;
            return;
        }
    }
    iType(code) {
        let decCode = StringHandle_1.bin2dec("00000000000000000000000000" + code, true);
        // addi addiu
        if (decCode == 8 || decCode == 9) {
            this.RegDes = false;
            this.ALUSrc = true;
            this.MemtoReg = false;
            this.RegWrite = true;
            this.MemRead = false;
            this.MemWrite = false;
            this.Branch = false;
            this.ALUOp1 = false;
            this.ALUOp0 = false;
            this.Jump = false;
            return;
        }
        // bne
        if (decCode == 5) {
            this.RegDes = false;
            this.ALUSrc = false;
            this.MemtoReg = false;
            this.RegWrite = false;
            this.MemRead = false;
            this.MemWrite = false;
            this.Branch = true;
            this.ALUOp1 = true;
            this.ALUOp0 = true;
            this.Jump = false;
            this.ImCode = "0110";
            return;
        }
        // lui
        if (decCode == 15) {
            this.RegDes = false;
            this.ALUSrc = true;
            this.MemtoReg = false;
            this.RegWrite = true;
            this.MemRead = false;
            this.MemWrite = false;
            this.Branch = false;
            this.ALUOp1 = true;
            this.ALUOp0 = true;
            this.Jump = false;
            this.ImCode = "0010";
            return;
        }
        // andi
        if (decCode == 12) {
            this.RegDes = false;
            this.ALUSrc = true;
            this.MemtoReg = false;
            this.RegWrite = true;
            this.MemRead = false;
            this.MemWrite = false;
            this.Branch = false;
            this.ALUOp1 = true;
            this.ALUOp0 = true;
            this.Jump = false;
            this.ImCode = "0000";
            return;
        }
        // ori
        if (decCode == 13) {
            this.RegDes = false;
            this.ALUSrc = true;
            this.MemtoReg = false;
            this.RegWrite = true;
            this.MemRead = false;
            this.MemWrite = false;
            this.Branch = false;
            this.ALUOp1 = true;
            this.ALUOp0 = true;
            this.Jump = false;
            this.ImCode = "0001";
            return;
        }
        // slti sltiu
        if (decCode == 10 || decCode == 11) {
            this.RegDes = false;
            this.ALUSrc = true;
            this.MemtoReg = false;
            this.RegWrite = true;
            this.MemRead = false;
            this.MemWrite = false;
            this.Branch = false;
            this.ALUOp1 = true;
            this.ALUOp0 = true;
            this.Jump = false;
            this.ImCode = "0111";
            return;
        }
        //     this.RegDes = 
        //     this.ALUSrc = 
        //     this.MemtoReg = 
        //     this.RegWrite = 
        //     this.MemRead = 
        //     this.MemWrite = 
        //     this.Branch = 
        //     this.ALUOp1 = 
        //     this.ALUOp0 = 
        //     this.Jump = 
    }
    conLogic() {
        let lw = this.Op0 && this.Op1 && !this.Op2 && !this.Op3 && !this.Op4 && this.Op5;
        let sw = this.Op0 && this.Op1 && !this.Op2 && this.Op3 && !this.Op4 && this.Op5;
        let beq = !this.Op0 && !this.Op1 && this.Op2 && !this.Op3 && !this.Op4 && !this.Op5;
        this.RegDes = !(this.Op0 || this.Op1 || this.Op2 || this.Op3 || this.Op4 || this.Op5);
        this.ALUSrc = lw || sw;
        this.MemtoReg = lw;
        this.RegWrite = this.RegDes || lw;
        this.MemRead = lw;
        this.MemWrite = sw;
        this.Branch = beq;
        this.ALUOp1 = !(this.Op0 || this.Op1 || this.Op2 || this.Op3 || this.Op4 || this.Op5);
        this.ALUOp0 = beq;
        this.Jump = !this.Op0 && this.Op1 && !this.Op2 && !this.Op3 && !this.Op4 && !this.Op5;
    }
    getALUOp() {
        return [this.ALUOp0, this.ALUOp1];
    }
    getImcode() {
        return this.ImCode;
    }
    getAllSignal() {
        return [this.RegDes, this.Jump, this.Branch, this.MemRead, this.MemtoReg, this.ALUOp0, this.ALUOp1, this.MemWrite, this.ALUSrc, this.RegWrite];
    }
}
exports.ControlUnits = ControlUnits;
class ALUControl {
    constructor(ALU) {
        this.ALUOp0 = false;
        this.ALUOp1 = false;
        this.bne = false; // bne signal
        // private controlUnits:ControlUnits;
        this.InsCodeStr = "000000";
        this.InsCode = new Array();
        // this.controlUnits = ConUni;
        this.ALU = ALU;
        this._4OperationBits = this.conLogic();
    }
    setALUOp(controlUnits) {
        [this.ALUOp0, this.ALUOp1] = controlUnits.getALUOp();
        this.bne = false;
        if (this.ALUOp0 && this.ALUOp1) {
            this._4OperationBits = controlUnits.getImcode();
            if (this._4OperationBits == "0110") {
                this.bne = true;
            }
            return;
        }
        this.conLogic();
    }
    setIns(code) {
        if (code.length != 6)
            throw Error("The length of Op fields is not 6");
        StringHandle_1.binaryDetect(code);
        let codeBits = StringHandle_1.stringToIntArray(code);
        let newCode = new Array();
        codeBits.forEach(bit => {
            newCode.unshift(BooleanHandler_1.num2bool(bit));
        });
        this.InsCode = newCode;
        this.InsCodeStr = code;
        this.conLogic();
    }
    getInsCodeStr() {
        return this.InsCodeStr;
    }
    conLogic() {
        let operation0 = this.ALUOp1 && (this.InsCode[0] || this.InsCode[3]);
        let operation1 = !(this.ALUOp1 && this.InsCode[2]);
        let operation2 = (this.ALUOp1 && this.InsCode[1]) || this.ALUOp0;
        let operation3 = this.ALUOp0 && !this.ALUOp0;
        let operation = [BooleanHandler_1.bool2num(operation3), BooleanHandler_1.bool2num(operation2), BooleanHandler_1.bool2num(operation1), BooleanHandler_1.bool2num(operation0)];
        operation = this.newFunctCode(operation);
        return this._4OperationBits = StringHandle_1.intArrayToString(operation);
    }
    newFunctCode(oriOpCode) {
        // this.ALU.isUnsign = false;
        if (!this.ALUOp1 || this.ALUOp0) {
            return oriOpCode;
        }
        if (this.InsCode[0] && this.InsCode[1] && this.InsCode[2] && !this.InsCode[3] && !this.InsCode[4] && this.InsCode[5]) {
            return [1, 1, 0, 0];
        }
        if (this.InsCode[0] && !this.InsCode[1] && !this.InsCode[2] && !this.InsCode[3] && !this.InsCode[4] && this.InsCode[5]) {
            return [0, 0, 1, 0];
        }
        if (this.InsCode[0] && this.InsCode[1] && !this.InsCode[2] && this.InsCode[3] && !this.InsCode[4] && this.InsCode[5]) {
            // this.ALU.isUnsign = true;
            return [0, 1, 1, 1];
        }
        if (this.InsCode[0] && this.InsCode[1] && !this.InsCode[2] && !this.InsCode[3] && !this.InsCode[4] && this.InsCode[5]) {
            return [0, 1, 1, 0];
        }
        // sll
        if (!this.InsCode[0] && !this.InsCode[1] && !this.InsCode[2] && !this.InsCode[3] && !this.InsCode[4] && !this.InsCode[5]) {
            return [1, 1, 1, 0];
        }
        // srl
        if (!this.InsCode[0] && this.InsCode[1] && !this.InsCode[2] && !this.InsCode[3] && !this.InsCode[4] && !this.InsCode[5]) {
            return [1, 1, 1, 1];
        }
        // sra
        if (this.InsCode[0] && this.InsCode[1] && !this.InsCode[2] && !this.InsCode[3] && !this.InsCode[4] && !this.InsCode[5]) {
            return [1, 1, 0, 1];
        }
        // syscall
        if (!this.InsCode[0] && !this.InsCode[1] && this.InsCode[2] && this.InsCode[3] && !this.InsCode[4] && !this.InsCode[5]) {
            return [0, 0, 0, 0];
        }
        return oriOpCode;
    }
    getOperationCode() {
        return this._4OperationBits;
    }
}
exports.ALUControl = ALUControl;
//# sourceMappingURL=ControlUnits.js.map