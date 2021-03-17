import {decimalToBinary} from "./DecimalToBinary";
import {Instruction} from "./Instruction";
import {MapForJ} from "./MapForJ";

export class InstructionJ extends Instruction{

    private operandADDRESS: string;
    private op: string;
    private address: string;
    private errMsg: string = "";

    //The ins should be in the form like "j 10000".
    //There should be only one space between the operator and the first operand, no other space existing.
    //The address should be represented by a decimal number.
    constructor(ins: string) {
        super(ins);
        let opBin: string | undefined = MapForJ.getMap().get(this.operator);
        if (opBin == undefined) {
            this.op = "XXXXXX";
            this.errMsg = this.errMsg + "Error 102: Failed to construct type-J instruction. -- " + ins + "\n";
        } else {
            this.op = opBin;
        }

        let posOfSpace: number = ins.indexOf(" ");
        this.operandADDRESS = ins.substring(posOfSpace + 1, ins.length);
        this.address = decimalToBinary(+this.operandADDRESS, 26);
 
        this.binIns = this.op + this.address;
    }

    public getErrMsg(): string {
        return this.errMsg;
    }
}