"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//待解决问题：
const ArrayList_1 = require("./ArrayList");
const Assembler_1 = require("./Assembler");
let assembler = Assembler_1.Assembler.getAssembler();
assembler.setSources(".text" + "\n" + "main: " + "\n" + "la $a0, str" + "\n" + "syscall" + "\n" + ".data" + "\n" + "str: " + "\n" + ".ascii" + "\n" + "\"s\"");
//assembler.setSources(".data" + "\n" + "item:" + "\n" + ".ascii \"s\"" + "\n" + ".word 33" + "\n" + "item2:" + "\n" + ".asciiz" + "\n" + "\"scc\"" + "\n" + ".text" + "\n" + "la $t1,item");
//assembler.setSources("sub $s1, $s2, $s3" + "\n" + ".text" + "\n" + ".globl main" + "\n" + "addi $s1,$s2,100" + "\n" + ".text" + "\n" + "addi $s1,$s2,10" + "\n" + ".data" + "\n" + ".asciiz  10000" + "\n" + ".data" + "\n" + ".byte 7890" + "\n" + ".text" + "\n" + "beq $t1,$t2,main" + "\n" + "main:" + "addi $s1,$s2,10" + "\n" + "j main" + "\n" + "beq $t1,$t2,-1");
if (assembler.preprocess()) {
    if (assembler.assemble()) {
        let i;
        let bin = new ArrayList_1.ArrayList(10);
        bin = assembler.getBin();
        for (i = 0; i < bin.size(); i++) {
            console.log(bin.get(i).toString());
        }
    }
    else {
        console.log(assembler.getErrMsg());
    }
}
else {
    console.log(assembler.getErrMsg());
}
// console.log(assembler.getMapForDataLabel().keys());
// console.log(assembler.getMapForDataLabel().values());
let printer = new Array(10);
let i;
console.log("SourceIns-----------------------");
printer = assembler.getSourceIns();
for (i = 0; i < printer.length; i++) {
    console.log(printer[i]);
}
console.log("Basic-----------------------");
let printer3 = assembler.getBasic();
for (i = 0; i < printer3.size(); i++) {
    console.log(printer3.get(i));
}
console.log("Data-----------------------");
let printer2 = new ArrayList_1.ArrayList(10);
printer2 = assembler.getData();
for (i = 0; i < printer2.size(); i++) {
    console.log(printer2.get(i));
}
console.log("-----------------------");
//# sourceMappingURL=Main.js.map