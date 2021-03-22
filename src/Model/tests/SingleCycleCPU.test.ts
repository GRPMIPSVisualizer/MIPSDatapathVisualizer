import {singleCycleCpu} from "../src/CPU/Single-CycleCPU"
import { init_bits } from "../src/Library/BItsGenerator";

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

let staticMemoryTest = [];

describe(`The function test of cpu`,()=>{
   let sinCycCPU1:singleCycleCpu = new singleCycleCpu();
   test(`The register initialize test`,()=>{
      expect(sinCycCPU1.debugReg()[28]).toBe("00010000000000001000000000000000");
      expect(sinCycCPU1.debugReg()[29]).toBe("01111111111111111110111111111100");
   });
   describe(`Test function of add instructions`,()=>{
      let sinCycCPU:singleCycleCpu = new singleCycleCpu();
      sinCycCPU.storeIns(addInsSet);
      test(`Load immediate test`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000000100");
         expect(sinCycCPU.debugReg()[5]).toBe("00000000000000000000000001100100");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000000000");
         expect(sinCycCPU.InsMemOut).toBe("00100100000001010000000001100100");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);

         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000001000");
         expect(sinCycCPU.debugReg()[6]).toBe("00000000000000000000000100110110");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000000100");
         expect(sinCycCPU.InsMemOut).toBe("00100100000001100000000100110110");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
      });
      test(`normal Add test`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000001100");
         expect(sinCycCPU.debugReg()[4]).toBe("00000000000000000000000110011010");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000001000");
         expect(sinCycCPU.InsMemOut).toBe("00000000101001100010000000100000");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
      });

      test(`normal Addi test`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000010000");
         expect(sinCycCPU.debugReg()[7]).toBe("00000000000000000000001000011010");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000001100");
         expect(sinCycCPU.InsMemOut).toBe("00100000100001110000000010000000");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
      });

      test(`normal Addiu test`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000010100");
         expect(sinCycCPU.debugReg()[7]).toBe("00000000000000000000000011100100");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000010000");
         expect(sinCycCPU.InsMemOut).toBe("00100100101001110000000010000000");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
      });

      test(`normal Addu test`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000011000");
         expect(sinCycCPU.debugReg()[8]).toBe("00000000000000000000001000011010");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000010100");
         expect(sinCycCPU.InsMemOut).toBe("00000000111001100100000000100001");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
      });

   });

   
   describe(`Test function of add instructions overflow cases`,()=>{
      let sinCycCPU:singleCycleCpu = new singleCycleCpu();
      sinCycCPU.storeIns(addOverflowSet);
      test(`lui and ori test`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000000100");
         expect(sinCycCPU.debugReg()[1]).toBe("01110010000000000000000000000000");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000000000");
         expect(sinCycCPU.InsMemOut).toBe("00111100000000010111001000000000");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);

         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000001000");
         expect(sinCycCPU.debugReg()[8]).toBe("01110010000000000000000100111000");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000000100");
         expect(sinCycCPU.InsMemOut).toBe("00110100001010000000000100111000");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
      });

      test(`addu test overflow case`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000001100");
         expect(sinCycCPU.debugReg()[9]).toBe("11100100000000000000001001110000");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000001000");
         expect(sinCycCPU.InsMemOut).toBe("00000001000010000100100000100001");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`add test overflow case`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000010000");
         expect(sinCycCPU.debugReg()[9]).toBe("11100100000000000000001001110000");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000001100");
         expect(sinCycCPU.InsMemOut).toBe("00000001000010000100100000100000");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("ALU Overflow Exception!\nALU Overflow Exception!\n");
      });
   });

   describe(`Test function of addi instructions overflow cases`,()=>{
      let sinCycCPU:singleCycleCpu = new singleCycleCpu();
      sinCycCPU.storeIns(addiOverflowSet);
      test(`lui and ori test`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000000100");
         expect(sinCycCPU.debugReg()[1]).toBe("01111111111111110000000000000000");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000000000");
         expect(sinCycCPU.InsMemOut).toBe("00111100000000010111111111111111");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);

         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000001000");
         expect(sinCycCPU.debugReg()[8]).toBe("01111111111111111111001001110000");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000000100");
         expect(sinCycCPU.InsMemOut).toBe("00110100001010001111001001110000");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
      });

      test(`addiu test overflow case`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000001100");
         expect(sinCycCPU.debugReg()[9]).toBe("10000000000000000101001001110000");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000001000");
         expect(sinCycCPU.InsMemOut).toBe("00100101000010010110000000000000");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`addi test overflow case`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000010000");
         expect(sinCycCPU.debugReg()[9]).toBe("10000000000000000101001001110000");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000001100");
         expect(sinCycCPU.InsMemOut).toBe("00100001000010010110000000000000");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("ALU Overflow Exception!\nALU Overflow Exception!\n");
      });

   });

   describe(`Test function of lui instruction`,()=>{
      let sinCycCPU:singleCycleCpu = new singleCycleCpu();
      sinCycCPU.storeIns(LoadSet);
      sinCycCPU.oneClockCycle();
      sinCycCPU.oneClockCycle();

      test(`Load upper immediate test`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000001100");
         expect(sinCycCPU.debugReg()[4]).toBe("00000011111010000000000000000000");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000001000");
         expect(sinCycCPU.InsMemOut).toBe("00111100000001000000001111101000");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");

         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000010000");
         expect(sinCycCPU.debugReg()[5]).toBe("00000011011011110000000000000000");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000001100");
         expect(sinCycCPU.InsMemOut).toBe("00111100000001010000001101101111");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

   });

   describe(`Test function of and,andi,branch(beq jump,bne do nothing).`,()=>{
      let sinCycCPU:singleCycleCpu = new singleCycleCpu();
      sinCycCPU.storeIns(and_BranchSet);
      sinCycCPU.oneClockCycle();
      sinCycCPU.oneClockCycle();
      sinCycCPU.oneClockCycle();
      sinCycCPU.oneClockCycle();
      test(`test and instruction`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000010100");
         expect(sinCycCPU.debugReg()[10]).toBe("00010001010100000001100000000010");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000010000");
         expect(sinCycCPU.InsMemOut).toBe("00000001000010010101000000100100");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`test andi instruction`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000011000");
         expect(sinCycCPU.debugReg()[11]).toBe("00000000000000000100100010000010");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000010100");
         expect(sinCycCPU.InsMemOut).toBe("00110001000010111100111110000010");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`test bne(do nothing) instruction`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000011100");
         expect(sinCycCPU.debugReg()[13] == sinCycCPU.debugReg()[14]).toBe(true);
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000011000");
         expect(sinCycCPU.InsMemOut).toBe("00010101101011101111111111111001");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`test beq(jump) instruction`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000000000");
         expect(sinCycCPU.debugReg()[5] == sinCycCPU.debugReg()[6]).toBe(true);
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000011100");
         expect(sinCycCPU.InsMemOut).toBe("00010001101011101111111111111000");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

   });


   describe(`Test function of branch(beq do nothing,bne jump).`,()=>{
      let sinCycCPU:singleCycleCpu = new singleCycleCpu();
      sinCycCPU.storeIns(branchNotEqualSet);
      sinCycCPU.oneClockCycle();
      sinCycCPU.oneClockCycle();
      sinCycCPU.oneClockCycle();
      sinCycCPU.oneClockCycle();

      sinCycCPU.oneClockCycle();
      sinCycCPU.oneClockCycle();
         

      test(`test beq(jump) instruction`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000011100");
         expect(sinCycCPU.debugReg()[10] == sinCycCPU.debugReg()[11]).toBe(false);
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000011000");
         expect(sinCycCPU.InsMemOut).toBe("00010001010010111111111111111001");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`test bne(do nothing) instruction`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000000000");
         expect(sinCycCPU.debugReg()[10] == sinCycCPU.debugReg()[11]).toBe(false);
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000011100");
         expect(sinCycCPU.InsMemOut).toBe("00010101010010111111111111111000");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

   });

   describe(`Test instructions or,nor,sw,lw.`,()=>{
      let sinCycCPU:singleCycleCpu = new singleCycleCpu();
      sinCycCPU.storeIns(norOrSwLw);
      sinCycCPU.oneClockCycle();
      sinCycCPU.oneClockCycle();
      sinCycCPU.oneClockCycle();
      sinCycCPU.oneClockCycle();

      test(`test or instruction`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000010100");
         expect(sinCycCPU.debugReg()[10]).toBe("00110101011111110101101011111010");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000010000");
         expect(sinCycCPU.InsMemOut).toBe("00000001001010000101000000100101");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`test nor instruction`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000011000");
         expect(sinCycCPU.debugReg()[11]).toBe("11001010100000001010010100000101");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000010100");
         expect(sinCycCPU.InsMemOut).toBe("00000001001010000101100000100111");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`test sw instruction`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000011100");
         expect(sinCycCPU.debugReg()[8]).toBe("00110001010100010101100010011010");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000011000");
         expect(sinCycCPU.InsMemOut).toBe("10101111101010001111111111111100");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([["01111111111111111110111111111000","00110001010100010101100010011010"]]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`test lw instruction`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000100000");
         expect(sinCycCPU.debugReg()[16]).toBe("00110001010100010101100010011010");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000011100");
         expect(sinCycCPU.InsMemOut).toBe("10001111101100001111111111111100");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([["01111111111111111110111111111000","00110001010100010101100010011010"]]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

   });

   describe(`Test a series of sub instructions.`,()=>{
      let sinCycCPU:singleCycleCpu = new singleCycleCpu();
      sinCycCPU.storeIns(sub);

      sinCycCPU.oneClockCycle();
      sinCycCPU.oneClockCycle();
      sinCycCPU.oneClockCycle();
      sinCycCPU.oneClockCycle();
      sinCycCPU.oneClockCycle();
      sinCycCPU.oneClockCycle();

      test(`test sub instruction`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000011100");
         expect(sinCycCPU.debugReg()[10]).toBe("00011011110100110011111000111000");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000011000");
         expect(sinCycCPU.InsMemOut).toBe("00000001000010010101000000100010");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`test subu instruction with overflow case`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000100000");
         expect(sinCycCPU.debugReg()[11]).toBe("10110001010100010100101100001010");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000011100");
         expect(sinCycCPU.InsMemOut).toBe("00000001000100000101100000100011");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`test sub instruction with overflow case`,()=>{
         expect(sinCycCPU.debugReg()[12]).toBe(init_bits(32));
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000100100");
         expect(sinCycCPU.debugReg()[12]).toBe("10110001010100010100101100001010");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000100000");
         expect(sinCycCPU.InsMemOut).toBe("00000001000100000110000000100010");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("ALU Overflow Exception!\nALU Overflow Exception!\n");
      });
   });

   describe(`Test a series of set less than instructions.`,()=>{
      let sinCycCPU:singleCycleCpu = new singleCycleCpu();
      sinCycCPU.storeIns(SetLessThan);

      sinCycCPU.oneClockCycle();
      sinCycCPU.oneClockCycle();
      sinCycCPU.oneClockCycle();
      sinCycCPU.oneClockCycle();
      sinCycCPU.oneClockCycle();
      sinCycCPU.oneClockCycle();

      test(`test true condition, the designated register will be set to 1`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000011100");
         expect(sinCycCPU.debugReg()[17]).toBe(init_bits(31)+"1");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000011000");
         expect(sinCycCPU.InsMemOut).toBe("00000001001010001000100000101011");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");

         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000100000");
         expect(sinCycCPU.debugReg()[18]).toBe(init_bits(31)+"1");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000011100");
         expect(sinCycCPU.InsMemOut).toBe("00000001001010001001000000101010");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`test false condition, the designated register will be set to 0`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000100100");
         expect(sinCycCPU.debugReg()[17]).toBe(init_bits(32));
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000100000");
         expect(sinCycCPU.InsMemOut).toBe("00000001000010011000100000101011");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");

         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000101000");
         expect(sinCycCPU.debugReg()[18]).toBe(init_bits(32));
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000100100");
         expect(sinCycCPU.InsMemOut).toBe("00000001000010011001000000101010");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`test false equal condition, the designated register will be set to 0`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000101100");
         expect(sinCycCPU.debugReg()[17]).toBe(init_bits(32));
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000101000");
         expect(sinCycCPU.InsMemOut).toBe("00000000010000001000100000101011");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");

         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000110000");
         expect(sinCycCPU.debugReg()[18]).toBe(init_bits(32));
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000101100");
         expect(sinCycCPU.InsMemOut).toBe("00000000010000001001000000101010");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`test difference between sign and unsign set less than case`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000110100");
         expect(sinCycCPU.debugReg()[19]).toBe(init_bits(31)+"1");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000110000");
         expect(sinCycCPU.InsMemOut).toBe("00000001000100001001100000101011");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");

         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000111000");
         expect(sinCycCPU.debugReg()[20]).toBe(init_bits(32));
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000110100");
         expect(sinCycCPU.InsMemOut).toBe("00000001000100001010000000101010");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });
      
   });

   describe(`Test a series of set less than immediate instructions.`,()=>{
      let sinCycCPU:singleCycleCpu = new singleCycleCpu();
      sinCycCPU.storeIns(setLessThanI);

      sinCycCPU.oneClockCycle();
      sinCycCPU.oneClockCycle();
      sinCycCPU.oneClockCycle();
      sinCycCPU.oneClockCycle();

      test(`slti $t2,$t0,289 false`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000010100");
         expect(sinCycCPU.debugReg()[10]).toBe("00000000000000000000000000000000");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000010000");
         expect(sinCycCPU.InsMemOut).toBe("00101001000010100000000100100001");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`slti $t2,$t1,289 true`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000011000");
         expect(sinCycCPU.debugReg()[10]).toBe("00000000000000000000000000000001");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000010100");
         expect(sinCycCPU.InsMemOut).toBe("00101001001010100000000100100001");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`slti $t3,$s0,100 true`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000011100");
         expect(sinCycCPU.debugReg()[11]).toBe("00000000000000000000000000000001");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000011000");
         expect(sinCycCPU.InsMemOut).toBe("00101010000010110000000001100100");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`slti $t3,$t1,100 false`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000100000");
         expect(sinCycCPU.debugReg()[11]).toBe("00000000000000000000000000000000");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000011100");
         expect(sinCycCPU.InsMemOut).toBe("00101001001010110000000001100100");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`slti $t4,$s0,-5 true`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000100100");
         expect(sinCycCPU.debugReg()[12]).toBe("00000000000000000000000000000001");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000100000");
         expect(sinCycCPU.InsMemOut).toBe("00101010000011001111111111111011");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`slti $t4,$s0,-1 true`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000101000");
         expect(sinCycCPU.debugReg()[12]).toBe("00000000000000000000000000000001");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000100100");
         expect(sinCycCPU.InsMemOut).toBe("00101010000011001111111111111111");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`sltiu $t2,$t0,289 false`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000101100");
         expect(sinCycCPU.debugReg()[10]).toBe("00000000000000000000000000000000");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000101000");
         expect(sinCycCPU.InsMemOut).toBe("00101101000010100000000100100001");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });
      
      test(`sltiu $t2,$t1,289 true`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000110000");
         expect(sinCycCPU.debugReg()[10]).toBe("00000000000000000000000000000001");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000101100");
         expect(sinCycCPU.InsMemOut).toBe("00101101001010100000000100100001");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`sltiu $t3,$s0,100 false`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000110100");
         expect(sinCycCPU.debugReg()[11]).toBe("00000000000000000000000000000000");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000110000");
         expect(sinCycCPU.InsMemOut).toBe("00101110000010110000000001100100");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`sltiu $t5,$t1,100 false`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000111000");
         expect(sinCycCPU.debugReg()[13]).toBe("00000000000000000000000000000000");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000110100");
         expect(sinCycCPU.InsMemOut).toBe("00101101001011010000000001100100");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`sltiu $t6,$s0,-5 true`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000111100");
         expect(sinCycCPU.debugReg()[14]).toBe("00000000000000000000000000000001");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000111000");
         expect(sinCycCPU.InsMemOut).toBe("00101110000011101111111111111011");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`sltiu $t6,$s0,-1 true`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000001000000");
         expect(sinCycCPU.debugReg()[14]).toBe("00000000000000000000000000000001");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000111100");
         expect(sinCycCPU.InsMemOut).toBe("00101110000011101111111111111111");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`slti $a1,$s0,200 true`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000001000100");
         expect(sinCycCPU.debugReg()[5]).toBe("00000000000000000000000000000001");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000001000000");
         expect(sinCycCPU.InsMemOut).toBe("00101010000001010000000011001000");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`sltiu $a1,$s0,200 false`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000001001000");
         expect(sinCycCPU.debugReg()[5]).toBe("00000000000000000000000000000000");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000001000100");
         expect(sinCycCPU.InsMemOut).toBe("00101110000001010000000011001000");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

   });

   describe(`Test shift left and shift right adn jump instructions.`,()=>{
      let sinCycCPU:singleCycleCpu = new singleCycleCpu();
      sinCycCPU.storeIns(shiftJump);
      // main
      // li $t0,1098778411
      sinCycCPU.oneClockCycle();
      sinCycCPU.oneClockCycle();

      test(`sll $t1,$t0,1`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000001100");
         expect(sinCycCPU.debugReg()[9]).toBe("10000010111111000000111001010110");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000001000");
         expect(sinCycCPU.InsMemOut).toBe("00000000000010000100100001000000");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`sll $t2,$t0,2`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000010000");
         expect(sinCycCPU.debugReg()[10]).toBe("00000101111110000001110010101100");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000001100");
         expect(sinCycCPU.InsMemOut).toBe("00000000000010000101000010000000");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`sll $t3,$t0,3`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000010100");
         expect(sinCycCPU.debugReg()[11]).toBe("00001011111100000011100101011000");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000010000");
         expect(sinCycCPU.InsMemOut).toBe("00000000000010000101100011000000");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`sll $t4,$t0,4`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000011000");
         expect(sinCycCPU.debugReg()[12]).toBe("00010111111000000111001010110000");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000010100");
         expect(sinCycCPU.InsMemOut).toBe("00000000000010000110000100000000");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`sll $t5,$t0,31`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000011100");
         expect(sinCycCPU.debugReg()[13]).toBe("1" + init_bits(31));
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000011000");
         expect(sinCycCPU.InsMemOut).toBe("00000000000010000110111111000000");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`srl $t1,$t0,1`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000100000");
         expect(sinCycCPU.debugReg()[9]).toBe("00100000101111110000001110010101");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000011100");
         expect(sinCycCPU.InsMemOut).toBe("00000000000010000100100001000010");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`srl $t2,$t0,2`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000100100");
         expect(sinCycCPU.debugReg()[10]).toBe("00010000010111111000000111001010");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000100000");
         expect(sinCycCPU.InsMemOut).toBe("00000000000010000101000010000010");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`srl $t3,$t0,3`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000101000");
         expect(sinCycCPU.debugReg()[11]).toBe("00001000001011111100000011100101");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000100100");
         expect(sinCycCPU.InsMemOut).toBe("00000000000010000101100011000010");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`srl $t4,$t0,4`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000101100");
         expect(sinCycCPU.debugReg()[12]).toBe("00000100000101111110000001110010");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000101000");
         expect(sinCycCPU.InsMemOut).toBe("00000000000010000110000100000010");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`srl $t5,$t0,31`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000110000");
         expect(sinCycCPU.debugReg()[13]).toBe(init_bits(31)+"0");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000101100");
         expect(sinCycCPU.InsMemOut).toBe("00000000000010000110111111000010");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`sll $s1,$s0,4`,()=>{
         sinCycCPU.oneClockCycle();
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000111000");
         expect(sinCycCPU.debugReg()[17]).toBe("11111111111111111100000110000000");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000110100");
         expect(sinCycCPU.InsMemOut).toBe("00000000000100001000100100000000");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`srl $s2,$s0,4`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000111100");
         expect(sinCycCPU.debugReg()[18]).toBe("00001111111111111111111111000001");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000111000");
         expect(sinCycCPU.InsMemOut).toBe("00000000000100001001000100000010");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`sra $s3,$s0,4`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000001000000");
         expect(sinCycCPU.debugReg()[19]).toBe("11111111111111111111111111000001");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000111100");
         expect(sinCycCPU.InsMemOut).toBe("00000000000100001001100100000011");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`j main`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000000000");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000001000000");
         expect(sinCycCPU.InsMemOut).toBe("00001000000100000000000000000000");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });

      test(`li $t0,1098778411 - the first instruction`,()=>{
         sinCycCPU.oneClockCycle();
         expect(sinCycCPU.muxBOut).toBe("00000000010000000000000000000100");
         expect(sinCycCPU.getCurrentInsAddr()).toBe("00000000010000000000000000000000");
         expect(sinCycCPU.InsMemOut).toBe("00111100000000010100000101111110");
         expect(sinCycCPU.getDynamicData()).toStrictEqual([]);
         expect(sinCycCPU.Errormsg).toStrictEqual("");
      });


   });

});