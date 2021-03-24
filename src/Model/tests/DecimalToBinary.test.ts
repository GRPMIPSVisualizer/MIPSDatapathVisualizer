import { decimalToBinary } from "../src/Assembler/DecimalToBinary";
let result1 = decimalToBinary(4, 4);
test("Test of 4 -> 0100", () => {
  expect(result1).toBe("0100");
});
let result2 = decimalToBinary(-1, 16);
test("Test of -1 -> 1111111111111111", () => {
  expect(result2).toBe("1111111111111111");
});