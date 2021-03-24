import { trimSpace } from "../src/Assembler/TrimSpace";
let result1 = trimSpace("add $s1, $s2, $s3");
test("Test of add $s1, $s2, $s3 -> add $s1,$s2,$s3", () => {
  expect(result1).toBe("add $s1,$s2,$s3");
});
let result2 = trimSpace("  add $s1, $s2, $s3");
test("Test of \"  add $s1, $s2, $s3\" -> add $s1,$s2,$s3", () => {
  expect(result2).toBe("add $s1,$s2,$s3");
});
let result3 = trimSpace("add  $s1, $s2, $s3");
test("Test of add  $s1, $s2, $s3 -> add $s1,$s2,$s3", () => {
  expect(result3).toBe("add $s1,$s2,$s3");
});