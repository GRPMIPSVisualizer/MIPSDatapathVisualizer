import {DMux} from "../src/Conponent/DMux"
import {DMux4Way} from "../src/Conponent/DMux4Way"
import {DMux8Way} from "../src/Conponent/DMux8Way"
import {Mux} from "../src/Conponent/Mux"
import {Mux32} from "../src/Conponent/Mux32"
import {Mux4Way32} from "../src/Conponent/Mux4Way32"
import {Mux8Way32} from "../src/Conponent/Mux8Way32"
import { stringToIntArray } from "../src/Library/StringHandle"

describe('Unit test of Circuit Componets: ',()=>{
    describe('Unit test of Mux and DMux.',()=>{
        
        test.each([
            [0,0,0,0],
            [0,0,1,0],
            [0,1,0,0],
            [0,1,1,1],
            [1,0,0,1],
            [1,0,1,0],
            [1,1,0,1],
            [1,1,1,1],
        ])(`Test of Mux inpin1:%i inpin2:%i,sel:%i`,(a,b,c,d)=>{
            expect(Mux.Mux(a,b,c)).toStrictEqual(d);
        })

        test.each([
            [0,0,[0,0]],
            [0,1,[0,0]],
            [1,0,[1,0]],
            [1,1,[0,1]]
        ])(`Test of DMux inpin %i, sel %i`,(a,b,c)=>{
            expect(DMux.DMux(a,b)).toStrictEqual(c);
        })

        test.each([
            [0,[0,0],[0,0,0,0]],
            [0,[0,1],[0,0,0,0]],
            [0,[1,0],[0,0,0,0]],
            [0,[1,1],[0,0,0,0]],
            [1,[0,0],[1,0,0,0]],
            [1,[0,1],[0,1,0,0]],
            [1,[1,0],[0,0,1,0]],
            [1,[1,1],[0,0,0,1]],
        ])(`Test of DMux4Way inpin %i, sel:%o`,(a,b,c)=>{
            expect(DMux4Way.DMux4Way(a,b)).toStrictEqual(c);
        });

        test.each([
            [0,[0,0,0],[0,0,0,0,0,0,0,0]],
            [0,[0,0,1],[0,0,0,0,0,0,0,0]],
            [0,[0,1,0],[0,0,0,0,0,0,0,0]],
            [0,[0,1,1],[0,0,0,0,0,0,0,0]],
            [0,[1,0,0],[0,0,0,0,0,0,0,0]],
            [0,[1,0,1],[0,0,0,0,0,0,0,0]],
            [0,[1,1,0],[0,0,0,0,0,0,0,0]],
            [0,[1,1,1],[0,0,0,0,0,0,0,0]],
            [1,[0,0,0],[1,0,0,0,0,0,0,0]],
            [1,[0,0,1],[0,1,0,0,0,0,0,0]],
            [1,[0,1,0],[0,0,1,0,0,0,0,0]],
            [1,[0,1,1],[0,0,0,1,0,0,0,0]],
            [1,[1,0,0],[0,0,0,0,1,0,0,0]],
            [1,[1,0,1],[0,0,0,0,0,1,0,0]],
            [1,[1,1,0],[0,0,0,0,0,0,1,0]],
            [1,[1,1,1],[0,0,0,0,0,0,0,1]],
        ])(`Test of DMux8Way inpin %i, sel:%o`,(a,b,c)=>{
            expect(DMux8Way.DMux8Way(a,b)).toStrictEqual(c);
        });
        

        test.each([
            [stringToIntArray("10111010101010110101010110101011"),stringToIntArray("10101010111110100000110101001010"),0,stringToIntArray("10111010101010110101010110101011")],
            [stringToIntArray("10111010101010110101010110101011"),stringToIntArray("10101010111110100000110101001010"),1,stringToIntArray("10101010111110100000110101001010")],
        ])(`Test of Mux inpin1:%s inpin2:%s,sel:%i`,(a,b,c,d)=>{
            expect(Mux32.Mux32(a,b,c)).toStrictEqual(d);
        });

        test.each([
            [[stringToIntArray("10111010101010110101010110101011"),stringToIntArray("10101010111110100000110101001010"),stringToIntArray("10101010101100101010100100101010"),stringToIntArray("01001010010101010101011110001100")],[0,0],stringToIntArray("10111010101010110101010110101011")],
            [[stringToIntArray("10111010101010110101010110101011"),stringToIntArray("10101010111110100000110101001010"),stringToIntArray("10101010101100101010100100101010"),stringToIntArray("01001010010101010101011110001100")],[0,1],stringToIntArray("10101010111110100000110101001010")],
            [[stringToIntArray("10111010101010110101010110101011"),stringToIntArray("10101010111110100000110101001010"),stringToIntArray("10101010101100101010100100101010"),stringToIntArray("01001010010101010101011110001100")],[1,0],stringToIntArray("10101010101100101010100100101010")],
            [[stringToIntArray("10111010101010110101010110101011"),stringToIntArray("10101010111110100000110101001010"),stringToIntArray("10101010101100101010100100101010"),stringToIntArray("01001010010101010101011110001100")],[1,1],stringToIntArray("01001010010101010101011110001100")]
        ])(`Test of Mux4Way32 inpin:%s, sel:%i`,(a,b,c)=>{
            expect(Mux4Way32.Mux4Way32(a,b)).toStrictEqual(c);
        });
        let a1:string = "10111010101010110101010110101011";
        let a2:string = "10101010111110100000110101001010";
        let a3:string = "10101010101100101010100100101010";
        let a4:string = "01001010010101010101011110001100";
        let a5:string = "10111010100101010101001010111100";
        let a6:string = "10010101001111001001000101011001";
        let a7:string = "10101010101010111011010010101011";
        let a8:string = "10101010101011110100101010101010";
        test.each([
            [[a1,a2,a3,a4,a5,a6,a7,a8],"000",stringToIntArray(a1)],
            [[a1,a2,a3,a4,a5,a6,a7,a8],"001",stringToIntArray(a2)],
            [[a1,a2,a3,a4,a5,a6,a7,a8],"010",stringToIntArray(a3)],
            [[a1,a2,a3,a4,a5,a6,a7,a8],"011",stringToIntArray(a4)],
            [[a1,a2,a3,a4,a5,a6,a7,a8],"100",stringToIntArray(a5)],
            [[a1,a2,a3,a4,a5,a6,a7,a8],"101",stringToIntArray(a6)],
            [[a1,a2,a3,a4,a5,a6,a7,a8],"110",stringToIntArray(a7)],
            [[a1,a2,a3,a4,a5,a6,a7,a8],"111",stringToIntArray(a8)]
        ])(`Test of Mux8Way32 inpin:%s, sel:%s`,(a,b,c)=>{
            expect(Mux8Way32.Mux8Way32(a,b)).toStrictEqual(c);
        });
    });
});