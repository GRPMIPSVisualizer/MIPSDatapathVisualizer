(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.singleCycleCpu = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayList = void 0;
/**
 * ArrayList
 */
class ArrayList {
    constructor(initialCapacity) {
        // The array used to store the elements
        this.elementData = [];
        // The number of elements stored in the ArrayList
        this.sizeNum = 0;
        if (typeof initialCapacity === 'number') {
            //initialize the capacity of the ArrayList
            if (initialCapacity < 0) {
                throw new Error("is no arrayList index : " + initialCapacity);
            }
            this.elementData = new Array(initialCapacity);
        }
        else {
            //initialize the capacity of the ArrayList
            this.elementData = new Array(10);
        }
    }
    add(arg0, arg1) {
        if (typeof arg0 === 'number') {
            //绱㈠紩娣诲姞
            this.ensureExplicitCapacity();
            this.rangeCheck(arg0);
            this.elementData.splice(arg0, 0, arg1);
            this.sizeNum++;
        }
        else {
            //鏅€氭坊鍔?瀹归噺璁＄畻
            this.ensureExplicitCapacity();
            this.elementData[this.sizeNum] = arg0;
            this.sizeNum++;
        }
    }
    /**
     * TODO  閫氳繃涓嬫爣鏌ヨ瀵硅薄
     * @param index 绱㈠紩
     * @return Object
     */
    get(index) {
        this.rangeCheck(index);
        return this.elementData[index];
    }
    /**
     * TODO  鏇存柊鏁版嵁
     * @param index 涓嬫爣
     * @param 瀵硅薄鏁版嵁
     * @return void
     */
    update(index, Object) {
        this.rangeCheck(index);
        this.elementData[index] = Object;
    }
    remove(arg0) {
        if (typeof arg0 === 'number') {
            //鍒犻櫎鎸囧畾涓嬫爣鏁版嵁
            this.elementData.splice(arg0, 1);
            this.sizeNum--;
            return true;
        }
        else {
            //鍒犻櫎鍏蜂綋鏁版嵁,鏁版嵁澶氫笉寤鸿浣跨敤
            let result = false;
            for (let i = 0; i < this.sizeNum; i++) {
                if (this.get(i) === arg0) {
                    result = this.remove(i);
                }
            }
            if (result == false) {
                console.log("is no object?");
            }
            return result;
        }
    }
    /**
     * TODO 鑾峰彇闆嗗悎闀垮害
     * @return
     */
    size() {
        return this.sizeNum;
    }
    /**
     * TODO 妫€娴嬫暟缁勬槸鍚︿笅鏍囪秺鐣岋紝鏄姏鍑鸿秺鐣屽紓甯?
     *
     * @param index
     */
    rangeCheck(index) {
        if (index >= this.sizeNum || index < 0) {
            throw new Error("is no index--->" + index);
        }
    }
    /**
     *  TODO 鑷姩鎵╁ 1.5X
     *  << : 宸︾Щ杩愮畻绗︼紝num << 1, 鐩稿綋浜巒um涔樹互2
     *  >> : 鍙崇Щ杩愮畻绗︼紝num >> 1, 鐩稿綋浜巒um闄や互2
     */
    ensureExplicitCapacity() {
        if (this.elementData.length < this.sizeNum + 1) {
            // 褰撳墠闆嗗悎瀹為檯瀹归噺
            let oldCapacity = this.elementData.length;
            //鎵╁1.5鍊嶅悗鐨勬暟
            let newCapacity = oldCapacity + (oldCapacity >> 1);
            //淇敼闆嗗悎瀹归噺
            this.elementData.length = newCapacity;
            //console.log(this.elementData.length+"--> "+newCapacity + "--銆?+this.elementData);
        }
    }
}
exports.ArrayList = ArrayList;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assembler = void 0;
const DecoderForR_1 = require("./DecoderForR");
const DecoderForI_1 = require("./DecoderForI");
const DecoderForJ_1 = require("./DecoderForJ");
const MapForCommaNum_1 = require("./MapForCommaNum");
const MapForInsType_1 = require("./MapForInsType");
const ArrayList_1 = require("./ArrayList");
const TrimSpace_1 = require("./TrimSpace");
class Assembler {
    constructor() {
        this.decoderForR = DecoderForR_1.DecoderForR.getDecoder();
        this.decoderForI = DecoderForI_1.DecoderForI.getDecoder();
        this.decoderForJ = DecoderForJ_1.DecoderForJ.getDecoder();
        this.source = new ArrayList_1.ArrayList(10);
        this.basic = new ArrayList_1.ArrayList(10);
        this.bin = new ArrayList_1.ArrayList(10);
    }
    static getAssembler() {
        return this.assembler;
    }
    getSource() {
        return this.source;
    }
    getBasic() {
        return this.basic;
    }
    setSource(source) {
        let sourceIns = source.split("\n");
        let i;
        let j;
        let patt = /^[\s]$/;
        for (i = 0; i < sourceIns.length; i++) {
            sourceIns[i] = sourceIns[i].trim();
        }
        let label;
        let mapForLabel = new Map();
        let address = "4194304";
        let posOfSpace;
        let operator;
        let jumpLabel;
        let instructionCounter = 0;
        let labelCounter = 0;
        let mapForCounter = new Map();
        let relativeJump = 0;
        let patt2 = /^[0-9]+$/;
        let labelFlag = true;
        for (i = 0; i < sourceIns.length; i++) {
            if (sourceIns[i] == "" || patt.test(sourceIns[i])) {
                continue;
            }
            else if (sourceIns[i].substring(sourceIns[i].length - 1, sourceIns[i].length) == ":") {
                label = sourceIns[i].substring(0, sourceIns[i].lastIndexOf(":")).trim();
                if (label.search(" ") != -1) {
                    console.log("Error 9 in Assembler. Label unrecognized.");
                }
                else {
                    mapForLabel.set(label, address);
                    labelCounter = instructionCounter;
                    mapForCounter.set(label, labelCounter.toFixed());
                }
            }
            instructionCounter++;
        }
        instructionCounter = 0;
        for (i = 0; i < sourceIns.length; i++) {
            if (sourceIns[i] == "" || patt.test(sourceIns[i]) || sourceIns[i].substring(sourceIns[i].length - 1, sourceIns[i].length) == ":") {
                continue;
            }
            else {
                posOfSpace = sourceIns[i].indexOf(" ");
                operator = sourceIns[i].substring(0, posOfSpace);
                this.source.add(sourceIns[i]);
                if (operator == "j" || operator == "jal") {
                    jumpLabel = sourceIns[i].substring(posOfSpace, sourceIns[i].length).trim();
                    for (j = 0; j < jumpLabel.length; j++) {
                        if (!patt2.test(jumpLabel.charAt(j))) {
                            labelFlag = true;
                            break;
                        }
                        else {
                            labelFlag = false;
                        }
                    }
                    if (labelFlag) {
                        if (mapForLabel.has(jumpLabel)) {
                            if (operator == "j") {
                                sourceIns[i] = "j " + mapForLabel.get(jumpLabel);
                            }
                            else {
                                sourceIns[i] = "jal " + mapForLabel.get(jumpLabel);
                            }
                            address = (+address + 4).toFixed();
                        }
                        else {
                            console.log("Error 10 in Assembler. Label is not found.");
                        }
                    }
                    else {
                        address = (+address + 4).toFixed();
                    }
                }
                else if (operator == "beq" || operator == "bne") {
                    jumpLabel = sourceIns[i].substring(sourceIns[i].lastIndexOf(",") + 1, sourceIns[i].length).trim();
                    for (j = 0; j < jumpLabel.length; j++) {
                        if (j == 0 && jumpLabel.charAt(0) == "-") {
                            continue;
                        }
                        if (!patt2.test(jumpLabel.charAt(j))) {
                            labelFlag = true;
                            break;
                        }
                        else {
                            labelFlag = false;
                        }
                    }
                    if (labelFlag) {
                        if (mapForLabel.has(jumpLabel)) {
                            relativeJump = +(mapForCounter.get(jumpLabel) + "") - instructionCounter - 1;
                            if (operator == "beq") {
                                sourceIns[i] = "beq" + sourceIns[i].substring(posOfSpace, sourceIns[i].lastIndexOf(",") + 1) + relativeJump.toFixed();
                            }
                            else {
                                sourceIns[i] = "bne" + sourceIns[i].substring(posOfSpace, sourceIns[i].lastIndexOf(",") + 1) + relativeJump.toFixed();
                            }
                            address = (+address + 4).toFixed();
                        }
                        else {
                            console.log("Error 11 in Assembler. Label is not found.");
                        }
                    }
                    else {
                        address = (+address + 4).toFixed();
                    }
                }
                this.basic.add(TrimSpace_1.trimSpace(sourceIns[i]));
                instructionCounter++;
            }
        }
    }
    getBin() {
        return this.bin;
    }
    assemble() {
        let result = true;
        let i;
        for (i = 0; i < this.basic.size(); i++) {
            let ins = this.basic.get(i).toString();
            let posOfSpace = ins.indexOf(" ");
            let operator = ins.substring(0, posOfSpace);
            if (MapForCommaNum_1.MapForCommaNum.getMap().has(operator)) {
                let expectedNumComma = MapForCommaNum_1.MapForCommaNum.getMap().get(operator);
                let actualNumComma = ins.split(",").length - 1;
                if (expectedNumComma == undefined) {
                    console.log("Error 1 in Assembler. Instruction unrecognized.");
                    return false;
                }
                else if (expectedNumComma == actualNumComma) {
                    let type = MapForInsType_1.MapForInsType.getMap().get(operator);
                    if (type == undefined) {
                        console.log("Error 2 in Assembler.");
                        return false;
                    }
                    else {
                        switch (type) {
                            case "R":
                                this.decoderForR.setIns(ins);
                                if (this.decoderForR.validate() == true) {
                                    this.decoderForR.decode();
                                    this.bin.add(this.decoderForR.getBinIns());
                                }
                                else {
                                    console.log("Error 3 in Assembler. Invalid instruction.");
                                    return false;
                                }
                                break;
                            case "I":
                                this.decoderForI.setIns(ins);
                                if (this.decoderForI.validate() == true) {
                                    this.decoderForI.decode();
                                    this.bin.add(this.decoderForI.getBinIns());
                                }
                                else {
                                    console.log("Error 4 in Assembler. Invalid instruction.");
                                    return false;
                                }
                                break;
                            case "J":
                                this.decoderForJ.setIns(ins);
                                if (this.decoderForJ.validate() == true) {
                                    this.decoderForJ.decode();
                                    this.bin.add(this.decoderForJ.getBinIns());
                                }
                                else {
                                    console.log("Error 5 in Assembler. Invalid instruction.");
                                    return false;
                                }
                                break;
                            default:
                                console.log("Error 6 in Assembler. Unrecognized instruction type.");
                                return false;
                        }
                    }
                }
                else {
                    console.log("Error 7 in Assembler. Invalid instruction.");
                    return false;
                }
            }
            else {
                console.log("Error 8 in Assembler. Instruction unrecognized.");
                return false;
            }
        }
        return result;
    }
}
exports.Assembler = Assembler;
Assembler.assembler = new Assembler();

},{"./ArrayList":1,"./DecoderForI":6,"./DecoderForJ":7,"./DecoderForR":8,"./MapForCommaNum":13,"./MapForInsType":15,"./TrimSpace":21}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.binaryAddition = void 0;
function binaryAddition(a, b) {
    let result = "";
    let x = 0;
    let y = 0;
    let pre = 0;
    let sum = 0;
    while (a.length != b.length) {
        if (a.length > b.length) {
            b = "0" + b;
        }
        else {
            a = "0" + a;
        }
    }
    let i;
    for (i = a.length - 1; i >= 0; i--) {
        x = +a.charAt(i);
        y = +b.charAt(i);
        sum = x + y + pre;
        if (sum >= 2) {
            pre = 1;
            result = "" + (sum - 2) + result;
        }
        else {
            pre = 0;
            result = "" + sum + result;
        }
    }
    if (pre == 1) {
        result = "1" + result;
    }
    return result;
}
exports.binaryAddition = binaryAddition;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decimalToBinary = void 0;
const Stack_1 = require("./Stack");
const TransformZeroOne_1 = require("./TransformZeroOne");
const BinaryAddition_1 = require("./BinaryAddition");
/**
 * Transform a number from decimal to binary.
 * The input numOfBits must be sufficient to represent the input decimal number.
 *
 * @param decimal the decimal number that need translation.
 * @param numOfBits the number of bits of the desired binary number (or two's implement).
 * If the input decimal number is positive, it will be translated into its binary number or its two's complement according to numOfBits.
 * If the input decimal number is negative, it will be translated into its two's complement.
 */
function decimalToBinary(decimal, numOfBits) {
    let binaryString = '';
    let isNegative = 0;
    if (decimal === 0) {
        for (let i = 0; i < numOfBits; i++) {
            binaryString = binaryString + "0";
        }
        return binaryString;
    }
    if (decimal < 0) {
        decimal = -decimal;
        isNegative = 1;
    }
    let stk = new Stack_1.Stack();
    while (decimal > 0) {
        stk.push(Math.floor(decimal % 2));
        decimal = Math.floor(decimal / 2);
    }
    let size = stk.size();
    for (let i = 0; i < size; i++) {
        binaryString = "" + binaryString + stk.pop();
    }
    while (binaryString.length < numOfBits) {
        binaryString = "0" + binaryString;
    }
    if (isNegative) {
        binaryString = TransformZeroOne_1.transformZeroOne(binaryString);
        binaryString = BinaryAddition_1.binaryAddition(binaryString, "1");
    }
    return binaryString;
}
exports.decimalToBinary = decimalToBinary;

},{"./BinaryAddition":3,"./Stack":19,"./TransformZeroOne":20}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decoder = void 0;
class Decoder {
    constructor() {
        this.ins = "";
        this.operator = "";
        this.binIns = "";
    }
    setIns(ins) {
        this.ins = ins;
        var posOfSpace = this.ins.indexOf(" ");
        this.operator = ins.substring(0, posOfSpace);
    }
    getIns() {
        return this.ins;
    }
    getBinIns() {
        return this.binIns;
    }
}
exports.Decoder = Decoder;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecoderForI = void 0;
const Decoder_1 = require("./Decoder");
const InstructionI_1 = require("./InstructionI");
const MapForRegister_1 = require("./MapForRegister");
class DecoderForI extends Decoder_1.Decoder {
    constructor() {
        super();
    }
    static getDecoder() {
        return this.decoder;
    }
    validate() {
        let posOfSpace = this.ins.indexOf(" ");
        let operandRS = "";
        let operandRT = "";
        let IMM = "";
        if (this.operator == "lui") {
            let operands = this.ins.substring(posOfSpace + 1, this.ins.length).split(",", 2);
            operandRT = operands[0];
            IMM = operands[1];
        }
        else if (this.operator == "beq" || this.operator == "bne") {
            let operands = this.ins.substring(posOfSpace + 1, this.ins.length).split(",", 3);
            operandRS = operands[0];
            operandRT = operands[1];
            IMM = operands[2];
        }
        else if (this.operator == "addi" ||
            this.operator == "addiu" ||
            this.operator == "andi" ||
            this.operator == "ori" ||
            this.operator == "slti" ||
            this.operator == "sltiu") {
            let operands = this.ins.substring(posOfSpace + 1, this.ins.length).split(",", 3);
            operandRT = operands[0];
            operandRS = operands[1];
            IMM = operands[2];
        }
        else {
            let numLeftBracket = this.ins.split("(").length - 1;
            let numRightBracket = this.ins.split(")").length - 1;
            if (!(numLeftBracket == 1 && numRightBracket == 1)) {
                console.log("Error 1 in DecoderForI. Invalid instruction format.");
                return false;
            }
            let operands = this.ins.substring(posOfSpace + 1, this.ins.length).split(",", 2);
            let leftBracket = operands[1].indexOf("(");
            let rightBracket = operands[1].indexOf(")");
            operandRT = operands[0];
            operandRS = operands[1].substring(leftBracket + 1, rightBracket);
            IMM = operands[1].substring(0, leftBracket);
        }
        let patt1 = /^[0-9]+$/;
        let patt2 = /^[a-z0-9]+$/;
        if (!patt1.test(IMM.charAt(0)) && IMM.charAt(0) != "+" && IMM.charAt(0) != "-") {
            console.log("Error 2 in DecoderForI. Invalid immediate number.");
            return false;
        }
        else if (+IMM <= -32768 || +IMM >= 32767) {
            console.log("Error 3 in DecoderForI. Invalid immediate number. Out of range.");
            return false;
        }
        let operands = [operandRS, operandRT];
        let i;
        for (i = 0; i < operands.length; i++) {
            let operand = operands[i].substring(1, operands[i].length);
            if (operands[i].charAt(0) == "$" && patt1.test(operand) && +operand > 31) {
                console.log("Error 4 in DecoderForI. Invalid operand.");
                return false;
            }
            else if (operands[i] == "" || (operands[i].charAt(0) == "$" && patt1.test(operand) && +operand <= 31)) {
                break;
            }
            else if (operands[i].charAt(0) == "$" && patt2.test(operand)) {
                if (MapForRegister_1.MapForRegister.getMap().has(operand)) {
                    let operandID = MapForRegister_1.MapForRegister.getMap().get(operand);
                    if (operandID == undefined) {
                        console.log("Error 5 in DecoderForI. Invalid operand.");
                        return false;
                    }
                    else {
                        this.ins = this.ins.replace(operand, operandID);
                    }
                }
            }
            else {
                console.log("Error 6 in DecoderForR. Invalid operand.");
                return false;
            }
        }
        return true;
    }
    decode() {
        let instruction = new InstructionI_1.InstructionI(this.ins);
        this.binIns = instruction.getBinIns();
    }
}
exports.DecoderForI = DecoderForI;
DecoderForI.decoder = new DecoderForI();

},{"./Decoder":5,"./InstructionI":10,"./MapForRegister":18}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecoderForJ = void 0;
const Decoder_1 = require("./Decoder");
const InstructionJ_1 = require("./InstructionJ");
class DecoderForJ extends Decoder_1.Decoder {
    constructor() {
        super();
    }
    static getDecoder() {
        return this.decoder;
    }
    validate() {
        let posOfSpace = this.ins.indexOf(" ");
        let operandADDRESS = this.ins.substring(posOfSpace + 1, this.ins.length);
        let patt1 = /^[0-9]+$/;
        if (!patt1.test(operandADDRESS)) {
            console.log("Error 1 in DecoderForJ. Invalid address.");
            return false;
        }
        return true;
    }
    decode() {
        let instruction = new InstructionJ_1.InstructionJ(this.ins);
        this.binIns = instruction.getBinIns();
    }
}
exports.DecoderForJ = DecoderForJ;
DecoderForJ.decoder = new DecoderForJ();

},{"./Decoder":5,"./InstructionJ":11}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecoderForR = void 0;
const Decoder_1 = require("./Decoder");
const InstructionR_1 = require("./InstructionR");
const MapForRegister_1 = require("./MapForRegister");
class DecoderForR extends Decoder_1.Decoder {
    constructor() {
        super();
    }
    static getDecoder() {
        return this.decoder;
    }
    validate() {
        let posOfSpace = this.ins.indexOf(" ");
        let operandRS = "";
        let operandRT = "";
        let operandRD = "";
        let SHAMT = "";
        if (this.operator == "jr") {
            operandRS = this.ins.substring(posOfSpace + 1, this.ins.length);
        }
        else if (this.operator == "sll" || this.operator == "srl") {
            let operands = this.ins.substring(posOfSpace + 1, this.ins.length).split(",", 3);
            operandRD = operands[0];
            operandRT = operands[1];
            SHAMT = operands[2];
        }
        else {
            let operands = this.ins.substring(posOfSpace + 1, this.ins.length).split(",", 3);
            operandRD = operands[0];
            operandRS = operands[1];
            operandRT = operands[2];
        }
        let patt1 = /^[0-9]+$/;
        let patt2 = /^[a-z0-9]+$/;
        if ((!(SHAMT == "" || patt1.test(SHAMT))) || (patt1.test(SHAMT) && +SHAMT >= 32)) {
            console.log("Error 1 in DecoderForR. Invalid shift amount.");
            return false;
        }
        let operands = [operandRS, operandRT, operandRD];
        let i;
        for (i = 0; i < operands.length; i++) {
            let operand = operands[i].substring(1, operands[i].length);
            if (operands[i].charAt(0) == "$" && patt1.test(operand) && +operand > 31) {
                console.log("Error 2 in DecoderForR. Invalid operand.");
                return false;
            }
            else if (operands[i] == "" || (operands[i].charAt(0) == "$" && patt1.test(operand) && +operand <= 31)) {
                break;
            }
            else if (operands[i].charAt(0) == "$" && patt2.test(operand)) {
                if (MapForRegister_1.MapForRegister.getMap().has(operand)) {
                    let operandID = MapForRegister_1.MapForRegister.getMap().get(operand);
                    if (operandID == undefined) {
                        console.log("Error 3 in DecoderForR. Invalid operand.");
                        return false;
                    }
                    else {
                        this.ins = this.ins.replace(operand, operandID);
                    }
                }
            }
            else {
                console.log("Error 4 in DecoderForR. Invalid operand.");
                return false;
            }
        }
        return true;
    }
    decode() {
        let instruction = new InstructionR_1.InstructionR(this.ins);
        this.binIns = instruction.getBinIns();
    }
}
exports.DecoderForR = DecoderForR;
DecoderForR.decoder = new DecoderForR();

},{"./Decoder":5,"./InstructionR":12,"./MapForRegister":18}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instruction = void 0;
class Instruction {
    constructor(ins) {
        this.ins = ins;
        this.binIns = "";
        let posOfSpace = ins.indexOf(" ");
        this.operator = ins.substring(0, posOfSpace);
    }
    getBinIns() {
        return this.binIns;
    }
}
exports.Instruction = Instruction;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructionI = void 0;
const DecimalToBinary_1 = require("./DecimalToBinary");
const Instruction_1 = require("./Instruction");
const MapForI_1 = require("./MapForI");
class InstructionI extends Instruction_1.Instruction {
    //The ins should be in the form like "addi $8,$16,10".
    //There should be only one space between the operator and the first operand, no other space existing.
    //The register should be in dollar sign and a number.
    constructor(ins) {
        super(ins);
        let opBin = MapForI_1.MapForI.getMap().get(this.operator);
        if (opBin == undefined) {
            this.op = "XXXXXX";
            console.log("Error in constructor for InstructionR.");
        }
        else {
            this.op = opBin;
        }
        let posOfSpace = ins.indexOf(" ");
        if (this.operator == "lui") {
            let operands = ins.substring(posOfSpace + 1, ins.length).split(",", 2);
            this.operandRS = "";
            this.operandRT = operands[0];
            this.operandIMM = operands[1];
            this.rs = "00000";
            this.rt = DecimalToBinary_1.decimalToBinary(+this.operandRT.substring(1), 5);
            this.imm = DecimalToBinary_1.decimalToBinary(+this.operandIMM, 16);
        }
        else if (this.operator == "beq" || this.operator == "bne") {
            let operands = ins.substring(posOfSpace + 1, ins.length).split(",", 3);
            this.operandRS = operands[0];
            this.operandRT = operands[1];
            this.operandIMM = operands[2];
            this.rs = DecimalToBinary_1.decimalToBinary(+this.operandRS.substring(1), 5);
            this.rt = DecimalToBinary_1.decimalToBinary(+this.operandRT.substring(1), 5);
            this.imm = DecimalToBinary_1.decimalToBinary(+this.operandIMM, 16);
        }
        else if (this.operator == "addi" ||
            this.operator == "addiu" ||
            this.operator == "andi" ||
            this.operator == "ori" ||
            this.operator == "slti" ||
            this.operator == "sltiu") {
            let operands = ins.substring(posOfSpace + 1, ins.length).split(",", 3);
            this.operandRS = operands[1];
            this.operandRT = operands[0];
            this.operandIMM = operands[2];
            this.rs = DecimalToBinary_1.decimalToBinary(+this.operandRS.substring(1), 5);
            this.rt = DecimalToBinary_1.decimalToBinary(+this.operandRT.substring(1), 5);
            this.imm = DecimalToBinary_1.decimalToBinary(+this.operandIMM, 16);
        }
        else {
            let operands = ins.substring(posOfSpace + 1, ins.length).split(",", 2);
            let leftBracket = operands[1].indexOf("(");
            let rightBracket = operands[1].indexOf(")");
            this.operandRS = operands[1].substring(leftBracket + 1, rightBracket);
            this.operandRT = operands[0];
            this.operandIMM = operands[1].substring(0, leftBracket);
            this.rs = DecimalToBinary_1.decimalToBinary(+this.operandRS.substring(1), 5);
            this.rt = DecimalToBinary_1.decimalToBinary(+this.operandRT.substring(1), 5);
            this.imm = DecimalToBinary_1.decimalToBinary(+this.operandIMM, 16);
        }
        this.binIns = this.op + this.rs + this.rt + this.imm;
    }
}
exports.InstructionI = InstructionI;

},{"./DecimalToBinary":4,"./Instruction":9,"./MapForI":14}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructionJ = void 0;
const DecimalToBinary_1 = require("./DecimalToBinary");
const Instruction_1 = require("./Instruction");
const MapForJ_1 = require("./MapForJ");
class InstructionJ extends Instruction_1.Instruction {
    //The ins should be in the form like "j 10000".
    //There should be only one space between the operator and the first operand, no other space existing.
    //The address should be represented by a decimal number.
    constructor(ins) {
        super(ins);
        let opBin = MapForJ_1.MapForJ.getMap().get(this.operator);
        if (opBin == undefined) {
            this.op = "XXXXXX";
            console.log("Error in constructor for InstructionR.");
        }
        else {
            this.op = opBin;
        }
        let posOfSpace = ins.indexOf(" ");
        this.operandADDRESS = ins.substring(posOfSpace + 1, ins.length);
        this.address = DecimalToBinary_1.decimalToBinary(+this.operandADDRESS, 26);
        this.binIns = this.op + this.address;
    }
}
exports.InstructionJ = InstructionJ;

},{"./DecimalToBinary":4,"./Instruction":9,"./MapForJ":16}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructionR = void 0;
const DecimalToBinary_1 = require("./DecimalToBinary");
const Instruction_1 = require("./Instruction");
const MapForR_1 = require("./MapForR");
class InstructionR extends Instruction_1.Instruction {
    //The ins should be in the form like "add $8,$16,$17".
    //There should be only one space between the operator and the first operand, no other space existing.
    //The register should be in dollar sign and a number.
    constructor(ins) {
        super(ins);
        this.op = "000000";
        let functBin = MapForR_1.MapForR.getMap().get(this.operator);
        if (functBin == undefined) {
            this.funct = "XXXXXX";
            console.log("Error in constructor for InstructionR.");
        }
        else {
            this.funct = functBin;
        }
        let posOfSpace = ins.indexOf(" ");
        if (this.operator == "jr") {
            this.operandRS = ins.substring(posOfSpace + 1, ins.length);
            this.operandRD = "";
            this.operandRT = "";
            this.rs = DecimalToBinary_1.decimalToBinary(+this.operandRS.substring(1), 5);
            this.rt = "00000";
            this.rd = "00000";
            this.shamt = "00000";
        }
        else if (this.operator == "sll" || this.operator == "srl") {
            let operands = ins.substring(posOfSpace + 1, ins.length).split(",", 3);
            this.operandRS = "";
            this.operandRD = operands[0];
            this.operandRT = operands[1];
            this.shamt = DecimalToBinary_1.decimalToBinary(+operands[2], 5);
            this.rs = "00000";
            this.rt = DecimalToBinary_1.decimalToBinary(+this.operandRT.substring(1), 5);
            this.rd = DecimalToBinary_1.decimalToBinary(+this.operandRD.substring(1), 5);
        }
        else {
            let operands = ins.substring(posOfSpace + 1, ins.length).split(",", 3);
            this.operandRD = operands[0];
            this.operandRS = operands[1];
            this.operandRT = operands[2];
            this.rs = DecimalToBinary_1.decimalToBinary(+this.operandRS.substring(1), 5);
            this.rt = DecimalToBinary_1.decimalToBinary(+this.operandRT.substring(1), 5);
            this.rd = DecimalToBinary_1.decimalToBinary(+this.operandRD.substring(1), 5);
            this.shamt = "00000";
        }
        this.binIns = this.op + this.rs + this.rt + this.rd + this.shamt + this.funct;
    }
}
exports.InstructionR = InstructionR;

},{"./DecimalToBinary":4,"./Instruction":9,"./MapForR":17}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapForCommaNum = void 0;
class MapForCommaNum {
    constructor() { }
    static getMap() {
        if (this.map.size == 0) {
            this.map.set("add", 2);
            this.map.set("addu", 2);
            this.map.set("sub", 2);
            this.map.set("subu", 2);
            this.map.set("and", 2);
            this.map.set("or", 2);
            this.map.set("nor", 2);
            this.map.set("slt", 2);
            this.map.set("sltu", 2);
            this.map.set("sll", 2);
            this.map.set("srl", 2);
            this.map.set("jr", 0);
            this.map.set("addi", 2);
            this.map.set("addiu", 2);
            this.map.set("andi", 2);
            this.map.set("beq", 2);
            this.map.set("bne", 2);
            this.map.set("lbu", 1);
            this.map.set("lhu", 1);
            this.map.set("ll", 1);
            this.map.set("lui", 1);
            this.map.set("lw", 1);
            this.map.set("ori", 2);
            this.map.set("slti", 2);
            this.map.set("sltiu", 2);
            this.map.set("sb", 1);
            this.map.set("sc", 1);
            this.map.set("sh", 1);
            this.map.set("sw", 1);
            this.map.set("j", 0);
            this.map.set("jal", 0);
        }
        return this.map;
    }
}
exports.MapForCommaNum = MapForCommaNum;
MapForCommaNum.map = new Map();

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapForI = void 0;
class MapForI {
    constructor() { }
    static getMap() {
        if (this.map.size == 0) {
            let addiOp = "001000";
            let addiuOp = "001001";
            let andiOp = "001100";
            let beqOp = "000100";
            let bneOp = "000101";
            let lbuOp = "100100";
            let lhuOp = "100101";
            let llOp = "110000";
            let luiOp = "001111";
            let lwOp = "100011";
            let oriOp = "001101";
            let sltiOp = "001010";
            let sltiuOp = "001011";
            let sbOp = "101000";
            let scOp = "111000";
            let shOp = "101001";
            let swOp = "101011";
            this.map.set("addi", addiOp);
            this.map.set("addiu", addiuOp);
            this.map.set("andi", andiOp);
            this.map.set("beq", beqOp);
            this.map.set("bne", bneOp);
            this.map.set("lbu", lbuOp);
            this.map.set("lhu", lhuOp);
            this.map.set("ll", llOp);
            this.map.set("lui", luiOp);
            this.map.set("lw", lwOp);
            this.map.set("ori", oriOp);
            this.map.set("slti", sltiOp);
            this.map.set("sltiu", sltiuOp);
            this.map.set("sb", sbOp);
            this.map.set("sc", scOp);
            this.map.set("sh", shOp);
            this.map.set("sw", swOp);
        }
        return this.map;
    }
}
exports.MapForI = MapForI;
MapForI.map = new Map();

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapForInsType = void 0;
class MapForInsType {
    constructor() { }
    static getMap() {
        if (this.map.size == 0) {
            let typeR = "R";
            let typeI = "I";
            let typeJ = "J";
            this.map.set("add", typeR);
            this.map.set("addu", typeR);
            this.map.set("sub", typeR);
            this.map.set("subu", typeR);
            this.map.set("and", typeR);
            this.map.set("or", typeR);
            this.map.set("nor", typeR);
            this.map.set("slt", typeR);
            this.map.set("sltu", typeR);
            this.map.set("sll", typeR);
            this.map.set("srl", typeR);
            this.map.set("jr", typeR);
            this.map.set("addi", typeI);
            this.map.set("addiu", typeI);
            this.map.set("andi", typeI);
            this.map.set("beq", typeI);
            this.map.set("bne", typeI);
            this.map.set("lbu", typeI);
            this.map.set("lhu", typeI);
            this.map.set("llOp", typeI);
            this.map.set("lui", typeI);
            this.map.set("lw", typeI);
            this.map.set("ori", typeI);
            this.map.set("slti", typeI);
            this.map.set("sltiu", typeI);
            this.map.set("sb", typeI);
            this.map.set("sc", typeI);
            this.map.set("sh", typeI);
            this.map.set("sw", typeI);
            this.map.set("j", typeJ);
            this.map.set("jal", typeJ);
        }
        return this.map;
    }
}
exports.MapForInsType = MapForInsType;
MapForInsType.map = new Map();

},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapForJ = void 0;
class MapForJ {
    constructor() { }
    static getMap() {
        if (this.map.size == 0) {
            let jOp = "000010";
            let jalOp = "000011";
            this.map.set("j", jOp);
            this.map.set("jal", jalOp);
        }
        return this.map;
    }
}
exports.MapForJ = MapForJ;
MapForJ.map = new Map();

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapForR = void 0;
class MapForR {
    constructor() { }
    static getMap() {
        if (this.map.size == 0) {
            let addFunct = "100000";
            let adduFunct = "100001";
            let subFunct = "100010";
            let subuFunct = "100011";
            let andFunct = "100100";
            let orFunct = "100101";
            let norFunct = "100111";
            let sltFunct = "101010";
            let sltuFunct = "101011";
            let sllFunct = "000000";
            let srlFunct = "000010";
            let jrFunct = "001000";
            this.map.set("add", addFunct);
            this.map.set("addu", adduFunct);
            this.map.set("sub", subFunct);
            this.map.set("subu", subuFunct);
            this.map.set("and", andFunct);
            this.map.set("or", orFunct);
            this.map.set("nor", norFunct);
            this.map.set("slt", sltFunct);
            this.map.set("sltu", sltuFunct);
            this.map.set("sll", sllFunct);
            this.map.set("srl", srlFunct);
            this.map.set("jr", jrFunct);
        }
        return this.map;
    }
}
exports.MapForR = MapForR;
MapForR.map = new Map();

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapForRegister = void 0;
class MapForRegister {
    constructor() { }
    static getMap() {
        if (this.map.size == 0) {
            this.map.set("zero", "0");
            this.map.set("at", "1");
            this.map.set("v0", "2");
            this.map.set("v1", "3");
            this.map.set("a0", "4");
            this.map.set("a1", "5");
            this.map.set("a2", "6");
            this.map.set("a3", "7");
            this.map.set("t0", "8");
            this.map.set("t1", "9");
            this.map.set("t2", "10");
            this.map.set("t3", "11");
            this.map.set("t4", "12");
            this.map.set("t5", "13");
            this.map.set("t6", "14");
            this.map.set("t7", "15");
            this.map.set("s0", "16");
            this.map.set("s1", "17");
            this.map.set("s2", "18");
            this.map.set("s3", "19");
            this.map.set("s4", "20");
            this.map.set("s5", "21");
            this.map.set("s6", "22");
            this.map.set("s7", "23");
            this.map.set("t8", "24");
            this.map.set("t9", "25");
            this.map.set("k0", "26");
            this.map.set("k1", "27");
            this.map.set("gp", "28");
            this.map.set("sp", "29");
            this.map.set("fp", "30");
            this.map.set("ra", "31");
        }
        return this.map;
    }
}
exports.MapForRegister = MapForRegister;
MapForRegister.map = new Map();

},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stack = void 0;
class Stack {
    constructor() {
        this.items = [];
    }
    push(element) {
        // 鍚戞爤椤跺帇鍏ヤ竴涓厓绱?
        this.items.push(element);
    }
    pop() {
        // 浠庢爤椤跺脊鍑轰竴涓厓绱?
        return this.items.pop();
    }
    peek() {
        // 杩斿洖鏍堥《鍏冪礌
        return this.items[this.items.length - 1];
    }
    isEmpty() {
        // 娴嬭瘯鏍堟槸鍚︿负绌?
        return this.items.length == 0;
    }
    size() {
        // 杩斿洖鏍堝厓绱犱釜鏁?
        return this.items.length;
    }
    length() {
        // 杩斿洖鏍堝厓绱犱釜鏁?
        return this.size();
    }
    clear() {
        this.items = [];
    }
    toString() {
        return this.items;
    }
}
exports.Stack = Stack;

},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformZeroOne = void 0;
//Transform one to zero and transform zero to one
function transformZeroOne(str) {
    let result = "";
    let i;
    for (i = 0; i < str.length; i++) {
        if (str.charAt(i) == '0') {
            result = result + "1";
        }
        else if (str.charAt(i) == '1') {
            result = result + "0";
        }
        else {
            console.log("Error in function inverseZeroOne");
            return "";
        }
    }
    return result;
}
exports.transformZeroOne = transformZeroOne;

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimSpace = void 0;
//Delete spaces in string except the first space
function trimSpace(str) {
    let result = "";
    let tempString = str.trim();
    let posOfFirstSpace = tempString.indexOf(" ");
    let beforeSpace = tempString.substring(0, posOfFirstSpace + 1);
    let afterSpace = tempString.substring(posOfFirstSpace + 1, tempString.length).replace(/\s+/g, "");
    result = beforeSpace + afterSpace;
    return result;
}
exports.trimSpace = trimSpace;

},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleCycleCpu = void 0;
const Adder_1 = require("../Circuit/Adder");
const ALU_1 = require("../Circuit/ALU");
const ControlUnits_1 = require("../Circuit/ControlUnits");
const Memory_1 = require("../Circuit/Memory");
const Register_1 = require("../Circuit/Register");
const RegisterFile_1 = require("../Circuit/RegisterFile");
const Sign_extend_1 = require("../Circuit/Sign-extend");
const Signal_1 = require("../Circuit/Signal");
const Mux32_1 = require("../Conponent/Mux32");
const BooleanHandler_1 = require("../Library/BooleanHandler");
const StringHandle_1 = require("../Library/StringHandle");
const AND_1 = require("../Logic/AND");
const Assembler_1 = require("../Assembler/Assembler");
const BItsGenerator_1 = require("../Library/BItsGenerator");
class PC extends Register_1._32BitsRegister {
    constructor(InsMem, PCAdder) {
        super();
        this.InstructionMem = InsMem;
        this.setInpin32(InsMem.getTextAddress());
        this.PCAdder = PCAdder;
        this.oneClockCycle();
    }
    oneClockCycle() {
        if (this.getClockSignal().getSignal()) {
            throw Error("One clock should start from false");
        }
        this.setClockSignal(true);
        this.setClockSignal(false);
    }
    muxChange(MUX) {
        this.setInpin32(MUX.outPin32);
    }
    setOutpin32() {
        super.setOutpin32();
        this.InstructionMem.setTextAddress(this.getOutPin32());
        this.PCAdder.newInPin(StringHandle_1.stringToIntArray(this.getOutPin32()), StringHandle_1.stringToIntArray(StringHandle_1.decToUnsignedBin32(4)));
    }
}
class PCAdder extends Adder_1.Adder {
    constructor(ALUAdder, MUX) {
        super(StringHandle_1.decToUnsignedBin32(0), StringHandle_1.decToUnsignedBin32(4));
        this.ALUAdder = ALUAdder;
        this.MUX = MUX;
    }
    connectConponents(ALUAdder, Mux) {
        this.ALUAdder = ALUAdder;
        this.MUX = Mux;
    }
    newInPin(inSignalA, inSignalB) {
        super.newInPin(inSignalA, inSignalB);
        this.ALUAdder.setInpinA(this.getOutput());
        this.MUX.setInpin32A(this.getOutput());
    }
}
// export class ConnectedMemory extends Memory{
//     private bindedControlUnit:ControlUnits;
//     private bindedRegisterFile:RegisterFile;
//     private bindedSignExtend:SignExtend;
//     constructor(bc:ControlUnits,br:RegisterFile,bs:SignExtend){
//         super();
//         this.bindedControlUnit = bc;
//         this.bindedRegisterFile = br;
//         this.bindedSignExtend = bs;
//     }
// }
class ALUAdder extends Adder_1.Adder {
    constructor(inSignalA, inSignalB, MUX) {
        super(inSignalA, inSignalB);
        this.MUX1 = MUX;
    }
    setOutpin32() {
        this.outPin32 = StringHandle_1.intArrayToString(this.Adder32(StringHandle_1.stringToIntArray(this.inPin32A), StringHandle_1.stringToIntArray(this.inPin32B)));
        this.MUX1.setInpin32B(this.outPin32);
    }
    setInpinA(binBits) {
        if (binBits.length != 32)
            throw Error("The length of ALU Adder Input A is not 32");
        StringHandle_1.binaryDetect(binBits);
        this.inPin32A = binBits;
        this.setOutpin32();
    }
    setInpinB(binBits) {
        if (binBits.length != 32)
            throw Error("The length of ALU Adder Input B is not 32");
        StringHandle_1.binaryDetect(binBits);
        this.inPin32B = binBits;
        this.setOutpin32();
    }
}
class ConSignExtend extends Sign_extend_1.SignExtend {
    constructor(ALUResultAdder, ALUMux) {
        super();
        this.ALUResultAdder = ALUResultAdder;
        this.ALUInpinBMux = ALUMux;
    }
    setInPin16(inPin, ALUOp) {
        super.setInPin16(inPin, ALUOp);
        let shiftedInput = StringHandle_1.shiftLeftBinary32Bits(this.getOutPin32());
        this.ALUResultAdder.setInpinB(shiftedInput);
        this.ALUInpinBMux.setInpin32B(this.getOutPin32());
    }
    memSetInpin16(Mem, con) {
        this.setInPin16(StringHandle_1.bitsMapping(Mem.getTextOutpin(), 0, 16), con.getALUOp());
    }
}
class conALUControl extends ControlUnits_1.ALUControl {
    constructor(ALU) {
        super(ALU);
    }
    memSetIns(mem) {
        if (this.ALUOp0 && this.ALUOp1) {
            return;
        }
        super.setIns(StringHandle_1.bitsMapping(mem.getTextOutpin(), 0, 6));
        this.ALU.setControlBits(this.getOperationCode());
    }
    setALUOp(controlUnits) {
        super.setALUOp(controlUnits);
        this.ALU.setControlBits(this.getOperationCode());
    }
}
class conRegisterFile extends RegisterFile_1.RegisterFile {
    constructor(ALU, aluInpinBMux, dataMem) {
        super();
        this.ALU = ALU;
        this.ALUInpinBMUX = aluInpinBMux;
        this.DataMemory = dataMem;
    }
    registerRead() {
        super.registerRead();
        this.ALU.setInpinA(this.getOutDataA());
        this.ALUInpinBMUX.setInpin32A(this.getOutDataB());
        this.DataMemory.setInpin32(this.getOutDataB());
    }
    setMuxWriteData(MemMux) {
        this.setWriteData(MemMux.outPin32);
    }
}
class ZeroAnd extends AND_1.AND {
    constructor(MuxA) {
        super(0, 0);
        this.MuxA = MuxA;
    }
    setInpinA(inpin) {
        this.pin1 = BooleanHandler_1.bool2num(inpin);
        this.setOutpin();
    }
    setInpinB(inpin) {
        this.pin2 = BooleanHandler_1.bool2num(inpin);
        this.setOutpin();
    }
    setOutpin() {
        this.outpin = AND_1.AND.And(this.pin1, this.pin2);
        this.MuxA.setSel(this.outpin);
    }
}
class conALU extends ALU_1.ALU {
    constructor(dataMem, MemMux, zeroAnd) {
        super(StringHandle_1.decToUnsignedBin32(0), StringHandle_1.decToUnsignedBin32(0), "0000");
        this.dataMemory = dataMem;
        this.MemoryMux = MemMux;
        this.zeroAnd = zeroAnd;
    }
    detectZero() {
        super.detectZero();
        this.zeroAnd.setInpinB(this.isZero);
    }
    setOutPin(outPin) {
        super.setOutPin(outPin);
        this.dataMemory.setDataAddress(this.getOutPin32());
        this.MemoryMux.setInpin32A(this.getOutPin32());
    }
}
class ConControlUnits extends ControlUnits_1.ControlUnits {
    // private bi
    constructor(bindedRegFile, conALUctl, muxb, aluMux, zeroAnd, MemMux, dataMem) {
        super();
        this.bindedRegFile = bindedRegFile;
        this.bindedALUControl = conALUctl;
        this.MUXB = muxb;
        this.ALUMUX = aluMux;
        this.zeroAnd = zeroAnd;
        this.MemMUX = MemMux;
        this.dataMem = dataMem;
    }
    setOp(code) {
        super.setOp(code);
        this.bindedRegFile.setWriteEnable(false);
        this.dataMem.setReadWriteEnable(false, false);
        this.bindedRegFile.setRegDes(this.RegDes);
        this.bindedALUControl.setALUOp(this);
        this.MUXB.setSel(BooleanHandler_1.bool2num(this.Jump));
        this.ALUMUX.setSel(BooleanHandler_1.bool2num(this.ALUSrc));
        this.zeroAnd.setInpinA(this.Branch);
        this.MemMUX.setSel(BooleanHandler_1.bool2num(this.MemtoReg));
        this.bindedRegFile.setWriteEnable(this.RegWrite);
        this.dataMem.setReadWriteEnable(this.MemRead, this.MemWrite);
    }
}
class singleCycleCpu {
    constructor() {
        this.MUXA = new Mux32_1.Mux32(StringHandle_1.decToUnsignedBin32(0), StringHandle_1.decToUnsignedBin32(0), 0);
        this.MUXB = new Mux32_1.Mux32(StringHandle_1.decToUnsignedBin32(0), StringHandle_1.decToUnsignedBin32(0), 0);
        this.ALUMUX = new Mux32_1.Mux32(StringHandle_1.decToUnsignedBin32(0), StringHandle_1.decToUnsignedBin32(0), 0);
        this.MemMUX = new Mux32_1.Mux32(StringHandle_1.decToUnsignedBin32(0), StringHandle_1.decToUnsignedBin32(0), 0);
        this._zeroAnd = new ZeroAnd(this.MUXA);
        this.ALUADD = new ALUAdder(StringHandle_1.decToUnsignedBin32(0), StringHandle_1.decToUnsignedBin32(0), this.MUXA);
        this._PCAdder = new PCAdder(this.ALUADD, this.MUXA);
        this._Memory = new Memory_1.Memory();
        this._PC = new PC(this._Memory, this._PCAdder);
        this._signExtend = new ConSignExtend(this.ALUADD, this.ALUMUX);
        this._alu = new conALU(this._Memory, this.MemMUX, this._zeroAnd);
        this._aluControl = new conALUControl(this._alu);
        this._registerFile = new conRegisterFile(this._alu, this.ALUMUX, this._Memory);
        this._controlUnits = new ConControlUnits(this._registerFile, this._aluControl, this.MUXB, this.ALUMUX, this._zeroAnd, this.MemMUX, this._Memory);
        this.clockSignal = new Signal_1.Signal(false);
        this._insMemData = new Map();
        this.machCode = [];
        // private _dataMemData:Map<number,string> = new Map();
        // data
        this.PCOut = BItsGenerator_1.init_bits(32);
        this.PCAdderOut = BItsGenerator_1.init_bits(32);
        this.InsMemOut = BItsGenerator_1.init_bits(32);
        this.writeNumberMuxOut = BItsGenerator_1.init_bits(32);
        this.registerFileOutPin1 = BItsGenerator_1.init_bits(32);
        this.registerFileOutPin2 = BItsGenerator_1.init_bits(32);
        this.aluAdderOut = BItsGenerator_1.init_bits(32);
        this.muxAOut = BItsGenerator_1.init_bits(32);
        this.muxBOut = BItsGenerator_1.init_bits(32);
        this.aluMuxOut = BItsGenerator_1.init_bits(32);
        this.memMuxOut = BItsGenerator_1.init_bits(32);
        this.ALUResultOut = BItsGenerator_1.init_bits(32);
        this.ALUIsZeroOut = true;
        this.ControlOut = [];
        this.DMOut = BItsGenerator_1.init_bits(32);
        this.MUXB.addNotifyFunc(this._PC.muxChange.bind(this._PC, this.MUXB));
        this.MUXA.addNotifyFunc(this.MUXB.setMuxInpin32A.bind(this.MUXB, this.MUXA));
        this.ALUMUX.addNotifyFunc(this._alu.setMuxInpinB.bind(this._alu, this.ALUMUX));
        this.MemMUX.addNotifyFunc(this._registerFile.setMuxWriteData.bind(this._registerFile, this.MemMUX));
        this._Memory.addTextNotifyFunc(this._controlUnits.changeOp.bind(this._controlUnits, this._Memory));
        this._Memory.addTextNotifyFunc(this._registerFile.setInstructionCode.bind(this._registerFile, this._Memory));
        this._Memory.addTextNotifyFunc(this.MUXB.memSetInpin32B.bind(this.MUXB, this._Memory, this._PCAdder));
        this._Memory.addTextNotifyFunc(this._signExtend.memSetInpin16.bind(this._signExtend, this._Memory, this._controlUnits));
        this._Memory.addTextNotifyFunc(this._aluControl.memSetIns.bind(this._aluControl, this._Memory));
        this._Memory.addDataNotifyFunc(this.MemMUX.dataMemSetInpin32B.bind(this.MemMUX, this._Memory));
    }
    changeClockSignal() {
        this.clockSignal.changeSiganl();
        this._Memory.clockSiganlChange();
        this._registerFile.changeClockSignal();
        this._PC.changeClockSignal();
        // this._PC.changeClockSignal();
        // this._registerFile.changeClockSignal();
        // this._Memory.clockSiganlChange();
    }
    setClockSignal(signal) {
        if (this.clockSignal.getSignal() == signal)
            return;
        this.setClockSignal(signal);
        this._Memory.setclockSiganl(signal);
        this._registerFile.setClockSignal(signal);
        this._PC.setClockSignal(signal);
    }
    oneClockCycle() {
        this.changeClockSignal();
        this.PCOut = this._PC.getOutPin32();
        this.PCAdderOut = this._PCAdder.getOutput();
        this.InsMemOut = this._Memory.getTextOutpin();
        this.writeNumberMuxOut = this._registerFile.getWriteNumber();
        this.registerFileOutPin1 = this._registerFile.getOutDataA();
        this.registerFileOutPin2 = this._registerFile.getOutDataB();
        this.aluAdderOut = this.ALUADD.getOutput();
        this.muxAOut = this.MUXA.outPin32;
        this.muxBOut = this.MUXB.outPin32;
        this.aluMuxOut = this.ALUMUX.outPin32;
        this.memMuxOut = this.MemMUX.outPin32;
        this.ALUResultOut = this._alu.getOutPin32();
        this.ALUIsZeroOut = this._alu.isZero;
        this.ControlOut = this._controlUnits.getAllSignal();
        this.DMOut = this._Memory.getOutPin32();
        this.changeClockSignal();
    }
    debugPC() {
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        this.changeClockSignal(); // 1 loading
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        this.changeClockSignal(); // 1 done 2 loading    
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        this.changeClockSignal(); // 2 loading
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        this.changeClockSignal(); // 2 done, 3 loading
        console.log("2 done, 3 loading. PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        this.changeClockSignal(); // 3 loading
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        this.changeClockSignal();
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        // 4
        this.changeClockSignal();
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        this.changeClockSignal();
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        // 5
        this.changeClockSignal();
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        this.changeClockSignal();
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        // 6
        this.changeClockSignal();
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        this.changeClockSignal();
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        for (let [key, value] of this._Memory.getAddedData()) {
            console.log(key, value);
        }
        // 7
        this.changeClockSignal();
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        this.changeClockSignal();
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        for (let [key, value] of this._Memory.getAddedData()) {
            console.log(key, value);
        }
        // 8
        this.changeClockSignal();
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        this.changeClockSignal();
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        for (let [key, value] of this._Memory.getAddedData()) {
            console.log(key, value);
        }
        // 9
        this.changeClockSignal();
        console.log("9");
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        this.changeClockSignal();
        console.log("9");
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        for (let [key, value] of this._Memory.getAddedData()) {
            console.log(key, value);
        }
        // 10
        this.changeClockSignal();
        console.log("10");
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        this.changeClockSignal();
        console.log("10");
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        for (let [key, value] of this._Memory.getAddedData()) {
            console.log(key, value);
        }
        // 11
        this.changeClockSignal();
        console.log("11");
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        this.changeClockSignal();
        console.log("11");
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        for (let [key, value] of this._Memory.getAddedData()) {
            console.log(key, value);
        }
        // 12
        this.changeClockSignal();
        console.log("12");
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        this.changeClockSignal();
        console.log("12");
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        for (let [key, value] of this._Memory.getAddedData()) {
            console.log(key, value);
        }
        // 13
        this.changeClockSignal();
        console.log("13");
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        this.changeClockSignal();
        console.log("13");
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        for (let [key, value] of this._Memory.getAddedData()) {
            console.log(key, value);
        }
        // 14
        this.changeClockSignal();
        console.log("14");
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        this.changeClockSignal();
        console.log("14");
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        for (let [key, value] of this._Memory.getAddedData()) {
            console.log(key, value);
        }
        // 15
        this.changeClockSignal();
        console.log("15");
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        this.changeClockSignal();
        console.log("15");
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        for (let [key, value] of this._Memory.getAddedData()) {
            console.log(key, value);
        }
    }
    debugReg() {
        let regs = this._registerFile.getRegisters();
        let Regs = [];
        regs.forEach(reg => {
            Regs.push(reg.getOutPin32());
        });
        return Regs;
    }
    storeIns(Ins) {
        let pcPtr = StringHandle_1.bin2dec("00000000010000000000000000000000", true);
        Ins.forEach(In => {
            if (In.length != 32)
                throw new Error("Adding Instruction Length must be 32!");
            StringHandle_1.binaryDetect(In);
            this._Memory.addInsAt(In, pcPtr);
            this._insMemData.set(pcPtr, In);
            pcPtr = pcPtr + 4;
        });
    }
    getMachineCode() {
        return this.machCode;
    }
    getCurrentInsAddr() {
        return this._Memory.getTextAddress();
    }
    getStaticData() {
        let StatData = new Array();
        for (let [key, value] of this._Memory.getStaticData()) {
            StatData.push([key, value]);
        }
        return StatData;
    }
    getDynamicData() {
        let DynamicData = new Array();
        for (let [key, value] of this._Memory.getAddedData()) {
            DynamicData.push([key, value]);
        }
        return DynamicData;
    }
    Assemble(Ins) {
        let machCode = [];
        let assembler = Assembler_1.Assembler.getAssembler();
        assembler.setSource(Ins);
        if (assembler.assemble() == true) {
            for (let i = 0; i < assembler.getBin().size(); i++) {
                machCode.push(assembler.getBin().get(i));
            }
        }
        else {
            console.log("Error");
        }
        this.storeIns(machCode);
        this.machCode = machCode;
    }
    resetAll() {
    }
}
exports.singleCycleCpu = singleCycleCpu;

},{"../Assembler/Assembler":2,"../Circuit/ALU":23,"../Circuit/Adder":24,"../Circuit/ControlUnits":25,"../Circuit/Memory":28,"../Circuit/Register":29,"../Circuit/RegisterFile":30,"../Circuit/Sign-extend":31,"../Circuit/Signal":32,"../Conponent/Mux32":39,"../Library/BItsGenerator":42,"../Library/BooleanHandler":43,"../Library/StringHandle":44,"../Logic/AND":45}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALU = void 0;
const Adder_1 = require("./Adder");
const AND32_1 = require("../Logic/AND32");
const OR32_1 = require("../Logic/OR32");
const StringHandle_1 = require("../Library/StringHandle");
const NOT32_1 = require("../Logic/NOT32");
const Mux4Way32_1 = require("../Conponent/Mux4Way32");
class ALU {
    constructor(inPinA, inPinB, control) {
        this.outPin32 = "";
        this.inPin32A = inPinA;
        this.inPin32B = inPinB;
        this.controlBits = control;
        this.isUnsign = false;
        this.isOverflow = false;
        this.isZero = false;
        this.Adder32 = new Adder_1.Adder(inPinA, inPinB);
        this.outPin32 = StringHandle_1.decToUnsignedBin32(0);
    }
    getOutPin32() {
        return this.outPin32;
    }
    ALU() {
        let control = StringHandle_1.stringToIntArray(this.controlBits);
        let pinA = StringHandle_1.stringToIntArray(this.inPin32A);
        let pinB = StringHandle_1.stringToIntArray(this.inPin32B);
        if (control[0])
            pinA = NOT32_1.NOT32.Not32(pinA);
        if (control[1])
            pinB = NOT32_1.NOT32.Not32(pinB);
        if (StringHandle_1.intArrayToString(control).slice(0, 3) == "011") {
            if (!this.isUnsign) {
                pinB = StringHandle_1.stringToIntArray(StringHandle_1.decToSignedBin32(StringHandle_1.bin2dec(StringHandle_1.intArrayToString(pinB), this.isUnsign) + 1));
            }
            else {
                pinB = StringHandle_1.stringToIntArray(StringHandle_1.decToUnsignedBin32(StringHandle_1.bin2dec(StringHandle_1.intArrayToString(pinB), this.isUnsign) + 1));
            }
        }
        let or32 = OR32_1.OR32.Or32(pinA, pinB);
        let and32 = AND32_1.AND32.And32(pinA, pinB);
        this.Adder32.newInPin(pinA, pinB);
        this.overflowDetect(this.Adder32.getInpinAAt(0), this.Adder32.getInpinBAt(0), this.Adder32.getOutputAt(0), this.Adder32.carry);
        let inpin = [and32, or32, StringHandle_1.stringToIntArray(this.Adder32.getOutput()), StringHandle_1.stringToIntArray(StringHandle_1.decToSignedBin32(this.Adder32.getOutputAt(0)))];
        // console.log(inpin[0],and32);
        this.setOutPin(StringHandle_1.intArrayToString(Mux4Way32_1.Mux4Way32.Mux4Way32(inpin, [control[2], control[3]])));
        this.detectZero();
    }
    overflowDetect(lastPinA, lastPinB, lastOut, carry) {
        // console.log(lastPinA,lastPinB,!lastOut);
        if (this.isUnsign) {
            if (carry) {
                this.isOverflow = true;
            }
            else {
                this.isOverflow = false;
            }
        }
        else {
            if ((lastPinA && lastPinB && !lastOut) || (!lastPinA && !lastPinB && lastOut)) {
                this.isOverflow = true;
            }
            else {
                this.isOverflow = false;
            }
        }
    }
    detectZero() {
        for (let i = 0; i < this.outPin32.length; ++i) {
            if (parseInt(this.outPin32.charAt(i)) != 0) {
                this.isZero = false;
                return;
            }
        }
        this.isZero = true;
    }
    newSignal(inPinA, inPinB, controlBits) {
        this.inPin32A = inPinA;
        this.inPin32B = inPinB;
        this.controlBits = controlBits;
        this.ALU();
    }
    setControlBits(conBits) {
        this.controlBits = conBits;
        this.ALU();
    }
    setInpinA(inPin) {
        this.inPin32A = inPin;
        this.ALU();
    }
    setMuxInpinB(MUX) {
        this.inPin32B = MUX.outPin32;
        this.ALU();
    }
    setOutPin(outPin) {
        this.outPin32 = outPin;
    }
}
exports.ALU = ALU;

},{"../Conponent/Mux4Way32":40,"../Library/StringHandle":44,"../Logic/AND32":46,"../Logic/NOT32":50,"../Logic/OR32":52,"./Adder":24}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Adder = void 0;
const AND_1 = require("../Logic/AND");
const XOR_1 = require("../Logic/XOR");
const OR_1 = require("../Logic/OR");
const Mux_1 = require("../Conponent/Mux");
const StringHandle_1 = require("../Library/StringHandle");
class Adder {
    constructor(inSignalA, inSignalB) {
        this.inPin32A = inSignalA;
        this.inPin32B = inSignalB;
        let bitA = StringHandle_1.stringToIntArray(this.inPin32A);
        let bitB = StringHandle_1.stringToIntArray(this.inPin32B);
        this.outPin32 = StringHandle_1.intArrayToString(this.Adder32(bitA, bitB));
        this.carry = 0;
    }
    static halfAdder(inPin1, inPin2) {
        let carry = AND_1.AND.And(inPin1, inPin2);
        let sum = XOR_1.XOR.Xor(inPin1, inPin2);
        return [carry, sum];
    }
    static fullAdder(inPin1, inPin2, carry) {
        let Pin0 = OR_1.OR.Or(inPin1, inPin2);
        let Pin1 = AND_1.AND.And(inPin1, inPin2);
        let Pin2 = XOR_1.XOR.Xor(inPin1, inPin2);
        let sum = XOR_1.XOR.Xor(Pin2, carry);
        let newCarry = Mux_1.Mux.Mux(Pin1, Pin0, carry);
        return [newCarry, sum];
    }
    Adder32(inSignalA, inSignalB) {
        let outPin = new Array(32);
        let carry = 0;
        [carry, outPin[31]] = Adder.halfAdder(inSignalA[31], inSignalB[31]);
        for (let i = 1; i < inSignalA.length; ++i) {
            [carry, outPin[31 - i]] = Adder.fullAdder(inSignalA[31 - i], inSignalB[31 - i], carry);
            // console.log(carry,outPin[i]);
        }
        this.carry = carry;
        return outPin;
    }
    newInPin(inSignalA, inSignalB) {
        this.inPin32A = StringHandle_1.intArrayToString(inSignalA);
        this.inPin32B = StringHandle_1.intArrayToString(inSignalB);
        this.outPin32 = StringHandle_1.intArrayToString(this.Adder32(inSignalA, inSignalB));
    }
    getOutputAt(i) {
        return parseInt(this.outPin32.charAt(i));
    }
    getOutput() {
        return this.outPin32;
    }
    getInpinAAt(i) {
        return parseInt(this.inPin32A.charAt(i));
    }
    getInpinBAt(i) {
        return parseInt(this.inPin32B.charAt(i));
    }
}
exports.Adder = Adder;

},{"../Conponent/Mux":38,"../Library/StringHandle":44,"../Logic/AND":45,"../Logic/OR":51,"../Logic/XOR":53}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALUControl = exports.ControlUnits = void 0;
const BooleanHandler_1 = require("../Library/BooleanHandler");
const StringHandle_1 = require("../Library/StringHandle");
class ControlUnits {
    constructor() {
        this.Op0 = false;
        this.Op1 = false;
        this.Op2 = false;
        this.Op3 = false;
        this.Op4 = false;
        this.Op5 = false;
        this.RegDes = false;
        this.Jump = false;
        this.Branch = false;
        this.MemRead = false;
        this.MemtoReg = false;
        this.ALUOp0 = false;
        this.ALUOp1 = false;
        this.MemWrite = false;
        this.ALUSrc = false;
        this.RegWrite = false;
        this.ImCode = "0000";
    }
    setOp(code) {
        if (code.length != 6)
            throw Error("The length of Op fields is not 6");
        StringHandle_1.binaryDetect(code);
        let codeBits = StringHandle_1.stringToIntArray(code);
        this.Op0 = BooleanHandler_1.num2bool(codeBits[5]);
        this.Op1 = BooleanHandler_1.num2bool(codeBits[4]);
        this.Op2 = BooleanHandler_1.num2bool(codeBits[3]);
        this.Op3 = BooleanHandler_1.num2bool(codeBits[2]);
        this.Op4 = BooleanHandler_1.num2bool(codeBits[1]);
        this.Op5 = BooleanHandler_1.num2bool(codeBits[0]);
        this.conLogic();
        this.iType(code);
        // this.addedIns(code);
    }
    changeOp(conMem) {
        this.setOp(StringHandle_1.bitsMapping(conMem.getTextOutpin(), 26, 32));
    }
    addedIns(code) {
        let decCode = StringHandle_1.bin2dec("00000000000000000000000000" + code, true);
        // lui
        if (decCode == 15) {
            this.RegDes = false;
            this.ALUSrc = true;
            this.MemtoReg = false;
            this.RegWrite = true;
            this.MemRead = false;
            this.MemWrite = false;
            this.Branch = false;
            this.ALUOp1 = false;
            this.ALUOp0 = false;
            this.Jump = false;
            return;
        }
        // jal
        //
    }
    iType(code) {
        let decCode = StringHandle_1.bin2dec("00000000000000000000000000" + code, true);
        if (decCode == 8 || decCode == 9) {
            this.RegDes = false;
            this.ALUSrc = true;
            this.MemtoReg = false;
            this.RegWrite = true;
            this.MemRead = false;
            this.MemWrite = false;
            this.Branch = false;
            this.ALUOp1 = false;
            this.ALUOp0 = false;
            this.Jump = false;
            return;
        }
        if (decCode == 12) {
            this.RegDes = false;
            this.ALUSrc = true;
            this.MemtoReg = false;
            this.RegWrite = true;
            this.MemRead = false;
            this.MemWrite = false;
            this.Branch = false;
            this.ALUOp1 = true;
            this.ALUOp0 = true;
            this.Jump = false;
            this.ImCode = "0000";
            return;
        }
        if (decCode == 13) {
            this.RegDes = false;
            this.ALUSrc = true;
            this.MemtoReg = false;
            this.RegWrite = true;
            this.MemRead = false;
            this.MemWrite = false;
            this.Branch = false;
            this.ALUOp1 = true;
            this.ALUOp0 = true;
            this.Jump = false;
            this.ImCode = "0001";
            return;
        }
        if (decCode == 10) {
            this.RegDes = false;
            this.ALUSrc = true;
            this.MemtoReg = false;
            this.RegWrite = true;
            this.MemRead = false;
            this.MemWrite = false;
            this.Branch = false;
            this.ALUOp1 = true;
            this.ALUOp0 = true;
            this.Jump = false;
            this.ImCode = "0111";
            return;
        }
        //     this.RegDes = 
        //     this.ALUSrc = 
        //     this.MemtoReg = 
        //     this.RegWrite = 
        //     this.MemRead = 
        //     this.MemWrite = 
        //     this.Branch = 
        //     this.ALUOp1 = 
        //     this.ALUOp0 = 
        //     this.Jump = 
    }
    conLogic() {
        let lw = this.Op0 && this.Op1 && !this.Op2 && !this.Op3 && !this.Op4 && this.Op5;
        let sw = this.Op0 && this.Op1 && !this.Op2 && this.Op3 && !this.Op4 && this.Op5;
        let beq = !this.Op0 && !this.Op1 && this.Op2 && !this.Op3 && !this.Op4 && !this.Op5;
        this.RegDes = !(this.Op0 || this.Op1 || this.Op2 || this.Op3 || this.Op4 || this.Op5);
        this.ALUSrc = lw || sw;
        this.MemtoReg = lw;
        this.RegWrite = this.RegDes || lw;
        this.MemRead = lw;
        this.MemWrite = sw;
        this.Branch = beq;
        this.ALUOp1 = !(this.Op0 || this.Op1 || this.Op2 || this.Op3 || this.Op4 || this.Op5);
        this.ALUOp0 = beq;
        this.Jump = !this.Op0 && this.Op1 && !this.Op2 && !this.Op3 && !this.Op4 && !this.Op5;
    }
    getALUOp() {
        return [this.ALUOp0, this.ALUOp1];
    }
    getImcode() {
        return this.ImCode;
    }
    getAllSignal() {
        return [this.RegDes, this.Jump, this.Branch, this.MemRead, this.MemtoReg, this.ALUOp0, this.ALUOp1, this.MemWrite, this.ALUSrc, this.RegWrite];
    }
}
exports.ControlUnits = ControlUnits;
class ALUControl {
    constructor(ALU) {
        this.ALUOp0 = false;
        this.ALUOp1 = false;
        // private controlUnits:ControlUnits;
        this.InsCode = new Array();
        // this.controlUnits = ConUni;
        this.ALU = ALU;
        this._4OperationBits = this.conLogic();
    }
    setALUOp(controlUnits) {
        [this.ALUOp0, this.ALUOp1] = controlUnits.getALUOp();
        if (this.ALUOp0 && this.ALUOp1) {
            this._4OperationBits = controlUnits.getImcode();
            return;
        }
        this.conLogic();
    }
    setIns(code) {
        if (code.length != 6)
            throw Error("The length of Op fields is not 6");
        StringHandle_1.binaryDetect(code);
        let codeBits = StringHandle_1.stringToIntArray(code);
        let newCode = new Array();
        codeBits.forEach(bit => {
            newCode.unshift(BooleanHandler_1.num2bool(bit));
        });
        this.InsCode = newCode;
        this.conLogic();
    }
    conLogic() {
        let operation0 = this.ALUOp1 && (this.InsCode[0] || this.InsCode[3]);
        let operation1 = !(this.ALUOp1 && this.InsCode[2]);
        let operation2 = (this.ALUOp1 && this.InsCode[1]) || this.ALUOp0;
        let operation3 = this.ALUOp0 && !this.ALUOp0;
        let operation = [BooleanHandler_1.bool2num(operation3), BooleanHandler_1.bool2num(operation2), BooleanHandler_1.bool2num(operation1), BooleanHandler_1.bool2num(operation0)];
        operation = this.newFunctCode(operation);
        return this._4OperationBits = StringHandle_1.intArrayToString(operation);
    }
    newFunctCode(oriOpCode) {
        if (this.ALUOp1 && !this.ALUOp0 && this.InsCode[0] && this.InsCode[1] && this.InsCode[2] && !this.InsCode[3] && !this.InsCode[4] && this.InsCode[5]) {
            return [1, 1, 0, 0];
        }
        return oriOpCode;
    }
    getOperationCode() {
        return this._4OperationBits;
    }
}
exports.ALUControl = ALUControl;

},{"../Library/BooleanHandler":43,"../Library/StringHandle":44}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DFlipFlop = void 0;
const BooleanHandler_1 = require("../Library/BooleanHandler");
const NOT_1 = require("../Logic/NOT");
const Latch_1 = require("./Latch");
const Wired_1 = require("./Wired");
class DFlipFlop extends Wired_1.Wired {
    constructor() {
        super();
        this.LatchA = new Latch_1.Latch();
        this.LatchB = new Latch_1.Latch();
        this.clockSigal = this.LatchA.getClockSignal();
        this.DSiganl = this.LatchA.getDSignal();
        this.OutPinA = this.LatchB.getOutPinA();
        this.OutPinB = this.LatchB.getOutPinB();
        this.addWire(this.LatchA.getOutPinA(), this.LatchB.getDSignal());
        this.addWire(this.clockSigal, this.LatchB.getClockSignal(), (signal) => {
            return BooleanHandler_1.num2bool(NOT_1.NOT.Not(BooleanHandler_1.bool2num(signal)));
        });
        // debug
        // this.DSiganl.name = "A-DSignal";
        // this.clockSigal.name = "A-clockSignal";
        // this.LatchA.getOutPinA().name = "A-outASignal";
        // this.LatchB.getClockSignal().name = "B-clockSignal";
        // this.LatchB.getDSignal().name = "B-DSignal";
    }
    changeDSiganl() {
        this.DSiganl.changeSiganl();
        this.clockSigalKeep();
    }
    setDSiganl(signal) {
        this.DSiganl.setSignal(signal);
        this.clockSigalKeep();
    }
    setClockSiganl(signal) {
        this.clockSigal.setSignal(signal);
        this.clockSigalKeep();
    }
    changeClockSiganl() {
        this.clockSigal.changeSiganl();
        this.clockSigalKeep();
    }
    getDSignal() {
        return this.DSiganl;
    }
    clockSigalKeep() {
        this.clockSigal.SignalKeep();
    }
    getOutPinA() {
        return this.OutPinA;
    }
    getOutPinB() {
        return this.OutPinB;
    }
}
exports.DFlipFlop = DFlipFlop;

},{"../Library/BooleanHandler":43,"../Logic/NOT":49,"./Latch":27,"./Wired":34}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Latch = void 0;
const BooleanHandler_1 = require("../Library/BooleanHandler");
const AND_1 = require("../Logic/AND");
const NOT_1 = require("../Logic/NOT");
const OR_1 = require("../Logic/OR");
const Signal_1 = require("./Signal");
// import { Wirable } from "./Wirable";
// up-edge change
class Latch {
    constructor() {
        // super();
        this.clockSignal = new Signal_1.Signal(false, this.Latch.bind(this));
        this.DSiganl = new Signal_1.Signal(false, this.Latch.bind(this));
        this.OutPinA = new Signal_1.Signal(false);
        this.OutPinB = new Signal_1.Signal(true);
    }
    getOutPinA() {
        return this.OutPinA;
    }
    getOutPinB() {
        return this.OutPinB;
    }
    getDSignal() {
        return this.DSiganl;
    }
    getClockSignal() {
        return this.clockSignal;
    }
    changeDSignal() {
        this.DSiganl.changeSiganl();
    }
    changeClockSignal() {
        this.clockSignal.changeSiganl();
    }
    Latch() {
        let pin1 = AND_1.AND.And(BooleanHandler_1.bool2num(this.clockSignal.getSignal()), NOT_1.NOT.Not(BooleanHandler_1.bool2num(this.DSiganl.getSignal())));
        let pin2 = AND_1.AND.And(BooleanHandler_1.bool2num(this.clockSignal.getSignal()), BooleanHandler_1.bool2num(this.DSiganl.getSignal()));
        let outA = this.OutPinA.getSignal();
        let outB = this.OutPinB.getSignal();
        this.OutPinA.setSignal(BooleanHandler_1.num2bool(NOT_1.NOT.Not(OR_1.OR.Or(pin1, BooleanHandler_1.bool2num(outB)))));
        this.OutPinB.setSignal(BooleanHandler_1.num2bool(NOT_1.NOT.Not(OR_1.OR.Or(pin2, BooleanHandler_1.bool2num(outA)))));
    }
}
exports.Latch = Latch;

},{"../Library/BooleanHandler":43,"../Logic/AND":45,"../Logic/NOT":49,"../Logic/OR":51,"./Signal":32}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Memory = void 0;
const BItsGenerator_1 = require("../Library/BItsGenerator");
const StringHandle_1 = require("../Library/StringHandle");
const Signal_1 = require("./Signal");
class Memory {
    constructor(MemorySize = Math.pow(2, 30)) {
        this.notifyFuncText = new Array();
        this.notifyFuncData = new Array();
        this.readSignal = new Signal_1.Signal(false);
        this.writeSignal = new Signal_1.Signal(false);
        this.clockSignal = new Signal_1.Signal(false);
        this.addedData = new Map();
        this.staticData = new Map();
        this.MemorySize = MemorySize;
        this.MemoryArray = new Array(MemorySize);
        this.addressPin = "00000000000000000000000000000000";
        this.inPin32 = "00000000000000000000000000000000";
        this.outPin32 = undefined;
        // default = 0x00400000;
        this.textReadAddress = "00000000010000000000000000000000";
        this.textOutpin = this.readDataAt(this.textReadAddress);
    }
    getMemorySize() {
        return this.MemorySize;
    }
    addInsAt(data, addr) {
        if ((addr % 4) != 0)
            throw Error("The Instruction Address must be multiple of 4!");
        if (addr >= Math.pow(16, 7) || addr < 4 * Math.pow(16, 5))
            throw Error("Instruction Index Cross 0x1000,0000 or below 0x 0040,0000");
        let retIns = this.MemoryArray[addr / 4];
        this.MemoryArray[addr / 4] = data;
        return retIns;
    }
    setDataAddress(newAddr) {
        this.addressPin = newAddr;
        this.judgeReadCondition();
    }
    getTextAddress() {
        return this.textReadAddress;
    }
    setTextAddress(newAddr) {
        this.dataFormatDetect(newAddr);
        this.textReadAddress = newAddr;
        this.textOutpin = this.readDataAt(this.textReadAddress);
        this.notifychange();
    }
    setInpin32(newInpin) {
        if (this.inPin32 == newInpin)
            return;
        this.dataFormatDetect(newInpin);
        this.inPin32 = newInpin;
    }
    getTextOutpin() {
        if (this.textOutpin == undefined)
            return BItsGenerator_1.init_bits(32);
        return this.textOutpin;
    }
    dataFormatDetect(binData) {
        if (binData.length != 32)
            throw Error("The length of data in memory is not 32 bits");
        StringHandle_1.binaryDetect(binData);
    }
    readDataAt(binIndex) {
        return this.MemoryArray[Math.floor(StringHandle_1.bin2dec(this.textReadAddress, true) / 4)];
    }
    readData() {
        let address = StringHandle_1.bin2dec(this.addressPin, true);
        let data1 = this.MemoryArray[Math.floor(address / 4)];
        let data2 = this.MemoryArray[Math.floor(address / 4) + 1];
        this.setOutPin32(data1.slice(8 * (address % 4)) + data2.slice(0, (address % 4)));
    }
    writeData() {
        let address = StringHandle_1.bin2dec(this.addressPin, true);
        let data1 = this.MemoryArray[Math.floor(address / 4)];
        let data2 = this.MemoryArray[Math.floor(address / 4) + 1];
        if (data1 == undefined) {
            data1 = BItsGenerator_1.init_bits(32);
        }
        if (data2 == undefined) {
            data2 = BItsGenerator_1.init_bits(32);
        }
        data1 = data1.slice(0, 8 * (address % 4)) + this.inPin32.slice(0, 8 * (4 - (address % 4)));
        data2 = this.inPin32.slice(8 * (4 - (address % 4))) + data2.slice(8 * (address % 4));
        this.MemoryArray[Math.floor(address / 4)] = data1;
        this.MemoryArray[Math.floor(address / 4) + 1] = data2;
        this.addedData.set(this.addressPin, this.inPin32);
    }
    clockSiganlChange() {
        this.clockSignal.changeSiganl();
        this.dataReact();
    }
    setclockSiganl(signal) {
        if (this.isSignalSame(signal))
            return;
        this.clockSignal.setSignal(signal);
        this.dataReact();
    }
    isSignalSame(signal) {
        if (this.clockSignal.getSignal() == signal)
            return true;
        return false;
    }
    dataReact() {
        if (this.writeSignal.getSignal() && this.readSignal.getSignal()) {
            throw Error("Memory can't be read and write at the same time!");
        }
        if (this.writeSignal.getSignal()) {
            if (this.clockSignal.getSignal() == true)
                return;
            this.writeData();
        }
        this.judgeReadCondition();
    }
    notifychange() {
        this.notifyFuncText.forEach(FuncText => {
            FuncText();
        });
    }
    addTextNotifyFunc(newFunc) {
        this.notifyFuncText.push(newFunc);
    }
    dataChange() {
        this.notifyFuncData.forEach(FuncData => {
            FuncData();
        });
    }
    addDataNotifyFunc(newFunc) {
        this.notifyFuncData.push(newFunc);
    }
    setOutPin32(newOutPin32) {
        this.outPin32 = newOutPin32;
        if (newOutPin32 == undefined)
            return;
        this.dataChange();
    }
    getOutPin32() {
        return this.outPin32;
    }
    setReadWriteEnable(ReadEn, WriteEn) {
        this.readSignal.setSignal(ReadEn);
        this.judgeReadCondition();
        this.writeSignal.setSignal(WriteEn);
        this.dataChange();
    }
    judgeReadCondition() {
        if (this.readSignal.getSignal()) {
            this.readData();
        }
        else {
            this.setOutPin32(undefined);
        }
    }
    getAddedData() {
        return this.addedData;
    }
    storeStaticData(data) {
        let staticDataIndex = StringHandle_1.bin2dec("00010000000000000000000000000000", true) / 4;
        data.forEach((datum) => {
            this.staticData.set(StringHandle_1.decToUnsignedBin32(staticDataIndex * 4), datum);
            this.MemoryArray[staticDataIndex++] = datum;
        });
    }
    getStaticData() {
        return this.staticData;
    }
}
exports.Memory = Memory;

},{"../Library/BItsGenerator":42,"../Library/StringHandle":44,"./Signal":32}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._32BitsRegister = void 0;
const BooleanHandler_1 = require("../Library/BooleanHandler");
const StringHandle_1 = require("../Library/StringHandle");
const DFlipFlop_1 = require("./DFlipFlop");
const Signal_1 = require("./Signal");
class _32BitsRegister {
    constructor() {
        this.outPin32 = "00000000000000000000000000000000";
        this.clockSignal = new Signal_1.Signal(false);
        this.DFFs = new Array();
        for (let i = 0; i < _32BitsRegister.bitsCount; ++i) {
            this.DFFs[i] = new DFlipFlop_1.DFlipFlop();
        }
    }
    setInpin32(newInPins) {
        this.inputDetect(newInPins);
        this.inPin32 = newInPins;
        this.setDSiganls();
        // this.setOutpin32();
    }
    resetInput() {
        this.inPin32 = undefined;
        this.resetDSignals();
    }
    resetDSignals() {
        let bits = StringHandle_1.stringToIntArray(this.outPin32);
        this.DFFs.forEach(DFF => {
            DFF.setDSiganl(BooleanHandler_1.num2bool(bits.shift()));
        });
    }
    changeClockSignal() {
        this.clockSignal.changeSiganl();
        this.DFFs.forEach(DFF => {
            DFF.changeClockSiganl();
        });
        this.setOutpin32();
    }
    setClockSignal(signal) {
        if (typeof signal == "number")
            signal = BooleanHandler_1.num2bool(signal);
        this.clockSignal.setSignal(signal);
        this.DFFs.forEach(DFF => {
            DFF.setClockSiganl(signal);
        });
        this.setOutpin32();
    }
    inputDetect(input) {
        if (input.length != 32) {
            throw new Error("Invalid Input!");
        }
        let bits = StringHandle_1.stringToIntArray(input);
        bits.forEach(bit => {
            if (bit !== 0 && bit !== 1)
                throw new Error("Invalid data " + bit + "!");
        });
    }
    setDSiganls() {
        if (this.inPin32 == undefined)
            return;
        let bits = StringHandle_1.stringToIntArray(this.inPin32);
        this.DFFs.forEach(DFF => {
            DFF.setDSiganl(BooleanHandler_1.num2bool(bits.shift()));
        });
    }
    setOutpin32() {
        let OutPins = new Array();
        this.DFFs.forEach(flipflop => {
            OutPins.push(BooleanHandler_1.bool2num(flipflop.getOutPinA().getSignal()));
        });
        this.outPin32 = StringHandle_1.intArrayToString(OutPins);
    }
    getinPin32() {
        return this.inPin32;
    }
    getOutPin32() {
        return this.outPin32;
    }
    getClockSignal() {
        return this.clockSignal;
    }
}
exports._32BitsRegister = _32BitsRegister;
_32BitsRegister.bitsCount = 32;

},{"../Library/BooleanHandler":43,"../Library/StringHandle":44,"./DFlipFlop":26,"./Signal":32}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterFile = void 0;
const DMux4Way_1 = require("../Conponent/DMux4Way");
const DMux8Way_1 = require("../Conponent/DMux8Way");
const Mux32_1 = require("../Conponent/Mux32");
const Mux4Way32_1 = require("../Conponent/Mux4Way32");
const Mux8Way32_1 = require("../Conponent/Mux8Way32");
const BItsGenerator_1 = require("../Library/BItsGenerator");
const BooleanHandler_1 = require("../Library/BooleanHandler");
const StringHandle_1 = require("../Library/StringHandle");
const Register_1 = require("./Register");
const Signal_1 = require("./Signal");
const Wired_1 = require("./Wired");
class RegisterFile extends Wired_1.Wired {
    constructor() {
        super();
        this.outDataA = "";
        this.outDataB = "";
        this.registers = new Array();
        this.readNumberA = BItsGenerator_1.init_bits(RegisterFile.bitWidth);
        this.readNumberB = BItsGenerator_1.init_bits(RegisterFile.bitWidth);
        this.writeNumber = BItsGenerator_1.init_bits(RegisterFile.bitWidth);
        this.writeData = BItsGenerator_1.init_bits(Math.pow(2, RegisterFile.bitWidth));
        this.clockSignal = new Signal_1.Signal(false);
        this.writeEnable = new Signal_1.Signal(false);
        this.WriteMux = new Mux32_1.Mux32(BItsGenerator_1.init_bits(32), BItsGenerator_1.init_bits(32), 0);
        for (let i = 0; i < Math.pow(2, RegisterFile.bitWidth); ++i) {
            this.registers[i] = new Register_1._32BitsRegister();
            // this.addWire(this.clockSignal,this.registers[i].getClockSignal());
        }
        this.registers[29].setInpin32(StringHandle_1.decToUnsignedBin32(2147479548));
        this.registers[29].changeClockSignal();
        this.registers[29].changeClockSignal();
        this.registers[28].setInpin32(StringHandle_1.decToUnsignedBin32(268468224));
        this.registers[28].changeClockSignal();
        this.registers[28].changeClockSignal();
        let data = new Array();
        this.registers.forEach(register => {
            data.push(register.getOutPin32());
        });
        this.outDataA = this.Mux32Way32(this.readNumberA, data);
        this.outDataB = this.Mux32Way32(this.readNumberB, data);
    }
    getOutDataA() {
        return this.outDataA;
    }
    getOutDataB() {
        return this.outDataB;
    }
    setWriteEnable(siganl) {
        this.writeEnable.setSignal(siganl);
        this.registerWrite();
    }
    setWriteData(data) {
        this.writeData = data;
        this.registerWrite();
    }
    setRegDes(signal) {
        this.WriteMux.setSel(BooleanHandler_1.bool2num(signal));
        this.writeNumber = this.WriteMux.outPin32.slice(27, 32);
    }
    changeClockSignal() {
        this.clockSignal.changeSiganl();
        this.registers.forEach(register => {
            register.changeClockSignal();
        });
    }
    setClockSignal(signal) {
        this.clockSignal.setSignal(signal);
        this.registers.forEach(register => {
            register.setClockSignal(signal);
        });
    }
    setInstructionCode(InsMem) {
        let InsCode = InsMem.getTextOutpin();
        if (InsCode.length != 32)
            throw Error("The length of Instruction code is not 32");
        StringHandle_1.binaryDetect(InsCode);
        this.readNumberA = StringHandle_1.bitsMapping(InsCode, 21, 26);
        this.readNumberB = StringHandle_1.bitsMapping(InsCode, 16, 21);
        this.setWriteNumber(StringHandle_1.bitsMapping(InsCode, 16, 21), StringHandle_1.bitsMapping(InsCode, 11, 16));
        this.registerRead();
    }
    setWriteNumber(InpinA, InpinB) {
        this.WriteMux.setInpin32A("000000000000000000000000000" + InpinA);
        this.WriteMux.setInpin32B("000000000000000000000000000" + InpinB);
        this.writeNumber = this.WriteMux.outPin32.slice(27, 32);
    }
    registerRead() {
        let data = new Array();
        this.registers.forEach(register => {
            data.push(register.getOutPin32());
        });
        this.outDataA = this.Mux32Way32(this.readNumberA, data);
        this.outDataB = this.Mux32Way32(this.readNumberB, data);
    }
    registerWrite() {
        this.registers.forEach(register => {
            register.resetInput();
        });
        // let clockSignals:number[] = this.DMux32Way(this.writeNumber,this.writeEnable);
        // this.registers.forEach(register=>{
        //     register.setClockSignal(num2bool(clockSignals.shift() as number));
        // });
        if (!this.writeEnable.getSignal())
            return;
        let index = StringHandle_1.bin2dec("000000000000000000000000000" + this.writeNumber, true);
        this.registers[index].setInpin32(this.writeData);
    }
    Mux32Way32(index, data) {
        let Muxes = new Array();
        Muxes.push(Mux8Way32_1.Mux8Way32.Mux8Way32(data.slice(0, 8), index.slice(2, 5)));
        Muxes.push(Mux8Way32_1.Mux8Way32.Mux8Way32(data.slice(8, 16), index.slice(2, 5)));
        Muxes.push(Mux8Way32_1.Mux8Way32.Mux8Way32(data.slice(16, 24), index.slice(2, 5)));
        Muxes.push(Mux8Way32_1.Mux8Way32.Mux8Way32(data.slice(24, 32), index.slice(2, 5)));
        return StringHandle_1.intArrayToString(Mux4Way32_1.Mux4Way32.Mux4Way32(Muxes, StringHandle_1.stringToIntArray(index.slice(0, 2))));
    }
    DMux32Way(index, signal) {
        let clockSignal = signal.getSignal();
        let innerOut = DMux4Way_1.DMux4Way.DMux4Way(BooleanHandler_1.bool2num(clockSignal), StringHandle_1.stringToIntArray(index.slice(0, 2)));
        let out32 = new Array();
        for (let i = 0; i < 4; ++i) {
            out32.concat(DMux8Way_1.DMux8Way.DMux8Way(innerOut[i], StringHandle_1.stringToIntArray(index.slice(2, 5))));
        }
        return out32;
    }
    getRegisters() {
        return this.registers;
    }
    getWriteNumber() {
        return this.writeNumber;
    }
}
exports.RegisterFile = RegisterFile;
RegisterFile.bitWidth = 5;

},{"../Conponent/DMux4Way":36,"../Conponent/DMux8Way":37,"../Conponent/Mux32":39,"../Conponent/Mux4Way32":40,"../Conponent/Mux8Way32":41,"../Library/BItsGenerator":42,"../Library/BooleanHandler":43,"../Library/StringHandle":44,"./Register":29,"./Signal":32,"./Wired":34}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignExtend = void 0;
const StringHandle_1 = require("../Library/StringHandle");
class SignExtend {
    constructor() {
        this.inPin16 = "0000000000000000";
        this.outPin32 = "";
        this.signExtend([false, false]);
    }
    setInPin16(inPin, ALUOp) {
        if (inPin.length != 16)
            throw Error("Sign Extend Input length is not 16.");
        StringHandle_1.binaryDetect(inPin);
        this.inPin16 = inPin;
        this.signExtend(ALUOp);
    }
    signExtend(ALUOp) {
        if (this.inPin16.charAt(0) == '0' || (ALUOp[0] && ALUOp[1])) {
            this.outPin32 = "0000000000000000" + this.inPin16;
            return;
        }
        if (this.inPin16.charAt(0) == '1') {
            this.outPin32 = "1111111111111111" + this.inPin16;
        }
    }
    getOutPin32() {
        return this.outPin32;
    }
}
exports.SignExtend = SignExtend;

},{"../Library/StringHandle":44}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signal = void 0;
const BooleanHandler_1 = require("../Library/BooleanHandler");
class Signal {
    //debug
    // public name:string="";
    constructor(signal, reactFunc = function () { }) {
        this.signal = signal;
        this.reactFunc = reactFunc;
        this.notifyChangeFuncs = new Array();
    }
    getSignal() {
        return this.signal;
    }
    changeSiganl() {
        if (typeof this.signal === "boolean")
            this.signal = !this.signal;
        if (typeof this.signal === "number")
            this.signal = BooleanHandler_1.bool2num(!BooleanHandler_1.num2bool(this.signal));
        this.SignalKeep();
    }
    setReactFunc(reactFunc) {
        this.reactFunc = reactFunc;
    }
    setSignal(signal) {
        this.signal = signal;
        this.SignalKeep();
    }
    SignalKeep() {
        this.notifyChange();
        this.reactFunc();
    }
    addNotifyChangeFunc(notifychangeFunc) {
        this.notifyChangeFuncs.push(notifychangeFunc);
    }
    notifyChange() {
        if (this.notifyChangeFuncs.length === 0)
            return;
        this.notifyChangeFuncs.forEach(changeFuncs => {
            changeFuncs();
        });
    }
    syncSignal(changedSignal, LogicFunc) {
        this.setSignal(LogicFunc(changedSignal.getSignal()));
    }
}
exports.Signal = Signal;

},{"../Library/BooleanHandler":43}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wire = void 0;
class Wire {
    constructor(changePin, reactPin, LogicFunc = function (signal) { return signal; }) {
        this.changePin = changePin;
        this.reactPin = reactPin;
        this.reactPin.setSignal(LogicFunc(this.changePin.getSignal()));
        this.changePin.addNotifyChangeFunc(this.reactPin.syncSignal.bind(this.reactPin, this.changePin, LogicFunc));
    }
}
exports.Wire = Wire;

},{}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wired = void 0;
const Wire_1 = require("./Wire");
class Wired {
    constructor() {
        this.Wires = new Array();
    }
    addWire(changeSignal, reactSiganl, LogicFunc) {
        let newWire = (LogicFunc === undefined) ? new Wire_1.Wire(changeSignal, reactSiganl) : new Wire_1.Wire(changeSignal, reactSiganl, LogicFunc);
        this.Wires.push(newWire);
    }
}
exports.Wired = Wired;

},{"./Wire":33}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DMux = void 0;
const AND_1 = require("../Logic/AND");
const NOT_1 = require("../Logic/NOT");
/**
 * This is not Logic
 */
class DMux {
    constructor(inPin, Select) {
        this.inPin = inPin;
        this.sel = Select;
        let temp = [];
        temp = DMux.DMux(this.inPin, this.sel);
        this.outPin1 = temp[0];
        this.outPin2 = temp[1];
    }
    static DMux(inPin, Select) {
        let temp = [];
        let nots = new NOT_1.NOT(Select);
        temp.push(AND_1.AND.And(nots.outpin, inPin));
        temp.push(AND_1.AND.And(Select, inPin));
        return temp;
    }
}
exports.DMux = DMux;

},{"../Logic/AND":45,"../Logic/NOT":49}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DMux4Way = void 0;
const DMux_1 = require("./DMux");
const StringHandle_1 = require("../Library/StringHandle");
class DMux4Way {
    constructor(inPin, Select) {
        this.inPin = inPin;
        this.sel = Select;
        this.outPin = StringHandle_1.intArrayToString(DMux4Way.DMux4Way(this.inPin, StringHandle_1.stringToIntArray(this.sel)));
    }
    static DMux4Way(inPin, Select) {
        let temp = [];
        let dmux1 = new DMux_1.DMux(inPin, Select[0]);
        temp = DMux_1.DMux.DMux(dmux1.outPin1, Select[1]).concat(DMux_1.DMux.DMux(dmux1.outPin2, Select[1]));
        return temp;
    }
}
exports.DMux4Way = DMux4Way;

},{"../Library/StringHandle":44,"./DMux":35}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DMux8Way = void 0;
const DMux_1 = require("./DMux");
const DMux4Way_1 = require("./DMux4Way");
const StringHandle_1 = require("../Library/StringHandle");
class DMux8Way {
    constructor(inPin, Select) {
        this.inPin = inPin;
        this.sel = Select;
        this.outPin = StringHandle_1.intArrayToString(DMux8Way.DMux8Way(this.inPin, StringHandle_1.stringToIntArray(this.sel)));
    }
    static DMux8Way(inPin, Select) {
        let temp = [];
        let dmux1 = new DMux_1.DMux(inPin, Select[0]);
        temp = DMux4Way_1.DMux4Way.DMux4Way(dmux1.outPin1, Select.slice(1, 3)).concat(DMux4Way_1.DMux4Way.DMux4Way(dmux1.outPin2, Select.slice(1, 3)));
        return temp;
    }
}
exports.DMux8Way = DMux8Way;

},{"../Library/StringHandle":44,"./DMux":35,"./DMux4Way":36}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mux = void 0;
const AND_1 = require("../Logic/AND");
const NOT_1 = require("../Logic/NOT");
const OR_1 = require("../Logic/OR");
/**
 * This is not Logic
 */
class Mux {
    constructor(inPin1, inPin2, Select) {
        this.inPin1 = inPin1;
        this.inPin2 = inPin2;
        this.sel = Select;
        this.outPin = Mux.Mux(this.inPin1, this.inPin2, this.sel);
    }
    static Mux(inPin1, inPin2, Select) {
        let nots = new NOT_1.NOT(Select);
        let and1 = new AND_1.AND(inPin2, Select);
        let and2 = new AND_1.AND(inPin1, nots.outpin);
        return OR_1.OR.Or(and1.outpin, and2.outpin);
    }
}
exports.Mux = Mux;

},{"../Logic/AND":45,"../Logic/NOT":49,"../Logic/OR":51}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mux32 = void 0;
const StringHandle_1 = require("../Library/StringHandle");
const Mux_1 = require("./Mux");
class Mux32 {
    constructor(inSignalA, inSignalB, Select) {
        this.notifyFunc = new Array();
        this.inPin32A = inSignalA;
        this.inPin32B = inSignalB;
        this.sel = Select;
        let bitA = StringHandle_1.stringToIntArray(this.inPin32A);
        let bitB = StringHandle_1.stringToIntArray(this.inPin32B);
        this.outPin32 = StringHandle_1.intArrayToString(Mux32.Mux32(bitA, bitB, this.sel));
    }
    static Mux32(inSignalA, inSignalB, Select) {
        let i = 0;
        let outPin = [];
        inSignalA.forEach((bit) => {
            outPin.push(Mux_1.Mux.Mux(bit, inSignalB[i], Select));
            ++i;
        });
        return outPin;
    }
    setInpin32A(newInPin) {
        this.inPin32A = newInPin;
        this.setOutPin();
    }
    memSetInpin32B(_Memory, _PCAdder) {
        let newInpin = StringHandle_1.bitsMapping(_PCAdder.getOutput(), 28, 32) + StringHandle_1.bitsMapping(StringHandle_1.shiftLeftBinary32Bits(_Memory.getTextOutpin()), 0, 28);
        this.setInpin32B(newInpin);
    }
    dataMemSetInpin32B(_Memory) {
        if (_Memory.getOutPin32() == undefined)
            return;
        this.setInpin32B(_Memory.getOutPin32());
    }
    setInpin32B(newInPin) {
        this.inPin32B = newInPin;
        this.setOutPin();
    }
    setMuxInpin32A(MUX) {
        this.setInpin32A(MUX.outPin32);
    }
    setSel(newSel) {
        this.sel = newSel;
        this.setOutPin();
    }
    setOutPin() {
        this.outPin32 = StringHandle_1.intArrayToString(Mux32.Mux32(StringHandle_1.stringToIntArray(this.inPin32A), StringHandle_1.stringToIntArray(this.inPin32B), this.sel));
        this.notifychange();
    }
    notifychange() {
        this.notifyFunc.forEach(Func => {
            Func();
        });
    }
    addNotifyFunc(newFunc) {
        this.notifyFunc.push(newFunc);
    }
}
exports.Mux32 = Mux32;

},{"../Library/StringHandle":44,"./Mux":38}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mux4Way32 = void 0;
const Mux32_1 = require("./Mux32");
const StringHandle_1 = require("../Library/StringHandle");
class Mux4Way32 {
    constructor(inSignal, Select) {
        this.inPin32 = inSignal;
        this.sel = Select;
        let bits = [];
        let index = 0;
        this.inPin32.forEach(pin => {
            bits[index] = StringHandle_1.stringToIntArray(pin);
            ++index;
        });
        let selBit = StringHandle_1.stringToIntArray(this.sel);
        this.outPin32 = StringHandle_1.intArrayToString(Mux4Way32.Mux4Way32(bits, selBit));
    }
    static Mux4Way32(inPin, Select2Way) {
        let mux32A = new Mux32_1.Mux32(StringHandle_1.intArrayToString(inPin[0]), StringHandle_1.intArrayToString(inPin[1]), Select2Way[1]);
        let mux32B = new Mux32_1.Mux32(StringHandle_1.intArrayToString(inPin[2]), StringHandle_1.intArrayToString(inPin[3]), Select2Way[1]);
        return Mux32_1.Mux32.Mux32(StringHandle_1.stringToIntArray(mux32A.outPin32), StringHandle_1.stringToIntArray(mux32B.outPin32), Select2Way[0]);
    }
}
exports.Mux4Way32 = Mux4Way32;

},{"../Library/StringHandle":44,"./Mux32":39}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mux8Way32 = void 0;
const Mux4Way32_1 = require("./Mux4Way32");
const Mux32_1 = require("./Mux32");
const StringHandle_1 = require("../Library/StringHandle");
class Mux8Way32 {
    constructor(inSignal, Select) {
        this.inPin32 = inSignal;
        this.sel = Select;
        this.outPin32 = StringHandle_1.intArrayToString(Mux8Way32.Mux8Way32(this.inPin32, this.sel));
    }
    static Mux8Way32(inPin, Select2Way) {
        let mux4Way32A = new Mux4Way32_1.Mux4Way32(inPin.slice(0, 4), Select2Way.slice(1, 3));
        let mux4Way32B = new Mux4Way32_1.Mux4Way32(inPin.slice(4, 8), Select2Way.slice(1, 3));
        // console.log(mux4Way32A);
        // console.log(mux4Way32B);
        return Mux32_1.Mux32.Mux32(StringHandle_1.stringToIntArray(mux4Way32A.outPin32), StringHandle_1.stringToIntArray(mux4Way32B.outPin32), parseInt(Select2Way.charAt(0)));
    }
}
exports.Mux8Way32 = Mux8Way32;

},{"../Library/StringHandle":44,"./Mux32":39,"./Mux4Way32":40}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init_bits = void 0;
const StringHandle_1 = require("./StringHandle");
function init_bits(bitWidth) {
    let bits = new Array();
    for (let i = 0; i < bitWidth; ++i) {
        bits.push(0);
    }
    return StringHandle_1.intArrayToString(bits);
}
exports.init_bits = init_bits;

},{"./StringHandle":44}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.num2bool = exports.bool2num = void 0;
function bool2num(bool) {
    if (bool)
        return 1;
    else
        return 0;
}
exports.bool2num = bool2num;
function num2bool(num) {
    if (num != 0)
        return true;
    else
        return false;
}
exports.num2bool = num2bool;

},{}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hex2bin = exports.bin2hex = exports.shiftLeftBinary32Bits = exports.bitsMapping = exports.binaryDetect = exports.bin2dec = exports.lengthDetect = exports.decToUnsignedBin32 = exports.decToSignedBin32 = exports.intArrayToString = exports.stringToIntArray = void 0;
function stringToIntArray(binaryString) {
    let intArray = [];
    // need ES5 or higher version or right module import format
    // for(let signal of inSignalA){
    //     bitA.push(parseInt(signal));
    // }
    // for(let signal of inSignalB){
    //     bitB.push(parseInt(signal));
    // }
    for (var i = 0; i < binaryString.length; ++i) {
        intArray.push(parseInt(binaryString.charAt(i)));
    }
    return intArray;
}
exports.stringToIntArray = stringToIntArray;
function intArrayToString(intArray) {
    return intArray.join("");
}
exports.intArrayToString = intArrayToString;
function decToSignedBin32(dec) {
    let bin32 = (dec >>> 0).toString(2);
    if (dec >= 0) {
        let binArr32 = stringToIntArray(bin32);
        let i = 32;
        let out32 = new Array(i);
        let j = bin32.length;
        while (i > 0) {
            out32[--i] = binArr32[--j];
            if (j == 0)
                break;
        }
        while (i > 0) {
            out32[--i] = 0;
        }
        return intArrayToString(out32);
    }
    lengthDetect(bin32);
    return bin32;
}
exports.decToSignedBin32 = decToSignedBin32;
function decToUnsignedBin32(dec) {
    if (dec < 0)
        throw Error("Unsign number cannot less than zero!");
    let bin32 = (dec >>> 0).toString(2);
    if (bin32.length < 32)
        return decToSignedBin32(dec);
    if (bin32.length == 32)
        return bin32;
    throw Error("Unsign Overflow!");
}
exports.decToUnsignedBin32 = decToUnsignedBin32;
function lengthDetect(binNum) {
    if (binNum.length > 32)
        throw Error("binary length is longer than 32!");
}
exports.lengthDetect = lengthDetect;
function bin2dec(bin, isUnsigned) {
    if (bin.length != 32)
        throw Error("binary length is longer than 32!");
    let binArr = stringToIntArray(bin);
    let retNum = 0;
    if (isUnsigned)
        retNum += binArr[0] * Math.pow(2, 31);
    else {
        retNum += -binArr[0] * Math.pow(2, 31);
    }
    for (let i = 1; i < bin.length; ++i) {
        retNum += binArr[i] * Math.pow(2, (31 - i));
    }
    return retNum;
}
exports.bin2dec = bin2dec;
function binaryDetect(bin) {
    stringToIntArray(bin).forEach(bit => {
        if (bit != 0 && bit != 1)
            throw Error("Binary data " + bin + " has invalid bit.");
    });
}
exports.binaryDetect = binaryDetect;
function bitsMapping(bits, from, to) {
    let newFrom = 32 - to;
    let newTo = 32 - from;
    return bits.slice(newFrom, newTo);
}
exports.bitsMapping = bitsMapping;
function shiftLeftBinary32Bits(binBits) {
    return binBits.slice(2) + "00";
}
exports.shiftLeftBinary32Bits = shiftLeftBinary32Bits;
function bin2hex(bin) {
    return bin;
}
exports.bin2hex = bin2hex;
function hex2bin(hex) {
    return hex;
}
exports.hex2bin = hex2bin;

},{}],45:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AND = void 0;
const Logic_1 = __importDefault(require("./Logic"));
const NAND_1 = require("./NAND");
class AND extends Logic_1.default {
    constructor(inputPin1, inputPin2) {
        super(inputPin1, inputPin2);
        this.outpin = AND.And(this.pin1, this.pin2);
    }
    static And(inputPin1, inputPin2) {
        let nand = new NAND_1.NAND(inputPin1, inputPin2);
        return NAND_1.NAND.Nand(nand.outpin, nand.outpin);
    }
}
exports.AND = AND;

},{"./Logic":47,"./NAND":48}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AND32 = void 0;
const AND_1 = require("./AND");
const StringHandle_1 = require("../Library/StringHandle");
class AND32 {
    constructor(inSignalA, inSignalB) {
        this.inPin32A = inSignalA;
        this.inPin32B = inSignalB;
        let bitA = StringHandle_1.stringToIntArray(this.inPin32A);
        let bitB = StringHandle_1.stringToIntArray(this.inPin32B);
        this.outPin32 = StringHandle_1.intArrayToString(AND32.And32(bitA, bitB));
    }
    static And32(BitsA, BitsB) {
        let outBits = [];
        let i = 0;
        BitsA.forEach((bit) => {
            outBits[i] = AND_1.AND.And(bit, BitsB[i]);
            ++i;
        });
        return outBits;
    }
}
exports.AND32 = AND32;

},{"../Library/StringHandle":44,"./AND":45}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logic {
    constructor(inputPin1, inputPin2) {
        this.outpin = 0;
        this.pin1 = inputPin1;
        this.pin2 = inputPin2;
    }
    toBinaryString() {
    }
}
exports.default = Logic;

},{}],48:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NAND = void 0;
const Logic_1 = __importDefault(require("./Logic"));
class NAND extends Logic_1.default {
    constructor(inputPin1, inputPin2) {
        super(inputPin1, inputPin2);
        this.outpin = NAND.Nand(this.pin1, this.pin2);
    }
    static Nand(inputPin1, inputPin2) {
        return Math.abs((inputPin1 & inputPin2) - 1);
    }
}
exports.NAND = NAND;

},{"./Logic":47}],49:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOT = void 0;
const Logic_1 = __importDefault(require("./Logic"));
const NAND_1 = require("./NAND");
/**
 * This is NOT Logic
 */
class NOT extends Logic_1.default {
    constructor(inputPin1) {
        super(inputPin1, 0);
        this.outpin = NOT.Not(this.pin1);
    }
    static Not(inputPin1) {
        let nand = new NAND_1.NAND(inputPin1, inputPin1);
        return nand.outpin;
    }
}
exports.NOT = NOT;

},{"./Logic":47,"./NAND":48}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOT32 = void 0;
const NOT_1 = require("./NOT");
const StringHandle_1 = require("../Library/StringHandle");
class NOT32 {
    constructor(inSignalA) {
        this.inPin32A = inSignalA;
        let bitA = StringHandle_1.stringToIntArray(this.inPin32A);
        this.outPin32 = StringHandle_1.intArrayToString(NOT32.Not32(bitA));
    }
    static Not32(BitsA) {
        let outBits = [];
        let i = 0;
        BitsA.forEach((bit) => {
            outBits[i] = NOT_1.NOT.Not(bit);
            ++i;
        });
        return outBits;
    }
}
exports.NOT32 = NOT32;

},{"../Library/StringHandle":44,"./NOT":49}],51:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OR = void 0;
const Logic_1 = __importDefault(require("./Logic"));
const NAND_1 = require("./NAND");
/**
 * This is OR Logic
 */
class OR extends Logic_1.default {
    constructor(inputPin1, inputPin2) {
        super(inputPin1, inputPin2);
        this.outpin = OR.Or(this.pin1, this.pin2);
    }
    static Or(inputPin1, inputPin2) {
        let nand1 = new NAND_1.NAND(inputPin1, inputPin1);
        let nand2 = new NAND_1.NAND(inputPin2, inputPin2);
        return NAND_1.NAND.Nand(nand1.outpin, nand2.outpin);
    }
}
exports.OR = OR;

},{"./Logic":47,"./NAND":48}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OR32 = void 0;
const OR_1 = require("./OR");
const StringHandle_1 = require("../Library/StringHandle");
class OR32 {
    constructor(inSignalA, inSignalB) {
        this.inPin32A = inSignalA;
        this.inPin32B = inSignalB;
        let bitA = StringHandle_1.stringToIntArray(this.inPin32A);
        let bitB = StringHandle_1.stringToIntArray(this.inPin32B);
        this.outPin32 = StringHandle_1.intArrayToString(OR32.Or32(bitA, bitB));
    }
    static Or32(BitsA, BitsB) {
        let outBits = [];
        let i = 0;
        BitsA.forEach((bit) => {
            outBits[i] = OR_1.OR.Or(bit, BitsB[i]);
            ++i;
        });
        return outBits;
    }
}
exports.OR32 = OR32;

},{"../Library/StringHandle":44,"./OR":51}],53:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XOR = void 0;
const Logic_1 = __importDefault(require("./Logic"));
const NAND_1 = require("./NAND");
const OR_1 = require("./OR");
const AND_1 = require("./AND");
/**
 * This is not Logic
 */
class XOR extends Logic_1.default {
    constructor(inputPin1, inputPin2) {
        super(inputPin1, inputPin2);
        this.outpin = XOR.Xor(this.pin1, this.pin2);
    }
    static Xor(inputPin1, inputPin2) {
        let nand = new NAND_1.NAND(inputPin1, inputPin2);
        let or = new OR_1.OR(inputPin1, inputPin2);
        return AND_1.AND.And(nand.outpin, or.outpin);
    }
}
exports.XOR = XOR;

},{"./AND":45,"./Logic":47,"./NAND":48,"./OR":51}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Adder_1 = require("./Circuit/Adder");
const Single_CycleCPU_1 = require("./CPU/Single-CycleCPU");
// import { DFlipFlop } from "./Circuit/DFlipFlop"
// let a:AND = new AND(0,0);
// let b:AND = new AND(1,0);
// let c:AND = new AND(0,1);
// let d:AND = new AND(1,1);
// console.log(a,b,c,d);
// let notA = new NOT(1);
// let notB = new NOT(0);
// console.log(notA,"\n",notB,"\n");
// let or1:OR = new OR(0,0);
// let or2:OR = new OR(1,0);
// let or3:OR = new OR(0,1);
// let or4:OR = new OR(1,1);
// console.log(or1,"\n",or2,"\n",or3,"\n",or4,"\n");
// let xor1:XOR = new XOR(0,0);
// let xor2:XOR = new XOR(1,0);
// let xor3:XOR = new XOR(0,1);
// let xor4:XOR = new XOR(1,1);
// console.log(xor1,"\n",xor2,"\n",xor3,"\n",xor4,"\n");
// console.log(-1 >>> 1);
// let testArray:number[] = [0,0,0,0,1];
// console.log(testArray.join(""));
/**
 * test for And32
 */
// let bitsA:string = "10000000000000000000000000000101"
// let bitsB:string = "00000000010000000000010000100101"
// let and32:AND32 = new AND32(bitsA,bitsB);
// console.log(and32);
/**
 * Test for Mux(multiplexor)
 */
// let muxA:Mux = new Mux(0,0,0); 
// let muxB:Mux = new Mux(0,0,1);
// let muxC:Mux = new Mux(0,1,0);
// let muxD:Mux = new Mux(0,1,1);
// let muxE:Mux = new Mux(1,0,0);
// let muxF:Mux = new Mux(1,0,1);
// let muxG:Mux = new Mux(1,1,0);
// let muxH:Mux = new Mux(1,1,1);
// console.log(muxA,"\n",muxB,"\n",muxC,"\n",muxD,"\n");
// console.log(muxE,"\n",muxF,"\n",muxG,"\n",muxH,"\n");
/**
 * Test for DMux(De-multiplexor)
 */
// let dmuxA:DMux = new DMux(0,0); 
// let dmuxB:DMux = new DMux(1,0);
// let dmuxC:DMux = new DMux(0,1);
// let dmuxD:DMux = new DMux(1,1);
// console.log(dmuxA,"\n",dmuxB,"\n",dmuxC,"\n",dmuxD,"\n");
/**
 * Test for NOT32
 */
// let inPin:string = "00010001000100010001000100010001" 
// let not32:NOT32 = new NOT32(inPin);
// console.log(not32);
/**
 * test for OR32
 */
// let bitsA:string = "00100000000000000000000000000101"
// let bitsB:string = "00000000010000000000010000100101"
// let and32:OR32 = new OR32(bitsA,bitsB);
// console.log(and32);
/**
 * Test for OR32WAY
 */
// let bits1:string = "00100000000000000000000000000101"
// let bits2:string = "00000000000000000000000000000000"
// let or32wayA:OR32WAY = new OR32WAY(bits1);
// let or32wayB:OR32WAY = new OR32WAY(bits2);
// console.log(or32wayA,or32wayB);
/**
 * Test Mux4Way32
 */
// let bits:string[] = [];
// bits[0] = "00000000000000000000000000000000"
// bits[1] = "00000000000000000000000000000010"
// bits[2] = "00000000000000000000000000000100"
// bits[3] = "00000000000000000000000000001000"
// bits[4] = "00000000000000000000000000010000"
// bits[5] = "00000000000000000000000000100000"
// bits[6] = "00000000000000000000000001000000"
// bits[7] = "00000000000000000000000010000000"
// let sel2way1:string = "00"
// let sel2way2:string = "01" 
// let sel2way3:string = "10" 
// let sel2way4:string = "11"
// let mux4way32A:Mux4Way32 = new Mux4Way32(bits,sel2way1);
// let mux4way32B:Mux4Way32 = new Mux4Way32(bits,sel2way2);
// let mux4way32C:Mux4Way32 = new Mux4Way32(bits,sel2way3);
// let mux4way32D:Mux4Way32 = new Mux4Way32(bits,sel2way4);
// console.log(mux4way32A,"\n",mux4way32B,"\n",mux4way32C,"\n",mux4way32D);
/**
 * Test Mux8Way32
 */
// let bits:string[] = [];
// bits[0] = "00000000000000000000000000000000"
// bits[1] = "00000000000000000000000000000010"
// bits[2] = "00000000000000000000000000000100"
// bits[3] = "00000000000000000000000000001000"
// bits[4] = "00000000000000000000000000010000"
// bits[5] = "00000000000000000000000000100000"
// bits[6] = "00000000000000000000000001000000"
// bits[7] = "00000000000000000000000010000000"
// let sel2way1:string = "000"
// let sel2way2:string = "001" 
// let sel2way3:string = "010" 
// let sel2way4:string = "011"
// let sel2way5:string = "100"
// let sel2way6:string = "101" 
// let sel2way7:string = "110" 
// let sel2way8:string = "111"
// let mux8way32A:Mux8Way32 = new Mux8Way32(bits,sel2way1);
// let mux8way32B:Mux8Way32 = new Mux8Way32(bits,sel2way2);
// let mux8way32C:Mux8Way32 = new Mux8Way32(bits,sel2way3);
// let mux8way32D:Mux8Way32 = new Mux8Way32(bits,sel2way4);
// let mux8way32E:Mux8Way32 = new Mux8Way32(bits,sel2way5);
// let mux8way32F:Mux8Way32 = new Mux8Way32(bits,sel2way6);
// let mux8way32G:Mux8Way32 = new Mux8Way32(bits,sel2way7);
// let mux8way32H:Mux8Way32 = new Mux8Way32(bits,sel2way8);
// console.log(mux8way32A,"\n",mux8way32B,"\n",mux8way32C,"\n",mux8way32D);
// console.log(mux8way32E,"\n",mux8way32F,"\n",mux8way32G,"\n",mux8way32H);
/**
 * Test for Dmux8Way
 */
// let bit:number = 1
// let sel2way1:string = "000"
// let sel2way2:string = "001" 
// let sel2way3:string = "010" 
// let sel2way4:string = "011"
// let sel2way5:string = "100"
// let sel2way6:string = "101" 
// let sel2way7:string = "110" 
// let sel2way8:string = "111"
// let dmux8wayA:DMux8Way = new DMux8Way(bit,sel2way1);
// let dmux8wayB:DMux8Way = new DMux8Way(bit,sel2way2);
// let dmux8wayC:DMux8Way = new DMux8Way(bit,sel2way3);
// let dmux8wayD:DMux8Way = new DMux8Way(bit,sel2way4);
// let dmux8wayE:DMux8Way = new DMux8Way(bit,sel2way5);
// let dmux8wayF:DMux8Way = new DMux8Way(bit,sel2way6);
// let dmux8wayG:DMux8Way = new DMux8Way(bit,sel2way7); 
// let dmux8wayH:DMux8Way = new DMux8Way(bit,sel2way8);
// console.log(dmux8wayA,"\n",dmux8wayB,"\n",dmux8wayC,"\n",dmux8wayD,"\n");
// console.log(dmux8wayE,"\n",dmux8wayF,"\n",dmux8wayG,"\n",dmux8wayH,"\n");
// let bits:string[] = [];
// bits[0] = "00000000000000000000000000000110";
// bits[1] = "00000000000000000000000000000100";
// bits[3] = "11111111111111111111111111011101";
// bits[4] = "00000000000000000000000000000101"
// bits[4] = "11111111111111111111111111111101";
// 0000 0000 0000 0010 0000 0000 1000 0000
// let inPin1:number = bin2dec(bits[3],false);
// let inPin2:number = bin2dec(bits[4],false);
// let bin32:string = decToSignedBin32(131200);
// let adder1:Adder = new Adder(bits[3],bits[4]);
// let outPin:number = bin2dec(adder1.getOutput(),false);
// adder1.inPin32A = bits[3];
// console.log(inPin1);
// console.log(inPin2);
// console.log(bin32);
// console.log(adder1);
// console.log(outPin);
// console.log(1 && 0);
// if (1 && 0)
//     console.log("true");
// else
//     console.log("false");
// let controlBits:string[] = ["0000","0001","0010","0110","0111","1100"];// and,or,add,subtract,set on less than, nor
// let ALU1:ALU = new ALU(bits[0],bits[3],controlBits[0]);
// console.log(bin2dec(bits[0],false),bin2dec(bits[3],false));
// console.log(ALU1);
// ALU1.newSignal(bits[0],bits[3],controlBits[1]);
// console.log(ALU1);
// console.log(bin2dec(ALU1.getOutPin32(),false));
// ALU1.newSignal(bits[0],bits[3],controlBits[2]);
// console.log(ALU1);
// console.log(bin2dec(ALU1.getOutPin32(),false));
// ALU1.newSignal(bits[0],bits[3],controlBits[3]);
// console.log(ALU1);
// console.log(bin2dec(ALU1.getOutPin32(),false));
// ALU1.newSignal(bits[3],bits[0],controlBits[4]);
// console.log(ALU1);
// console.log(bin2dec(ALU1.getOutPin32(),false));
// ALU1.newSignal(bits[0],bits[3],controlBits[5]);
// console.log(ALU1);
// console.log(bin2dec(ALU1.getOutPin32(),false));
// let DLatch:Latch = new Latch();
// console.log(DLatch);
// // C = 0, D = 0, O = 0, !O = 1;
// // C = 0, D = 1, O = 0, !O = 1;
// DLatch.changeDSignal();
// console.log(DLatch);
// DLatch.changeClockSignal();
// console.log(DLatch);
// // C = 1, D = 1, O = 1, !O = 0;
// DLatch.clockChange();
// console.log(DLatch);
// if Clock is not change, nothing will change
// DLatch.DSignalChange();
// console.log(DLatch);
// DLatch.DSignalChange();
// console.log(DLatch);
// DLatch.DSignalChange();
// console.log(DLatch);
// let dfilpflop:DFlipFlop = new DFlipFlop();
// console.log(dfilpflop);
// dfilpflop.changeDSiganl();
// console.log(dfilpflop);
// let flipflop:DFlipFlop = new DFlipFlop();
// console.log(flipflop);
// flipflop.changeDSiganl();
// console.log(flipflop);
// flipflop.changeClockSiganl();
// console.log(flipflop);
// flipflop.changeClockSiganl();
// console.log(flipflop);
// let index:number = 0;
// function debugger1():void{
//     console.log("this is attemp " + index);
//     console.log(_32Register.getinPin32());
//     console.log(_32Register.getOutPin32());
//     index++;
// }
// let _32Register:_32BitsRegister = new _32BitsRegister();
// debugger1();
// _32Register.changeClockSignal();
// debugger1();
// _32Register.setInpin32("00000011000000001100000000000000");
// debugger1();
// _32Register.changeClockSignal();
// debugger1();
// function desc2(target:Function) {
//     console.log('---------------绫荤殑瑁呴グ鍣ㄥ弬鏁?start------------------');
//     console.log(target); // 杈撳嚭 [Function: Person]琛ㄧず褰撳墠瑁呴グ鐨勭被
//     console.log('---------------绫荤殑瑁呴グ鍣ㄥ弬鏁?end------------------');
//   }
//   @desc2 // 浣跨敤瑁呴グ鍣?
//   class Person {
//     public name: string | undefined;
//     public age: number | 0;
//     constructor(name:any, age:any) {
//       this.name = name;
//       this.age = age;
//       console.log("shit");
//     }
//   }
//   let p2:Person = new Person('鍝堝搱', 20);
let adderTest = new Adder_1.Adder("00000000010000000000000000111100", "11111111111111111111111111000100");
let sinCycCPU = new Single_CycleCPU_1.singleCycleCpu();
// addiu $0
let InsSet = [
    // "00111100000000100000000011101001",
    "00100100000010110000000000001010",
    "00100100000010100000000000010100",
    "00000001010010111001100000100000",
    "00100000000000010000000000000100",
    "00000011101000011110100000100010",
    "10101111101100110000000000000000",
    "10001111101011110000000000000000",
    "00100001010011100000001111101000",
    "00100100000010010000000000001101",
    "00000001110010010111100000100100",
    "00110100000000101100100011001111",
    "00110000010000111001100101000100",
    "00110100000000111001100101000100",
    "00000000011000100001100000100111",
    //  "00010000000110011111111111110001"
    // "00000000000000000001000000101010"
    // "00000000011000100001000000101010",
    "00101001110000100000001111111011"
];
sinCycCPU.storeIns(InsSet);
window.CPU = sinCycCPU;
// console.log("object");
module.exports = require("./CPU/Single-CycleCPU");
// sinCycCPU.debugPC();

},{"./CPU/Single-CycleCPU":22,"./Circuit/Adder":24}]},{},[54])(54)
});
