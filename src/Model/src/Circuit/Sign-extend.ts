import { init_bits } from "../Library/BItsGenerator";
import { binaryDetect } from "../Library/StringHandle";
/**
 * This class is the abstract model of a real sign extend componet
 */
export class SignExtend{
    /**
     * the 16-bits input Pin
     */
    private inPin16:string;
    /**
     * the 32 bits sign extended string pf input data
     */
    private outPin32:string;
    /**
     * the operation code will decides how the input data being sign extended
     */
    protected opCode:string = init_bits(6);

    /**
     * The construcor initializes all the fields
     */
    constructor(){
        this.inPin16 = "0000000000000000"
        this.outPin32 = "";
        this.signExtend([false,false]);
    }

    /**
     * set the 16bits inPin and set the outPin32 accordingto ALUOp
     * @param inPin the 16bits input Pin
     * @param ALUOp the ALUOp
     */
    public setInPin16(inPin:string,ALUOp:boolean[]):void{
        if (inPin.length != 16)
            throw Error("Sign Extend Input length is not 16.");
        binaryDetect(inPin);
        this.inPin16 = inPin;
        this.signExtend(ALUOp);
    }

    /**
     * the logic of sign extend.
     * @param ALUOp the ALUOp
     * @returns nothing
     */
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
    /**
     * get the OutPin32 of this SignExtend class
     * @returns the value of {@link outPin32}
     */
    public getOutPin32():string{
        return this.outPin32;
    }

}