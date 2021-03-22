import { init_bits } from "../src/Library/BItsGenerator";
import {AND} from "../src/Logic/AND"
import { AND32 } from "../src/Logic/AND32";
import Logic from "../src/Logic/Logic"
import { NAND } from "../src/Logic/NAND";
import { NOT } from "../src/Logic/NOT";
import { NOT32 } from "../src/Logic/NOT32";
import { OR } from "../src/Logic/OR";
import { OR32 } from "../src/Logic/OR32";
import {XOR} from "../src/Logic/XOR"
import {OR32WAY} from "../src/Logic/OR32WAY"

describe('Unit test of Logic Components: ',()=>{
    describe.each([
        [1,1,1],
        [1,0,0],
        [0,1,0],
        [0,0,0]]
        )('1-bits Logic Test: a:%i,b:%i',(a,b,c)=>{
        test(`The outcome of And should be ${c}`,()=>{
            expect(AND.And(a,b)).toBe(c);
        })

        test(`The outcome of Nand should be ${Math.abs(c-1)}`,()=>{
            expect(NAND.Nand(a,b)).toBe(Math.abs(c-1));
        })

        test(`The outcome of Not should be ${Math.abs(a-1)}`,()=>{
            expect(NOT.Not(a)).toBe(Math.abs(a-1));
        })

        test(`The outcome of Or should be ${(Math.abs(a+b)!=0)?1:0}`,()=>{
            expect(OR.Or(a,b)).toBe((Math.abs(a+b)!=0)?1:0);
        })

        test(`The outcome of Xor should be ${Math.abs(a-b)}`,()=>{
            expect(XOR.Xor(a,b)).toBe(Math.abs(a-b));
        })
        let testLogic:Logic = new Logic(a,b);
        let encodeString:string = `${a}${b}0`;
        test(`Logic initialization test`,()=>{
            expect(testLogic.pin1).toBe(a);
            expect(testLogic.pin2).toBe(b);
            expect(testLogic.toBinaryString()).toBe(encodeString);
        });
    });

    describe.each([
        [init_bits(32),"10011001100110011001100110011001",init_bits(32),"11111111111111111111111111111111","10011001100110011001100110011001",0],
        ["10101100101010011111110010101100","10011001100110011001100110011001","10001000100010011001100010001000","01010011010101100000001101010011","10111101101110011111110110111101",1]
        ])('32-bits Logic Test: a:%s,b:%s',(a,b,c,d,e,f)=>{
        
        let testAnd:AND32 = new AND32(a,b);
        test(`The outpin of and32 should be ${c}`,()=>{
            expect(testAnd.outPin32).toBe(c);
        });

        let testNot:NOT32 = new NOT32(a);
        test(`The outpin of not32 should be ${d}`,()=>{
            expect(testNot.outPin32).toBe(d);
        });

        let testOr:OR32 = new OR32(a,b);
        test(`The outpin of or32 should be ${e}`,()=>{
            expect(testOr.outPin32).toBe(e);
        });

        let testOr32Way:OR32WAY = new OR32WAY(a);
        test(`The outpin of or32way should be ${f}`,()=>{
            expect(testOr32Way.outPin32).toBe(f);
        });
    });
});