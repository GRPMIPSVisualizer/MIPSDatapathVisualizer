import { binaryToDecimal } from "../src/Assembler/BinaryToDecimal";
let result1 = binaryToDecimal("0010");
test("Test of 0010 -> 0", () => {
  expect(result1).toBe(0);
});
let result2 = binaryToDecimal("0000000000000100");
test("Test of 0000000000000100 -> 4", () => {
  expect(result2).toBe(4);
});
let result3 = binaryToDecimal("1111111111111111");
test("Test of 1111111111111111 -> -1", () => {
  expect(result3).toBe(-1);
});