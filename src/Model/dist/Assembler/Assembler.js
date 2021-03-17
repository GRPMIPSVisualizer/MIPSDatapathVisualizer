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
const DecimalToBinary_1 = require("./DecimalToBinary");
const BinaryToDecimal_1 = require("./BinaryToDecimal");
class Assembler {
    constructor() {
        this.decoderForR = DecoderForR_1.DecoderForR.getDecoder();
        this.decoderForI = DecoderForI_1.DecoderForI.getDecoder();
        this.decoderForJ = DecoderForJ_1.DecoderForJ.getDecoder();
        this.sources = []; //The raw input from the user
        this.data = new ArrayList_1.ArrayList(10); //The contents contained in the .data segment
        this.sourceInsAL = new ArrayList_1.ArrayList(10); //The contents contained in the .text segment in the form of an ArrayList
        this.sourceIns = []; //The contents stored in the .text segment in the form of an array
        this.basic = new ArrayList_1.ArrayList(10);
        this.bin = new ArrayList_1.ArrayList(10);
        this.mapForDataLabel = new Map();
        this.mapForWord = new Map();
        this.mapForAscii = new Map();
        this.mapForByte = new Map();
        this.errMsg = "";
    }
    static getAssembler() {
        return this.assembler;
    }
    getErrMsg() {
        return this.errMsg;
    }
    getMapForWord() {
        return this.mapForWord;
    }
    getMapForDataLabel() {
        return this.mapForDataLabel;
    }
    getMapForAscii() {
        return this.mapForAscii;
    }
    getMapForByte() {
        return this.mapForByte;
    }
    getSourceInsAL() {
        return this.sourceInsAL;
    }
    getSourceIns() {
        return this.sourceIns;
    }
    getBasic() {
        return this.basic;
    }
    getData() {
        return this.data;
    }
    getBin() {
        return this.bin;
    }
    /**
     * Set the sources using the raw input from the user.
     * @param input the raw input from the user
     */
    setSources(input) {
        //let result = true;
        this.sources = input.split("\n");
        //let sourceInsAl: ArrayList<string> = new ArrayList<string>(10);
        let i;
        //let j: number;
        //Deal with MIPS comments which start with a hash sign
        for (i = 0; i < this.sources.length; i++) {
            this.sources[i] = this.sources[i].trim();
            if (this.sources[i].search("#") != -1) {
                let posOfHash = this.sources[i].search("#");
                this.sources[i] = this.sources[i].substring(0, posOfHash);
            }
        }
    }
    /**
     * Divide the sources(the raw input from the user) into two segments -- data segment and text segment.
     * The contents of the data segment are stored into an ArrayList called data.
     * The contents of the text segment are stored into an ArrayList called sourceInsAL
     * and an Array called sourceIns.
     */
    segmentDataText() {
        let i;
        let j;
        let indices = new Array();
        for (i = 0; i < this.sources.length; i++) {
            if (this.sources[i] == ".data" || this.sources[i] == ".text") {
                indices.push(i);
            }
            if (this.sources[i] == ".globl main") {
                this.sources[i] = "";
            }
        }
        if (indices.length == 0) {
            for (i = 0; i < this.sources.length; i++) {
                this.sourceInsAL.add(this.sources[i]);
            }
        }
        else {
            for (i = 0; i < indices.length; i++) {
                if (i == 0) {
                    if (indices[0] != 0) {
                        for (j = 0; j < indices[0]; j++) {
                            this.sourceInsAL.add(this.sources[j]);
                        }
                    }
                    if (indices.length == 1) {
                        if (this.sources[indices[i]] == ".data") {
                            for (j = indices[0] + 1; j < this.sources.length; j++) {
                                this.data.add(this.sources[j]);
                            }
                        }
                        else {
                            for (j = indices[0] + 1; j < this.sources.length; j++) {
                                this.sourceInsAL.add(this.sources[j]);
                            }
                        }
                    }
                    else {
                        if (this.sources[indices[i]] == ".data") {
                            for (j = indices[0] + 1; j < indices[1]; j++) {
                                this.data.add(this.sources[j]);
                            }
                        }
                        else {
                            for (j = indices[0] + 1; j < indices[1]; j++) {
                                this.sourceInsAL.add(this.sources[j]);
                            }
                        }
                    }
                }
                else {
                    if (indices.length == (i + 1)) {
                        if (this.sources[indices[i]] == ".data") {
                            for (j = indices[i] + 1; j < this.sources.length; j++) {
                                this.data.add(this.sources[j]);
                            }
                        }
                        else {
                            for (j = indices[i] + 1; j < this.sources.length; j++) {
                                this.sourceInsAL.add(this.sources[j]);
                            }
                        }
                    }
                    else {
                        if (this.sources[indices[i]] == ".data") {
                            for (j = indices[i] + 1; j < indices[i + 1]; j++) {
                                this.data.add(this.sources[j]);
                            }
                        }
                        else {
                            for (j = indices[i] + 1; j < indices[i + 1]; j++) {
                                this.sourceInsAL.add(this.sources[j]);
                            }
                        }
                    }
                }
            }
        }
        for (i = 0; i < this.sourceInsAL.size(); i++) {
            if (this.sourceInsAL.get(i) == "") {
                this.sourceInsAL.remove(i);
            }
        }
        for (i = 0; i < this.sourceInsAL.size(); i++) {
            this.sourceIns[i] = this.sourceInsAL.get(i).toString();
        }
    }
    separateLabelIns() {
        let result = true;
        let posOfColon;
        let pattLabel = /^[A-Za-z0-9._]+$/;
        let pattnumber = /[0-9]/;
        let i;
        let label;
        for (i = 0; i < this.sourceIns.length; i++) {
            posOfColon = this.sourceIns[i].indexOf(":");
            if (posOfColon != -1) {
                label = this.sourceIns[i].substring(0, posOfColon).trim();
                if (pattLabel.test(label) && pattnumber.test(label.charAt(0))) {
                    this.errMsg = this.errMsg + "Error 303: Invalid label. -- " + this.sourceIns[i] + "\n";
                    return false;
                }
                else if (this.sourceIns[i].substring(posOfColon + 1, this.sourceIns[i].length) != "") {
                    console.log(this.sourceIns);
                    this.sourceIns.splice(i, 1, label + ":", this.sourceIns[i].substring(posOfColon + 1, this.sourceIns[i].length));
                    console.log(this.sourceIns);
                }
            }
        }
        return result;
    }
    formatData() {
        let result = true;
        let i;
        let posOfColon;
        let posOfQuo;
        let label;
        let patt = /^[\s]$/;
        let pattLabel = /^[A-Za-z0-9._]+$/;
        let pattnumber = /[0-9]/;
        let resultData = new ArrayList_1.ArrayList();
        for (i = 0; i < this.data.size(); i++) {
            posOfColon = this.data.get(i).toString().indexOf(":");
            if (posOfColon != -1) {
                label = this.data.get(i).toString().substring(0, posOfColon);
                if (pattLabel.test(label) && pattnumber.test(label.charAt(0))) {
                    this.errMsg = this.errMsg + "Error 302: Invalid label. -- " + this.data.get(i) + "\n";
                    return false;
                }
                if (this.data.get(i).toString().substring(posOfColon + 1, this.data.get(i).toString.length) == "" || !patt.test(this.data.get(i).toString().substring(posOfColon + 1, this.data.get(i).toString.length))) {
                    if (i == this.data.size() - 1) {
                        resultData.add(label + ":");
                        return true;
                    }
                    else if (this.data.get(i + 1).toString().indexOf(":") != -1) {
                        resultData.add(label + ":");
                        continue;
                    }
                    else {
                        if (this.data.get(i + 1).toString().trim() == ".word" || this.data.get(i + 1).toString().trim() == ".byte" || this.data.get(i + 1).toString().trim() == ".ascii" || this.data.get(i + 1).toString().trim() == ".asciiz") {
                            if (i != this.data.size() - 2) {
                                if (this.data.get(i + 2).toString().trim().charAt(0) != ".") {
                                    resultData.add(label + ": " + this.data.get(i + 1).toString() + " " + this.data.get(i + 2).toString());
                                    i = i + 2;
                                    continue;
                                }
                            }
                        }
                        else {
                            resultData.add(label + ": " + this.data.get(i + 1).toString());
                            i++;
                            continue;
                        }
                    }
                }
                else {
                    resultData.add(label + ": " + this.data.get(i).toString().substring(posOfColon + 1, this.data.get(i).toString.length));
                }
            }
            else {
                if (this.data.get(i).toString().trim() == ".ascii" || this.data.get(i).toString().trim() == ".asciiz") {
                    if (i == this.data.size() - 1) {
                        return true;
                    }
                    else if (this.data.get(i + 1).toString().trim().charAt(0) == "\"" && this.data.get(i + 1).toString().trim().endsWith("\"")) {
                        resultData.add(this.data.get(i).toString().trim() + " " + this.data.get(i + 1).toString().trim());
                        i++;
                        continue;
                    }
                    else {
                        continue;
                    }
                }
                else if (this.data.get(i).toString().trim() == ".word") {
                    if (i == this.data.size() - 1) {
                        return true;
                    }
                    else if (pattnumber.test(this.data.get(i + 1).toString().trim())) {
                        resultData.add(".word " + this.data.get(i + 1).toString().trim());
                        i++;
                        continue;
                    }
                    else {
                        continue;
                    }
                }
                else if (this.data.get(i).toString().trim() == ".byte") {
                    if (i == this.data.size() - 1) {
                        return true;
                    }
                    else if (pattnumber.test(this.data.get(i + 1).toString().trim())) {
                        resultData.add(".byte " + this.data.get(i + 1).toString().trim());
                        i++;
                        continue;
                    }
                    else {
                        continue;
                    }
                }
                else {
                    this.errMsg = this.errMsg + "Error 336: Invalid instruction. -- " + this.data.get(i) + "\n";
                    return false;
                }
                // posOfQuo = this.data.get(i).toString().indexOf("\"");
                // if (posOfQuo != -1) {
                //     resultData.add(this.data.get(i).toString().substring(0, posOfQuo).trim() + " " + this.data.get(i).toString().substring(posOfQuo, this.data.get(i).toString().length).trim());
                //     continue;
                // }
                // resultData.add(this.data.get(i).toString().trim());
            }
        }
        for (i = 0; i < resultData.size(); i++) {
            this.data.update(i, resultData.get(i).toString());
        }
        let sizeOfData = this.data.size();
        if (sizeOfData > resultData.size()) {
            for (i = resultData.size(); i < sizeOfData; i++) {
                this.data.remove(i);
            }
        }
        return result;
    }
    storeData() {
        let result = true;
        let i;
        let j;
        let label;
        let address = "268500992";
        let posOfSpace;
        let dataIns;
        let patt = /^(\-|\+)?\d+$/;
        for (i = 0; i < this.data.size(); i++) {
            let ins = this.data.get(i).toString();
            let posOfColon = ins.indexOf(":");
            if (posOfColon != -1) {
                label = ins.substring(0, posOfColon).trim();
                this.mapForDataLabel.set(label, address);
                let insAfterLabel = ins.substring(posOfColon + 2, ins.length);
                posOfSpace = insAfterLabel.indexOf(" ");
                dataIns = insAfterLabel.substring(0, posOfSpace);
                if (dataIns == ".word") {
                    if (insAfterLabel.substring(posOfSpace, ins.length).trim().indexOf(",") != -1) {
                        let wordArray = insAfterLabel.substring(posOfSpace, ins.length).trim().split(",");
                        for (j = 0; j < wordArray.length; j++) {
                            if (!patt.test(wordArray[j])) {
                                this.errMsg = this.errMsg + "Error 304: Invalid data type. -- " + this.data.get(i) + "\n";
                                return false;
                            }
                            else if (+wordArray[j] > 2147483647 || +wordArray[j] < -2147483648) {
                                this.errMsg = this.errMsg + "Error 305: Data value out of range. -- " + this.data.get(i) + "\n";
                                return false;
                            }
                            else {
                                if (+address % 4 == 0) {
                                    this.mapForWord.set(address, +wordArray[j]);
                                }
                                else {
                                    address = (+address + +address % 4).toFixed();
                                    this.mapForWord.set(address, +wordArray[j]);
                                }
                                address = (+address + 4).toFixed();
                            }
                        }
                    }
                    else {
                        if (insAfterLabel.substring(posOfSpace, ins.length).trim() == "") {
                            continue;
                        }
                        if (patt.test(insAfterLabel.substring(posOfSpace, ins.length).trim())) {
                            this.errMsg = this.errMsg + "Error 306: Invalid data type. -- " + this.data.get(i) + "\n";
                            return false;
                        }
                        else {
                            let wordNumber = +ins.substring(posOfSpace, ins.length).trim();
                            if (wordNumber > 2147483647 || wordNumber < -2147483648) {
                                this.errMsg = this.errMsg + "Error 307: Data value out of range. -- " + this.data.get(i) + "\n";
                                return false;
                            }
                            else {
                                if (+address % 4 == 0) {
                                    this.mapForWord.set(address, wordNumber);
                                }
                                else {
                                    address = (+address + +address % 4).toFixed();
                                    this.mapForWord.set(address, wordNumber);
                                }
                                address = (+address + 4).toFixed();
                            }
                        }
                    }
                }
                else if (dataIns == ".byte") {
                    if (insAfterLabel.substring(posOfSpace, ins.length).trim().indexOf(",") != -1) {
                        let byteArray = insAfterLabel.substring(posOfSpace, ins.length).trim().split(",");
                        for (j = 0; j < byteArray.length; j++) {
                            if (!patt.test(byteArray[j])) {
                                this.errMsg = this.errMsg + "Error 308: Invalid data type. -- " + this.data.get(i) + "\n";
                                return false;
                            }
                            else if (+byteArray[j] > 127 || +byteArray[j] < -128) {
                                this.errMsg = this.errMsg + "Error 309: Data value out of range. -- " + this.data.get(i) + "\n";
                                return false;
                            }
                            else {
                                this.mapForByte.set(address, +byteArray[j]);
                                address = (+address + 1).toFixed();
                            }
                        }
                    }
                    else {
                        if (insAfterLabel.substring(posOfSpace, ins.length).trim() == "") {
                            continue;
                        }
                        if (!patt.test(ins.substring(posOfSpace, ins.length).trim())) {
                            this.errMsg = this.errMsg + "Error 310: Invalid data type. -- " + this.data.get(i) + "\n";
                            return false;
                        }
                        else {
                            let byteNumber = +insAfterLabel.substring(posOfSpace, ins.length).trim();
                            if (byteNumber > 127 || byteNumber < -128) {
                                this.errMsg = this.errMsg + "Error 311: Data value out of range. -- " + this.data.get(i) + "\n";
                                return false;
                            }
                            else {
                                this.mapForWord.set(address, byteNumber);
                                address = (+address + 1).toFixed();
                            }
                        }
                    }
                }
                else if (dataIns == ".ascii" || dataIns == ".asciiz") {
                    if (insAfterLabel.substring(posOfSpace, ins.length).trim().charAt(0) != "\"" || !insAfterLabel.substring(posOfSpace, ins.length).trim().endsWith("\"")) {
                        this.errMsg = this.errMsg + "Error 312: Invalid string. -- " + this.data.get(i) + "\n";
                        return false;
                    }
                    else {
                        if (dataIns == ".ascii") {
                            this.mapForAscii.set(address, insAfterLabel.substring(posOfSpace + 2, insAfterLabel.length - 1));
                            address = (+address + insAfterLabel.substring(posOfSpace + 2, ins.length - 1).length).toFixed();
                        }
                        else {
                            this.mapForAscii.set(address, insAfterLabel.substring(posOfSpace + 2, insAfterLabel.length - 1) + "\n");
                            address = (+address + insAfterLabel.substring(posOfSpace + 2, ins.length - 1).length + 1).toFixed();
                        }
                    }
                }
            }
            else {
                posOfSpace = ins.indexOf(" ");
                dataIns = ins.substring(0, posOfSpace);
                if (dataIns == ".word") {
                    if (ins.substring(posOfSpace, ins.length).trim().indexOf(",") != -1) {
                        let wordArray = ins.substring(posOfSpace, ins.length).trim().split(",");
                        for (j = 0; j < wordArray.length; j++) {
                            if (!patt.test(wordArray[j])) {
                                this.errMsg = this.errMsg + "Error 313: Invalid data type. -- " + this.data.get(i) + "\n";
                                return false;
                            }
                            else if (+wordArray[j] > 2147483647 || +wordArray[j] < -2147483648) {
                                this.errMsg = this.errMsg + "Error 314: Data value out of range. -- " + this.data.get(i) + "\n";
                                return false;
                            }
                            else {
                                if (+address % 4 == 0) {
                                    this.mapForWord.set(address, +wordArray[j]);
                                }
                                else {
                                    address = (+address + +address % 4).toFixed();
                                    this.mapForWord.set(address, +wordArray[j]);
                                }
                                address = (+address + 4).toFixed();
                            }
                        }
                    }
                    else {
                        if (ins.substring(posOfSpace, ins.length).trim() == "") {
                            continue;
                        }
                        if (!patt.test(ins.substring(posOfSpace, ins.length).trim())) {
                            this.errMsg = this.errMsg + "Error 315: Invalid data type. -- " + this.data.get(i) + "\n";
                            return false;
                        }
                        else {
                            let wordNumber = +ins.substring(posOfSpace, ins.length).trim();
                            if (wordNumber > 2147483647 || wordNumber < -2147483648) {
                                this.errMsg = this.errMsg + "Error 316: Data value out of range. -- " + this.data.get(i) + "\n";
                                return false;
                            }
                            else {
                                if (+address % 4 == 0) {
                                    this.mapForWord.set(address, wordNumber);
                                }
                                else {
                                    address = (+address + +address % 4).toFixed();
                                    this.mapForWord.set(address, wordNumber);
                                }
                                address = (+address + 4).toFixed();
                            }
                        }
                    }
                }
                else if (dataIns == ".byte") {
                    if (ins.substring(posOfSpace, ins.length).trim().indexOf(",") != -1) {
                        let byteArray = ins.substring(posOfSpace, ins.length).trim().split(",");
                        for (j = 0; j < byteArray.length; j++) {
                            if (!patt.test(byteArray[j])) {
                                this.errMsg = this.errMsg + "Error 317: Invalid data type. -- " + this.data.get(i) + "\n";
                                return false;
                            }
                            else if (+byteArray[j] > 127 || +byteArray[j] < -128) {
                                this.errMsg = this.errMsg + "Error 318: Data value out of range. -- " + this.data.get(i) + "\n";
                                return false;
                            }
                            else {
                                this.mapForByte.set(address, +byteArray[j]);
                                address = (+address + 1).toFixed();
                            }
                        }
                    }
                    else {
                        if (ins.substring(posOfSpace, ins.length).trim() == "") {
                            continue;
                        }
                        if (!patt.test(ins.substring(posOfSpace, ins.length).trim())) {
                            this.errMsg = this.errMsg + "Error 319: Invalid data type. -- " + this.data.get(i) + "\n";
                            return false;
                        }
                        else {
                            let byteNumber = +ins.substring(posOfSpace, ins.length).trim();
                            if (byteNumber > 127 || byteNumber < -128) {
                                this.errMsg = this.errMsg + "Error 320: Data value out of range. -- " + this.data.get(i) + "\n";
                                return false;
                            }
                            else {
                                this.mapForWord.set(address, byteNumber);
                                address = (+address + 1).toFixed();
                            }
                        }
                    }
                }
                else if (dataIns == ".ascii" || dataIns == ".asciiz") {
                    if (ins.substring(posOfSpace, ins.length).trim().charAt(0) != "\"" || !ins.substring(posOfSpace, ins.length).trim().endsWith("\"")) {
                        this.errMsg = this.errMsg + "Error 321: Invalid string. -- " + this.data.get(i) + "\n";
                        return false;
                    }
                    else {
                        this.mapForAscii.set(address, ins.substring(posOfSpace + 2, ins.length - 1));
                        if (dataIns == ".ascii") {
                            address = (+address + ins.substring(posOfSpace + 2, ins.length - 1).length).toFixed();
                        }
                        else {
                            address = (+address + ins.substring(posOfSpace + 2, ins.length - 1).length + 1).toFixed();
                        }
                    }
                }
            }
        }
        return result;
    }
    checkLabel() {
        let result = true;
        let i;
        let posOfColon;
        let mapForAllLabel = new Map();
        for (i = 0; i < this.sources.length; i++) {
            posOfColon = this.sources[i].indexOf(":");
            if (posOfColon != -1) {
                let label = this.sources[i].substring(0, posOfColon);
                if (mapForAllLabel.has(label)) {
                    this.errMsg = this.errMsg + "Error 301: Label has already existed. -- " + this.sources[i] + "\n";
                    return false;
                }
                else {
                    mapForAllLabel.set(label, "");
                }
            }
            else {
                continue;
            }
        }
        return result;
    }
    /**
     * Expand the pseudo instructions into basic instructions.
     * @returns true if there is no error in the pseudo instructions, otherwise false
     */
    expandPseudo() {
        let i;
        let result = true;
        let posOfSpace;
        let operator;
        let temp = [];
        for (i = 0; i < this.sourceIns.length; i++) {
            if (this.sourceIns[i] == "syscall") {
                temp.push(this.sourceIns[i]);
                continue;
            }
            posOfSpace = this.sourceIns[i].indexOf(" ");
            operator = this.sourceIns[i].substring(0, posOfSpace);
            if (MapForCommaNum_1.MapForCommaNum.getMap().has(operator)) {
                let expectedNumComma = MapForCommaNum_1.MapForCommaNum.getMap().get(operator);
                let actualNumComma = this.sourceIns[i].split(",").length - 1;
                if (expectedNumComma == undefined) {
                    this.errMsg = this.errMsg + "Error 322: Invalid instruction. -- " + this.sourceIns[i] + "\n";
                    return false;
                }
                else if (expectedNumComma == actualNumComma) {
                    let type = MapForInsType_1.MapForInsType.getMap().get(operator);
                    if (type == undefined) {
                        this.errMsg = this.errMsg + "Error 323: Invalid instruction. -- " + this.sourceIns[i] + "\n";
                        return false;
                    }
                    else if (type == "P") {
                        let ins0 = "";
                        let ins1 = "";
                        let ins2 = "";
                        let operands;
                        let operand0 = "";
                        let operand1 = "";
                        let operand2 = "";
                        operands = this.sourceIns[i].substring(posOfSpace + 1).split(",");
                        if (operands[0] != "") {
                            operand0 = operands[0];
                        }
                        if (operands[1] != "") {
                            operand1 = operands[1];
                        }
                        if (operands[2] != "") {
                            operand2 = operands[2];
                        }
                        if (operator == "abs") {
                            ins0 = "sra $1," + operand1 + ",31";
                            ins1 = "xor " + operand0 + ",$1," + operand1;
                            ins2 = "subu " + operand0 + "," + operand0 + ",$1";
                        }
                        else if (operator == "blt") {
                            ins0 = "slt $1," + operand0 + "," + operand1;
                            ins1 = "bne $1,$0," + operand2;
                        }
                        else if (operator == "bgt") {
                            ins0 = "slt $1," + operand1 + "," + operand0;
                            ins1 = "bne $1,$0," + operand2;
                        }
                        else if (operator == "ble") {
                            ins0 = "slt $1," + operand1 + "," + operand0;
                            ins1 = "beq $1,$0," + operand2;
                        }
                        else if (operator == "neg") {
                            ins0 = "sub " + operand0 + ",$0," + operand1;
                        }
                        else if (operator == "negu") {
                            ins0 = "subu " + operand0 + ",$0," + operand1;
                        }
                        else if (operator == "not") {
                            ins0 = "nor " + operand0 + "," + operand1 + ",$0";
                        }
                        else if (operator == "bge") {
                            ins0 = "slt $1," + operand0 + "," + operand1;
                            ins1 = "beq $1,$0," + operand2;
                        }
                        else if (operator == "li") {
                            ins0 = "addiu " + operand0 + ",$0," + operand1;
                        }
                        else if (operator == "la") {
                            if (this.mapForDataLabel.has(operand1.trim())) {
                                let address = DecimalToBinary_1.decimalToBinary(+(this.mapForDataLabel.get(operand1) + ""), 32);
                                let first16bits = BinaryToDecimal_1.binaryToDecimal(address.substring(0, 16));
                                let last16bits = BinaryToDecimal_1.binaryToDecimal(address.substring(16));
                                ins0 = "lui $1," + first16bits;
                                ins1 = "ori " + operand0 + ",$1," + last16bits;
                            }
                            else {
                                this.errMsg = this.errMsg + "Error 324: Label unrecongnized. -- " + this.sourceIns[i] + "\n";
                                return false;
                            }
                        }
                        else if (operator == "move") {
                            ins0 = "addu " + operand0 + ",$0," + operand1;
                        }
                        else if (operator == "sge") {
                            ins0 = "slt " + operand0 + "," + operand1 + "," + operand2;
                            ins1 = "ori $1,$0,1";
                            ins2 = "subu " + operand0 + ",$1," + operand0;
                        }
                        else if (operator == "sgt") {
                            ins0 = "slt" + operand0 + "," + operand2 + "," + operand1;
                        }
                        if (ins0 != "") {
                            temp.push(ins0);
                        }
                        if (ins1 != "") {
                            temp.push(ins1);
                        }
                        if (ins2 != "") {
                            temp.push(ins2);
                        }
                    }
                    else {
                        temp.push(this.sourceIns[i]);
                    }
                }
                else {
                    this.errMsg = this.errMsg + "Error 325: Too few or incorrectly formatted operands. -- " + this.sourceIns[i] + "\n";
                    return false;
                }
            }
            else if (this.sourceIns[i].trim().split(":").length != 0) {
                temp.push(this.sourceIns[i]);
            }
            else {
                this.errMsg = this.errMsg + "Error 326: Instruction unrecognized. -- " + this.sourceIns[i] + "\n";
                return false;
            }
        }
        this.sourceIns = temp;
        return result;
    }
    translateLabel() {
        let result = true;
        let i;
        let j;
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
        let patt = /^[\s]$/;
        let pattLabel = /^[A-Za-z0-9._]+$/;
        let pattnumber = /[0-9]/;
        let posOfColon;
        for (i = 0; i < this.sourceIns.length; i++) {
            if (this.sourceIns[i] == "" || patt.test(this.sourceIns[i])) {
                continue;
            }
            else {
                posOfColon = this.sourceIns[i].indexOf(":");
                if (posOfColon != -1) {
                    label = this.sourceIns[i].substring(0, posOfColon).trim();
                    if (pattLabel.test(label)) {
                        if (pattnumber.test(label.charAt(0))) {
                            this.errMsg = this.errMsg + "Error 327: Invalid label. -- " + this.sourceIns[i] + "\n";
                            return false;
                        }
                        else {
                            mapForLabel.set(label, address);
                            labelCounter = instructionCounter;
                            mapForCounter.set(label, labelCounter.toFixed());
                        }
                    }
                    else {
                        this.errMsg = this.errMsg + "Error 328: Invalid label. -- " + this.sourceIns[i] + "\n";
                        return false;
                    }
                }
                address = (+address + 4).toFixed();
            }
            instructionCounter++;
        }
        instructionCounter = 0;
        for (i = 0; i < this.sourceIns.length; i++) {
            if (this.sourceIns[i] == "" || patt.test(this.sourceIns[i]) || this.sourceIns[i].substring(this.sourceIns[i].length - 1, this.sourceIns[i].length) == ":") {
                continue;
            }
            else {
                posOfSpace = this.sourceIns[i].indexOf(" ");
                operator = this.sourceIns[i].substring(0, posOfSpace);
                if (operator == "j" || operator == "jal") {
                    jumpLabel = this.sourceIns[i].substring(posOfSpace, this.sourceIns[i].length).trim();
                    if (mapForLabel.has(jumpLabel)) {
                        if (operator == "j") {
                            this.sourceIns[i] = "j " + mapForLabel.get(jumpLabel);
                        }
                        else {
                            this.sourceIns[i] = "jal " + mapForLabel.get(jumpLabel);
                        }
                    }
                    else {
                        this.errMsg = this.errMsg + "Error 329: Operand is of incorrect type. -- " + this.sourceIns[i] + "\n";
                        return false;
                    }
                }
                else if (operator == "beq" || operator == "bne") {
                    jumpLabel = this.sourceIns[i].substring(this.sourceIns[i].lastIndexOf(",") + 1, this.sourceIns[i].length).trim();
                    if (mapForLabel.has(jumpLabel)) {
                        relativeJump = +(mapForCounter.get(jumpLabel) + "") - instructionCounter - 1;
                        if (operator == "beq") {
                            this.sourceIns[i] = "beq" + this.sourceIns[i].substring(posOfSpace, this.sourceIns[i].lastIndexOf(",") + 1) + relativeJump.toFixed();
                        }
                        else {
                            this.sourceIns[i] = "bne" + this.sourceIns[i].substring(posOfSpace, this.sourceIns[i].lastIndexOf(",") + 1) + relativeJump.toFixed();
                        }
                    }
                    else {
                        this.errMsg = this.errMsg + "Error 330: Label is not found. -- " + this.sourceIns[i] + "\n";
                        return false;
                    }
                }
                this.basic.add(TrimSpace_1.trimSpace(this.sourceIns[i]));
                instructionCounter++;
            }
        }
        return result;
    }
    preprocess() {
        this.segmentDataText();
        if (this.checkLabel()) {
            if (this.formatData()) {
                if (this.separateLabelIns()) {
                    if (this.storeData()) {
                        if (this.expandPseudo()) {
                            if (this.translateLabel()) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    assemble() {
        let result = true;
        let i;
        for (i = 0; i < this.basic.size(); i++) {
            let ins = this.basic.get(i).toString();
            if (ins == "syscall") {
                this.bin.add("00000000000000000000000000001100");
                continue;
            }
            let posOfSpace = ins.indexOf(" ");
            let operator = ins.substring(0, posOfSpace);
            if (MapForCommaNum_1.MapForCommaNum.getMap().has(operator)) {
                let expectedNumComma = MapForCommaNum_1.MapForCommaNum.getMap().get(operator);
                let actualNumComma = ins.split(",").length - 1;
                if (expectedNumComma == undefined) {
                    this.errMsg = this.errMsg + "Error 331: Instruction unrecognized. -- " + this.basic.get(i) + "\n";
                    console.log("Error 1 in Assembler. Instruction unrecognized.");
                    return false;
                }
                else if (expectedNumComma == actualNumComma) {
                    let type = MapForInsType_1.MapForInsType.getMap().get(operator);
                    if (type == undefined) {
                        this.errMsg = this.errMsg + "Error 332: Instruction unrecognized. -- " + this.basic.get(i) + "\n";
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
                                    this.errMsg = this.decoderForR.getErrMsg();
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
                                    this.errMsg = this.decoderForI.getErrMsg();
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
                                    this.errMsg = this.decoderForJ.getErrMsg();
                                    return false;
                                }
                                break;
                            default:
                                this.errMsg = this.errMsg + "Error 333: Instruction unrecognized. -- " + this.basic.get(i) + "\n";
                                return false;
                        }
                    }
                }
                else {
                    this.errMsg = this.errMsg + "Error 334: Too few or incorrectly formatted operands. -- " + this.basic.get(i) + "\n";
                    return false;
                }
            }
            else {
                this.errMsg = this.errMsg + "Error 335: Instruction unrecognized. -- " + this.basic.get(i) + "\n";
                return false;
            }
        }
        return result;
    }
}
exports.Assembler = Assembler;
Assembler.assembler = new Assembler();
//# sourceMappingURL=Assembler.js.map