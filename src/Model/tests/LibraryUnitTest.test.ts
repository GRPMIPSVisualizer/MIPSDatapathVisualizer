import { init_bits } from "../src/Library/BItsGenerator";
import { bool2num, num2bool } from "../src/Library/BooleanHandler";
import { bin2dec, binaryDetect, bitsMapping, decToSignedBin32, decToUnsignedBin32, intArrayToString, lengthDetect, shiftLeftBinary32Bits, stringToIntArray } from "../src/Library/StringHandle";
let i:number = 0;
describe('Unit test of Library functions: ',()=>{
    describe.each([
        [1,"0"],
        [32,"00000000000000000000000000000000"],
        [64,"0000000000000000000000000000000000000000000000000000000000000000"]])
        ('Unit test of BitsGenerator %i $s',(a,s)=>{
            test(`A bits of length ${a}`,()=>{
                expect(init_bits(a)).toBe(s);
            });
        }
    );

    describe.each([
        [true,10,1,true],
        [false,0,0,false],
        [false,-100,0,true]
        ])
        ('Unit test of BooleanHandler',(a,b,c,d)=>{
            ++i;
            test(`Boolean to number test number ${i}`,()=>{
                expect(bool2num(a)).toBe(c);
            });

            test(`Number to boolean test number ${i}`,()=>{
                expect(num2bool(b)).toBe(d);
            });
            
        }
    );

    describe('Unit test of StringHandler',()=>{
        let k:string = "00101";
        let ia:number[] = [1,0,1,1,1,0,1,1,1,0,0,0,1];
        let e2:number[] = [1,1,1,1,1,3,3];
        function ErrorCase2(){
            intArrayToString(e2);
        }
        test(`Test function stringToIntArray`,()=>{
            expect(stringToIntArray(k)).toStrictEqual([0,0,1,0,1]);
        });

        test(`Test function intArrayToString`,()=>{
            expect(intArrayToString(ia)).toEqual("1011101110001");
            expect(ErrorCase2).toThrowError(new Error("The int array contains bit other than 0 or 1"));
        });

        let normalNumberA:number = 19082;
        let normalNumberB:number = -19082;
        let normalNumberC:number = 0;
        let normalNumberD:number = 3254779904;
        let overNumberA:number = 17592203870224;
        
        test(`Test function intArrayToString`,()=>{
            expect(decToSignedBin32(normalNumberA)).toBe("00000000000000000100101010001010");
            expect(decToSignedBin32(normalNumberB)).toBe("11111111111111111011010101110110");
            expect(decToSignedBin32(normalNumberC)).toBe("00000000000000000000000000000000");
            expect(decToSignedBin32(overNumberA)).toBe("00000001000100000000000000010000");
        });

        function ErrorCase4(){
            decToUnsignedBin32(normalNumberB);
        }

        test(`Test function intArrayToString`,()=>{
            expect(decToUnsignedBin32(normalNumberA)).toBe("00000000000000000100101010001010");
            expect(ErrorCase4).toThrowError(new Error("Unsign number cannot less than zero!"));
            expect(decToSignedBin32(normalNumberC)).toBe("00000000000000000000000000000000");
            expect(decToUnsignedBin32(overNumberA)).toBe("00000001000100000000000000010000");
            expect(decToUnsignedBin32(normalNumberD)).toBe("11000010000000000000000000000000");
        });

        function ErrorCase6(){
            lengthDetect(init_bits(34));
        }
        test(`Test function lengthDetect`,()=>{
            expect(ErrorCase6).toThrowError(new Error("binary length is longer than 32!"));
        });
        let normalNumberE:string = "11110010101101010101111100011001";
        let normalNumberF:string = "01110010101101010101111100011001";
        test(`Test function bin2dec`,()=>{
            expect(bin2dec(normalNumberE,true)).toBe(4071972633);
            expect(bin2dec(normalNumberE,false)).toBe(-222994663);
            expect(bin2dec(normalNumberF,true)).toBe(1924488985);
            expect(bin2dec(normalNumberF,false)).toBe(1924488985);
        });

        let innormalNumberA:string = "111012201111"
        function ErrorCase7(){
            binaryDetect(innormalNumberA);
        }
        test(`Test function binaryDetect`,()=>{
            expect(ErrorCase7).toThrowError(new Error("Binary data 111012201111 has invalid bit."));
        });

        let normalNumberH:string = "10111001000100001111010100101010"
        test(`Test function bitsMapping and shiftBits`,()=>{
            expect(bitsMapping(normalNumberH,10,15)).toBe("11101");
            expect(shiftLeftBinary32Bits(normalNumberH)).toBe("11100100010000111101010010101000");
        });
    });

})