import { transformZeroOne } from "../src/Assembler/TransformZeroOne";
let result1 = transformZeroOne("0");
test("Test of 0 -> 1", () => {
  expect(result1).toBe("1");
});
let result2 = transformZeroOne("1");
test("Test of 1 -> 0", () => {
  expect(result2).toBe("0");
});
let result3 = transformZeroOne("0101010101010101");
test("Test of 0101010101010101 -> 1010101010101010", () => {
  expect(result3).toBe("1010101010101010");
});