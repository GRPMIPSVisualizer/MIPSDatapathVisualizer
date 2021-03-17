import { init_bits } from "../Library/BItsGenerator";
import { binaryDetect } from "../Library/StringHandle";

export class SignExtend{
    private inPin16:string;
    private outPin32:string;
    protected opCode:string = init_bits(6);
    constructor(){
        this.inPin16 = "0000000000000000"
        this.outPin32 = "";
        this.signExtend([false,false]);
    }

    public setInPin16(inPin:string,ALUOp:boolean[]):void{
        if (inPin.length != 16)
            throw Error("Sign Extend Input length is not 16.");
        binaryDetect(inPin);
        this.inPin16 = inPin;
        this.signExtend(ALUOp);
    }

    private signExtend(ALUOp:boolean[]):void{
        if (this.opCode == "001111"){
            this.outPin32 = this.inPin16 + "0000000000000000";
            return;
        }
        
        if (this.inPin16.charAt(0) == '0' || (ALUOp[0] && ALUOp[1] && this.opCode != "000101" && this.opCode != "001010" && this.opCode != "001011")){
            this.outPin32 = "0000000000000000" + this.inPin16;
            return;
        }

        if (this.inPin16.charAt(0) == '1'){
            this.outPin32 = "1111111111111111" + this.inPin16;
        }
    }

    public getOutPin32():string{
        return this.outPin32;
    }

}