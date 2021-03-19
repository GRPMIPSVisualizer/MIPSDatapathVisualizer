import { DecoderForR } from "../src/Assembler/DecoderForR";
import { DecoderForI } from "../src/Assembler/DecoderForI";
import { DecoderForJ } from "../src/Assembler/DecoderForJ";

//Type R
let decoder1 = DecoderForR.getDecoder();
decoder1.setIns("add $s1,$s2,$s3");
decoder1.validate();
decoder1.decode();
let bins1 = decoder1.getBinIns();

let decoder2 = DecoderForR.getDecoder();
decoder2.setIns("add $s1,$zero,$s3");
decoder2.validate();
decoder2.decode();
let bins2 = decoder2.getBinIns();

let decoder3 = DecoderForR.getDecoder();
decoder3.setIns("addu $t1,$t2,$t3");
decoder3.validate();
decoder3.decode();
let bins3 = decoder3.getBinIns();

let decoder4 = DecoderForR.getDecoder();
decoder4.setIns("sub $s0,$s1,$t1");
decoder4.validate();
decoder4.decode();
let bins4 = decoder4.getBinIns();

let decoder5 = DecoderForR.getDecoder();
decoder5.setIns("subu $s0,$s1,$t1");
decoder5.validate();
decoder5.decode();
let bins5 = decoder5.getBinIns();

let decoder6 = DecoderForR.getDecoder();
decoder6.setIns("and $at,$v0,$v1");
decoder6.validate();
decoder6.decode();
let bins6 = decoder6.getBinIns();

let decoder7 = DecoderForR.getDecoder();
decoder7.setIns("or $at,$v0,$v1");
decoder7.validate();
decoder7.decode();
let bins7 = decoder7.getBinIns();

let decoder8 = DecoderForR.getDecoder();
decoder8.setIns("nor $s1,$s2,$s3");
decoder8.validate();
decoder8.decode();
let bins8 = decoder8.getBinIns();

let decoder9 = DecoderForR.getDecoder();
decoder9.setIns("slt $s1,$s2,$s3");
decoder9.validate();
decoder9.decode();
let bins9 = decoder9.getBinIns();

let decoder10 = DecoderForR.getDecoder();
decoder10.setIns("sltu $s1,$s2,$s3");
decoder10.validate();
decoder10.decode();
let bins10 = decoder10.getBinIns();

let decoder11 = DecoderForR.getDecoder();
decoder11.setIns("sll $s1,$s2,10");
decoder11.validate();
decoder11.decode();
let bins11 = decoder11.getBinIns();

let decoder12 = DecoderForR.getDecoder();
decoder12.setIns("sll $s1,$s2,");
decoder12.validate();
decoder12.decode();
let ins12 = decoder12.getIns();
let error12 = decoder12.getErrMsg();

let decoder13 = DecoderForR.getDecoder();
decoder13.setIns("sll $s1,$s2,-1");
decoder13.validate();
decoder13.decode();
let ins13 = decoder13.getIns();
let error13 = decoder13.getErrMsg();

let decoder14 = DecoderForR.getDecoder();
decoder14.setIns("sll $s1,$s2,32");
decoder14.validate();
decoder14.decode();
let ins14 = decoder14.getIns();
let error14 = decoder14.getErrMsg();

let decoder15 = DecoderForR.getDecoder();
decoder15.setIns("srl $s1,$s2,10");
decoder15.validate();
decoder15.decode();
let bins15 = decoder15.getBinIns();

let decoder16 = DecoderForR.getDecoder();
decoder16.setIns("jr $ra");
decoder16.validate();
decoder16.decode();
let bins16 = decoder16.getBinIns();

let decoder17 = DecoderForR.getDecoder();
decoder17.setIns("sra $s1,$s2,10");
decoder17.validate();
decoder17.decode();
let bins17 = decoder17.getBinIns();

let decoder43 = DecoderForR.getDecoder();
decoder43.setIns("sra sc,$s2,10");
decoder43.validate();
decoder43.decode();
let ins43 = decoder43.getIns();
let error43 = decoder43.getErrMsg();

let decoder44 = DecoderForR.getDecoder();
decoder44.setIns("sra $sc,$s2,10");
decoder44.validate();
decoder44.decode();
let ins44 = decoder44.getIns();
let error44 = decoder44.getErrMsg();

let decoder45 = DecoderForR.getDecoder();
decoder45.setIns("sra $32,$s2,10");
decoder45.validate();
decoder45.decode();
let ins45 = decoder45.getIns();
let error45 = decoder45.getErrMsg();
/*=========================================================================================*/
// Type I
let decoder18 = DecoderForI.getDecoder();
decoder18.setIns("addi $s1,$s2,10");
decoder18.validate();
decoder18.decode();
let bins18 = decoder18.getBinIns();

let decoder19 = DecoderForI.getDecoder();
decoder19.setIns("addi $s1,$s2,sc");
decoder19.validate();
decoder19.decode();
let ins19 = decoder19.getIns();
let error19 = decoder19.getErrMsg();

let decoder20 = DecoderForI.getDecoder();
decoder20.setIns("addi $s1,$s2,32768");
decoder20.validate();
decoder20.decode();
let ins20 = decoder20.getIns();
let error20 = decoder20.getErrMsg();

let decoder21 = DecoderForI.getDecoder();
decoder21.setIns("addi $s1,$s2,-32769");
decoder21.validate();
decoder21.decode();
let ins21 = decoder21.getIns();
let error21 = decoder21.getErrMsg();

let decoder22 = DecoderForI.getDecoder();
decoder22.setIns("addi $s1,$s2,");
decoder22.validate();
decoder22.decode();
let ins22 = decoder22.getIns();
let error22 = decoder22.getErrMsg();

let decoder23 = DecoderForI.getDecoder();
decoder23.setIns("addiu $s1,$s2,10");
decoder23.validate();
decoder23.decode();
let bins23 = decoder23.getBinIns();

let decoder24 = DecoderForI.getDecoder();
decoder24.setIns("andi $s1,$s2,10");
decoder24.validate();
decoder24.decode();
let bins24 = decoder24.getBinIns();

let decoder25 = DecoderForI.getDecoder();
decoder25.setIns("beq $s1,$s2,1");
decoder25.validate();
decoder25.decode();
let bins25 = decoder25.getBinIns();

let decoder26 = DecoderForI.getDecoder();
decoder26.setIns("bne $s1,$s2,-1");
decoder26.validate();
decoder26.decode();
let bins26 = decoder26.getBinIns();

let decoder27 = DecoderForI.getDecoder();
decoder27.setIns("lbu $s1,20($s2)");
decoder27.validate();
decoder27.decode();
let bins27 = decoder27.getBinIns();

let decoder28 = DecoderForI.getDecoder();
decoder28.setIns("lbu $s1,20($s2");
decoder28.validate();
decoder28.decode();
let ins28 = decoder28.getIns();
let error28 = decoder28.getErrMsg();

let decoder29 = DecoderForI.getDecoder();
decoder29.setIns("lbu $s1,20");
decoder29.validate();
decoder29.decode();
let ins29 = decoder29.getIns();
let error29 = decoder29.getErrMsg();

let decoder30 = DecoderForI.getDecoder();
decoder30.setIns("lbu $s1,20($sc)");
decoder30.validate();
decoder30.decode();
let ins30 = decoder30.getIns();
let error30 = decoder30.getErrMsg();

let decoder31 = DecoderForI.getDecoder();
decoder31.setIns("lbu $s1,sc($s2)");
decoder31.validate();
decoder31.decode();
let ins31 = decoder31.getIns();
let error31 = decoder31.getErrMsg();

let decoder32 = DecoderForI.getDecoder();
decoder32.setIns("lhu $s1,20($s2)");
decoder32.validate();
decoder32.decode();
let bins32 = decoder32.getBinIns();

let decoder33 = DecoderForI.getDecoder();
decoder33.setIns("ll $s1,20($s2)");
decoder33.validate();
decoder33.decode();
let bins33 = decoder33.getBinIns();

let decoder34 = DecoderForI.getDecoder();
decoder34.setIns("lui $s1,20");
decoder34.validate();
decoder34.decode();
let bins34 = decoder34.getBinIns();

let decoder35 = DecoderForI.getDecoder();
decoder35.setIns("lw $s1,20($s2)");
decoder35.validate();
decoder35.decode();
let bins35 = decoder35.getBinIns();

let decoder36 = DecoderForI.getDecoder();
decoder36.setIns("ori $s1,$s2,20");
decoder36.validate();
decoder36.decode();
let bins36 = decoder36.getBinIns();

let decoder37 = DecoderForI.getDecoder();
decoder37.setIns("slti $s1,$s2,20");
decoder37.validate();
decoder37.decode();
let bins37 = decoder37.getBinIns();

let decoder38 = DecoderForI.getDecoder();
decoder38.setIns("sltiu $s1,$s2,20");
decoder38.validate();
decoder38.decode();
let bins38 = decoder38.getBinIns();

let decoder39 = DecoderForI.getDecoder();
decoder39.setIns("sb $s1,20($s2)");
decoder39.validate();
decoder39.decode();
let bins39 = decoder39.getBinIns();

let decoder40 = DecoderForI.getDecoder();
decoder40.setIns("sc $s1,20($s2)");
decoder40.validate();
decoder40.decode();
let bins40 = decoder40.getBinIns();

let decoder41 = DecoderForI.getDecoder();
decoder41.setIns("sh $s1,20($s2)");
decoder41.validate();
decoder41.decode();
let bins41 = decoder41.getBinIns();

let decoder42 = DecoderForI.getDecoder();
decoder42.setIns("sw $s1,20($s2)");
decoder42.validate();
decoder42.decode();
let bins42 = decoder42.getBinIns();

let decoder46 = DecoderForI.getDecoder();
decoder46.setIns("lbu s1,20($s2)");
decoder46.validate();
decoder46.decode();
let ins46 = decoder46.getIns();
let error46 = decoder46.getErrMsg();

let decoder47 = DecoderForI.getDecoder();
decoder47.setIns("lbu $33,20($s2)");
decoder47.validate();
decoder47.decode();
let ins47 = decoder47.getIns();
let error47 = decoder47.getErrMsg();
/*=========================================================================================*/
// Type J
let decoder48 = DecoderForJ.getDecoder();
decoder48.setIns("j 4194304");
decoder48.validate();
decoder48.decode();
let bins48 = decoder48.getBinIns();

let decoder49 = DecoderForJ.getDecoder();
decoder49.setIns("j 4194304sc");
decoder49.validate();
decoder49.decode();
let ins49 = decoder49.getIns();
let error49 = decoder49.getErrMsg();

let decoder50 = DecoderForJ.getDecoder();
decoder50.setIns("jal 4194308");
decoder50.validate();
decoder50.decode();
let bins50 = decoder50.getBinIns();

let decoder51 = DecoderForJ.getDecoder();
decoder51.setIns("jal -1");
decoder51.validate();
decoder51.decode();
let ins51 = decoder51.getIns();
let error51 = decoder51.getErrMsg();

// Type R
test("add $s1,$s2,$s3", () => {
  expect(bins1).toBe("00000010010100111000100000100000");
});
test("add $s1,$zero,$s3", () => {
  expect(bins2).toBe("00000000000100111000100000100000");
});
test("addu $t1,$t2,$t3", () => {
  expect(bins3).toBe("00000001010010110100100000100001");
});
test("sub $s0,$s1,$t1", () => {
  expect(bins4).toBe("00000010001010011000000000100010");
});
test("subu $s0,$s1,$t1", () => {
  expect(bins5).toBe("00000010001010011000000000100011");
});
test("and $at,$v0,$v1", () => {
  expect(bins6).toBe("00000000010000110000100000100100");
});
test("or $at,$v0,$v1", () => {
  expect(bins7).toBe("00000000010000110000100000100101");
});
test("nor $s1,$s2,$s3", () => {
  expect(bins8).toBe("00000010010100111000100000100111");
});
test("slt $s1,$s2,$s3", () => {
  expect(bins9).toBe("00000010010100111000100000101010");
});
test("sltu $s1,$s2,$s3", () => {
  expect(bins10).toBe("00000010010100111000100000101011");
});
test("sll $s1,$s2,10", () => {
  expect(bins11).toBe("00000000000100101000101010000000");
});
test("sll $s1,$s2,", () => {
    expect(error12).toBe("Error 209: Invalid shift amount. -- " + ins12 + "\n");
});
test("sll $s1,$s2,-1", () => {
  expect(error13).toBe(error12 + "Error 209: Invalid shift amount. -- " + ins13 + "\n");
});
test("sll $s1,$s2,32", () => {
  expect(error14).toBe(error13 + "Error 209: Invalid shift amount. -- " + ins14 + "\n");
});
test("srl $s1,$s2,10", () => {
  expect(bins15).toBe("00000000000100101000101010000010");
});
test("jr $ra", () => {
  expect(bins16).toBe("00000011111000000000000000001000");
});
test("sra $s1,$s2,10", () => {
  expect(bins17).toBe("00000000000100101000101010000011");
});
test("sra sc,$s2,10", () => {
  expect(error43).toBe(error14 + "Error 213: Invalid operand. -- " + ins43 + "\n");
});
test("sra $sc,$s2,10", () => {
  expect(error44).toBe(error43 + "Error 212: Invalid operand. -- " + ins44 + "\n");
});
test("sra $32,$s2,10", () => {
  expect(error45).toBe(error44 + "Error 210: Invalid operand. -- " + ins45 + "\n");
});
/*=========================================================================================*/
// Type I
test("addi $s1,$s2,10", () => {
  expect(bins18).toBe("00100010010100010000000000001010");
});
test("addi $s1,$s2,sc", () => {
  expect(error19).toBe("Error 202: Invalid immediate number. -- " + ins19 + "\n");
});
test("addi $s1,$s2,32768", () => {
  expect(error20).toBe(error19 + "Error 203: Invalid immediate number. Out of range. -- " + ins20 + "\n");
});
test("addi $s1,$s2,-32769", () => {
  expect(error21).toBe(error20 + "Error 203: Invalid immediate number. Out of range. -- " + ins21 + "\n");
});
test("addi $s1,$s2,", () => {
  expect(error22).toBe(error21 + "Error 202: Invalid immediate number. -- " + ins22 + "\n");
});
test("addiu $s1,$s2,10", () => {
  expect(bins23).toBe("00100110010100010000000000001010");
});
test("andi $s1,$s2,10", () => {
  expect(bins24).toBe("00110010010100010000000000001010");
});
test("beq $s1,$s2,1", () => {
  expect(bins25).toBe("00010010001100100000000000000001");
});
test("bne $s1,$s2,-1", () => {
  expect(bins26).toBe("00010110001100101111111111111111");
});
test("lbu $s1,20($s2)", () => {
  expect(bins27).toBe("10010010010100010000000000010100");
});
test("lbu $s1,20($s2", () => {
  expect(error28).toBe(error22 + "Error 201: Invalid instruction format. -- " + ins28 + "\n");
});
test("lbu $s1,20", () => {
  expect(error29).toBe(error28 + "Error 201: Invalid instruction format. -- " + ins29 + "\n");
});
test("lbu $s1,20($sc)", () => {
  expect(error30).toBe(error29 + "Error 206: Invalid operand. -- " + ins30 + "\n");
});
test("lbu $s1,sc($s2)", () => {
  expect(error31).toBe(error30 + "Error 202: Invalid immediate number. -- " + ins31 + "\n");
});
test("lhu $s1,20($s2)", () => {
  expect(bins32).toBe("10010110010100010000000000010100");
});
test("ll $s1,20($s2)", () => {
  expect(bins33).toBe("11000010010100010000000000010100");
});
test("lui $s1,20", () => {
  expect(bins34).toBe("00111100000100010000000000010100");
});
test("lw $s1,20($s2)", () => {
  expect(bins35).toBe("10001110010100010000000000010100");
});
test("ori $s1,$s2,20", () => {
  expect(bins36).toBe("00110110010100010000000000010100");
});
test("slti $s1,$s2,20", () => {
  expect(bins37).toBe("00101010010100010000000000010100");
});
test("sltiu $s1,$s2,20", () => {
  expect(bins38).toBe("00101110010100010000000000010100");
});
test("sb $s1,20($s2)", () => {
  expect(bins39).toBe("10100010010100010000000000010100");
});
test("sc $s1,20($s2)", () => {
  expect(bins40).toBe("11100010010100010000000000010100");
});
test("sh $s1,20($s2)", () => {
  expect(bins41).toBe("10100110010100010000000000010100");
});
test("sw $s1,20($s2)", () => {
  expect(bins42).toBe("10101110010100010000000000010100");
});
test("lbu s1,20($s2)", () => {
  expect(error46).toBe(error31 + "Error 207: Invalid operand. -- " + ins46 + "\n");
});
test("lbu $33,20($s2)", () => {
  expect(error47).toBe(error46 + "Error 204: Invalid operand. -- " + ins47 + "\n");
});
/*=========================================================================================*/
// Type J
test("j 4194304", () => {
  expect(bins48).toBe("00001000010000000000000000000000");
});
test("j 4194304sc", () => {
  expect(error49).toBe("Error 208: Invalid address. -- " + ins49 + "\n");
});
test("jal 4194308", () => {
  expect(bins50).toBe("00001100010000000000000000000100");
});
test("jal -1", () => {
  expect(error51).toBe(error49 + "Error 208: Invalid address. -- " + ins51 + "\n");
});