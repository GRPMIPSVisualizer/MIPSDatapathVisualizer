import { Assembler } from "../src/Assembler/Assembler";

let assembler = Assembler.getAssembler();
assembler.setSources(".data" + "\n" + ".word 1" + "\n" + "label:" + "\n" + ".ascii" + "\n" + "\"sc\"" + "\n" + ".text" + "\n" + "#comment" + "\n" + "main: add $s1,$s2,$s3" + "\n" + "beq $s1,$s2,main" + "\n" + "la $a0,label");
let source = assembler.getSources();
test("Test of setSource: ", () => {
  expect(source[6]).toBe("");
});
assembler.segmentDataText();
let data = assembler.getData().size();
let sourceInsAL = assembler.getSourceInsAL();
test("Test of segmentDataText: ", () => {
  expect(data).toBe(4);
  expect(sourceInsAL.size()).toBe(3);
});
assembler.separateLabelIns();
let sourceIns = assembler.getSourceIns().length;
test("Test of separateLabelIns: ", () => {
  expect(sourceIns).toBe(4);
});
assembler.formatData();
let data2 = assembler.getData().size();
test("Test of formatData: ", () => {
  expect(data2).toBe(2);
});
assembler.storeData();
let mapForDataLabel = assembler.getMapForDataLabel().size;
let mapForWord = assembler.getMapForWord().size;
let mapForAscii = assembler.getMapForAscii().size;
let mapForByte = assembler.getMapForByte().size;
test("Test of storeData: ", () => {
  expect(mapForDataLabel).toBe(1);
  expect(mapForWord).toBe(1);
  expect(mapForAscii).toBe(1);
  expect(mapForByte).toBe(0);
});
assembler.expandPseudo();
let sourceInsExpanded = assembler.getSourceIns().length;
test("Test of expandPseudo: ", () => {
  expect(sourceInsExpanded).toBe(5);
});
assembler.translateLabel();
let basic = assembler.getBasic().get(1);
test("Test of translateLabel: ", () => {
  expect(basic).toBe("beq $s1,$s2,-2");
});
assembler.assemble();
let bin1 = assembler.getBin().get(0);
let bin2 = assembler.getBin().get(1);
let bin3 = assembler.getBin().get(2);
let bin4 = assembler.getBin().get(3);
test("Test of assembler: ", () => {
  expect(bin1).toBe("00000010010100111000100000100000");
  expect(bin2).toBe("00010010001100101111111111111110");
  expect(bin3).toBe("00111100000000010001000000000001");
  expect(bin4).toBe("00110100001001000000000000000100");
});

