import { binaryAddition } from "../src/Assembler/BinaryAddition";
let result1 = binaryAddition("0", "1");
test("Test of 0 + 1: 1", () => {
  expect(result1).toBe("1");
});
let result2 = binaryAddition("0", "0");
test("Test of 0 + 0: 0", () => {
  expect(result2).toBe("0");
});
let result3 = binaryAddition("0001", "0111");
test("Test of 0001 + 0111: 1000", () => {
  expect(result3).toBe("1000");
});