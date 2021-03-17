import {Decoder} from "./Decoder";
import {InstructionJ} from "./InstructionJ";

export class DecoderForJ extends Decoder {
    private errMsg: string = "";
    private static decoder: DecoderForJ = new DecoderForJ();

    private constructor(){
        super();
    }

    public static getDecoder(): DecoderForJ {
        return this.decoder;
    }

    public validate(): boolean {
        let posOfSpace: number = this.ins.indexOf(" ");
        let operandADDRESS = this.ins.substring(posOfSpace + 1, this.ins.length);
        let patt1 = /^[0-9]+$/;

        if (!patt1.test(operandADDRESS)) {
            this.errMsg = this.errMsg + "Error 208: Invalid address. -- " + this.getIns() + "\n";
            return false;
        }
        return true;
    }
    
    public decode(): void {
        let instruction: InstructionJ = new InstructionJ(this.ins);
        this.binIns = instruction.getBinIns();
    }

    public getErrMsg(): string {
        return this.errMsg;
    }
}