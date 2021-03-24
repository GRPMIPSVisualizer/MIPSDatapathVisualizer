import { Assembler } from "../src/Assembler/Assembler";

let assembler = Assembler.getAssembler();
assembler.setSources("main:" + "\n" + "add $s1,$s2,$s3" + "\n" + "main:" + "\n" + "beq $t1,$t2,main");
assembler.preprocess();
let err1 = assembler.getErrMsg();
test("Test of error message 301 in checkLabel: ", () => {
  expect(err1).toBe("Error 301: Label has already existed. -- " + "main:" + "\n");
});
assembler.refresh();
assembler.setSources("0main: " + "add $s1, $s2, $s3");
assembler.preprocess();
let err2 = assembler.getErrMsg();
test("Test of error message 303 in separateLabelIns: ", () => {
  expect(err2).toBe("Error 303: Invalid label. -- " + "0main: " + "add $s1, $s2, $s3" + "\n");
});
assembler.refresh();
assembler.setSources(".data" + "\n" + "6str: .asciiz \"sc\"");
assembler.preprocess();
let err3 = assembler.getErrMsg();
test("Test of error message 302 in formateData: ", () => {
  expect(err3).toBe("Error 302: Invalid label. -- " + "6str: .asciiz \"sc\"" + "\n");
});
assembler.refresh();
assembler.setSources(".data" + "\n" + "scc");
assembler.preprocess();
let err4 = assembler.getErrMsg();
test("Test of error message 336 in formateData: ", () => {
  expect(err4).toBe("Error 336: Invalid instruction. -- " + "scc" + "\n");
});
assembler.refresh();
assembler.setSources(".data" + "\n" + "label:.word 8,s");
assembler.preprocess();
let err5 = assembler.getErrMsg();
test("Test of error message 304 in storeData: ", () => {
  expect(err5).toBe("Error 304: Invalid data type. -- " + "label: .word 8,s" + "\n");
});
assembler.refresh();
assembler.setSources(".data" + "\n" + "label:.word 8,2147483648");
assembler.preprocess();
let err6 = assembler.getErrMsg();
test("Test of error message 305 in storeData: ", () => {
  expect(err6).toBe("Error 305: Data value out of range. -- " + "label: .word 8,2147483648" + "\n");
});
assembler.refresh();
assembler.setSources(".data" + "\n" + "label:.word +");
assembler.preprocess();
let err7 = assembler.getErrMsg();
test("Test of error message 306 in storeData: ", () => {
  expect(err7).toBe("Error 306: Invalid data type. -- " + "label: .word +" + "\n");
});
assembler.refresh();
assembler.setSources(".data" + "\n" + "label:.word -2147483649");
assembler.preprocess();
let err8 = assembler.getErrMsg();
test("Test of error message 307 in storeData: ", () => {
  expect(err8).toBe("Error 307: Data value out of range. -- " + "label: .word -2147483649" + "\n");
});
assembler.refresh();
assembler.setSources(".data" + "\n" + "label:.byte _,2");
assembler.preprocess();
let err9 = assembler.getErrMsg();
test("Test of error message 308 in storeData: ", () => {
  expect(err9).toBe("Error 308: Invalid data type. -- " + "label: .byte _,2" + "\n");
});
assembler.refresh();
assembler.setSources(".data" + "\n" + "label:.byte 2,128");
assembler.preprocess();
let err10 = assembler.getErrMsg();
test("Test of error message 309 in storeData: ", () => {
  expect(err10).toBe("Error 309: Data value out of range. -- " + "label: .byte 2,128" + "\n");
});
assembler.refresh();
assembler.setSources(".data" + "\n" + "label:  .byte -");
assembler.preprocess();
let err11 = assembler.getErrMsg();
test("Test of error message 310 in storeData: ", () => {
  expect(err11).toBe("Error 310: Invalid data type. -- " + "label: .byte -" + "\n");
});
assembler.refresh();
assembler.setSources(".data" + "\n" + "label:.byte -129");
assembler.preprocess();
let err12 = assembler.getErrMsg();
test("Test of error message 311 in storeData: ", () => {
  expect(err12).toBe("Error 311: Data value out of range. -- " + "label: .byte -129" + "\n");
});
assembler.refresh();
assembler.setSources(".data" + "\n" + "label:.ascii sc");
assembler.preprocess();
let err13 = assembler.getErrMsg();
test("Test of error message 312 in storeData: ", () => {
  expect(err13).toBe("Error 312: Invalid string. -- " + "label: .ascii sc" + "\n");
});
assembler.refresh();
assembler.setSources(".data" + "\n" + ".word s,8");
assembler.preprocess();
let err14 = assembler.getErrMsg();
test("Test of error message 313 in storeData: ", () => {
  expect(err14).toBe("Error 313: Invalid data type. -- " + ".word s,8" + "\n");
});
assembler.refresh();
assembler.setSources(".data" + "\n" + ".word 8,2147483648");
assembler.preprocess();
let err15 = assembler.getErrMsg();
test("Test of error message 314 in storeData: ", () => {
  expect(err15).toBe("Error 314: Data value out of range. -- " + ".word 8,2147483648" + "\n");
});
assembler.refresh();
assembler.setSources(".data" + "\n" + ".word =");
assembler.preprocess();
let err16 = assembler.getErrMsg();
test("Test of error message 315 in storeData: ", () => {
  expect(err16).toBe("Error 315: Invalid data type. -- " + ".word =" + "\n");
});
assembler.refresh();
assembler.setSources(".data" + "\n" + ".word -2147483649");
assembler.preprocess();
let err17 = assembler.getErrMsg();
test("Test of error message 316 in storeData: ", () => {
  expect(err17).toBe("Error 316: Data value out of range. -- " + ".word -2147483649" + "\n");
});
assembler.refresh();
assembler.setSources(".data" + "\n" + ".byte $,9");
assembler.preprocess();
let err18 = assembler.getErrMsg();
test("Test of error message 317 in storeData: ", () => {
  expect(err18).toBe("Error 317: Invalid data type. -- " + ".byte $,9" + "\n");
});
assembler.refresh();
assembler.setSources(".data" + "\n" + ".byte 9,128");
assembler.preprocess();
let err19 = assembler.getErrMsg();
test("Test of error message 318 in storeData: ", () => {
  expect(err19).toBe("Error 318: Data value out of range. -- " + ".byte 9,128" + "\n");
});
assembler.refresh();
assembler.setSources(".data" + "\n" + ".byte %");
assembler.preprocess();
let err20 = assembler.getErrMsg();
test("Test of error message 319 in storeData: ", () => {
  expect(err20).toBe("Error 319: Invalid data type. -- " + ".byte %" + "\n");
});
assembler.refresh();
assembler.setSources(".data" + "\n" + ".byte -129");
assembler.preprocess();
let err21 = assembler.getErrMsg();
test("Test of error message 320 in storeData: ", () => {
  expect(err21).toBe("Error 320: Data value out of range. -- " + ".byte -129" + "\n");
});
assembler.refresh();
assembler.setSources(".data" + "\n" + ".asciiz \"sc");
assembler.preprocess();
let err22 = assembler.getErrMsg();
test("Test of error message 321 in storeData: ", () => {
  expect(err22).toBe("Error 321: Invalid string. -- " + ".asciiz \"sc" + "\n");
});
assembler.refresh();
assembler.setSources("la $t1,str");
assembler.preprocess();
let err23 = assembler.getErrMsg();
test("Test of error message 324 in expandPesudo: ", () => {
  expect(err23).toBe("Error 324: Label unrecongnized. -- " + "la $t1,str" + "\n");
});
assembler.refresh();
assembler.setSources("\n" + "la $t1");
assembler.preprocess();
let err24 = assembler.getErrMsg();
test("Test of error message 325 in expandPesudo: ", () => {
  expect(err24).toBe("Error 325: Too few or incorrectly formatted operands. -- " + "la $t1" + "\n");
});
// assembler.refresh();
// assembler.setSources("la$t1,str");
// assembler.preprocess();
// let err25 = assembler.getErrMsg();
// test("Test of error message 326 in expandPesudo: ", () => {
//   expect(err25).toBe("Error 326: Instruction unrecognized. -- " + "la$t1,str" + "\n");
// });
assembler.refresh();
assembler.setSources("j 2500");
assembler.preprocess();
let err26 = assembler.getErrMsg();
test("Test of error message 329 in translateLabel: ", () => {
  expect(err26).toBe("Error 329: Operand is of incorrect type. -- " + "j 2500" + "\n");
});
assembler.refresh();
assembler.setSources("beq $s1,$s2,main");
assembler.preprocess();
let err27 = assembler.getErrMsg();
test("Test of error message 330 in translateLabel: ", () => {
  expect(err27).toBe("Error 330: Label is not found. -- " + "beq $s1,$s2,main" + "\n");
});
assembler.refresh();
assembler.setSources(".text" + "\n" + "addd $s1,$s2,$s3");
assembler.preprocess();
assembler.assemble();
let err28 = assembler.getErrMsg();
test("Test of error message 335 in assemble: ", () => {
  expect(err28).toBe("Error 335: Instruction unrecognized. -- " + "addd $s1,$s2,$s3" + "\n");
});