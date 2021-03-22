"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALUControl = exports.ControlUnits = void 0;
const BooleanHandler_1 = require("../Library/BooleanHandler");
const StringHandle_1 = require("../Library/StringHandle");
/**
 * Class ControlUnits is an abstract model of real Control Unit<br/>
 * It implements the functionalities of a real Control Unit by simulating how Control Unit works<br/>
 * This is also one of core componets of MIPS circuit
 */
class ControlUnits {
    constructor() {
        /**
         * operation code 0.(operation code is the first 6 bits of MIPS machine code)
         */
        this.Op0 = false;
        /**
         * operation code 1.
         */
        this.Op1 = false;
        /**
         * operation code 2.
         */
        this.Op2 = false;
        /**
         * operation code 3.
         */
        this.Op3 = false;
        /**
         * operation code 4.
         */
        this.Op4 = false;
        /**
         * operation code 5.
         */
        this.Op5 = false;
        /**
         * the register destination signal
         */
        this.RegDes = false;
        /**
         * the jump signal
         */
        this.Jump = false;
        /**
         * the branch signal
         */
        this.Branch = false;
        /**
         * the memory read signal
         */
        this.MemRead = false;
        /**
         * the memory wirte to register signal
         */
        this.MemtoReg = false;
        /**
         * the ALUOp code 0
         */
        this.ALUOp0 = false;
        /**
         * the ALUOp code 1
         */
        this.ALUOp1 = false;
        /**
         * the Memory write signal
         */
        this.MemWrite = false;
        /**
         * the ALU inpin32B source signal
         */
        this.ALUSrc = false;
        /**
         * The Register Write signal
         */
        this.RegWrite = false;
        /**
         * immediate code. will assign to ALU
         */
        this.ImCode = "0000";
    }
    /**
     * As the name indicates, this method will set 6bits Operation Code
     * @param code
     */
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
    /**
     * Memory watches the change of outPin32 and change the operation Code accordingly
     * @param conMem the Memory component
     */
    changeOp(conMem) {
        this.setOp(StringHandle_1.bitsMapping(conMem.getTextOutpin(), 26, 32));
    }
    /**
     * Add new Ins Code(new operation code) to reactive functions
     * @param code the new operation code that should be handled properly.
     * @returns
     */
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
    /**
     * I-type instruction's reactive method.<br/>
     * The output signals will be set according to specific I-type code
     * @param code the operation code
     * @returns nothing
     */
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
    /**
     * basic instruction's reactive method.<br/>
     * The output signals will be set according to specific operation code
     */
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
    /**
     * get 2-bits ALUOp in the form of an array
     * @returns a array of boolean
     */
    getALUOp() {
        return [this.ALUOp0, this.ALUOp1];
    }
    /**
     * get the immediate code
     * @returns the immediate code
     */
    getImcode() {
        return this.ImCode;
    }
    /**
     * get all output signals
     * @returns all output signals in the array of boolean
     */
    getAllSignal() {
        return [this.RegDes, this.Jump, this.Branch, this.MemRead, this.MemtoReg, this.ALUOp0, this.ALUOp1, this.MemWrite, this.ALUSrc, this.RegWrite];
    }
}
exports.ControlUnits = ControlUnits;
/**
 * Class ALUControl is an abstract model of ALU Control<br/>
 * The basic functionalities of ALU Control are implemented here
 */
class ALUControl {
    /**
     * initialize {@link ALU} and {@link _4OperationBits}
     * @param ALU the ALU that will be connected to this ALU Control
     */
    constructor(ALU) {
        /**
         * the ALUOp0, get from Control Unit
         */
        this.ALUOp0 = false;
        /**
         * the ALUOp1, get from Control Unit
         */
        this.ALUOp1 = false;
        /**
         * bne signal
         */
        this.bne = false; // bne signal
        // private controlUnits:ControlUnits;
        /**
         * the 6-bits operation code in the form of a string
         */
        this.InsCodeStr = "000000";
        /**
         * 6 bits function code
         */
        this.InsCode = new Array();
        // this.controlUnits = ConUni;
        this.ALU = ALU;
        this._4OperationBits = this.conLogic();
    }
    /**
     * As the name indicates, this method will set two ALUOp by getting ALUOp from input controlUnits
     * @param controlUnits the control units that connect to this alu control
     * @returns nothing
     */
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
    /**
     * it's trivial that this method can set the {@link InsCode} and {@link InsCodeStr}
     * @param code the new 6bits code that will assign to {@link InsCode}
     */
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
    /**
     * get InsCode in the form of string
     * @returns a encoding string representing 6-bits inscode
     */
    getInsCodeStr() {
        return this.InsCodeStr;
    }
    /**
     * The logic of how {@link _4OperationBits} is set
     * @returns 4 Operation Bits
     */
    conLogic() {
        let operation0 = this.ALUOp1 && (this.InsCode[0] || this.InsCode[3]);
        let operation1 = !(this.ALUOp1 && this.InsCode[2]);
        let operation2 = (this.ALUOp1 && this.InsCode[1]) || this.ALUOp0;
        let operation3 = this.ALUOp0 && !this.ALUOp0;
        let operation = [BooleanHandler_1.bool2num(operation3), BooleanHandler_1.bool2num(operation2), BooleanHandler_1.bool2num(operation1), BooleanHandler_1.bool2num(operation0)];
        operation = this.newFunctCode(operation);
        return this._4OperationBits = StringHandle_1.intArrayToString(operation);
    }
    /**
     * Additional opCode
     * @param oriOpCode original opcode
     * @returns a number of binary integer which indicates a new 4 bits operation code
     */
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
    /**
     * get 4 bits operation code
     * @returns 4 Operation Bits
     */
    getOperationCode() {
        return this._4OperationBits;
    }
}
exports.ALUControl = ALUControl;
//# sourceMappingURL=ControlUnits.js.map