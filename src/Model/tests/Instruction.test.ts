import {InstructionR} from "../src/Assembler/InstructionR"
import {InstructionI} from "../src/Assembler/InstructionI"
import {InstructionJ} from "../src/Assembler/InstructionJ"


//Declaration for type R instructions
let instruction1 = new InstructionR("add $9,$10,$11");
let instruction2 = new InstructionR("addu $9,$10,$11");
let instruction3 = new InstructionR("sub $9,$10,$11");
let instruction4 = new InstructionR("subu $9,$10,$11");
let instruction5 = new InstructionR("and $9,$10,$11");
let instruction6 = new InstructionR("or $9,$10,$11");
let instruction7 = new InstructionR("nor $9,$10,$11");
let instruction8 = new InstructionR("slt $9,$10,$11");
let instruction9 = new InstructionR("sltu $9,$10,$11");
let instruction10 = new InstructionR("sll $9,$10,10");
let instruction11 = new InstructionR("srl $9,$10,10");
let instruction12 = new InstructionR("jr $31");
let instruction13 = new InstructionR("sra $9,$10,10");

//Declaration for type I instructions
let instruction14 = new InstructionI("addi $9,$10,100");
let instruction15 = new InstructionI("addiu $9,$10,100");
let instruction16 = new InstructionI("andi $9,$10,100");
let instruction17 = new InstructionI("beq $9,$10,1");
let instruction18 = new InstructionI("bne $9,$10,1");
let instruction19 = new InstructionI("lbu $9,100($10)");
let instruction20 = new InstructionI("lhu $9,100($10)");
let instruction21 = new InstructionI("ll $9,100($10)");
let instruction22 = new InstructionI("lui $9,100");
let instruction23 = new InstructionI("lw $9,100($10)");
let instruction24 = new InstructionI("ori $9,$10,100");
let instruction25 = new InstructionI("slti $9,$10,100");
let instruction26 = new InstructionI("sltiu $9,$10,100");
let instruction27 = new InstructionI("sb $9,100($10)");
let instruction28 = new InstructionI("sc $9,100($10)");
let instruction29 = new InstructionI("sh $9,100($10)");
let instruction30 = new InstructionI("sw $9,100($10)");

//Declaration for type J instructions
let instruction31 = new InstructionJ("j 1000");
let instruction32 = new InstructionJ("jal 1000");


//Test for type R instructions
test("The binary code for \"add $t1,$t2,$t3\" is 00000001010010110100100000100000", () => {
    expect(instruction1.getBinIns()).toBe("00000001010010110100100000100000");
});

test("The binary code for \"addu $t1,$t2,$t3\" is 00000001010010110100100000100001", () => {
    expect(instruction2.getBinIns()).toBe("00000001010010110100100000100001");                              
});

test("The binary code for \"sub $t1,$t2,$t3\" is 00000001010010110100100000100010", () => {
    expect(instruction3.getBinIns()).toBe("00000001010010110100100000100010");                              
});

test("The binary code for \"subu $t1,$t2,$t3\" is 00000001010010110100100000100011", () => {
    expect(instruction4.getBinIns()).toBe("00000001010010110100100000100011");                              
});

test("The binary code for \"and $t1,$t2,$t3\" is 00000001010010110100100000100100", () => {
    expect(instruction5.getBinIns()).toBe("00000001010010110100100000100100");                              
});

test("The binary code for \"or $t1,$t2,$t3\" is 00000001010010110100100000100101", () => {
    expect(instruction6.getBinIns()).toBe("00000001010010110100100000100101");                              
});

test("The binary code for \"nor $t1,$t2,$t3\" is 00000001010010110100100000100111", () => {
    expect(instruction7.getBinIns()).toBe("00000001010010110100100000100111");                              
});

test("The binary code for \"slt $t1,$t2,$t3\" is 00000001010010110100100000101010", () => {
    expect(instruction8.getBinIns()).toBe("00000001010010110100100000101010");                              
});

test("The binary code for \"sltu $t1,$t2,$t3\" is 00000001010010110100100000101011", () => {
    expect(instruction9.getBinIns()).toBe("00000001010010110100100000101011");                              
});

test("The binary code for \"sll $t1,$t2,10\" is 00000000000010100100101010000000", () => {
    expect(instruction10.getBinIns()).toBe("00000000000010100100101010000000");                              
});

test("The binary code for \"slr $t1,$t2,10\" is 00000000000010100100101010000010", () => {
    expect(instruction11.getBinIns()).toBe("00000000000010100100101010000010");                              
});

test("The binary code for \"jr $31\" is 00000011111000000000000000001000", () => {
    expect(instruction12.getBinIns()).toBe("00000011111000000000000000001000");                              
});

test("The binary code for \"sra $t1,$t2,10\" is 00000000000010100100101010000011", () => {
    expect(instruction13.getBinIns()).toBe("00000000000010100100101010000011");                              
});

//Test for type I instructions
test("The binary code for \"addi $9,$10,100\" is 00100001010010010000000001100100", () => {
    expect(instruction14.getBinIns()).toBe("00100001010010010000000001100100");                              
});

test("The binary code for \"addiu $9,$10,100\" is 00100101010010010000000001100100", () => {
    expect(instruction15.getBinIns()).toBe("00100101010010010000000001100100");                              
});

test("The binary code for \"andi $9,$10,100\" is 00110001010010010000000001100100", () => {
    expect(instruction16.getBinIns()).toBe("00110001010010010000000001100100");                              
});

test("The binary code for \"beq $9,$10,1\" is 00010001001010100000000000000001", () => {
    expect(instruction17.getBinIns()).toBe("00010001001010100000000000000001");                              
});

test("The binary code for \"bne $9,$10,1\" is 00010101001010100000000000000001", () => {
    expect(instruction18.getBinIns()).toBe("00010101001010100000000000000001");                              
});

test("The binary code for \"lbu $9,100($10)\" is 10010001010010010000000001100100", () => {
    expect(instruction19.getBinIns()).toBe("10010001010010010000000001100100");                              
});

test("The binary code for \"lhu $9,100($10)\" is 10010101010010010000000001100100", () => {
    expect(instruction20.getBinIns()).toBe("10010101010010010000000001100100");                              
});

test("The binary code for \"ll $9,100($10)\" is 11000001010010010000000001100100", () => {
    expect(instruction21.getBinIns()).toBe("11000001010010010000000001100100");                              
});

test("The binary code for \"lui $9,100\" is 00111100000010010000000001100100", () => {
    expect(instruction22.getBinIns()).toBe("00111100000010010000000001100100");                              
});
 
test("The binary code for \"lw $9,100($10)\" is 10001101010010010000000001100100", () => {
    expect(instruction23.getBinIns()).toBe("10001101010010010000000001100100");                              
});

test("The binary code for \"ori $9,$10,100\" is 00110101010010010000000001100100", () => {
    expect(instruction24.getBinIns()).toBe("00110101010010010000000001100100");                              
});

test("The binary code for \"slti $9,$10,100\" is 00101001010010010000000001100100", () => {
    expect(instruction25.getBinIns()).toBe("00101001010010010000000001100100");                              
});

test("The binary code for \"sltiu $9,$10,100\" is 00101101010010010000000001100100", () => {
    expect(instruction26.getBinIns()).toBe("00101101010010010000000001100100");                              
});

test("The binary code for \"sb $9,100($10)\" is 10100001010010010000000001100100", () => {
    expect(instruction27.getBinIns()).toBe("10100001010010010000000001100100");                              
});

test("The binary code for \"sc $9,100($10)\" is 11100001010010010000000001100100", () => {
    expect(instruction28.getBinIns()).toBe("11100001010010010000000001100100");                              
});

test("The binary code for \"sh $9,100($10)\" is 10100101010010010000000001100100", () => {
    expect(instruction29.getBinIns()).toBe("10100101010010010000000001100100");                              
});

test("The binary code for \"sw $9,100($10)\" is 10101101010010010000000001100100", () => {
    expect(instruction30.getBinIns()).toBe("10101101010010010000000001100100");                              
});

//Test for type J instructions
test("The binary code for \"j 1000\" is 00001000000000000000001111101000", () => {
    expect(instruction31.getBinIns()).toBe("00001000000000000000001111101000");                              
});

test("The binary code for \"jal 1000\" is 00001100000000000000001111101000", () => {
    expect(instruction32.getBinIns()).toBe("00001100000000000000001111101000");                              
});