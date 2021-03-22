import {NAND} from "./Logic/NAND"
import {AND} from "./Logic/AND"
import {NOT} from "./Logic/NOT"
import {OR} from "./Logic/OR"
import {XOR} from "./Logic/XOR"
import {AND32} from "./Logic/AND32"
import {Mux} from "./Conponent/Mux"
import {DMux} from "./Conponent/DMux"
import {NOT32} from "./Logic/NOT32"
import {OR32} from "./Logic/OR32"
import {OR32WAY} from "./Logic/OR32WAY"
import {Mux4Way32} from "./Conponent/Mux4Way32"
import {Mux8Way32} from "./Conponent/Mux8Way32"
import { DMux8Way } from "./Conponent/DMux8Way"
import {bin2dec,decToSignedBin32, stringToIntArray,decToUnsignedBin32} from "./Library/StringHandle"
import {Adder} from "./Circuit/Adder"
import {ALU} from "./Circuit/ALU"
import { Latch } from "./Circuit/Latch"
import { DFlipFlop } from "./Circuit/DFlipFlop"
import { _32BitsRegister } from "./Circuit/Register"
import { Memory } from "./Circuit/Memory"
import { singleCycleCpu } from "./CPU/Single-CycleCPU"
import { RegisterFile } from "./Circuit/RegisterFile"
// import { DFlipFlop } from "./Circuit/DFlipFlop"
// let a:AND = new AND(0,0);
// let b:AND = new AND(1,0);
// let c:AND = new AND(0,1);
// let d:AND = new AND(1,1);
// console.log(a,b,c,d);

// let notA = new NOT(1);
// let notB = new NOT(0);
// console.log(notA,"\n",notB,"\n");

// let or1:OR = new OR(0,0);
// let or2:OR = new OR(1,0);
// let or3:OR = new OR(0,1);
// let or4:OR = new OR(1,1);

// console.log(or1,"\n",or2,"\n",or3,"\n",or4,"\n");

// let xor1:XOR = new XOR(0,0);
// let xor2:XOR = new XOR(1,0);
// let xor3:XOR = new XOR(0,1);
// let xor4:XOR = new XOR(1,1);

// console.log(xor1,"\n",xor2,"\n",xor3,"\n",xor4,"\n");
// console.log(-1 >>> 1);

// let testArray:number[] = [0,0,0,0,1];
// console.log(testArray.join(""));

/**
 * test for And32
 */
// let bitsA:string = "10000000000000000000000000000101"
// let bitsB:string = "00000000010000000000010000100101"
// let and32:AND32 = new AND32(bitsA,bitsB);
// console.log(and32);

/**
 * Test for Mux(multiplexor)
 */
// let muxA:Mux = new Mux(0,0,0); 
// let muxB:Mux = new Mux(0,0,1);
// let muxC:Mux = new Mux(0,1,0);
// let muxD:Mux = new Mux(0,1,1);
// let muxE:Mux = new Mux(1,0,0);
// let muxF:Mux = new Mux(1,0,1);
// let muxG:Mux = new Mux(1,1,0);
// let muxH:Mux = new Mux(1,1,1);
// console.log(muxA,"\n",muxB,"\n",muxC,"\n",muxD,"\n");
// console.log(muxE,"\n",muxF,"\n",muxG,"\n",muxH,"\n");

/**
 * Test for DMux(De-multiplexor)
 */
// let dmuxA:DMux = new DMux(0,0); 
// let dmuxB:DMux = new DMux(1,0);
// let dmuxC:DMux = new DMux(0,1);
// let dmuxD:DMux = new DMux(1,1);
// console.log(dmuxA,"\n",dmuxB,"\n",dmuxC,"\n",dmuxD,"\n");

/**
 * Test for NOT32
 */
// let inPin:string = "00010001000100010001000100010001" 
// let not32:NOT32 = new NOT32(inPin);
// console.log(not32);

/**
 * test for OR32
 */
// let bitsA:string = "00100000000000000000000000000101"
// let bitsB:string = "00000000010000000000010000100101"
// let and32:OR32 = new OR32(bitsA,bitsB);
// console.log(and32);

/**
 * Test for OR32WAY
 */
// let bits1:string = "00100000000000000000000000000101"
// let bits2:string = "00000000000000000000000000000000"
// let or32wayA:OR32WAY = new OR32WAY(bits1);
// let or32wayB:OR32WAY = new OR32WAY(bits2);
// console.log(or32wayA,or32wayB);

/**
 * Test Mux4Way32
 */

// let bits:string[] = [];
// bits[0] = "00000000000000000000000000000000"
// bits[1] = "00000000000000000000000000000010"
// bits[2] = "00000000000000000000000000000100"
// bits[3] = "00000000000000000000000000001000"
// bits[4] = "00000000000000000000000000010000"
// bits[5] = "00000000000000000000000000100000"
// bits[6] = "00000000000000000000000001000000"
// bits[7] = "00000000000000000000000010000000"
// let sel2way1:string = "00"
// let sel2way2:string = "01" 
// let sel2way3:string = "10" 
// let sel2way4:string = "11"

// let mux4way32A:Mux4Way32 = new Mux4Way32(bits,sel2way1);
// let mux4way32B:Mux4Way32 = new Mux4Way32(bits,sel2way2);
// let mux4way32C:Mux4Way32 = new Mux4Way32(bits,sel2way3);
// let mux4way32D:Mux4Way32 = new Mux4Way32(bits,sel2way4);

// console.log(mux4way32A,"\n",mux4way32B,"\n",mux4way32C,"\n",mux4way32D);

/**
 * Test Mux8Way32
 */

// let bits:string[] = [];
// bits[0] = "00000000000000000000000000000000"
// bits[1] = "00000000000000000000000000000010"
// bits[2] = "00000000000000000000000000000100"
// bits[3] = "00000000000000000000000000001000"
// bits[4] = "00000000000000000000000000010000"
// bits[5] = "00000000000000000000000000100000"
// bits[6] = "00000000000000000000000001000000"
// bits[7] = "00000000000000000000000010000000"
// let sel2way1:string = "000"
// let sel2way2:string = "001" 
// let sel2way3:string = "010" 
// let sel2way4:string = "011"
// let sel2way5:string = "100"
// let sel2way6:string = "101" 
// let sel2way7:string = "110" 
// let sel2way8:string = "111"

// let mux8way32A:Mux8Way32 = new Mux8Way32(bits,sel2way1);
// let mux8way32B:Mux8Way32 = new Mux8Way32(bits,sel2way2);
// let mux8way32C:Mux8Way32 = new Mux8Way32(bits,sel2way3);
// let mux8way32D:Mux8Way32 = new Mux8Way32(bits,sel2way4);
// let mux8way32E:Mux8Way32 = new Mux8Way32(bits,sel2way5);
// let mux8way32F:Mux8Way32 = new Mux8Way32(bits,sel2way6);
// let mux8way32G:Mux8Way32 = new Mux8Way32(bits,sel2way7);
// let mux8way32H:Mux8Way32 = new Mux8Way32(bits,sel2way8);

// console.log(mux8way32A,"\n",mux8way32B,"\n",mux8way32C,"\n",mux8way32D);
// console.log(mux8way32E,"\n",mux8way32F,"\n",mux8way32G,"\n",mux8way32H);

/**
 * Test for Dmux8Way
 */
// let bit:number = 1

// let sel2way1:string = "000"
// let sel2way2:string = "001" 
// let sel2way3:string = "010" 
// let sel2way4:string = "011"
// let sel2way5:string = "100"
// let sel2way6:string = "101" 
// let sel2way7:string = "110" 
// let sel2way8:string = "111"

// let dmux8wayA:DMux8Way = new DMux8Way(bit,sel2way1);
// let dmux8wayB:DMux8Way = new DMux8Way(bit,sel2way2);
// let dmux8wayC:DMux8Way = new DMux8Way(bit,sel2way3);
// let dmux8wayD:DMux8Way = new DMux8Way(bit,sel2way4);
// let dmux8wayE:DMux8Way = new DMux8Way(bit,sel2way5);
// let dmux8wayF:DMux8Way = new DMux8Way(bit,sel2way6);
// let dmux8wayG:DMux8Way = new DMux8Way(bit,sel2way7); 
// let dmux8wayH:DMux8Way = new DMux8Way(bit,sel2way8);

// console.log(dmux8wayA,"\n",dmux8wayB,"\n",dmux8wayC,"\n",dmux8wayD,"\n");
// console.log(dmux8wayE,"\n",dmux8wayF,"\n",dmux8wayG,"\n",dmux8wayH,"\n");

// let bits:string[] = [];
// bits[0] = "00000000000000000000000000000110";
// bits[1] = "00000000000000000000000000000100";
// bits[3] = "11111111111111111111111111011101";
// bits[4] = "00000000000000000000000000000101"
// bits[4] = "11111111111111111111111111111101";
// 0000 0000 0000 0010 0000 0000 1000 0000
// let inPin1:number = bin2dec(bits[3],false);
// let inPin2:number = bin2dec(bits[4],false);
// let bin32:string = decToSignedBin32(131200);
// let adder1:Adder = new Adder(bits[3],bits[4]);
// let outPin:number = bin2dec(adder1.getOutput(),false);
// adder1.inPin32A = bits[3];
// console.log(inPin1);
// console.log(inPin2);
// console.log(bin32);
// console.log(adder1);
// console.log(outPin);
// console.log(1 && 0);
// if (1 && 0)
//     console.log("true");
// else
//     console.log("false");

// let controlBits:string[] = ["0000","0001","0010","0110","0111","1100"];// and,or,add,subtract,set on less than, nor
// let ALU1:ALU = new ALU(bits[0],bits[3],controlBits[0]);
// console.log(bin2dec(bits[0],false),bin2dec(bits[3],false));
// console.log(ALU1);
// ALU1.newSignal(bits[0],bits[3],controlBits[1]);
// console.log(ALU1);
// console.log(bin2dec(ALU1.getOutPin32(),false));
// ALU1.newSignal(bits[0],bits[3],controlBits[2]);
// console.log(ALU1);
// console.log(bin2dec(ALU1.getOutPin32(),false));
// ALU1.newSignal(bits[0],bits[3],controlBits[3]);
// console.log(ALU1);
// console.log(bin2dec(ALU1.getOutPin32(),false));
// ALU1.newSignal(bits[3],bits[0],controlBits[4]);
// console.log(ALU1);
// console.log(bin2dec(ALU1.getOutPin32(),false));
// ALU1.newSignal(bits[0],bits[3],controlBits[5]);
// console.log(ALU1);
// console.log(bin2dec(ALU1.getOutPin32(),false));
// let DLatch:Latch = new Latch();
// console.log(DLatch);
// // C = 0, D = 0, O = 0, !O = 1;

// // C = 0, D = 1, O = 0, !O = 1;
// DLatch.changeDSignal();
// console.log(DLatch);
// DLatch.changeClockSignal();
// console.log(DLatch);

// // C = 1, D = 1, O = 1, !O = 0;
// DLatch.clockChange();
// console.log(DLatch);


// if Clock is not change, nothing will change
// DLatch.DSignalChange();
// console.log(DLatch);
// DLatch.DSignalChange();
// console.log(DLatch);
// DLatch.DSignalChange();
// console.log(DLatch);

// let dfilpflop:DFlipFlop = new DFlipFlop();
// console.log(dfilpflop);
// dfilpflop.changeDSiganl();
// console.log(dfilpflop);

// let flipflop:DFlipFlop = new DFlipFlop();
// console.log(flipflop);
// flipflop.changeDSiganl();
// console.log(flipflop);
// flipflop.changeClockSiganl();
// console.log(flipflop);
// flipflop.changeClockSiganl();
// console.log(flipflop);
// let index:number = 0;
// function debugger1():void{
//     console.log("this is attemp " + index);
//     console.log(_32Register.getinPin32());
//     console.log(_32Register.getOutPin32());
//     index++;
// }

// let _32Register:_32BitsRegister = new _32BitsRegister();
// debugger1();
// _32Register.changeClockSignal();
// debugger1();
// _32Register.setInpin32("00000011000000001100000000000000");
// debugger1();
// _32Register.changeClockSignal();
// debugger1();

// function desc2(target:Function) {
//     console.log('---------------类的装饰器参数 start------------------');
//     console.log(target); // 输出 [Function: Person]表示当前装饰的类
//     console.log('---------------类的装饰器参数 end------------------');
//   }
  
//   @desc2 // 使用装饰器
//   class Person {
//     public name: string | undefined;
//     public age: number | 0;
  
//     constructor(name:any, age:any) {
//       this.name = name;
//       this.age = age;
//       console.log("shit");
//     }
//   }
  
//   let p2:Person = new Person('哈哈', 20);
let adderTest:Adder = new Adder("00000000010000000000000000111100","11111111111111111111111111000100");




let sinCycCPU:singleCycleCpu = new singleCycleCpu();
// addiu $0
// let InsSet:string[] = 
//  [
//     // "00111100000000100000000011101001",
//     "00100100000010110000000000001010",
//     "00100100000010100000000000010100",
//     "00000001010010111001100000100000",
//     "00100000000000010000000000000100",
//     "00000011101000011110100000100010",
//     "10101111101100110000000000000000",
//     "10001111101011110000000000000000",
//     "00100001010011100000001111101000",
//     "00100100000010010000000000001101",
//     "00000001110010010111100000100100",
//     "00110100000000101100100011001111",
//     "00110000010000111001100101000100",
//     "00110100000000111001100101000100",
//     "00000000011000100001100000100111",
//    //  "00010000000110011111111111110001"
//    // "00000000000000000001000000101010"
//    // "00000000011000100001000000101010",
//     "00101001110000100000001111111011"
//  ]

let addInsSet:string[] = [
   // add normal case
   "00100100000001010000000001100100", // li $a1,100 
   "00100100000001100000000100110110", // li $a2,310
   "00000000101001100010000000100000", // add $a0,$a1,$a2
   // addi normal case
   "00100000100001110000000010000000", // addi $a3,$a0,128
   // addiu normal case
   "00100100101001110000000010000000", // addiu $a3,$a1,128 
   // addu normal case
   "00000000111001100100000000100001" // addu $t0,$a3,$a2
   ];
let addOverflowSet:string[] = [
   // li $t0 1912602936
   "00111100000000010111001000000000", // lui $1,0x00007200
   "00110100001010000000000100111000", // ori $8,$1,0x00000138
   // addu $9,$8,$8
   "00000001000010000100100000100001",
   // add $9,$8,$8
   "00000001000010000100100000100000"
   
];

let addiOverflowSet:string[] = [
   // li $t0 2147480176
   "00111100000000010111111111111111", // lui $1,0x00007fff
   "00110100001010001111001001110000", // ori $8,$1,0x0000f270
   // addiu $9,$8,0x00006000
   "00100101000010010110000000000000",
   // addi $9,$8,0x00006000
   "00100001000010010110000000000000"
   
];

let LoadSet:string[] = [
   // li
   "00100100000001010000000001100100", // li $a1,100 
   "00100100000001100000000100110110", // li $a2,310
   // lui
   "00111100000001000000001111101000", // lui $a0 1000
   "00111100000001010000001101101111" // lui $a1 879
];

let and_BranchSet:string[] = [
   // main:
   // li $t0 22302251162
   "00111100000000010011000101010001",
   "00110100001010000101100010011010",
   // li $t1 4655553122
   "00111100000000010001010101111110",
   "00110100001010010001101001100010",
   // and $t2,$t0,$t1
   "00000001000010010101000000100100",
   // andi $t3,$t0,53122
   "00110001000010111100111110000010",
   // bne $13,$14,0xfffffff98(main)
   "00010101101011101111111111111001",
   // beq $t5,$t6,main
   "00010001101011101111111111111000"
];

let branchNotEqualSet:string[] = [
   // main:
   // li $t0 22302251162
   "00111100000000010011000101010001",
   "00110100001010000101100010011010",
   // li $t1 4655553122
   "00111100000000010001010101111110",
   "00110100001010010001101001100010",
   // and $t2,$t0,$t1
   "00000001000010010101000000100100",
   // andi $t3,$t0,53122
   "00110001000010111100111110000010",
   // beq $10,$11,0xfffffff99(main)
   "00010001010010111111111111111001",
   // bne $10,$11,0xfffffff98(main)
   "00010101010010111111111111111000"
];

let norOrSwLw:string[] = [
   // li $t0 22302251162
   "00111100000000010011000101010001", 
   "00110100001010000101100010011010",
   // li $t1 4655553122
   "00111100000000010001010101111110",
   "00110100001010010001101001100010",
   // or $t2,$t1,$t0
   "00000001001010000101000000100101",
   // nor $t3,$t1,$t0
   "00000001001010000101100000100111",
   // sw $t0 ,-4($sp)
   "10101111101010001111111111111100",
   // lw $s0,-4($sp)
   "10001111101100001111111111111100"
];

let sub:string[] = [
   // li $t0 22302251162
   "00111100000000010011000101010001",
   "00110100001010000101100010011010",
   // li $t1 4655553122
   "00111100000000010001010101111110",
   "00110100001010010001101001100010",
   // li $s0 -2147480176
   "00111100000000011000000000000000",
   "00110100001100000000110110010000",
   // sub $t2,$t0,$t1
   "00000001000010010101000000100010",
   // subu $t3,$t0,$s0
   "00000001000100000101100000100011",
   // sub $t4,$t0,$s0
   "00000001000100000110000000100010"
];

let SetLessThan:string[] = [
   // li $t0 22302251162
   "00111100000000010011000101010001",
   "00110100001010000101100010011010",
   // li $t1 4655553122
   "00111100000000010001010101111110",
   "00110100001010010001101001100010",
   // li $s0 -2147480176
   "00111100000000011000000000000000",
   "00110100001100000000110110010000",
   // true set to 1
   // sltu $s1,$t1,$t0
   "00000001001010001000100000101011",
   // slt $s2,$t1,$t0
   "00000001001010001001000000101010",
   // false,set to 0
   // sltu $s1,$t0,$t1
   "00000001000010011000100000101011",
   // slt $s2,$t0,$t1
   "00000001000010011001000000101010",
   // false equal
   // sltu $s1,$v0,$zero
   "00000000010000001000100000101011",
   // slt $s2,$v0,$zero
   "00000000010000001001000000101010",
   // sign vs. unsign
   // sltu $s3,$t0,$s0
   "00000001000100001001100000101011",
   // slt $s4,$t0,$s0
   "00000001000100001010000000101010"
];

let setLessThanI:string[] = [
   // li $t0 22302251162
   "00111100000000010011000101010001",
   "00110100001010000101100010011010",
   // li $t1, 100
   "00100100000010010000000001100100",
   // li $s0,-10
   "00100100000100001111111111110110",
   // slti $t2,$t0,289
   "00101001000010100000000100100001",
   // slti $t2,$t1,289
   "00101001001010100000000100100001",
   // slti $t3,$s0,100
   "00101010000010110000000001100100",
   // slti $t3,$t1,100
   "00101001001010110000000001100100",
   // slti $t4,$s0,-5
   "00101010000011001111111111111011",
   // slti $t4,$s0,-1
   "00101010000011001111111111111111",
   // sltiu $t2,$t0,289
   "00101101000010100000000100100001",
   // sltiu $t2,$t1,289
   "00101101001010100000000100100001",
   // sltiu $t3,$s0,100
   "00101110000010110000000001100100",
   // sltiu $t5,$t1,100
   "00101101001011010000000001100100",
   // sltiu $t6,$s0,-5
   "00101110000011101111111111111011",
   // sltiu $t6,$s0,-1
   "00101110000011101111111111111111",
   // slti $a1,$s0,200
   "00101010000001010000000011001000",
   // sltiu $a1,$s0,200
   "00101110000001010000000011001000"
];

let shiftJump:string[] = [
   // main
   // li $t0,1098778411
   "00111100000000010100000101111110",
   "00110100001010000000011100101011",
   // sll $t1,$t0,1
   "00000000000010000100100001000000",
   // sll $t2,$t0,2
   "00000000000010000101000010000000",
   // sll $t3,$t0,3
   "00000000000010000101100011000000",
   // sll $t4,$t0,4
   "00000000000010000110000100000000",
   // sll $t5,$t0,31
   "00000000000010000110111111000000",
   // srl $t1,$t0,1
   "00000000000010000100100001000010",
   // srl $t2,$t0,2
   "00000000000010000101000010000010",
   // srl $t3,$t0,3
   "00000000000010000101100011000010",
   // srl $t4,$t0,4
   "00000000000010000110000100000010",
   // srl $t5,$t0,31
   "00000000000010000110111111000010",
   // li $s0,-1000
   "00100100000100001111110000011000",
   // sll $s1,$s0,4
   "00000000000100001000100100000000",
   // srl $s2,$s0,4
   "00000000000100001001000100000010",
   // sra $s3,$s0,4
   "00000000000100001001100100000011",
   // j main
   "00001000000100000000000000000000",
   // sll $zero,$zero,0
   "00000000000000000000000000000000"
];

let SyscallTest = [];

sinCycCPU.storeIns(SetLessThan);
sinCycCPU.runWhole();
// sinCycCPU.debugPC();