"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ArrayList_1 = require("./ArrayList");
const DecimalToBinary_1 = require("./DecimalToBinary");
const TransformZeroOne_1 = require("./TransformZeroOne");
const BinaryAddition_1 = require("./BinaryAddition");
const InstructionR_1 = require("./InstructionR");
const InstructionI_1 = require("./InstructionI");
const InstructionJ_1 = require("./InstructionJ");
const DecoderForR_1 = require("./DecoderForR");
const DecoderForI_1 = require("./DecoderForI");
const DecoderForJ_1 = require("./DecoderForJ");
const MapForInsType_1 = require("./MapForInsType");
const TrimSpace_1 = require("./TrimSpace");
const BinaryToDecimal_1 = require("./BinaryToDecimal");
var list = new ArrayList_1.ArrayList(10);
list.add("张三");
list.add("李四");
list.add("王五");
console.log("-------------测试添加-----------------");
for (var i = 0; i < list.size(); i++) {
    console.log(list.get(i));
}
console.log("--------------测试添加--------------------");
list.add(2, "杨超越");
for (var i = 0; i < list.size(); i++) {
    console.log(list.get(i));
}
console.log("-------------测试修改，下标1改为赵六-------------");
list.update(1, "赵六");
for (var i = 0; i < list.size(); i++) {
    console.log(list.get(i));
}
console.log("-------------测试删除，删除下标为2的-------------");
list.remove(2);
for (var i = 0; i < list.size(); i++) {
    console.log(list.get(i));
}
console.log("-------------测试删除，删除'王五'-------------");
list.remove('张三');
for (var i = 0; i < list.size(); i++) {
    console.log(list.get(i));
}
console.log("----------------------------");
let nameSiteMapping = new Map();
// 设置 Map 对象
nameSiteMapping.set("Google", "000001");
nameSiteMapping.set("Runoob", 2);
nameSiteMapping.set("Taobao", 3);
// 获取键对应的值
console.log(nameSiteMapping.get("Runoob"));
console.log(nameSiteMapping.get("Google"));
console.log(nameSiteMapping.get("Taobao"));
var name1 = "y";
name1 = "YCY";
let name2 = "YCYYCY";
name2 = "YCY";
var name3 = "YCY";
let name4 = "YCY";
console.log(name1);
console.log(name2);
console.log(name3);
console.log(name4);
var ins = "add $1,$2,$3";
var posOfSpace = ins.indexOf(" ");
var operands = ins.split(",", 3);
console.log(posOfSpace);
console.log(ins.substring(0, 1));
console.log(ins.substring(0, posOfSpace));
console.log(ins.substring(posOfSpace + 1, ins.length));
console.log(operands[0]);
console.log(operands[1]);
console.log(operands[2]);
let arr = [];
arr.push(0);
arr.push(1);
arr.push(2);
console.log(arr);
console.log(TransformZeroOne_1.transformZeroOne("1000111"));
let x = +'1';
console.log(x);
let a = 10;
let b = '1';
let result = b + '' + a;
console.log(result);
console.log(BinaryAddition_1.binaryAddition("101100", "000111"));
console.log(Math.log2(8));
console.log(Math.log2(8) % 1);
console.log(Math.log2(7) % 1);
console.log(Math.ceil(Math.log2(7)) + 1);
console.log(DecimalToBinary_1.decimalToBinary(-8, 6));
let d = undefined;
console.log(d == undefined);
console.log("a" != "a");
console.log("a" == "a");
console.log("-----------------");
let q = "abcde";
let p = "abc";
let o = q.substring(0, 3);
console.log(o == "abc");
console.log(o == p);
console.log(o === "abc");
console.log(o === p);
let e = q.replace("a", "hhh");
console.log(q);
console.log(e);
console.log("---------------");
let instruction = new InstructionR_1.InstructionR("add $1,$2,$3");
console.log(instruction.getBinIns());
let instruction1 = new InstructionI_1.InstructionI("addi $1,$2,10");
console.log(instruction1.getBinIns());
let instruction2 = new InstructionI_1.InstructionI("addiu $1,$2,10");
console.log(instruction2.getBinIns());
let instruction3 = new InstructionR_1.InstructionR("addu $1,$2,$3");
console.log(instruction3.getBinIns());
let instruction4 = new InstructionR_1.InstructionR("and $1,$2,$3");
console.log(instruction4.getBinIns());
let instruction5 = new InstructionI_1.InstructionI("andi $1,$2,20");
console.log(instruction5.getBinIns());
let instruction6 = new InstructionI_1.InstructionI("beq $1,$2,25");
console.log(instruction6.getBinIns());
let instruction7 = new InstructionI_1.InstructionI("bne $1,$2,25");
console.log(instruction7.getBinIns());
let instruction8 = new InstructionJ_1.InstructionJ("j 2500");
console.log(instruction8.getBinIns());
let instruction9 = new InstructionJ_1.InstructionJ("jal 2500");
console.log(instruction9.getBinIns());
let instruction10 = new InstructionR_1.InstructionR("jr $31");
console.log(instruction10.getBinIns());
let instruction11 = new InstructionI_1.InstructionI("lbu $1,20($2)");
console.log(instruction11.getBinIns());
let instruction12 = new InstructionI_1.InstructionI("lhu $1,20($2)");
console.log(instruction12.getBinIns());
let instruction13 = new InstructionI_1.InstructionI("ll $1,20($2)");
console.log(instruction13.getBinIns());
let instruction14 = new InstructionI_1.InstructionI("lui $1,20");
console.log(instruction14.getBinIns());
let instruction15 = new InstructionI_1.InstructionI("lw $1,20($2)");
console.log(instruction15.getBinIns());
let instruction16 = new InstructionR_1.InstructionR("nor $1,$2,$3");
console.log(instruction16.getBinIns());
let instruction17 = new InstructionR_1.InstructionR("or $1,$2,$3");
console.log(instruction17.getBinIns());
let instruction18 = new InstructionI_1.InstructionI("ori $1,$2,20");
console.log(instruction18.getBinIns());
let instruction19 = new InstructionR_1.InstructionR("slt $1,$2,$3");
console.log(instruction19.getBinIns());
let instruction20 = new InstructionI_1.InstructionI("slti $1,$2,20");
console.log(instruction20.getBinIns());
let instruction21 = new InstructionI_1.InstructionI("sltiu $1,$2,20");
console.log(instruction21.getBinIns());
let instruction22 = new InstructionR_1.InstructionR("sltu $1,$2,$3");
console.log(instruction22.getBinIns());
let instruction23 = new InstructionR_1.InstructionR("sll $1,$2,10");
console.log(instruction23.getBinIns());
let instruction24 = new InstructionR_1.InstructionR("srl $1,$2,10");
console.log(instruction24.getBinIns());
let instruction25 = new InstructionI_1.InstructionI("sb $1,20($2)");
console.log(instruction25.getBinIns());
let instruction26 = new InstructionI_1.InstructionI("sc $1,20($2)");
console.log(instruction26.getBinIns());
let instruction27 = new InstructionI_1.InstructionI("sh $1,20($2)");
console.log(instruction27.getBinIns());
let instruction28 = new InstructionI_1.InstructionI("sw $1,20($2)");
console.log(instruction28.getBinIns());
let instruction29 = new InstructionR_1.InstructionR("sub $1,$2,$3");
console.log(instruction29.getBinIns());
let instruction30 = new InstructionR_1.InstructionR("subu $1,$2,$3");
console.log(instruction30.getBinIns());
console.log("--------------------------");
let decoderForR = DecoderForR_1.DecoderForR.getDecoder();
decoderForR.setIns("add $s1,$s2,$s3");
let binIns1 = "origin";
if (decoderForR.validate() == true) {
    decoderForR.decode();
    binIns1 = decoderForR.getBinIns();
}
console.log(binIns1);
let instructionCom1 = new InstructionR_1.InstructionR("add $17,$18,$19");
console.log(instructionCom1.getBinIns());
console.log("-------------------------");
let decoderForI = DecoderForI_1.DecoderForI.getDecoder();
decoderForI.setIns("addi $s1,$s2,31");
let binIns2 = "origin";
if (decoderForI.validate() == true) {
    decoderForI.decode();
    binIns2 = decoderForI.getBinIns();
}
console.log(binIns2);
let instructionCom2 = new InstructionI_1.InstructionI("addi $17,$18,31");
console.log(instructionCom2.getBinIns());
console.log("--------------------------");
let decoderForJ = DecoderForJ_1.DecoderForJ.getDecoder();
decoderForJ.setIns("j 10000");
let binIns3 = "origin";
if (decoderForJ.validate() == true) {
    decoderForJ.decode();
    binIns3 = decoderForJ.getBinIns();
}
console.log(binIns3);
let instructionCom3 = new InstructionJ_1.InstructionJ("j 10000");
console.log(instructionCom3.getBinIns());
console.log("------------------------------");
let map = MapForInsType_1.MapForInsType.getMap();
for (let [key, value] of map) {
    console.log(key);
}
console.log("----------------------------");
let patt = /[\s]/;
console.log(patt.test("   "));
console.log(patt.test(" "));
console.log(patt.test("         "));
console.log(patt.test(""));
console.log("-----------------------------");
let testString = "add $1,$2,$3" + "\n" + "sub $3,$4,$5" + "\n" + "\n" + "ll 12";
let substrings = testString.split("\n");
console.log(substrings);
console.log("------------------------------");
let num = "-1000";
console.log(+num + 100);
let num2 = "+1000";
console.log(+num2 + 100);
console.log("-----------------------------");
let imm = "+1000";
console.log(imm.substring(1));
let patt1 = /^[0-9]$/;
let IMM = "10+00";
if ((!patt1.test(IMM.charAt(0)) && IMM.charAt(0) != "+" && IMM.charAt(0) != "-") || !patt1.test(IMM)) {
    console.log("Invalid");
}
else {
    console.log("valid");
}
console.log(patt1.test(IMM));
console.log(patt1.test("1"));
console.log("--------------------------");
let str = "add $s1,  $s2, $s3";
str = TrimSpace_1.trimSpace(str);
console.log(str);
console.log("--------------------------");
str = "#sd";
console.log(str.substring(0, str.search("#")));
console.log("--------------------------");
let indices = new ArrayList_1.ArrayList(10);
indices.add("100");
console.log(indices.get(0));
console.log("--------------------------");
let instruction31 = new InstructionR_1.InstructionR("sra $1,$2,1");
console.log(instruction31.getBinIns());
console.log("--------------------------");
let strArr = ["YCY", "QWE", "ASD"];
console.log(strArr);
strArr.splice(2, 0, "ZXC");
console.log(strArr);
console.log("--------------------------");
str = "abs $t1,$t2";
posOfSpace = str.indexOf(" ");
console.log(str.substring(posOfSpace + 1).split(","));
console.log("--------------------------");
let strArr2 = [];
strArr2.push("abc");
strArr2.push("qwe");
strArr2.push("zxc");
strArr2.push("asd");
console.log(strArr2);
strArr = strArr2;
console.log(strArr);
console.log("-------------------------");
str = "main: ";
console.log(str.trim().endsWith(":"));
console.log("-------------------------");
console.log(BinaryToDecimal_1.binaryToDecimal("0000000000000010"));
console.log("-------------------------");
let decoder1 = DecoderForI_1.DecoderForI.getDecoder();
decoder1.setIns("addiu $t1,$8,10");
console.log(decoder1.validate());
decoder1.decode();
console.log(decoder1.getBinIns());
// 001000   10010   10001   0000000000011111
// 001001   01001   01001   0000000000001010
//# sourceMappingURL=test.js.map