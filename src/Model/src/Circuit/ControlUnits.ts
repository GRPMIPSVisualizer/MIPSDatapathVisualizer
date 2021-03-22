import { bool2num, num2bool } from "../Library/BooleanHandler";
import { bin2dec, binaryDetect, bitsMapping, intArrayToString, stringToIntArray } from "../Library/StringHandle";
import { ALU } from "./ALU";
import { Memory } from "./Memory";
/**
 * Class ControlUnits is an abstract model of real Control Unit<br/>
 * It implements the functionalities of a real Control Unit by simulating how Control Unit works<br/>
 * This is also one of core componets of MIPS circuit
 */
export class ControlUnits{
    /**
     * operation code 0.(operation code is the first 6 bits of MIPS machine code)
     */
    private Op0:boolean = false;
    /**
     * operation code 1.
     */
    private Op1:boolean = false;
    /**
     * operation code 2.
     */
    private Op2:boolean = false;
    /**
     * operation code 3.
     */
    private Op3:boolean = false;
    /**
     * operation code 4.
     */
    private Op4:boolean = false;
    /**
     * operation code 5.
     */
    private Op5:boolean = false;

    /**
     * the register destination signal
     */
    protected RegDes:boolean = false;
    /**
     * the jump signal
     */
    protected Jump:boolean = false;
    /**
     * the branch signal
     */
    protected Branch:boolean = false;
    /**
     * the memory read signal
     */
    protected MemRead:boolean = false;
    /**
     * the memory wirte to register signal
     */
    protected MemtoReg:boolean = false;
    /**
     * the ALUOp code 0
     */
    protected ALUOp0:boolean = false;
    /**
     * the ALUOp code 1
     */
    protected ALUOp1:boolean = false;
    /**
     * the Memory write signal
     */
    protected MemWrite:boolean = false;
    /**
     * the ALU inpin32B source signal
     */
    protected ALUSrc:boolean = false;
    /**
     * The Register Write signal
     */
    protected RegWrite:boolean = false;
    /**
     * immediate code. will assign to ALU
     */
    protected ImCode:string = "0000";
   

    constructor(){
        
    }
    /**
     * As the name indicates, this method will set 6bits Operation Code
     * @param code 
     */
    protected setOp(code:string):void{
        if (code.length != 6)
            throw Error("The length of Op fields is not 6");
        binaryDetect(code);
        let codeBits:number[] = stringToIntArray(code);
        this.Op0 = num2bool(codeBits[5]);
        this.Op1 = num2bool(codeBits[4]);
        this.Op2 = num2bool(codeBits[3]);
        this.Op3 = num2bool(codeBits[2]);
        this.Op4 = num2bool(codeBits[1]);
        this.Op5 = num2bool(codeBits[0]);
        this.conLogic();
        this.iType(code);
        // this.addedIns(code);
        
    }
    /**
     * Memory watches the change of outPin32 and change the operation Code accordingly 
     * @param conMem the Memory component
     */
    public changeOp(conMem:Memory):void{
        this.setOp(bitsMapping(conMem.getTextOutpin(),26,32));
    }

    

    /**
     * Add new Ins Code(new operation code) to reactive functions
     * @param code the new operation code that should be handled properly.
     * @returns 
     */
    private addedIns(code:string):void{
        let decCode:number = bin2dec("00000000000000000000000000"+code,true);
        // if (decCode == )

        // jal
        if (decCode == 3){
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
    private iType(code:string):void{
        let decCode:number = bin2dec("00000000000000000000000000"+code,true);
        // addi addiu
        if (decCode == 8 || decCode == 9){
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
        if (decCode == 5){
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
            this.ImCode = "0110"
            return;
        }

        // lui
        if (decCode == 15){
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
            this.ImCode = "0010"
            return;
        }
        // andi
        if (decCode == 12){
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
            this.ImCode = "0000"
            return;
        }
        // ori
        if (decCode == 13){
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
            this.ImCode = "0001"
            return;
        }
        // slti sltiu
        if (decCode == 10 || decCode == 11){
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
            this.ImCode = "0111"
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
    private conLogic():void{
        let lw:boolean = this.Op0 && this.Op1 && !this.Op2 && !this.Op3 && !this.Op4 && this.Op5;
        let sw:boolean = this.Op0 && this.Op1 && !this.Op2 && this.Op3 && !this.Op4 && this.Op5;
        let beq:boolean = !this.Op0 && !this.Op1 && this.Op2 && !this.Op3 && !this.Op4 && !this.Op5;

        this.RegDes = !(this.Op0 || this.Op1 || this.Op2 || this.Op3 || this.Op4 || this.Op5 );
        this.ALUSrc = lw || sw;
        this.MemtoReg = lw;
        this.RegWrite = this.RegDes || lw;
        this.MemRead = lw;
        this.MemWrite = sw;
        this.Branch = beq;
        this.ALUOp1 = !(this.Op0 || this.Op1 || this.Op2 || this.Op3 || this.Op4 || this.Op5 );
        this.ALUOp0 = beq;
        this.Jump = !this.Op0 && this.Op1 && !this.Op2 && !this.Op3 && !this.Op4 && !this.Op5;

    }
    /**
     * get 2-bits ALUOp in the form of an array
     * @returns a array of boolean
     */
    public getALUOp():boolean[]{
        return [this.ALUOp0,this.ALUOp1];
    }

    /**
     * get the immediate code
     * @returns the immediate code
     */
    public getImcode():string{
        return this.ImCode;
    }
    /**
     * get all output signals
     * @returns all output signals in the array of boolean
     */
    public getAllSignal():boolean[]{
        return [this.RegDes,this.Jump,this.Branch,this.MemRead,this.MemtoReg,this.ALUOp0,this.ALUOp1,this.MemWrite,this.ALUSrc,this.RegWrite];
    }
}

/**
 * Class ALUControl is an abstract model of ALU Control<br/>
 * The basic functionalities of ALU Control are implemented here
 */
export class ALUControl{
    /**
     * the ALUOp0, get from Control Unit
     */
    protected ALUOp0:boolean = false;
    /**
     * the ALUOp1, get from Control Unit
     */
    protected ALUOp1:boolean = false;
    /**
     * bne signal
     */
    protected bne:boolean = false; // bne signal
    // private controlUnits:ControlUnits;
    /**
     * the 6-bits operation code in the form of a string
     */
    private InsCodeStr:string = "000000";
    /**
     * 6 bits function code
     */
    private InsCode:boolean[] = new Array<boolean>();
    /**
     * the output will be 4 bits control bits
     */
    private _4OperationBits:string;
    /**
     * the connected ALU
     */
    protected ALU:ALU;
    /**
     * initialize {@link ALU} and {@link _4OperationBits}
     * @param ALU the ALU that will be connected to this ALU Control
     */
    constructor(ALU:ALU){
        // this.controlUnits = ConUni;
        this.ALU = ALU;
        this._4OperationBits = this.conLogic();
    }
    /**
     * As the name indicates, this method will set two ALUOp by getting ALUOp from input controlUnits
     * @param controlUnits the control units that connect to this alu control
     * @returns nothing
     */
    public setALUOp(controlUnits:ControlUnits):void{
        [this.ALUOp0,this.ALUOp1] = controlUnits.getALUOp();
        this.bne = false;
        if (this.ALUOp0 && this.ALUOp1){
            this._4OperationBits = controlUnits.getImcode();
            if (this._4OperationBits == "0110"){
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
    public setIns(code:string):void{
        if (code.length != 6)
            throw Error("The length of Op fields is not 6");
        binaryDetect(code);
        let codeBits:number[] = stringToIntArray(code);
        let newCode:boolean[] = new Array<boolean>();
        codeBits.forEach(bit=>{
            newCode.unshift(num2bool(bit));
        });
        this.InsCode = newCode;
        this.InsCodeStr = code;
        this.conLogic();
    }
    /**
     * get InsCode in the form of string
     * @returns a encoding string representing 6-bits inscode
     */
    public getInsCodeStr():string{
        return this.InsCodeStr;
    }
    /**
     * The logic of how {@link _4OperationBits} is set
     * @returns 4 Operation Bits
     */
    private conLogic():string{
        let operation0:boolean = this.ALUOp1 && (this.InsCode[0] || this.InsCode[3]);
        let operation1:boolean = !( this.ALUOp1 && this.InsCode[2]);
        let operation2:boolean = (this.ALUOp1 && this.InsCode[1]) || this.ALUOp0;
        let operation3:boolean = this.ALUOp0 && !this.ALUOp0;
        let operation:number[] = [bool2num(operation3),bool2num(operation2),bool2num(operation1),bool2num(operation0)];
        operation = this.newFunctCode(operation);
        return this._4OperationBits = intArrayToString(operation);
    }
    /**
     * Additional opCode
     * @param oriOpCode original opcode
     * @returns a number of binary integer which indicates a new 4 bits operation code
     */
    private newFunctCode(oriOpCode:number[]):number[]{
        // this.ALU.isUnsign = false;
        if (!this.ALUOp1 || this.ALUOp0){
            return oriOpCode;
        }

        if (this.InsCode[0] && this.InsCode[1] && this.InsCode[2] && !this.InsCode[3] && !this.InsCode[4] && this.InsCode[5]){
            return [1,1,0,0];
        }
        if (this.InsCode[0] && !this.InsCode[1] && !this.InsCode[2] && !this.InsCode[3] && !this.InsCode[4] && this.InsCode[5]){
            return [0,0,1,0];
        }
        if (this.InsCode[0] && this.InsCode[1] && !this.InsCode[2] && this.InsCode[3] && !this.InsCode[4] && this.InsCode[5]){
            // this.ALU.isUnsign = true;
            return [0,1,1,1];
        }
        if (this.InsCode[0] && this.InsCode[1] && !this.InsCode[2] && !this.InsCode[3] && !this.InsCode[4] && this.InsCode[5]){
            return [0,1,1,0];
        }
        // sll
        if (!this.InsCode[0] && !this.InsCode[1] && !this.InsCode[2] && !this.InsCode[3] && !this.InsCode[4] && !this.InsCode[5]){
            return [1,1,1,0];
        }

        // srl
        if (!this.InsCode[0] && this.InsCode[1] && !this.InsCode[2] && !this.InsCode[3] && !this.InsCode[4] && !this.InsCode[5]){
            return [1,1,1,1];
        }
        // sra
        if (this.InsCode[0] && this.InsCode[1] && !this.InsCode[2] && !this.InsCode[3] && !this.InsCode[4] && !this.InsCode[5]){
            return [1,1,0,1];
        }
        // syscall
        if (!this.InsCode[0] && !this.InsCode[1] && this.InsCode[2] && this.InsCode[3] && !this.InsCode[4] && !this.InsCode[5]){
            return [0,0,0,0];
        }
        return oriOpCode;
    }
    /**
     * get 4 bits operation code
     * @returns 4 Operation Bits
     */
    public getOperationCode():string{
        return this._4OperationBits;
    }
}