import { Assembler } from "../src/Assembler/Assembler";

let assembler = Assembler.getAssembler();
assembler.setSources(".data\n" + ".word\n" + "2,8\n" + "9");
assembler.preprocess();
let data1 = assembler.getData().get(0).toString();
let size1 = assembler.getData().size();
test("Test of .word without label and data after .word: ", () => {
  expect(data1).toBe(".word 2,8,9");
  expect(size1).toBe(1);
});

assembler.refresh();
assembler.setSources(".data\n" + ".word 2\n" + "8\n" + "9");
assembler.preprocess();
let data2 = assembler.getData().get(0).toString();
let size2 = assembler.getData().size();
test("Test of .word without label but with data after .word: ", () => {
  expect(data2).toBe(".word 2,8,9");
  expect(size2).toBe(1);
});

assembler.refresh();
assembler.setSources(".data\n" + ".byte\n" + "2,8\n" + "9");
assembler.preprocess();
let data3 = assembler.getData().get(0).toString();
let size3 = assembler.getData().size();
test("Test of .byte without label and data after .byte: ", () => {
  expect(data3).toBe(".byte 2,8,9");
  expect(size3).toBe(1);
});

assembler.refresh();
assembler.setSources(".data\n" + ".byte 2\n" + "8\n" + "9");
assembler.preprocess();
let data4 = assembler.getData().get(0).toString();
let size4 = assembler.getData().size();
test("Test of .byte without label but with data after .byte: ", () => {
  expect(data4).toBe(".byte 2,8,9");
  expect(size4).toBe(1);
});

assembler.refresh();
assembler.setSources(".data\n" + ".ascii\n" + "\"sc\"\n" + "\"scc\"");
assembler.preprocess();
let data5 = assembler.getData().get(0).toString();
let size5 = assembler.getData().size();
test("Test of .ascii without label and string after .ascii: ", () => {
  expect(data5).toBe(".ascii \"scscc\"");
  expect(size5).toBe(1);
});

assembler.refresh();
assembler.setSources(".data\n" + ".ascii \"s\"\n" + "\"c\"\n" + "\"scc\"");
assembler.preprocess();
let data6 = assembler.getData().get(0).toString();
let size6 = assembler.getData().size();
test("Test of .ascii without label but with a space and a string after .ascii: ", () => {
  expect(data6).toBe(".ascii \"scscc\"");
  expect(size6).toBe(1);
});

assembler.refresh();
assembler.setSources(".data\n" + ".ascii\"s\"\n" + "\"c\"\n" + "\"scc\"");
assembler.preprocess();
let data7 = assembler.getData().get(0).toString();
let size7 = assembler.getData().size();
test("Test of .ascii without label and space but with a string after .ascii: ", () => {
  expect(data7).toBe(".ascii \"scscc\"");
  expect(size7).toBe(1);
});

assembler.refresh();
assembler.setSources(".data\n" + "label:.word\n" + "2,8\n" + "9");
assembler.preprocess();
let data8 = assembler.getData().get(0).toString();
let size8 = assembler.getData().size();
test("Test of .word with label but without data after .word: ", () => {
  expect(data8).toBe("label: .word 2,8,9");
  expect(size8).toBe(1);
});

assembler.refresh();
assembler.setSources(".data\n" + "label:  .word 2\n" + "8\n" + "9");
assembler.preprocess();
let data9 = assembler.getData().get(0).toString();
let size9 = assembler.getData().size();
test("Test of .word with label and data after .word: ", () => {
  expect(data9).toBe("label: .word 2,8,9");
  expect(size9).toBe(1);
});

assembler.refresh();
assembler.setSources(".data\n" + "label:.byte\n" + "2\n" + "8,9");
assembler.preprocess();
let data10 = assembler.getData().get(0).toString();
let size10 = assembler.getData().size();
test("Test of .byte with label but without data after .byte: ", () => {
  expect(data10).toBe("label: .byte 2,8,9");
  expect(size10).toBe(1);
});

assembler.refresh();
assembler.setSources(".data\n" + "label:  .byte 2\n" + "8\n" + "9");
assembler.preprocess();
let data11 = assembler.getData().get(0).toString();
let size11 = assembler.getData().size();
test("Test of .byte with label and data after .byte: ", () => {
  expect(data11).toBe("label: .byte 2,8,9");
  expect(size11).toBe(1);
});

assembler.refresh();
assembler.setSources(".data\n" + "str: .ascii\n" + "\"sc\"\n" + "\"scc\"");
assembler.preprocess();
let data12 = assembler.getData().get(0).toString();
let size12 = assembler.getData().size();
test("Test of .ascii with label but without string after .ascii: ", () => {
  expect(data12).toBe("str: .ascii \"scscc\"");
  expect(size12).toBe(1);
});

assembler.refresh();
assembler.setSources(".data\n" + "str:.ascii \"s\"\n" + "\"c\"\n" + "\"scc\"");
assembler.preprocess();
let data13 = assembler.getData().get(0).toString();
let size13 = assembler.getData().size();
test("Test of .ascii with label but with a space and a string after .ascii: ", () => {
  expect(data13).toBe("str: .ascii \"scscc\"");
  expect(size13).toBe(1);
});

assembler.refresh();
assembler.setSources(".data\n" + "str:  .ascii\"s\"\n" + "\"c\"\n" + "\"scc\"");
assembler.preprocess();
let data14 = assembler.getData().get(0).toString();
let size14 = assembler.getData().size();
test("Test of .ascii with label and a string after .ascii: ", () => {
  expect(data14).toBe("str: .ascii \"scscc\"");
  expect(size14).toBe(1);
});

assembler.refresh();
assembler.setSources(".data\n" + "label:\n" + ".word\n" + "2,8\n" + "9");
assembler.preprocess();
let data15 = assembler.getData().get(0).toString();
let size15 = assembler.getData().size();
test("Test of .word with label in the last line but without data after .word: ", () => {
  expect(data15).toBe("label: .word 2,8,9");
  expect(size15).toBe(1);
});

assembler.refresh();
assembler.setSources(".data\n" + "label:\n" + ".word 2\n" + "8\n" + "9");
assembler.preprocess();
let data16 = assembler.getData().get(0).toString();
let size16 = assembler.getData().size();
test("Test of .word with label in the last line and data after .word: ", () => {
  expect(data16).toBe("label: .word 2,8,9");
  expect(size16).toBe(1);
});

assembler.refresh();
assembler.setSources(".data\n" + "label:\n" + ".byte\n" + "2\n" + "8,9");
assembler.preprocess();
let data17 = assembler.getData().get(0).toString();
let size17 = assembler.getData().size();
test("Test of .byte with label in the last line but without data after .byte: ", () => {
  expect(data17).toBe("label: .byte 2,8,9");
  expect(size17).toBe(1);
});

assembler.refresh();
assembler.setSources(".data\n" + "label:\n" + ".byte 2\n" + "8\n" + "9");
assembler.preprocess();
let data18 = assembler.getData().get(0).toString();
let size18 = assembler.getData().size();
test("Test of .byte with label in the last line and data after .byte: ", () => {
  expect(data18).toBe("label: .byte 2,8,9");
  expect(size18).toBe(1);
});

assembler.refresh();
assembler.setSources(".data\n" + "str:\n" + ".asciiz\n" + "\"sc\"\n" + "\"scc\"");
assembler.preprocess();
let data19 = assembler.getData().get(0).toString();
let size19 = assembler.getData().size();
test("Test of .asciiz with label in the last line but without string after .asciiz: ", () => {
  expect(data19).toBe("str: .asciiz \"scscc\"");
  expect(size19).toBe(1);
});

assembler.refresh();
assembler.setSources(".data\n" + "str:\n" + ".asciiz \"s\"\n" + "\"c\"\n" + "\"scc\"");
assembler.preprocess();
let data20 = assembler.getData().get(0).toString();
let size20 = assembler.getData().size();
test("Test of .asciiz with label in the last line, a space and a string after .asciiz: ", () => {
  expect(data20).toBe("str: .asciiz \"scscc\"");
  expect(size20).toBe(1);
});

assembler.refresh();
assembler.setSources(".data\n" + "str:\n" + ".asciiz\"s\"\n" + "\"c\"\n" + "\"scc\"");
assembler.preprocess();
let data21 = assembler.getData().get(0).toString();
let size21 = assembler.getData().size();
test("Test of .asciiz with label in the last line and a string after .asciiz: ", () => {
  expect(data21).toBe("str: .asciiz \"scscc\"");
  expect(size21).toBe(1);
});
