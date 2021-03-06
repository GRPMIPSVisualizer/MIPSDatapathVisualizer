(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.singleCycleCpu = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayList = void 0;
class ArrayList {
    constructor(initialCapacity) {
        /**
         * The array used to store the elements.
         */
        this.elementData = [];
        /**
         * The number of elements stored in the ArrayList.
         */
        this.sizeNum = 0;
        if (typeof initialCapacity === 'number') {
            if (initialCapacity < 0) {
                throw new Error("is no arrayList index : " + initialCapacity);
            }
            this.elementData = new Array(initialCapacity);
        }
        else {
            this.elementData = new Array(10);
        }
    }
    add(arg0, arg1) {
        if (typeof arg0 === 'number') {
            this.ensureExplicitCapacity();
            this.rangeCheck(arg0);
            this.elementData.splice(arg0, 0, arg1);
            this.sizeNum++;
        }
        else {
            this.ensureExplicitCapacity();
            this.elementData[this.sizeNum] = arg0;
            this.sizeNum++;
        }
    }
    /**
     * Get the object specified by the index
     * @param index
     * @returns Object
     */
    get(index) {
        this.rangeCheck(index);
        return this.elementData[index];
    }
    /**
     * Update the object at the specified index
     * @param index
     * @param Object
     * @returns void
     */
    update(index, Object) {
        this.rangeCheck(index);
        this.elementData[index] = Object;
    }
    remove(arg0) {
        if (typeof arg0 === 'number') {
            this.elementData.splice(arg0, 1);
            this.sizeNum--;
            return true;
        }
        else {
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
     * Clear all elements in the ArrayList.
     * @returns void
     */
    clear() {
        for (let i = 0; i < this.sizeNum; i++) {
            this.remove(i);
        }
    }
    /**
     * Get the size of the ArrayList
     * @returns the size of the ArrayList
     */
    size() {
        return this.sizeNum;
    }
    /**
     * Check whether the index exceeds the capacity
     * @param index
     * @returns void
     */
    rangeCheck(index) {
        if (index >= this.sizeNum || index < 0) {
            throw new Error("is no index--->" + index);
        }
    }
    /**
     *  Expand the capacity of the ArrayList to 1.5 times
     * @returns void
     */
    ensureExplicitCapacity() {
        if (this.elementData.length < this.sizeNum + 1) {
            let oldCapacity = this.elementData.length;
            let newCapacity = oldCapacity + (oldCapacity >> 1);
            this.elementData.length = newCapacity;
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
const DecimalToBinary_1 = require("./DecimalToBinary");
const BinaryToDecimal_1 = require("./BinaryToDecimal");
/**
 * Class Assembler is for an assembler to validate the MIPS code and change the MIPS code into binary code.
 *
 * This class contains methods that format the source code, deal with labels and pseudo instructions,
 * segment data part and text part of the code and change the code into binary code.
 * It also provides some get methods to get the source code, basic code and maps which store the address and the data stored in the address.
 *
 */
class Assembler {
    /**
     * Constructor for Assembler.
     */
    constructor() {
        /**
         * The decoder to validate and decode instructions of type-R.
         */
        this.decoderForR = DecoderForR_1.DecoderForR.getDecoder();
        /**
         * The decoder to validate and decode instructions of type-I.
         */
        this.decoderForI = DecoderForI_1.DecoderForI.getDecoder();
        /**
         * The decoder to validate and decode instructions of type-J.
         */
        this.decoderForJ = DecoderForJ_1.DecoderForJ.getDecoder();
        /**
         * The raw input from the user.
         */
        this.sources = [];
        /**
         * The contents contained in the .data segment.
         */
        this.data = new ArrayList_1.ArrayList(10);
        /**
         * The contents contained in the .text segment in the form of an ArrayList.
         */
        this.sourceInsAL = new ArrayList_1.ArrayList(10);
        /**
         * The contents stored in the .text segment in the form of an array.
         */
        this.sourceIns = [];
        /**
         * The contents of the code which has translated the label to address and expanded pseudo instructions.
         */
        this.basic = new ArrayList_1.ArrayList(10);
        /**
         * The binary code of the MIPS instructions.
         */
        this.bin = new ArrayList_1.ArrayList(10);
        /**
         * The map stored labels in the .data segment, which the keys are labels and the values are addresses matched with labels.
         */
        this.mapForDataLabel = new Map();
        /**
         * The map stored .word data in the .data segment, which the keys are addresses and the values are integers stored in addresses.
         */
        this.mapForWord = new Map();
        /**
         * The map stored .ascii and .asciiz data in the .data segment, which the keys are addresses and the values are strings stored in addresses.
         */
        this.mapForAscii = new Map();
        /**
         * The map stored .byte data in the .data segment, which the keys are addresses and the values are integers stored in addresses.
         */
        this.mapForByte = new Map();
        /**
         * The string for error message of invalid MIPS code.
         */
        this.errMsg = "";
    }
    /**
     * Method for getting the assembler to assemble the MIPS code.
     * @returns an assembler for validating the MIPS code and translating the MIPS code into binary code.
     */
    static getAssembler() {
        return this.assembler;
    }
    /**
     * Method for getting the error message of invalid MIPS code.
     * @returns a string of error message.
     */
    getErrMsg() {
        return this.errMsg;
    }
    /**
     * Method for getting the map which stores .word data in the .data segment.
     * @returns a map which the keys are addresses and the values are integers stored in addresses.
     */
    getMapForWord() {
        return this.mapForWord;
    }
    /**
     * Method for getting the map which stores labels in the .data segment.
     * @returns a map which the keys are labels and the values are addresses matched with labels.
     */
    getMapForDataLabel() {
        return this.mapForDataLabel;
    }
    /**
     * Method for getting the map which stores .ascii and .asciiz data in the .data segment.
     * @returns a map which the keys are addresses and the values are strings stored in addresses.
     */
    getMapForAscii() {
        return this.mapForAscii;
    }
    /**
     * Method for getting the map which stores .byte data in the .data segment.
     * @returns a map which the keys are addresses and the values are integers stored in addresses.
     */
    getMapForByte() {
        return this.mapForByte;
    }
    /**
     * Method for getting the .text segment in the form of an ArrayList.
     * @returns an ArrayList of .text segment.
     */
    getSourceInsAL() {
        return this.sourceInsAL;
    }
    /**
     * Method for getting .text segment in the form of an array.
     * @returns an array of .text segment.
     */
    getSourceIns() {
        return this.sourceIns;
    }
    /**
     * Method for getting code which has translated the label to address and expanded pseudo instructions in the form of an ArrayList.
     * @returns an ArrayList of code which has translated the label to address and expanded pseudo instructions.
     */
    getBasic() {
        return this.basic;
    }
    /**
     * Method for getting the code of .data segment in the form of an ArrayList.
     * @returns an ArrayList of the code of .data segment.
     */
    getData() {
        return this.data;
    }
    /**
     * Method for getting the binary code of the MIPS instructions in the form of an ArrayList.
     * @returns an ArrayList of the binary code.
     */
    getBin() {
        return this.bin;
    }
    /**
     * Set the sources using the raw input from the user.
     * @param input the raw input from the user.
     * @returns void
     */
    setSources(input) {
        this.sources = input.split("\n");
        let i;
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
     * @returns void
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
    /**
     * Divide the label and instruction into two lines if they are in the same line in source instructions.
     * The function operates the Array called sourceIns directly.
     * If a label is valid and followed by an instruction which in the same line,
     * the element is separated into two elements in the array which one is the label and the other is the next instruction.
     * @returns true if there is no invalid labels and separate successfully, false if there are invalid labels.
     */
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
                    this.sourceIns.splice(i, 1, label + ":", this.sourceIns[i].substring(posOfColon + 1, this.sourceIns[i].length).trim());
                }
            }
        }
        return result;
    }
    /**
     * Format the data segment.
     * The function puts the label and the data layout instruction in the same line with a space interval if they do not follow this format
     * and puts the data layout instruction and the data in the same line with a space interval if they do not follow this format.
     * The formatted code is stored back to the ArrayList called data.
     * @returns true if the data segment is formatted successfully and false if there are invalid labels or instructions.
     */
    formatData() {
        let result = true;
        let i;
        let posOfColon;
        let label;
        let patt = /^[\s]$/;
        let pattLabel = /^[A-Za-z0-9._]+$/;
        let pattnumber = /[0-9]/;
        let resultData = new ArrayList_1.ArrayList();
        let posOfSpace;
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
                    posOfSpace = this.data.get(i).toString().indexOf(" ");
                    if (this.data.get(i).toString().substring(0, posOfSpace) == ".word" || this.data.get(i).toString().substring(0, posOfSpace) == ".byte" || this.data.get(i).toString().trim().substring(0, 6) == ".ascii" || this.data.get(i).toString().substring(0, 7) == ".asciiz") {
                        resultData.add(this.data.get(i).toString().trim());
                    }
                    else {
                        this.errMsg = this.errMsg + "Error 336: Invalid instruction. -- " + this.data.get(i) + "\n";
                        return false;
                    }
                }
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
    /**
     * Store the data in the data segment into maps.
     * The labels in the data segment are stored as keys and the addresses matched with the labels are stored as values in the map called mapForDataLabel.
     * The addresses of the data stored by .word instructions are stored as keys and the data stored in this address is stored as values in the map called mapForWord.
     * The addresses of the data stored by .byte instructions are stored as keys and the data stored in this address is stored as values in the map called mapForByte.
     * The addresses of string are stored as keys and the string stored in this address is stored as values in the map called mapForAscii.
     * @returns true if all data is stored successfully and false if there is invalid data type or the data is out of range.
     */
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
                                    address = (+address + (4 - +address % 4)).toFixed();
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
                                    address = (+address + (4 - +address % 4)).toFixed();
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
                                this.mapForByte.set(address, byteNumber);
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
                                    address = (+address + (4 - +address % 4)).toFixed();
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
                                    address = (+address + (4 - +address % 4)).toFixed();
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
                                this.mapForByte.set(address, byteNumber);
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
    /**
     * Check whether there are labels with the same name or not.
     * @returns true if there is no labels with the same name, otherwise false.
     */
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
     * @returns true if there is no error in the pseudo instructions, otherwise false.
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
    /**
     * Translate the labels in the "j", "jal", "beq" and "bne" instructions into addresses or offset.
     * The translated instructions are stored in an ArrayList called basic.
     * @returns true if all labels in the four types of instructions are translated successfully, false if there are invalid labels.
     */
    translateLabel() {
        let result = true;
        let i;
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
                instructionCounter++;
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
                        if (relativeJump < 0) {
                            relativeJump++;
                        }
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
    /**
     * Preprocess the instructions before assembling.
     * Methods called "segmentDataText", "checkLabel", "formatData", "separateLabelIns", "storeData", "expandPseudo" and "translateLabel"
     * are executed one by one.
     * @returns true if all methods in preprocess return true, otherwise false.
     */
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
    /**
     * Clear all fields in Assembler.
     * @returns void
     */
    refresh() {
        this.sources = [];
        this.data.clear();
        this.sourceInsAL.clear();
        this.sourceIns = [];
        this.basic.clear();
        this.bin.clear();
        this.mapForDataLabel.clear();
        this.mapForWord.clear();
        this.mapForAscii.clear();
        this.mapForByte.clear();
        this.errMsg = "";
    }
    /**
     * Assemble the instructions stored in the ArrayList called basic and translate instructions into a string of binary code.
     * The binary code is stored in the ArrayList called bin.
     * @returns true if all the instructions are valid and translated into binary code successfully, otherwise false.
     */
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
/**
 * Assembler for validating the MIPS code and translating the MIPS code into binary code.
 */
Assembler.assembler = new Assembler();

},{"./ArrayList":1,"./BinaryToDecimal":4,"./DecimalToBinary":5,"./DecoderForI":7,"./DecoderForJ":8,"./DecoderForR":9,"./MapForCommaNum":14,"./MapForInsType":16,"./TrimSpace":22}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.binaryAddition = void 0;
/**
 * Add two binary numbers in the form of string.
 * @param a a string of a binary number to be added.
 * @param b a string of a binary number to add.
 * @returns a string of the sum of the two binary numbers.
 */
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
exports.binaryToDecimal = void 0;
/**
 * Translate a 16-bits binary number into decimal number.
 * @param bin a string of a binary number(must be 16-bits) to be translated.
 * @returns a number which is the decimal format of the binary number, or 0 if the binary number is not 16-bits.
 */
function binaryToDecimal(bin) {
    let retNum = 0;
    if (bin.length != 16) {
        return 0;
    }
    else {
        let i = 1;
        let j = 0;
        for (; j < 15; j++) {
            retNum = retNum + +(bin.charAt(15 - j)) * i;
            i = 2 * i;
        }
        i = -i;
        retNum = retNum + +(bin.charAt(0)) * i;
    }
    return retNum;
}
exports.binaryToDecimal = binaryToDecimal;

},{}],5:[function(require,module,exports){
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
 * @returns a string of the binary format of the decimal number.
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

},{"./BinaryAddition":3,"./Stack":20,"./TransformZeroOne":21}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decoder = void 0;
/**
 * Abstract Decoder class for validating the instruction and decoding the instruction into binary code.
 * It contains methods for setting and getting the instruction, getting the binary code, validate instruction and decode instruction.
 */
class Decoder {
    constructor() {
        /**
         * The instruction to be decoded.
         */
        this.ins = "";
        /**
         * The operator of the instruction.
         */
        this.operator = "";
        /**
         * The binary code of the instruction.
         */
        this.binIns = "";
    }
    /**
     * Set the strings called ins and operator in the class Decoder.
     * @param ins the instruction to be decoded.
     * @returns void
     */
    setIns(ins) {
        this.ins = ins;
        var posOfSpace = this.ins.indexOf(" ");
        this.operator = ins.substring(0, posOfSpace);
    }
    /**
     * Method for getting the instruction.
     * @returns a string of the instruction.
     */
    getIns() {
        return this.ins;
    }
    /**
     * Method for getting the binary code of the instruction.
     * @returns a string of the binary code of the instruction.
     */
    getBinIns() {
        return this.binIns;
    }
}
exports.Decoder = Decoder;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecoderForI = void 0;
const Decoder_1 = require("./Decoder");
const InstructionI_1 = require("./InstructionI");
const MapForRegister_1 = require("./MapForRegister");
/**
 * Class for validating and decoding the instruction of type-I into binary code.
 * It contains methods for validating instruction, decoding instruction and getting the error message.
 */
class DecoderForI extends Decoder_1.Decoder {
    /**
     * Constructor of DecoderForI.
     */
    constructor() {
        super();
        /**
         * The string for error message.
         */
        this.errMsg = "";
    }
    /**
     * Method for getting the decoder for instruction of type-I.
     * @returns the decoder to validate and decode instructions of type-I.
     */
    static getDecoder() {
        return this.decoder;
    }
    /**
     * Method for validating the instruction of type-I.
     * @returns true if the instruction is valid, otherwise false.
     */
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
        else { // lbu, lhu, ll, lw, sb, sc, sh, sw
            let numLeftBracket = this.ins.split("(").length - 1;
            let numRightBracket = this.ins.split(")").length - 1;
            if (!(numLeftBracket == 1 && numRightBracket == 1)) {
                this.errMsg = this.errMsg + "Error 201: Invalid instruction format. -- " + this.getIns() + "\n";
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
        let patt3 = /^(\-|\+)?\d+$/;
        if (!patt3.test(IMM)) {
            this.errMsg = this.errMsg + "Error 202: Invalid immediate number. -- " + this.getIns() + "\n";
            return false;
        }
        else if (+IMM <= -32768 || +IMM >= 32767) {
            this.errMsg = this.errMsg + "Error 203: Invalid immediate number. Out of range. -- " + this.getIns() + "\n";
            return false;
        }
        let operands = [operandRS, operandRT];
        let i;
        for (i = 0; i < operands.length; i++) {
            let operand = operands[i].substring(1, operands[i].length);
            if (operands[i].charAt(0) == "$" && patt1.test(operand) && +operand > 31) {
                this.errMsg = this.errMsg + "Error 204: Invalid operand. -- " + this.getIns() + "\n";
                return false;
            }
            else if (operands[i] == "" || (operands[i].charAt(0) == "$" && patt1.test(operand) && +operand <= 31)) {
                continue;
            }
            else if (operands[i].charAt(0) == "$" && patt2.test(operand)) {
                if (MapForRegister_1.MapForRegister.getMap().has(operand)) {
                    let operandID = MapForRegister_1.MapForRegister.getMap().get(operand);
                    if (operandID == undefined) {
                        this.errMsg = this.errMsg + "Error 205: Invalid operand. -- " + this.getIns() + "\n";
                        return false;
                    }
                    else {
                        this.ins = this.ins.replace(operand, operandID);
                    }
                }
                else {
                    this.errMsg = this.errMsg + "Error 206: Invalid operand. -- " + this.getIns() + "\n";
                    return false;
                }
            }
            else {
                this.errMsg = this.errMsg + "Error 207: Invalid operand. -- " + this.getIns() + "\n";
                return false;
            }
        }
        return true;
    }
    /**
     * Method for decoding the instruction of type-I into binary code.
     * @returns void
     */
    decode() {
        let instruction = new InstructionI_1.InstructionI(this.ins);
        this.binIns = instruction.getBinIns();
    }
    /**
     * Method for getting the error message of invalid instruction of type-I.
     * @returns a string of error message.
     */
    getErrMsg() {
        return this.errMsg;
    }
}
exports.DecoderForI = DecoderForI;
/**
 * The decoder to validate and decode instructions of type-I.
 */
DecoderForI.decoder = new DecoderForI();

},{"./Decoder":6,"./InstructionI":11,"./MapForRegister":19}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecoderForJ = void 0;
const Decoder_1 = require("./Decoder");
const InstructionJ_1 = require("./InstructionJ");
/**
 * Class for validating and decoding the instruction of type-J into binary code.
 * It contains methods for validating instruction, decoding instruction and getting the error message.
 */
class DecoderForJ extends Decoder_1.Decoder {
    /**
     * Constructor of DecoderForJ.
     */
    constructor() {
        super();
        /**
         * The string for error message.
         */
        this.errMsg = "";
    }
    /**
     * Method for getting the decoder for instruction of type-J.
     * @returns the decoder to validate and decode instructions of type-J.
     */
    static getDecoder() {
        return this.decoder;
    }
    /**
     * Method for validating the instruction of type-J.
     * @returns true if the instruction is valid, otherwise false.
     */
    validate() {
        let posOfSpace = this.ins.indexOf(" ");
        let operandADDRESS = this.ins.substring(posOfSpace + 1, this.ins.length);
        let patt1 = /^[0-9]+$/;
        if (!patt1.test(operandADDRESS)) {
            this.errMsg = this.errMsg + "Error 208: Invalid address. -- " + this.getIns() + "\n";
            return false;
        }
        return true;
    }
    /**
     * Method for decoding the instruction of type-J into binary code.
     * @returns void
     */
    decode() {
        let instruction = new InstructionJ_1.InstructionJ(this.ins);
        this.binIns = instruction.getBinIns();
    }
    /**
     * Method for getting the error message of invalid instruction of type-J.
     * @returns a string of error message.
     */
    getErrMsg() {
        return this.errMsg;
    }
}
exports.DecoderForJ = DecoderForJ;
/**
 * The decoder to validate and decode instructions of type-J.
 */
DecoderForJ.decoder = new DecoderForJ();

},{"./Decoder":6,"./InstructionJ":12}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecoderForR = void 0;
const Decoder_1 = require("./Decoder");
const InstructionR_1 = require("./InstructionR");
const MapForRegister_1 = require("./MapForRegister");
/**
 * Class for validating and decoding the instruction of type-R into binary code.
 * It contains methods for validating instruction, decoding instruction and getting the error message.
 */
class DecoderForR extends Decoder_1.Decoder {
    /**
     * Constructor of DecoderForR.
     */
    constructor() {
        super();
        /**
         * The string for error message.
         */
        this.errMsg = "";
    }
    /**
     * Method for getting the decoder for instruction of type-R.
     * @returns the decoder to validate and decode instructions of type-R.
     */
    static getDecoder() {
        return this.decoder;
    }
    /**
     * Method for validating the instruction of type-R.
     * @returns true if the instruction is valid, otherwise false.
     */
    validate() {
        let posOfSpace = this.ins.indexOf(" ");
        let operandRS = "";
        let operandRT = "";
        let operandRD = "";
        let SHAMT = "";
        let patt1 = /^[0-9]+$/;
        let patt2 = /^[a-z0-9]+$/;
        let patt3 = /^(\+)?\d+$/;
        if (this.operator == "jr") {
            operandRS = this.ins.substring(posOfSpace + 1, this.ins.length);
        }
        else if (this.operator == "sll" || this.operator == "srl" || this.operator == "sra") {
            let operands = this.ins.substring(posOfSpace + 1, this.ins.length).split(",", 3);
            operandRD = operands[0];
            operandRT = operands[1];
            SHAMT = operands[2];
            if (((SHAMT == "" || !patt3.test(SHAMT))) || (patt3.test(SHAMT) && +SHAMT >= 32)) {
                this.errMsg = this.errMsg + "Error 209: Invalid shift amount. -- " + this.getIns() + "\n";
                return false;
            }
        }
        else {
            let operands = this.ins.substring(posOfSpace + 1, this.ins.length).split(",", 3);
            operandRD = operands[0];
            operandRS = operands[1];
            operandRT = operands[2];
        }
        let operands = [operandRS, operandRT, operandRD];
        let i;
        for (i = 0; i < operands.length; i++) {
            let operand = operands[i].substring(1, operands[i].length);
            if (operands[i].charAt(0) == "$" && patt1.test(operand) && +operand > 31) {
                this.errMsg = this.errMsg + "Error 210: Invalid operand. -- " + this.getIns() + "\n";
                return false;
            }
            else if (operands[i] == "" || (operands[i].charAt(0) == "$" && patt1.test(operand) && +operand <= 31)) {
                continue;
            }
            else if (operands[i].charAt(0) == "$" && patt2.test(operand)) {
                if (MapForRegister_1.MapForRegister.getMap().has(operand)) {
                    let operandID = MapForRegister_1.MapForRegister.getMap().get(operand);
                    if (operandID == undefined) {
                        this.errMsg = this.errMsg + "Error 211: Invalid operand. -- " + this.getIns() + "\n";
                        return false;
                    }
                    else {
                        this.ins = this.ins.replace(operand, operandID);
                    }
                }
                else {
                    this.errMsg = this.errMsg + "Error 212: Invalid operand. -- " + this.getIns() + "\n";
                    return false;
                }
            }
            else {
                this.errMsg = this.errMsg + "Error 213: Invalid operand. -- " + this.getIns() + "\n";
                return false;
            }
        }
        return true;
    }
    /**
     * Method for decoding the instruction of type-R into binary code.
     * @returns void
     */
    decode() {
        let instruction = new InstructionR_1.InstructionR(this.ins);
        this.binIns = instruction.getBinIns();
    }
    /**
     * Method for getting the error message of invalid instruction of type-R.
     * @returns a string of error message.
     */
    getErrMsg() {
        return this.errMsg;
    }
}
exports.DecoderForR = DecoderForR;
/**
 * The decoder to validate and decode instructions of type-R.
 */
DecoderForR.decoder = new DecoderForR();

},{"./Decoder":6,"./InstructionR":13,"./MapForRegister":19}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instruction = void 0;
/**
 * Abstract Instruction class for translating the instruction into binary code.
 * It contains a constructor and a method to get the binary code.
 */
class Instruction {
    /**
     * Constructor of Instruction.
     * @param ins the instruction to be decoded.
     */
    constructor(ins) {
        this.ins = ins;
        this.binIns = "";
        let posOfSpace = ins.indexOf(" ");
        this.operator = ins.substring(0, posOfSpace);
    }
    /**
 * Method for getting the instruction in binary format.
 * @returns a string of the instruction in binary format.
 */
    getBinIns() {
        return this.binIns;
    }
}
exports.Instruction = Instruction;

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructionI = void 0;
const DecimalToBinary_1 = require("./DecimalToBinary");
const Instruction_1 = require("./Instruction");
const MapForI_1 = require("./MapForI");
/**
 * Class for decoding the instruction of type-I into binary code.
 * It contains a constructor and a method to get the error message.
 */
class InstructionI extends Instruction_1.Instruction {
    /**
     * Constructor of InstructionI.
     * Translate the type-I instruction into binary format.
     * @param ins the type-I instruction to be translated. It should be in the form like "addi $8,$16,10".
     * There should be only one space between the operator and the first operand, no other space existing.
     * The register should be in dollar sign and a number.
     */
    constructor(ins) {
        super(ins);
        /**
         * The string of the error message.
         */
        this.errMsg = "";
        let opBin = MapForI_1.MapForI.getMap().get(this.operator);
        if (opBin == undefined) {
            this.op = "XXXXXX";
            this.errMsg = this.errMsg + "Error 101: Failed to construct type-I instruction. -- " + ins + "\n";
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
    /**
     * Method for getting the error message of type-I instruction.
     * @returns a string of error message.
     */
    getErrMsg() {
        return this.errMsg;
    }
}
exports.InstructionI = InstructionI;

},{"./DecimalToBinary":5,"./Instruction":10,"./MapForI":15}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructionJ = void 0;
const DecimalToBinary_1 = require("./DecimalToBinary");
const Instruction_1 = require("./Instruction");
const MapForJ_1 = require("./MapForJ");
/**
 * Class for decoding the instruction of type-J into binary code.
 * It contains a constructor and a method to get the error message.
 */
class InstructionJ extends Instruction_1.Instruction {
    /**
     * Constructor of InstructionJ.
     * Translate the type-J instruction into binary format.
     * @param ins the type-J instruction to be translated. It should be in the form like "j 10000".
     * There should be only one space between the operator and the first operand, no other space existing.
     * The address should be represented by a decimal number.
     */
    constructor(ins) {
        super(ins);
        /**
         * The string of the error message.
         */
        this.errMsg = "";
        let opBin = MapForJ_1.MapForJ.getMap().get(this.operator);
        if (opBin == undefined) {
            this.op = "XXXXXX";
            this.errMsg = this.errMsg + "Error 102: Failed to construct type-J instruction. -- " + ins + "\n";
        }
        else {
            this.op = opBin;
        }
        let posOfSpace = ins.indexOf(" ");
        this.operandADDRESS = ins.substring(posOfSpace + 1, ins.length);
        this.address = DecimalToBinary_1.decimalToBinary(+this.operandADDRESS, 26);
        this.binIns = this.op + this.address;
    }
    /**
     * Method for getting the error message of type-J instruction.
     * @returns a string of error message.
     */
    getErrMsg() {
        return this.errMsg;
    }
}
exports.InstructionJ = InstructionJ;

},{"./DecimalToBinary":5,"./Instruction":10,"./MapForJ":17}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructionR = void 0;
const DecimalToBinary_1 = require("./DecimalToBinary");
const Instruction_1 = require("./Instruction");
const MapForR_1 = require("./MapForR");
/**
 * Class for decoding the instruction of type-R into binary code.
 * It contains a constructor and a method to get the error message.
 */
class InstructionR extends Instruction_1.Instruction {
    /**
     * Constructor of InstructionR.
     * Translate the type-R instruction into binary format.
     * @param ins the type-R instruction to be translated. It should be in the form like "add $8,$16,$17".
     * There should be only one space between the operator and the first operand, no other space existing.
     * The register should be in dollar sign and a number.
     */
    constructor(ins) {
        super(ins);
        /**
         * The string of the error message.
         */
        this.errMsg = "";
        this.op = "000000";
        let functBin = MapForR_1.MapForR.getMap().get(this.operator);
        if (functBin == undefined) {
            this.funct = "XXXXXX";
            this.errMsg = this.errMsg + "Error 103: Failed to construct type-R instruction. -- " + ins + "\n";
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
        else if (this.operator == "sll" || this.operator == "srl" || this.operator == "sra") {
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
    /**
     * Method for getting the error message of type-R instruction.
     * @returns a string of error message.
     */
    getErrMsg() {
        return this.errMsg;
    }
}
exports.InstructionR = InstructionR;

},{"./DecimalToBinary":5,"./Instruction":10,"./MapForR":18}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapForCommaNum = void 0;
/**
 * MapForCommaNum stores core instructions and amount of the commas in the instructions.
 */
class MapForCommaNum {
    /**
     * Constructor of MapForCommaNum which is a singleton.
     */
    constructor() { }
    /**
     * Method for getting the singleton map.
     * @returns a map which the keys are instructions and the values are their amount of commas.
     */
    static getMap() {
        return this.map;
    }
}
exports.MapForCommaNum = MapForCommaNum;
/**
 * The map which the keys are instructions and the values are their amount of commas.
 */
MapForCommaNum.map = new Map([
    ["add", 2],
    ["addu", 2],
    ["sub", 2],
    ["subu", 2],
    ["and", 2],
    ["or", 2],
    ["nor", 2],
    ["slt", 2],
    ["sltu", 2],
    ["sll", 2],
    ["srl", 2],
    ["jr", 0],
    ["addi", 2],
    ["addiu", 2],
    ["andi", 2],
    ["beq", 2],
    ["bne", 2],
    ["lbu", 1],
    ["lhu", 1],
    ["ll", 1],
    ["lui", 1],
    ["lw", 1],
    ["ori", 2],
    ["slti", 2],
    ["sltiu", 2],
    ["sb", 1],
    ["sc", 1],
    ["sh", 1],
    ["sw", 1],
    ["j", 0],
    ["jal", 0],
    ["sra", 2],
    ["abs", 1],
    ["blt", 2],
    ["bgt", 2],
    ["ble", 2],
    ["neg", 1],
    ["negu", 1],
    ["not", 1],
    ["bge", 2],
    ["li", 1],
    ["la", 1],
    ["move", 1],
    ["sge", 2],
    ["sgt", 2]
]);

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapForI = void 0;
/**
 * MapForI stores some type-I core instructions and their corresponding 6 bits opcodes.
 */
class MapForI {
    /**
     * Constructor of MapForI which is a singleton.
     */
    constructor() { }
    /**
     * Method for getting the singleton map.
     * @returns a map which the keys are type-I instructions and the values are their corresponding 6 bits opcodes.
     */
    static getMap() {
        return this.map;
    }
}
exports.MapForI = MapForI;
/**
 * The map which the keys are type-I instructions and the values are their corresponding 6 bits opcodes.
 */
MapForI.map = new Map([
    ["addi", "001000"],
    ["addiu", "001001"],
    ["andi", "001100"],
    ["beq", "000100"],
    ["bne", "000101"],
    ["lbu", "100100"],
    ["lhu", "100101"],
    ["ll", "110000"],
    ["lui", "001111"],
    ["lw", "100011"],
    ["ori", "001101"],
    ["slti", "001010"],
    ["sltiu", "001011"],
    ["sb", "101000"],
    ["sc", "111000"],
    ["sh", "101001"],
    ["sw", "101011"]
]);

},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapForInsType = void 0;
/**
 * MapForCommaNum stores core instructions and the types of instructions.
 * The types contain "R", "I", "J" and "P", which type-P is for pseudo instructions.
 */
class MapForInsType {
    /**
     * Constructor of MapForInsType which is a singleton.
     */
    constructor() { }
    /**
     * Method for getting the singleton map.
     * @returns a map which the keys instructions and the values are the types of instructions.
     */
    static getMap() {
        return this.map;
    }
}
exports.MapForInsType = MapForInsType;
/**
 * The map which the keys are instructions and the values are the types of instructions.
 */
MapForInsType.map = new Map([
    ["add", "R"],
    ["addu", "R"],
    ["sub", "R"],
    ["subu", "R"],
    ["and", "R"],
    ["or", "R"],
    ["nor", "R"],
    ["slt", "R"],
    ["sltu", "R"],
    ["sll", "R"],
    ["srl", "R"],
    ["jr", "R"],
    ["sra", "R"],
    ["addi", "I"],
    ["addiu", "I"],
    ["andi", "I"],
    ["beq", "I"],
    ["bne", "I"],
    ["lbu", "I"],
    ["lhu", "I"],
    ["ll", "I"],
    ["lui", "I"],
    ["lw", "I"],
    ["ori", "I"],
    ["slti", "I"],
    ["sltiu", "I"],
    ["sb", "I"],
    ["sc", "I"],
    ["sh", "I"],
    ["sw", "I"],
    ["j", "J"],
    ["jal", "J"],
    ["abs", "P"],
    ["blt", "P"],
    ["bgt", "P"],
    ["ble", "P"],
    ["neg", "P"],
    ["negu", "P"],
    ["not", "P"],
    ["bge", "P"],
    ["li", "P"],
    ["la", "P"],
    ["move", "P"],
    ["sge", "P"],
    ["sgt", "P"]
]);

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapForJ = void 0;
/**
 * MapForI stores some type-J core instructions and their corresponding 6 bits opcodes.
 */
class MapForJ {
    /**
     * Constructor of MapForJ which is a singleton.
     */
    constructor() { }
    /**
     * Method for getting the singleton map.
     * @returns a map which the keys are type-J instructions and the values are their corresponding 6 bits opcodes.
     */
    static getMap() {
        return this.map;
    }
}
exports.MapForJ = MapForJ;
/**
 * The map which the keys are type-J instructions and the values are their corresponding 6 bits opcodes.
 */
MapForJ.map = new Map([
    ["j", "000010"],
    ["jal", "000011"]
]);

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapForR = void 0;
/**
 * MapForR stores some type-R core instructions and their corresponding 6 bits funct codes.
 */
class MapForR {
    /**
     * Constructor of MapForR which is a singleton.
     */
    constructor() { }
    /**
     * Method for getting the singleton map.
     * @returns a map which the keys are type-R instructions and the values are their corresponding 6 bits funct codes.
     */
    static getMap() {
        return this.map;
    }
}
exports.MapForR = MapForR;
/**
 * The map which the keys are type-R instructions and the values are their corresponding 6 bits funct codes.
 */
MapForR.map = new Map([
    ["add", "100000"],
    ["addu", "100001"],
    ["sub", "100010"],
    ["subu", "100011"],
    ["and", "100100"],
    ["or", "100101"],
    ["nor", "100111"],
    ["slt", "101010"],
    ["sltu", "101011"],
    ["sll", "000000"],
    ["srl", "000010"],
    ["jr", "001000"],
    ["sra", "000011"]
]);

},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapForRegister = void 0;
/**
 * MapForRegister stores 32 registers and their indices.
 */
class MapForRegister {
    /**
     * Constructor of MapForRegister which is a singleton.
     */
    constructor() { }
    /**
     * Method for getting the singleton map.
     * @returns a map which the keys are registers and the values are their indices.
     */
    static getMap() {
        return this.map;
    }
}
exports.MapForRegister = MapForRegister;
/**
 * The map which the keys are registers and the values are their indices.
 */
MapForRegister.map = new Map([
    ["zero", "0"],
    ["at", "1"],
    ["v0", "2"],
    ["v1", "3"],
    ["a0", "4"],
    ["a1", "5"],
    ["a2", "6"],
    ["a3", "7"],
    ["t0", "8"],
    ["t1", "9"],
    ["t2", "10"],
    ["t3", "11"],
    ["t4", "12"],
    ["t5", "13"],
    ["t6", "14"],
    ["t7", "15"],
    ["s0", "16"],
    ["s1", "17"],
    ["s2", "18"],
    ["s3", "19"],
    ["s4", "20"],
    ["s5", "21"],
    ["s6", "22"],
    ["s7", "23"],
    ["t8", "24"],
    ["t9", "25"],
    ["k0", "26"],
    ["k1", "27"],
    ["gp", "28"],
    ["sp", "29"],
    ["fp", "30"],
    ["ra", "31"]
]);

},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stack = void 0;
/**
 * Class Stack for storing data.
 * It is for the function which transforms a number from decimal to binary.
 * It contains methods to operate the data in stack.
 */
class Stack {
    /**
     * Constructor of Stack.
     * Initialize the array called items.
     */
    constructor() {
        this.items = [];
    }
    /**
     * Push an element into stack.
     * @param element the number need to be push into the stack.
     * @returns void
     */
    push(element) {
        this.items.push(element);
    }
    /**
     * Pop an element out from the stack.
     * @returns a number in the stack or undefined.
     */
    pop() {
        return this.items.pop();
    }
    /**
     * Get the element at the top of the stack.
     * @returns the number at the top of the stack.
     */
    peek() {
        return this.items[this.items.length - 1];
    }
    /**
     * Check whether the stack is empty or not.
     * @returns true if the stack is empty, otherwise not.
     */
    isEmpty() {
        return this.items.length == 0;
    }
    /**
     * Get the size of the stack.
     * @returns a number of the size of the stack.
     */
    size() {
        return this.items.length;
    }
    /**
     * Get the size of the stack.
     * @returns a number of the size of the stack.
     */
    length() {
        return this.size();
    }
    /**
     * Clear the elements in the stack.
     * @returns void
     */
    clear() {
        this.items = [];
    }
    /**
     * Get the elements in the stack.
     * @returns an array of numbers in the stack.
     */
    toString() {
        return this.items;
    }
}
exports.Stack = Stack;

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformZeroOne = void 0;
/**
 * Transform one to zero and transform zero to one
 * @param str the string of binary number to be transformed.
 * @returns a string which has transformed one to zero and zero to one.
 */
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

},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimSpace = void 0;
/**
 * Delete spaces in string except the first space.
 * @param str the string which the spaces in it needed to be deleted.
 * @returns a string without spaces in it except the first space.
 */
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

},{}],23:[function(require,module,exports){
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
const ArrayList_1 = require("../Assembler/ArrayList");
const ExceptionReporter_1 = require("../Circuit/ExceptionReporter");
/**
 * A PC is a register.Therefore class PC exends {@link _32BitsRegister}<br/>
 * some methods of {@link _32BitsRegister} are override to support some functions of PC
 * There are also some new methods which can help class PC works.
 */
class PC extends Register_1._32BitsRegister {
    /**
     * The constructor initializes all fields of this PC
     * @param InsMem the Memory object that will be connected by this PC
     * @param PCAdder the PCAdder that connects this PC
     */
    constructor(InsMem, PCAdder) {
        super();
        this.InstructionMem = InsMem;
        this.setInpin32(InsMem.getTextAddress());
        this.PCAdder = PCAdder;
        this.oneClockCycle();
    }
    /**
     * a cycle of clock signal pass
     */
    oneClockCycle() {
        if (this.getClockSignal().getSignal()) {
            throw Error("One clock should start from false");
        }
        this.setClockSignal(true);
        this.setClockSignal(false);
    }
    /**
     * the connected MUX set the Inpin32
     * @param MUX the connected MUX32 object
     */
    muxChange(MUX) {
        this.setInpin32(MUX.outPin32);
    }
    /**
     * overwrite of setOutPin32<br/>
     * trigger Instruction Memory and PCAdder changes when outPin32 is reset
     */
    setOutpin32() {
        super.setOutpin32();
        this.InstructionMem.setTextAddress(this.getOutPin32());
        this.PCAdder.newInPin(StringHandle_1.stringToIntArray(this.getOutPin32()), StringHandle_1.stringToIntArray(StringHandle_1.decToUnsignedBin32(4)));
    }
}
/**
 * PCAdder is the address Adder of PC
 * this clas extends Adder and has all the functionalities of an adder
 */
class PCAdder extends Adder_1.Adder {
    /**
     * the constructor connects this PCAdder with other componets
     * @param ALUAdder the ALU object that will be connected with this PC Adder
     * @param MUX the Mux32 object that will connect with this PC Adder
     */
    constructor(ALUAdder, MUX) {
        super(StringHandle_1.decToUnsignedBin32(0), StringHandle_1.decToUnsignedBin32(4));
        this.ALUAdder = ALUAdder;
        this.MUX = MUX;
    }
    /**
     * reconnect all componets.
     * @param ALUAdder the ALU object that will be connected with this PC Adder
     * @param MUX the Mux32 object that will connect with this PC Adder
     */
    connectConponents(ALUAdder, Mux) {
        this.ALUAdder = ALUAdder;
        this.MUX = Mux;
    }
    /**
     * Set new inpin signals for inpin32A and inpin32B<br/>
     * And trigger the change of inPin32A of both ALU Adder and MUX
     * @param inSignalA new signal for inpin32A
     * @param inSignalB new signal for inpin32B
     */
    newInPin(inSignalA, inSignalB) {
        super.newInPin(inSignalA, inSignalB);
        this.ALUAdder.setInpinA(this.getOutput());
        this.MUX.setInpin32A(this.getOutput());
    }
}
/**
 * ALU adder is the adder that caculates the branch address according to the outPin32 of ALU<br/>
 * The ALU adder is connected with mux1
 */
class ALUAdder extends Adder_1.Adder {
    /**
     * The constructor initializes inPin32A and inPin32B and Mux object
     * @param inSignalA new signal for inpin32A
     * @param inSignalB new signal for inpin32B
     * @param MUX the connected mux32 object
     */
    constructor(inSignalA, inSignalB, MUX) {
        super(inSignalA, inSignalB);
        this.MUX1 = MUX;
    }
    /**
     * This method set the outPin32 of this Adder<br/>
     * Trigger the change of inPin32B of connected mux32
     */
    setOutpin32() {
        this.outPin32 = StringHandle_1.intArrayToString(this.Adder32(StringHandle_1.stringToIntArray(this.inPin32A), StringHandle_1.stringToIntArray(this.inPin32B)));
        this.MUX1.setInpin32B(this.outPin32);
    }
    /**
     * set the inPin32A of this ALU Adder
     * @param binBits The new binary value that will assigned to the InPin32A of this ALU adder.
     */
    setInpinA(binBits) {
        if (binBits.length != 32)
            throw Error("The length of ALU Adder Input A is not 32");
        StringHandle_1.binaryDetect(binBits);
        this.inPin32A = binBits;
        this.setOutpin32();
    }
    /**
     * set the inPin32B of this ALU Adder
     * @param binBits The new binary value that will assigned to the InPin32B of this ALU adder.
     */
    setInpinB(binBits) {
        if (binBits.length != 32)
            throw Error("The length of ALU Adder Input B is not 32");
        StringHandle_1.binaryDetect(binBits);
        this.inPin32B = binBits;
        this.setOutpin32();
    }
}
/**
 * The connected sign extend components<br/>
 * the branch mux32 object and alu adder object will be connected with this sign extend component.
 */
class ConSignExtend extends Sign_extend_1.SignExtend {
    /**
     * Initialize all the fields of this class
     * @param ALUResultAdder the connected ALU adder
     * @param ALUMux the connected ALU Mux32
     */
    constructor(ALUResultAdder, ALUMux) {
        super();
        this.ALUResultAdder = ALUResultAdder;
        this.ALUInpinBMux = ALUMux;
    }
    /**
     * Set the 16bits inPin of this sign extend object
     * @param inPin the new 16 bits binary input that will be assigned to inPin16
     * @param ALUOp the ALUOp get from control unit
     */
    setInPin16(inPin, ALUOp) {
        super.setInPin16(inPin, ALUOp);
        let shiftedInput = StringHandle_1.shiftLeftBinary32Bits(this.getOutPin32());
        this.ALUResultAdder.setInpinB(shiftedInput);
        this.ALUInpinBMux.setInpin32B(this.getOutPin32());
    }
    /**
     * Memory set the inpin16 of this sign extend class.<br/>
     * the change of Memory's TextOutPin will trigger the change of inPin16 of this component
     * @param Mem The connected memory
     * @param con the connected control unit
     */
    memSetInpin16(Mem, con) {
        this.opCode = Mem.getTextOutpin().slice(0, 6);
        this.setInPin16(StringHandle_1.bitsMapping(Mem.getTextOutpin(), 0, 16), con.getALUOp());
    }
}
/**
 * The connected ALU Control component.<br/>
 * the ALU will be connected with this ALU Control
 */
class conALUControl extends ControlUnits_1.ALUControl {
    /**
     * initialize all th fields and the connected ALU object
     * @param ALU the ALU object that will be connected with this ALU Control
     */
    constructor(ALU) {
        super(ALU);
        /**
         * A boolean value indicates whether the alu should report its overflow
         */
        this.reportOverflow = false;
    }
    /**
     * This method provides a way for memory to set ALU's control bits and the InsCode of this component
     * @param mem the connected Memory
     * @returns nothing
     */
    memSetIns(mem) {
        this.setBne(this.bne);
        if (this.ALUOp0 && this.ALUOp1) {
            return;
        }
        super.setIns(StringHandle_1.bitsMapping(mem.getTextOutpin(), 0, 6));
        this.changeOverflowReport();
        this.setALUReportOverflow();
        this.ALU.setControlBits(this.getOperationCode());
        this.reportOverflow = false;
        this.setALUReportOverflow();
    }
    /**
     * As the name indicates, this method will set two ALUOp by getting ALUOp from input controlUnits<br/>
     * The ALU will also get the immediate code by calling this method
     * @param controlUnits the control units that connect to this alu control
     * @returns nothing
     */
    setALUOp(controlUnits) {
        super.setALUOp(controlUnits);
        this.ALU.setControlBits(this.getOperationCode());
    }
    /**
     * change the state of overflow reporter
     * @returns nothing
     */
    changeOverflowReport() {
        let Inscode = this.getInsCodeStr();
        let InsIndex = StringHandle_1.bin2dec("00000000000000000000000000" + Inscode, true);
        if (!this.ALUOp1 || this.ALUOp0) {
            return;
        }
        if (InsIndex == 8 || InsIndex == 32 || InsIndex == 34) {
            this.reportOverflow = true;
        }
        else {
            this.reportOverflow = false;
        }
    }
    /**
     * set bne field of ALU
     * @param ben the value that will assign to ALU's bne
     */
    setBne(ben) {
        this.ALU.bne = ben;
    }
    /**
     * synchronize the ALU's overflow report's state with that of this component
     */
    setALUReportOverflow() {
        this.ALU.setReportOverflow(this.reportOverflow);
    }
}
/**
 * The connected Register File<br/>
 * This component is connected with ALU and the mux32 of ALU inPinB and the data Memory.
 */
class conRegisterFile extends RegisterFile_1.RegisterFile {
    /**
     * The constructor initialize all the fields
     * @param ALU the alu object that will be connected with this register file
     * @param aluInpinBMux the mux32 of alu inpinB that will be connected with this register file
     * @param dataMem the data memory that will be connected with this register file.
     */
    constructor(ALU, aluInpinBMux, dataMem) {
        super();
        this.ALU = ALU;
        this.ALUInpinBMUX = aluInpinBMux;
        this.DataMemory = dataMem;
    }
    /**
     * override of logic of register read<br/>
     * Not only read data but also trigger the change of all connected components' inPin32
     */
    registerRead() {
        super.registerRead();
        this.ALU.setInpinA(this.getOutDataA());
        this.ALUInpinBMUX.setInpin32A(this.getOutDataB());
        this.DataMemory.setInpin32(this.getOutDataB());
    }
    /**
     * The memory mux32 set the write data pin of this register file
     * @param MemMux the setter memory outPin Mux32
     */
    setMuxWriteData(MemMux) {
        this.setWriteData(MemMux.outPin32);
    }
}
/**
 * This is the and of isZero of ALU and the branch signal from control unit
 */
class ZeroAnd extends AND_1.AND {
    /**
     * The constructor initializes the connected mux32
     * @param MuxA the mux32 object that is being connected with this register file
     */
    constructor(MuxA) {
        super(0, 0);
        this.MuxA = MuxA;
    }
    /**
     * set the InpinA of this and object.
     * @param inpin
     */
    setInpinA(inpin) {
        this.pin1 = BooleanHandler_1.bool2num(inpin);
        this.setOutpin();
    }
    /**
     * set the inPinB of this and object.
     * @param inpin the value that will be assigned to inPinB of this and object
     */
    setInpinB(inpin) {
        this.pin2 = BooleanHandler_1.bool2num(inpin);
        this.setOutpin();
    }
    /**
     * set the outPin of this and object and trigger the change of selector of the connected mux32
     */
    setOutpin() {
        this.outpin = AND_1.AND.And(this.pin1, this.pin2);
        this.MuxA.setSel(this.outpin);
    }
}
/**
 * the connected ALU<br/>
 * This class is connected with Memory mux and data Mememory and zeroAnd object
 */
class conALU extends ALU_1.ALU {
    /**
     * initialize all the fields
     * @param dataMem
     * @param MemMux
     * @param zeroAnd
     */
    constructor(dataMem, MemMux, zeroAnd) {
        super(StringHandle_1.decToUnsignedBin32(0), StringHandle_1.decToUnsignedBin32(0), "0000");
        this.dataMemory = dataMem;
        this.MemoryMux = MemMux;
        this.zeroAnd = zeroAnd;
    }
    /**
     * Override of detect zero<br/>
     * the change of isZero field will trigger the change of inPinB of zeroAnd
     */
    detectZero() {
        super.detectZero();
        if (this.bne) {
            this.isZero = !this.isZero;
        }
        this.zeroAnd.setInpinB(this.isZero);
    }
    /**
     * override of setOutPin<br/>
     * the change of outPin32 will trigger the change of the address of data memory and the inpin32A of memory mux
     * @param outPin
     */
    setOutPin(outPin) {
        super.setOutPin(outPin);
        this.dataMemory.setDataAddress(this.getOutPin32());
        this.MemoryMux.setInpin32A(this.getOutPin32());
    }
    /**
     * override of ALU logic<br/>
     * Additional logic of ALU is added to this method.
     */
    ALU() {
        this.shamt = this.dataMemory.getTextOutpin().slice(21, 26);
        if (this.dataMemory.getTextOutpin().slice(0, 6) == "001111") {
            this.inPin32A = BItsGenerator_1.init_bits(16) + this.inPin32A.slice(16, 32);
        }
        if (this.dataMemory.getTextOutpin().slice(0, 6) == "001011") {
            this.isUnsign = true;
        }
        else {
            if (this.dataMemory.getTextOutpin().slice(0, 6) == "000000" && this.dataMemory.getTextOutpin().slice(26, 32) == "101011") {
                this.isUnsign = true;
            }
            else {
                this.isUnsign = false;
            }
        }
        super.ALU();
    }
}
/**
 * The connected Control Unit<br/>
 * This object is connected with register file and alu control and jump mux32 and alu mux and memory mux and zeroAnd and data memory
 */
class ConControlUnits extends ControlUnits_1.ControlUnits {
    // private bi
    /**
     * initialize all the connected components.
     * @param bindedRegFile
     * @param conALUctl
     * @param muxb
     * @param aluMux
     * @param zeroAnd
     * @param MemMux
     * @param dataMem
     */
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
    /**
     * override of setOp<br/>
     * the change of operation code will also change the value connected with out signal of this control unit
     * @param code the code being set
     */
    setOp(code) {
        super.setOp(code);
        this.setOverflow(code);
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
    /**
     * if OPCode indicates that this is an unsign instruction<br/>
     * then the overflow report function of alu will be turned on
     * @param code the 6 bits OPCode
     * @returns nothing
     */
    setOverflow(code) {
        let decCode = StringHandle_1.bin2dec("00000000000000000000000000" + code, true);
        if (decCode == 0) {
            return;
        }
        if (decCode == 4 || decCode == 5 || decCode == 8) {
            this.bindedALUControl.reportOverflow = true;
        }
        else {
            this.bindedALUControl.reportOverflow = false;
        }
    }
}
/**
 * This is the real CPU of MIPS<br/>
 * Assembler and all circuit's components are integrated in this class<br/>
 * The functionalities of this class simulates a real MIPS CPU.<br/>
 * The pipeline is not realized is this class so we gave it name singleCycleCPU
 * which means the cpu will only run one instruction in one cycle.
 */
class singleCycleCpu {
    /**
     * The constructor initializes all the fields
     */
    constructor() {
        /**
         * The branch mux32 of this MIPS CPU
         */
        this.MUXA = new Mux32_1.Mux32(StringHandle_1.decToUnsignedBin32(0), StringHandle_1.decToUnsignedBin32(0), 0);
        /**
         * The jump mux32 of this MIPS CPU
         */
        this.MUXB = new Mux32_1.Mux32(StringHandle_1.decToUnsignedBin32(0), StringHandle_1.decToUnsignedBin32(0), 0);
        /**
         * The alu mux of this MIPS CPU
         */
        this.ALUMUX = new Mux32_1.Mux32(StringHandle_1.decToUnsignedBin32(0), StringHandle_1.decToUnsignedBin32(0), 0);
        /**
         * The memory mux32 of this MIPS CPU
         */
        this.MemMUX = new Mux32_1.Mux32(StringHandle_1.decToUnsignedBin32(0), StringHandle_1.decToUnsignedBin32(0), 0);
        /**
         * The zeroAnd of this MIPS CPU
         */
        this._zeroAnd = new ZeroAnd(this.MUXA);
        /**
         * The branch address adder.
         */
        this.ALUADD = new ALUAdder(StringHandle_1.decToUnsignedBin32(0), StringHandle_1.decToUnsignedBin32(0), this.MUXA);
        /**
         * The PC + 4 address Adder
         */
        this._PCAdder = new PCAdder(this.ALUADD, this.MUXA);
        /**
         * The instruction Memory and data Memory of this MIPS CPU
         */
        this._Memory = new Memory_1.Memory();
        /**
         * The PC of this MIPS CPU
         */
        this._PC = new PC(this._Memory, this._PCAdder);
        /**
         * The sign Extend component of this MIPS CPU
         */
        this._signExtend = new ConSignExtend(this.ALUADD, this.ALUMUX);
        /**
         * The alu of this MIPS CPU
         */
        this._alu = new conALU(this._Memory, this.MemMUX, this._zeroAnd);
        /**
         * The alu control of this MIPS CPU
         */
        this._aluControl = new conALUControl(this._alu);
        /**
         * The register file of this MIPS CPU
         */
        this._registerFile = new conRegisterFile(this._alu, this.ALUMUX, this._Memory);
        /**
         * The control unit of this MIPS CPU
         */
        this._controlUnits = new ConControlUnits(this._registerFile, this._aluControl, this.MUXB, this.ALUMUX, this._zeroAnd, this.MemMUX, this._Memory);
        /**
         * The clock signal of this CPU
         */
        this.clockSignal = new Signal_1.Signal(false);
        /**
         * record of all the added data to the memory
         */
        this._insMemData = new Map();
        /**
         * The assembled machince code
         */
        this.machCode = [];
        /**
         * the current pointed pc address
         */
        this.currentInsAddr = BItsGenerator_1.init_bits(32);
        /**
         * the added ascii string to the memory
         */
        this.asciiString = new Map();
        /**
         * the out message of console
         */
        this.StdOut = "";
        /**
         * the reported error message
         */
        this.Errormsg = "";
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
        this.ALUAdderB = BItsGenerator_1.init_bits(32);
        this.signExtendOUT = BItsGenerator_1.init_bits(32);
        this.assembler = Assembler_1.Assembler.getAssembler();
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
    /**
     * change the clock siganl of this CPU<br/>
     * trigger the change of clock signal of all composed components
     */
    changeClockSignal() {
        this.clockSignal.changeSiganl();
        this._Memory.clockSiganlChange();
        this._registerFile.changeClockSignal();
        this._PC.changeClockSignal();
        // this._PC.changeClockSignal();
        // this._registerFile.changeClockSignal();
        // this._Memory.clockSiganlChange();
    }
    /**
     * set the clock signal of this CPU<br/>
     * set the clock signal of all composed components
     * @param signal the signal being set
     * @returns nothing
     */
    setClockSignal(signal) {
        if (this.clockSignal.getSignal() == signal)
            return;
        this.setClockSignal(signal);
        this._Memory.setclockSiganl(signal);
        this._registerFile.setClockSignal(signal);
        this._PC.setClockSignal(signal);
    }
    /**
     * The logic of syscall instruction
     * @returns nothing
     */
    syscall() {
        let registers = this.debugReg();
        let v0 = StringHandle_1.bin2dec(registers[2], true);
        if (v0 == 1) {
            this.StdOut = StringHandle_1.bin2dec(registers[4], false) + "";
            return;
        }
        if (v0 == 4) {
            let a0 = StringHandle_1.bin2dec(registers[4], true) + "";
            let print_str = this.asciiString.get(a0);
            if (print_str == undefined) {
                let excepReporter = ExceptionReporter_1.ExceptionReporter.getReporter();
                excepReporter.addException("syscall print_str error: no such address!");
                this.Errormsg = this.reportExceptions();
            }
            else {
                this.StdOut = print_str;
            }
            return;
        }
        if (v0 == 5) {
            let read_int = this.readFromConsole(v0);
            let isDigit = /^-?\d+$/.test(read_int);
            if (!isDigit) {
                let excepReporter = ExceptionReporter_1.ExceptionReporter.getReporter();
                excepReporter.addException("your input is not a number!");
                this.Errormsg = this.reportExceptions();
            }
            else {
                let binCode = StringHandle_1.decToSignedBin32(+read_int);
                this._registerFile.storeADataAt(2, binCode);
            }
            return;
        }
        if (v0 == 8) {
            let read_str = this.readFromConsole(v0);
            let max_length = StringHandle_1.bin2dec(registers[5], true);
            if (max_length < read_str.length) {
                let excepReporter = ExceptionReporter_1.ExceptionReporter.getReporter();
                excepReporter.addException("Buffer size is not enough!!");
                this.Errormsg = this.reportExceptions();
            }
            for (let i = 0; i < read_str.length; ++i) {
                let asciiCode = read_str.charCodeAt(i);
                let binCode = StringHandle_1.decToUnsignedBin32(asciiCode).slice(24, 32);
                this._Memory.storeByteStaticData([StringHandle_1.bin2dec(registers[4], true) + "", binCode]);
            }
            return;
        }
        if (v0 == 10) {
            let excepReporter = ExceptionReporter_1.ExceptionReporter.getReporter();
            excepReporter.addException("Program Exit!");
            this.Errormsg = this.reportExceptions();
            return;
        }
        if (v0 == 11) {
            let a0 = StringHandle_1.bin2dec(registers[4], true);
            let print_char = String.fromCharCode(StringHandle_1.bin2dec(BItsGenerator_1.init_bits(24) + this._Memory.CharAt(a0), true));
            this.StdOut = print_char;
            return;
        }
        if (v0 == 12) {
            let read_char = this.readFromConsole(v0);
            let asciiCode = read_char.charCodeAt(0);
            let binCode = StringHandle_1.decToUnsignedBin32(asciiCode);
            this._registerFile.storeADataAt(2, binCode);
            return;
        }
        let excepReporter = ExceptionReporter_1.ExceptionReporter.getReporter();
        excepReporter.addException("sys code in v0 is not supported!");
        this.Errormsg = this.reportExceptions();
    }
    /**
     * The logic of read from console
     * @param readCode the syscall code
     * @returns the string user input on console
     */
    readFromConsole(readCode) {
        // 浣犱滑鏉ュ啓锛屾妸鐢ㄦ埛杈撳叆鍦╟onsole涓婄殑涓滆タ浣滀负涓€涓猻tring杩斿洖
        return "";
    }
    /**
     * change clock signal twice<br/>
     * This means the clock of this signal passes a clock cycle
     */
    oneClockCycle() {
        this.StdOut = "";
        if (this._Memory.getTextOutpin() == "00000000000000000000000000001100") {
            this.syscall();
        }
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
        this.ALUAdderB = this.ALUADD.getInpinB();
        this.signExtendOUT = this._signExtend.getOutPin32();
        this.currentInsAddr = this._Memory.getTextAddress();
        this.Errormsg = this.reportExceptions();
        this.changeClockSignal();
    }
    /**
     * The logic of report exception
     * @returns the exception message
     */
    reportExceptions() {
        let ExcepReporter = ExceptionReporter_1.ExceptionReporter.getReporter();
        if (!ExcepReporter.isEmpty()) {
            let Errors = ExcepReporter.reportException();
            let ErrorInOneLine = "";
            ExcepReporter.clearException();
            Errors.forEach(error => {
                ErrorInOneLine = ErrorInOneLine + error + "\n";
            });
            return ErrorInOneLine;
        }
        else {
            return "";
        }
    }
    /**
     * test method of this class<br/>
     * used for debugging this class
     * @param InsNum The index of instructions
     */
    debugCPU(InsNum) {
        this.changeClockSignal();
        console.log(InsNum);
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        this.changeClockSignal();
        console.log(InsNum);
        console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
        console.log("The address of Memory is ", this._Memory.getTextAddress());
        console.log("The code is ", this._Memory.getTextOutpin());
        console.log(this.debugReg());
        for (let [key, value] of this._Memory.getAddedData()) {
            console.log(key, value);
        }
    }
    /**
     * run all the instructions stored in this model in one turn<br/>
     */
    runWhole() {
        let i = 0;
        do {
            this.oneClockCycle();
            console.log(i);
            console.log("PC: The inPin is: ", this._PC.getinPin32(), ".The OutPin is", this._PC.getOutPin32());
            console.log("The address of Memory is ", this._Memory.getTextAddress());
            console.log("The code is ", this._Memory.getTextOutpin());
            console.log(this.debugReg());
            i++;
            for (let [key, value] of this._Memory.getAddedData()) {
                console.log(key, value);
            }
        } while (!this._Memory.isEnd());
    }
    /**
     * get the binary string data of all the registers
     * @returns a array of 32 strings, each represents the data of a register
     */
    debugReg() {
        let regs = this._registerFile.getRegisters();
        let Regs = [];
        regs.forEach(reg => {
            Regs.push(reg.getOutPin32());
        });
        return Regs;
    }
    /**
     * store machine code into Instruction Memory
     * @param Ins the machine code that will be stored into instrucion memory
     */
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
    /**
     * get all stored machine code
     * @returns all the machine code
     */
    getMachineCode() {
        return this.machCode;
    }
    /**
     * get the current pointed pc address
     * @returns
     */
    getCurrentInsAddr() {
        return this.currentInsAddr;
    }
    /**
     * get all static stored data
     * @returns an array of index data pair
     */
    getStaticData() {
        let StatData = new Array();
        for (let [key, value] of this._Memory.getStaticData()) {
            StatData.push([key, value]);
        }
        return StatData;
    }
    /**
     * get all dynamic stored data
     * @returns an array of index data pair
     */
    getDynamicData() {
        let DynamicData = new Array();
        for (let [key, value] of this._Memory.getAddedData()) {
            DynamicData.push([key, value]);
        }
        return DynamicData;
    }
    /**
     * Assemble the instructions into machine codes
     * @param Ins the instructions in the form of one string
     */
    Assemble(Ins) {
        let machCode = [];
        let assembler = Assembler_1.Assembler.getAssembler();
        assembler.setSources(Ins);
        if (assembler.preprocess()) {
            let wordMap = assembler.getMapForWord();
            let byteMap = assembler.getMapForByte();
            let asciiMap = assembler.getMapForAscii();
            if (wordMap.size != 0) {
                for (let key of wordMap.keys()) {
                    let tempNum = wordMap.get(key);
                    let datum = StringHandle_1.decToSignedBin32(tempNum);
                    this._Memory.storeWordStaticData([key, datum]);
                }
            }
            if (byteMap.size != 0) {
                for (let key of wordMap.keys()) {
                    let tempNum = byteMap.get(key);
                    let datum = StringHandle_1.decToSignedBin32(tempNum);
                    this._Memory.storeByteStaticData([key, datum.slice(24, 32)]);
                }
            }
            if (asciiMap.size != 0) {
                this.asciiString = asciiMap;
                for (let key of asciiMap.keys()) {
                    let tempChars = asciiMap.get(key);
                    let datum = "";
                    let currentAddr = +key;
                    for (let i = 0; i < tempChars.length; ++i) {
                        datum = StringHandle_1.decToSignedBin32(tempChars.charCodeAt(i));
                        this._Memory.storeByteStaticData([currentAddr + "", datum.slice(24, 32)]);
                        ++currentAddr;
                    }
                }
            }
            if (assembler.assemble()) {
                let i;
                let bin = new ArrayList_1.ArrayList(10);
                bin = assembler.getBin();
                for (i = 0; i < bin.size(); i++) {
                    machCode.push((bin.get(i).toString()));
                }
            }
            else {
                let excepReporter = ExceptionReporter_1.ExceptionReporter.getReporter();
                excepReporter.addException(assembler.getErrMsg());
                this.Errormsg = this.reportExceptions();
            }
        }
        else {
            let excepReporter = ExceptionReporter_1.ExceptionReporter.getReporter();
            excepReporter.addException(assembler.getErrMsg());
            this.Errormsg = this.reportExceptions();
        }
        this.storeIns(machCode);
        this.machCode = machCode;
    }
    /**
     * reset this CPU
     */
    resetAll() {
    }
}
exports.singleCycleCpu = singleCycleCpu;

},{"../Assembler/ArrayList":1,"../Assembler/Assembler":2,"../Circuit/ALU":24,"../Circuit/Adder":25,"../Circuit/ControlUnits":26,"../Circuit/ExceptionReporter":28,"../Circuit/Memory":30,"../Circuit/Register":31,"../Circuit/RegisterFile":32,"../Circuit/Sign-extend":33,"../Circuit/Signal":34,"../Conponent/Mux32":41,"../Library/BItsGenerator":45,"../Library/BooleanHandler":46,"../Library/StringHandle":47,"../Logic/AND":48}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALU = void 0;
const Adder_1 = require("./Adder");
const AND32_1 = require("../Logic/AND32");
const OR32_1 = require("../Logic/OR32");
const StringHandle_1 = require("../Library/StringHandle");
const NOT32_1 = require("../Logic/NOT32");
const Mux4Way32_1 = require("../Conponent/Mux4Way32");
const ExceptionReporter_1 = require("./ExceptionReporter");
const BItsGenerator_1 = require("../Library/BItsGenerator");
/**
 * Class ALU simulates some basic function of ALU. This is a core component for building a CPU.<br/>
 * 8 functions are fulfilled in this ALU:<br/>
 * or<br/>
 * and<br/>
 * add32<br/>
 * sub32<br/>
 * set on less than<br/>
 * nor<br/>
 * shiftLeftLogic<br/>
 * shiftRightLogic
 */
class ALU {
    /**
     * The Constructor initializes {@link inPin32A} and {@link inPin32B} and {@link controlBits}
     * @param inPinA the binary string that will assigned to {@link inPin32A}
     * @param inPinB the binary string that will assigned to {@link inPin32B}
     * @param control the 4-bits string that will assigned to {@link controlBits}
     */
    constructor(inPinA, inPinB, control) {
        /**
         * As the name indicates, this is 32bits outPin of the ALU
         */
        this.outPin32 = "";
        /**
         * This field records the shamt bits of a machine code
         */
        this.shamt = BItsGenerator_1.init_bits(5);
        /**
         * This is a boolean value that indicates whether the instruction is bne
         */
        this.bne = false;
        /**
         * This is a boolean value which indicates whether the overflow should be reported.
         */
        this.reportOverflow = false;
        this.inPin32A = inPinA;
        this.inPin32B = inPinB;
        this.controlBits = control;
        this.isUnsign = false;
        this.isOverflow = false;
        this.isZero = false;
        this.Adder32 = new Adder_1.Adder(inPinA, inPinB);
        this.outPin32 = StringHandle_1.decToUnsignedBin32(0);
    }
    /**
     * get {@link outPin32}
     * @returns binary string that stored in outPin32
     */
    getOutPin32() {
        return this.outPin32;
    }
    /**
     * this method is the most critical method in this class.<br/>
     * It simulates the workflow of ALU and set {@link outPin32} and other boolean variables according to inputs<br/>
     * @returns nothing
     */
    ALU() {
        if (this.controlBits == "1111" || this.controlBits == "1110" || this.controlBits == "1101") {
            let right = (this.controlBits[3] == '0') ? false : true;
            let shiftIndex = StringHandle_1.bin2dec(BItsGenerator_1.init_bits(27) + this.shamt, true);
            let newStr = "";
            if (right) {
                if (this.controlBits[2] == '0' && this.inPin32B[0] == '1') {
                    for (let i = 0; i < shiftIndex; ++i) {
                        newStr = newStr + "1";
                    }
                }
                else {
                    for (let i = 0; i < shiftIndex; ++i) {
                        newStr = newStr + "0";
                    }
                }
                newStr = newStr + this.inPin32B.slice(0, 32 - shiftIndex);
            }
            else {
                newStr = newStr + this.inPin32B.slice(shiftIndex, 32);
                for (let i = 0; i < shiftIndex; ++i) {
                    newStr = newStr + "0";
                }
            }
            this.setOutPin(newStr);
            return;
        }
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
        let slt = [];
        if (this.isUnsign) {
            let numA = StringHandle_1.bin2dec(this.inPin32A, this.isUnsign);
            let numB = StringHandle_1.bin2dec(this.inPin32B, this.isUnsign);
            if (numA < numB) {
                slt = StringHandle_1.stringToIntArray(StringHandle_1.decToSignedBin32(1));
            }
            else {
                slt = StringHandle_1.stringToIntArray(StringHandle_1.decToSignedBin32(0));
            }
        }
        else {
            if (this.inPin32A[0] == '0' && this.inPin32B[0] == '1') {
                slt = StringHandle_1.stringToIntArray(StringHandle_1.decToSignedBin32(0));
            }
            if (this.inPin32A[0] == '1' && this.inPin32B[0] == '0') {
                slt = StringHandle_1.stringToIntArray(StringHandle_1.decToSignedBin32(1));
            }
            if (this.inPin32A[0] == '1' && this.inPin32B[0] == '1') {
                slt = StringHandle_1.stringToIntArray(StringHandle_1.decToSignedBin32(this.Adder32.getOutputAt(0)));
            }
            if (this.inPin32A[0] == '0' && this.inPin32B[0] == '0') {
                slt = StringHandle_1.stringToIntArray(StringHandle_1.decToSignedBin32(this.Adder32.getOutputAt(0)));
            }
        }
        let inpin = [and32, or32, StringHandle_1.stringToIntArray(this.Adder32.getOutput()), slt];
        // console.log(inpin[0],and32);
        if (this.getReportOverflow()) {
            this.reportOverflowException();
        }
        this.setOutPin(StringHandle_1.intArrayToString(Mux4Way32_1.Mux4Way32.Mux4Way32(inpin, [control[2], control[3]])));
        this.detectZero();
    }
    /**
     * This method add an error message to {@link ExceptionReporter} if {@link isOverflow} is true<br/>
     * @returns nothing
     */
    reportOverflowException() {
        if (!this.isOverflow)
            return;
        let exceptionReporter = ExceptionReporter_1.ExceptionReporter.getReporter();
        exceptionReporter.addException("ALU Overflow Exception!");
    }
    /**
     * This method detect overflow and set {@link isOverflow} according to last bit of {@link inPin32A} and {@link inPin32B} as well as the output of {@link Adder32}
     * @param lastPinA last bit of {@link inPin32A}
     * @param lastPinB last bit of {@link inPin32B}
     * @param lastOut last bit of output of {@link Adder32}
     * @param carry carry?
     */
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
    /**
     * detect whether the {@link outPin32} is zero
     * if it is zero, set {@link isZero} to true
     * @returns nothing
     */
    detectZero() {
        for (let i = 0; i < this.outPin32.length; ++i) {
            if (parseInt(this.outPin32.charAt(i)) != 0) {
                this.isZero = false;
                return;
            }
        }
        this.isZero = true;
    }
    /**
     * reset both {@link inPin32A} and {@link inPin32B} and {@link controlBits}
     * @param inPinA new binary string that will assigned to {@link inPin32A}
     * @param inPinB new binary string that will assigned to {@link inPin32B}
     * @param controlBits new 4-bits control string that will assigned to {@link controlBits}
     */
    newSignal(inPinA, inPinB, controlBits) {
        this.inPin32A = inPinA;
        this.inPin32B = inPinB;
        this.controlBits = controlBits;
        this.ALU();
    }
    /**
     * assign a new 4-bits control string to {@link controlBits}
     * @param conBits
     */
    setControlBits(conBits) {
        this.controlBits = conBits;
        this.ALU();
    }
    /**
     * assign a new 32-bits binary value to {@link inPin32A}
     * @param inPin
     */
    setInpinA(inPin) {
        this.inPin32A = inPin;
        this.ALU();
    }
    /**
     * the ALU Mux32 component will watch the change of its outPin32 and will set {@link inPin32B} accordingly.
     * @param MUX the ALU Mux32 component
     */
    setMuxInpinB(MUX) {
        this.inPin32B = MUX.outPin32;
        this.ALU();
    }
    /**
     * assign a new value to {@link outPin32}
     * @param outPin
     */
    setOutPin(outPin) {
        this.outPin32 = outPin;
    }
    /**
     * This method sets {@link reportOverflow}
     * @param b the boolean number that will be assigned to {@link reportOverflow}
     */
    setReportOverflow(b) {
        this.reportOverflow = b;
    }
    /**
     * This method return a boolean indicates whether overflow should be reported
     * @returns a boolean indicates whether overflow should be reported
     */
    getReportOverflow() {
        return this.reportOverflow;
    }
}
exports.ALU = ALU;

},{"../Conponent/Mux4Way32":42,"../Library/BItsGenerator":45,"../Library/StringHandle":47,"../Logic/AND32":49,"../Logic/NOT32":53,"../Logic/OR32":55,"./Adder":25,"./ExceptionReporter":28}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Adder = void 0;
const AND_1 = require("../Logic/AND");
const XOR_1 = require("../Logic/XOR");
const OR_1 = require("../Logic/OR");
const Mux_1 = require("../Conponent/Mux");
const StringHandle_1 = require("../Library/StringHandle");
/**
 * Class Adder implements some basic the functionalities of a adder.<br/>
 * This component is used for PC and branch as well as ALU to get correct data
 */
class Adder {
    /**
     * The Constructor initialize {@link inPin32A} and {@link inPin32B}<br/>
     * The adder will then set the {@link outPin32} according to two inputs.
     * @param inSignalA a binary string that will assign to {@link inPin32A}
     * @param inSignalB a binary string that will assign to {@link inPin32A}
     */
    constructor(inSignalA, inSignalB) {
        this.inPin32A = inSignalA;
        this.inPin32B = inSignalB;
        let bitA = StringHandle_1.stringToIntArray(this.inPin32A);
        let bitB = StringHandle_1.stringToIntArray(this.inPin32B);
        this.outPin32 = StringHandle_1.intArrayToString(this.Adder32(bitA, bitB));
        this.carry = 0;
    }
    /**
     * A half adder will do add logic but only for 1-bit,and it does not take carry into consideration
     * @param inPin1 1-bit data
     * @param inPin2 1-bit data
     * @returns a array of number indicates carry and the result of sum
     */
    static halfAdder(inPin1, inPin2) {
        let carry = AND_1.AND.And(inPin1, inPin2);
        let sum = XOR_1.XOR.Xor(inPin1, inPin2);
        return [carry, sum];
    }
    /**
     * get {@link inPin32B}
     * @returns a binary string which {@link inPin32B} stores
     */
    getInpinB() {
        return this.inPin32B;
    }
    /**
     * A full adder will do add logic but only for 1-bit,and it takes carry into consideration.
     * @param inPin1 1-bit data
     * @param inPin2 1-bit data
     * @param carry carry
     * @returns a array of number indicates new carry and the result of sum
     */
    static fullAdder(inPin1, inPin2, carry) {
        let Pin0 = OR_1.OR.Or(inPin1, inPin2);
        let Pin1 = AND_1.AND.And(inPin1, inPin2);
        let Pin2 = XOR_1.XOR.Xor(inPin1, inPin2);
        let sum = XOR_1.XOR.Xor(Pin2, carry);
        let newCarry = Mux_1.Mux.Mux(Pin1, Pin0, carry);
        return [newCarry, sum];
    }
    /**
     * This method do 32-bits add logic by recurring call {@link halfAdder} and {@link fullAdder}
     * @param inSignalA the first input pin of an adder
     * @param inSignalB the second input pin of an adder
     * @returns the sum of two 32bits input, but in the form of number array
     */
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
    /**
     * assign new value to two inpin {@link inPin32A} and {@link inPin32B}<br/>
     * the {@link outPin32} will be set accordingly.
     * @param inSignalA a array of 32-bits that will be assigned to {@link inPin32A}
     * @param inSignalB a array of 32-bits that will be assigned to {@link inPin32B}
     */
    newInPin(inSignalA, inSignalB) {
        this.inPin32A = StringHandle_1.intArrayToString(inSignalA);
        this.inPin32B = StringHandle_1.intArrayToString(inSignalB);
        this.outPin32 = StringHandle_1.intArrayToString(this.Adder32(inSignalA, inSignalB));
    }
    /**
     * get i-th bit of {@link outPin32}
     * @param i index of bit
     * @returns the i-th bit of {@link outPin32}
     */
    getOutputAt(i) {
        return parseInt(this.outPin32.charAt(i));
    }
    /**
     * get {@link outPin32}
     * @returns the outPin32 will be return
     */
    getOutput() {
        return this.outPin32;
    }
    /**
     * get i-th bit of {@link inPin32A}
     * @param i index of bit
     * @returns the i-th bit of {@link inPin32A}
     */
    getInpinAAt(i) {
        return parseInt(this.inPin32A.charAt(i));
    }
    /**
     * get i-th bit of {@link inPin32B}
     * @param i index of bit
     * @returns the i-th bit of {@link inPin32B}
     */
    getInpinBAt(i) {
        return parseInt(this.inPin32B.charAt(i));
    }
}
exports.Adder = Adder;

},{"../Conponent/Mux":40,"../Library/StringHandle":47,"../Logic/AND":48,"../Logic/OR":54,"../Logic/XOR":56}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALUControl = exports.ControlUnits = void 0;
const BooleanHandler_1 = require("../Library/BooleanHandler");
const StringHandle_1 = require("../Library/StringHandle");
/**
 * Class ControlUnits is an abstract model of real Control Unit<br/>
 * It implements the functionalities of a real Control Unit by simulating how Control Unit works<br/>
 * This is also one of core componets of MIPS circuit
 */
class ControlUnits {
    constructor() {
        /**
         * operation code 0.(operation code is the first 6 bits of MIPS machine code)
         */
        this.Op0 = false;
        /**
         * operation code 1.
         */
        this.Op1 = false;
        /**
         * operation code 2.
         */
        this.Op2 = false;
        /**
         * operation code 3.
         */
        this.Op3 = false;
        /**
         * operation code 4.
         */
        this.Op4 = false;
        /**
         * operation code 5.
         */
        this.Op5 = false;
        /**
         * the register destination signal
         */
        this.RegDes = false;
        /**
         * the jump signal
         */
        this.Jump = false;
        /**
         * the branch signal
         */
        this.Branch = false;
        /**
         * the memory read signal
         */
        this.MemRead = false;
        /**
         * the memory wirte to register signal
         */
        this.MemtoReg = false;
        /**
         * the ALUOp code 0
         */
        this.ALUOp0 = false;
        /**
         * the ALUOp code 1
         */
        this.ALUOp1 = false;
        /**
         * the Memory write signal
         */
        this.MemWrite = false;
        /**
         * the ALU inpin32B source signal
         */
        this.ALUSrc = false;
        /**
         * The Register Write signal
         */
        this.RegWrite = false;
        /**
         * immediate code. will assign to ALU
         */
        this.ImCode = "0000";
    }
    /**
     * As the name indicates, this method will set 6bits Operation Code
     * @param code
     */
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
    /**
     * Memory watches the change of outPin32 and change the operation Code accordingly
     * @param conMem the Memory component
     */
    changeOp(conMem) {
        this.setOp(StringHandle_1.bitsMapping(conMem.getTextOutpin(), 26, 32));
    }
    /**
     * Add new Ins Code(new operation code) to reactive functions
     * @param code the new operation code that should be handled properly.
     * @returns
     */
    addedIns(code) {
        let decCode = StringHandle_1.bin2dec("00000000000000000000000000" + code, true);
        // if (decCode == )
        // jal
        if (decCode == 3) {
            this.RegDes = false;
            this.ALUSrc = true;
            this.MemtoReg = false;
            this.RegWrite = true;
            this.MemRead = false;
            this.MemWrite = false;
            this.Branch = false;
            this.ALUOp1 = false;
            this.ALUOp0 = false;
            this.Jump = true;
            return;
        }
    }
    /**
     * I-type instruction's reactive method.<br/>
     * The output signals will be set according to specific I-type code
     * @param code the operation code
     * @returns nothing
     */
    iType(code) {
        let decCode = StringHandle_1.bin2dec("00000000000000000000000000" + code, true);
        // addi addiu
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
        // bne
        if (decCode == 5) {
            this.RegDes = false;
            this.ALUSrc = false;
            this.MemtoReg = false;
            this.RegWrite = false;
            this.MemRead = false;
            this.MemWrite = false;
            this.Branch = true;
            this.ALUOp1 = true;
            this.ALUOp0 = true;
            this.Jump = false;
            this.ImCode = "0110";
            return;
        }
        // lui
        if (decCode == 15) {
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
            this.ImCode = "0010";
            return;
        }
        // andi
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
        // ori
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
        // slti sltiu
        if (decCode == 10 || decCode == 11) {
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
    /**
     * basic instruction's reactive method.<br/>
     * The output signals will be set according to specific operation code
     */
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
    /**
     * get 2-bits ALUOp in the form of an array
     * @returns a array of boolean
     */
    getALUOp() {
        return [this.ALUOp0, this.ALUOp1];
    }
    /**
     * get the immediate code
     * @returns the immediate code
     */
    getImcode() {
        return this.ImCode;
    }
    /**
     * get all output signals
     * @returns all output signals in the array of boolean
     */
    getAllSignal() {
        return [this.RegDes, this.Jump, this.Branch, this.MemRead, this.MemtoReg, this.ALUOp0, this.ALUOp1, this.MemWrite, this.ALUSrc, this.RegWrite];
    }
}
exports.ControlUnits = ControlUnits;
/**
 * Class ALUControl is an abstract model of ALU Control<br/>
 * The basic functionalities of ALU Control are implemented here
 */
class ALUControl {
    /**
     * initialize {@link ALU} and {@link _4OperationBits}
     * @param ALU the ALU that will be connected to this ALU Control
     */
    constructor(ALU) {
        /**
         * the ALUOp0, get from Control Unit
         */
        this.ALUOp0 = false;
        /**
         * the ALUOp1, get from Control Unit
         */
        this.ALUOp1 = false;
        /**
         * bne signal
         */
        this.bne = false; // bne signal
        // private controlUnits:ControlUnits;
        /**
         * the 6-bits operation code in the form of a string
         */
        this.InsCodeStr = "000000";
        /**
         * 6 bits function code
         */
        this.InsCode = new Array();
        // this.controlUnits = ConUni;
        this.ALU = ALU;
        this._4OperationBits = this.conLogic();
    }
    /**
     * As the name indicates, this method will set two ALUOp by getting ALUOp from input controlUnits
     * @param controlUnits the control units that connect to this alu control
     * @returns nothing
     */
    setALUOp(controlUnits) {
        [this.ALUOp0, this.ALUOp1] = controlUnits.getALUOp();
        this.bne = false;
        if (this.ALUOp0 && this.ALUOp1) {
            this._4OperationBits = controlUnits.getImcode();
            if (this._4OperationBits == "0110") {
                this.bne = true;
            }
            return;
        }
        this.conLogic();
    }
    /**
     * it's trivial that this method can set the {@link InsCode} and {@link InsCodeStr}
     * @param code the new 6bits code that will assign to {@link InsCode}
     */
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
        this.InsCodeStr = code;
        this.conLogic();
    }
    /**
     * get InsCode in the form of string
     * @returns a encoding string representing 6-bits inscode
     */
    getInsCodeStr() {
        return this.InsCodeStr;
    }
    /**
     * The logic of how {@link _4OperationBits} is set
     * @returns 4 Operation Bits
     */
    conLogic() {
        let operation0 = this.ALUOp1 && (this.InsCode[0] || this.InsCode[3]);
        let operation1 = !(this.ALUOp1 && this.InsCode[2]);
        let operation2 = (this.ALUOp1 && this.InsCode[1]) || this.ALUOp0;
        let operation3 = this.ALUOp0 && !this.ALUOp0;
        let operation = [BooleanHandler_1.bool2num(operation3), BooleanHandler_1.bool2num(operation2), BooleanHandler_1.bool2num(operation1), BooleanHandler_1.bool2num(operation0)];
        operation = this.newFunctCode(operation);
        return this._4OperationBits = StringHandle_1.intArrayToString(operation);
    }
    /**
     * Additional opCode
     * @param oriOpCode original opcode
     * @returns a number of binary integer which indicates a new 4 bits operation code
     */
    newFunctCode(oriOpCode) {
        // this.ALU.isUnsign = false;
        if (!this.ALUOp1 || this.ALUOp0) {
            return oriOpCode;
        }
        if (this.InsCode[0] && this.InsCode[1] && this.InsCode[2] && !this.InsCode[3] && !this.InsCode[4] && this.InsCode[5]) {
            return [1, 1, 0, 0];
        }
        if (this.InsCode[0] && !this.InsCode[1] && !this.InsCode[2] && !this.InsCode[3] && !this.InsCode[4] && this.InsCode[5]) {
            return [0, 0, 1, 0];
        }
        if (this.InsCode[0] && this.InsCode[1] && !this.InsCode[2] && this.InsCode[3] && !this.InsCode[4] && this.InsCode[5]) {
            // this.ALU.isUnsign = true;
            return [0, 1, 1, 1];
        }
        if (this.InsCode[0] && this.InsCode[1] && !this.InsCode[2] && !this.InsCode[3] && !this.InsCode[4] && this.InsCode[5]) {
            return [0, 1, 1, 0];
        }
        // sll
        if (!this.InsCode[0] && !this.InsCode[1] && !this.InsCode[2] && !this.InsCode[3] && !this.InsCode[4] && !this.InsCode[5]) {
            return [1, 1, 1, 0];
        }
        // srl
        if (!this.InsCode[0] && this.InsCode[1] && !this.InsCode[2] && !this.InsCode[3] && !this.InsCode[4] && !this.InsCode[5]) {
            return [1, 1, 1, 1];
        }
        // sra
        if (this.InsCode[0] && this.InsCode[1] && !this.InsCode[2] && !this.InsCode[3] && !this.InsCode[4] && !this.InsCode[5]) {
            return [1, 1, 0, 1];
        }
        // syscall
        if (!this.InsCode[0] && !this.InsCode[1] && this.InsCode[2] && this.InsCode[3] && !this.InsCode[4] && !this.InsCode[5]) {
            return [0, 0, 0, 0];
        }
        return oriOpCode;
    }
    /**
     * get 4 bits operation code
     * @returns 4 Operation Bits
     */
    getOperationCode() {
        return this._4OperationBits;
    }
}
exports.ALUControl = ALUControl;

},{"../Library/BooleanHandler":46,"../Library/StringHandle":47}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DFlipFlop = void 0;
const BooleanHandler_1 = require("../Library/BooleanHandler");
const NOT_1 = require("../Logic/NOT");
const Latch_1 = require("./Latch");
const Wired_1 = require("./Wired");
/**
 * Class DFlipFlop is an abstract model of real DFlipFlap
 * This is a down-edge trigger DFlipFlop,which means the data in D signal will only stored into this DFlipFlop when clock signal is changed from high to low<br/>
 * DFlipFlop is the basic unit of 32bits register.<br/>
 * 1 DFlipFlop can store 1 bit data
 */
class DFlipFlop extends Wired_1.Wired {
    /**
     * The constructor initializes all fields
     */
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
    /**
     * change the Dsignal of this FlipFlop
     */
    changeDSiganl() {
        this.DSiganl.changeSiganl();
        this.clockSigalKeep();
    }
    /**
     * set the DSignal
     * @param signal the signal that will assigned to DSignal
     */
    setDSiganl(signal) {
        this.DSiganl.setSignal(signal);
        this.clockSigalKeep();
    }
    /**
     * set the clock signal
     * @param signal the signal that will assigned to clock signal
     */
    setClockSiganl(signal) {
        this.clockSigal.setSignal(signal);
        this.clockSigalKeep();
    }
    /**
     * change the value of clock signal
     */
    changeClockSiganl() {
        this.clockSigal.changeSiganl();
        this.clockSigalKeep();
    }
    /**
     * get the value of DSignal
     * @returns the value of DSignal
     */
    getDSignal() {
        return this.DSiganl;
    }
    /**
     * keep the orignal clock signal and call corresponding reactive function
     */
    clockSigalKeep() {
        this.clockSigal.SignalKeep();
    }
    /**
     * get the outPinA of this DFlipFlop
     * @returns the value of outPinA of this DFlipFlop
     */
    getOutPinA() {
        return this.OutPinA;
    }
    /**
     * get the outPinB of this DFlipFlop
     * @returns the value of outPinB of this DFlipFlop
     */
    getOutPinB() {
        return this.OutPinB;
    }
}
exports.DFlipFlop = DFlipFlop;

},{"../Library/BooleanHandler":46,"../Logic/NOT":52,"./Latch":29,"./Wired":36}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionReporter = void 0;
/**
 * This class accepts singleton design pattern
 */
class ExceptionReporter {
    /**
     * the constructor is set to private. So this class can't be instantiated outside this class
     */
    constructor() {
        /**
         * an array of string which stores the exception information
         */
        this.ExceptionArray = new Array();
    }
    /**
     * get the instantiated object of an exception reportor
     * @returns the instantiated object of this class
     */
    static getReporter() {
        return this.exceptionReporter;
    }
    /**
     * Add a new exception information to {@link ExceptionArray}<br/>
     * This message will be passed to console and render on the screen
     * @param newExcp new exception information message
     */
    addException(newExcp) {
        this.ExceptionArray.push(newExcp);
    }
    /**
     * a boolean value which indicates whether the exception array is empty
     * @returns true if empty, false otherwise
     */
    isEmpty() {
        if (this.ExceptionArray.length == 0)
            return true;
        return false;
    }
    /**
     * report exception by passing exception messages to console
     */
    reportException() {
        return this.ExceptionArray;
    }
    /**
     * clear exceptions
     */
    clearException() {
        this.ExceptionArray = new Array();
    }
}
exports.ExceptionReporter = ExceptionReporter;
/**
 * the only instantiated object of this class.
 */
ExceptionReporter.exceptionReporter = new ExceptionReporter();

},{}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Latch = void 0;
const BooleanHandler_1 = require("../Library/BooleanHandler");
const AND_1 = require("../Logic/AND");
const NOT_1 = require("../Logic/NOT");
const OR_1 = require("../Logic/OR");
const Signal_1 = require("./Signal");
// import { Wirable } from "./Wirable";
/**
 * This class mimics an up-edge change Latch<br/>
 * Two Latches compose a DFlipFlop
 */
class Latch {
    /**
     * the constructor initializes all the fileds.
     */
    constructor() {
        // super();
        this.clockSignal = new Signal_1.Signal(false, this.Latch.bind(this));
        this.DSiganl = new Signal_1.Signal(false, this.Latch.bind(this));
        this.OutPinA = new Signal_1.Signal(false);
        this.OutPinB = new Signal_1.Signal(true);
    }
    /**
     * get the value of {@link OutPinA}
     * @returns the value of {@link OutPinA}
     */
    getOutPinA() {
        return this.OutPinA;
    }
    /**
     * get the value of {@link OutPinB}
     * @returns the value of {@link OutPinB}
     */
    getOutPinB() {
        return this.OutPinB;
    }
    /**
     * get DSinal of the Latch
     * @returns the value of {@link DSiganl}
     */
    getDSignal() {
        return this.DSiganl;
    }
    /**
     * get the clock signal of this Latch
     * @returns the value of {@link clockSignal}
     */
    getClockSignal() {
        return this.clockSignal;
    }
    /**
     * changes the value of DSignal
     */
    changeDSignal() {
        this.DSiganl.changeSiganl();
    }
    /**
     * change the value of clockSignal
     */
    changeClockSignal() {
        this.clockSignal.changeSiganl();
    }
    /**
     * the logic of Latch<br/>
     * the {@link OutPinA} and {@link OutPinB} will be set according to {@link DSignal} and {@link clockSignal}
     */
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

},{"../Library/BooleanHandler":46,"../Logic/AND":48,"../Logic/NOT":52,"../Logic/OR":54,"./Signal":34}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Memory = void 0;
const BItsGenerator_1 = require("../Library/BItsGenerator");
const StringHandle_1 = require("../Library/StringHandle");
const Signal_1 = require("./Signal");
/**
 * This class is an abstract model of real Memory component<br/>
 * A memory has two parts. The first part is instruction memory, the second part is data memory.
 */
class Memory {
    /**
     * the constructor initialize all the fields
     * @param MemorySize the size of this memory
     */
    constructor(MemorySize = Math.pow(2, 30)) {
        /**
         * when the {@link textOutpin} changes,all the notifying function stored in this array will be called.
         */
        this.notifyFuncText = new Array();
        /**
         * when the {@link outPin32} changes, all the  notifying function stored in this array will be called.
         */
        this.notifyFuncData = new Array();
        /**
         * the signal indicates read
         */
        this.readSignal = new Signal_1.Signal(false);
        /**
         * the signal indicates write
         */
        this.writeSignal = new Signal_1.Signal(false);
        /**
         * the clock signal of this memory
         */
        this.clockSignal = new Signal_1.Signal(false);
        /**
         * the added data
         */
        this.addedData = new Map();
        /**
         * the static data being added to this memory
         */
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
    /**
     * get the size of memory
     * @returns the size of memory
     */
    getMemorySize() {
        return this.MemorySize;
    }
    /**
     * add new instruction at designated address
     * @param data the data that will be added to the memory
     * @param addr the address of this added instruction
     * @returns the added data.
     */
    addInsAt(data, addr) {
        if ((addr % 4) != 0)
            throw Error("The Instruction Address must be multiple of 4!");
        if (addr >= Math.pow(16, 7) || addr < 4 * Math.pow(16, 5))
            throw Error("Instruction Index Cross 0x1000,0000 or below 0x 0040,0000");
        let retIns = this.MemoryArray[addr / 4];
        this.MemoryArray[addr / 4] = data;
        return retIns;
    }
    /**
     * set the address of added data
     * @param newAddr the address that will be set
     */
    setDataAddress(newAddr) {
        this.addressPin = newAddr;
        this.judgeReadCondition();
    }
    /**
     * get the current address of instruction
     * @returns the value of current address of instruction
     */
    getTextAddress() {
        return this.textReadAddress;
    }
    /**
     * set the current address of instruction
     * @param newAddr the text address that will be set
     */
    setTextAddress(newAddr) {
        this.dataFormatDetect(newAddr);
        this.textReadAddress = newAddr;
        this.textOutpin = this.readDataAt(this.textReadAddress);
        this.notifychange();
    }
    /**
     * set the data memory inPin32
     * @param newInpin the new binary value that will be assigned to inPin32
     * @returns nothing
     */
    setInpin32(newInpin) {
        if (this.inPin32 == newInpin)
            return;
        this.dataFormatDetect(newInpin);
        this.inPin32 = newInpin;
    }
    /**
     * get the machine code pointed by current instruction address
     * @returns the machine code pointed by current instruction address
     */
    getTextOutpin() {
        if (this.textOutpin == undefined)
            return BItsGenerator_1.init_bits(32);
        return this.textOutpin;
    }
    /**
     * whether the current instruction address is pointed at the end of instruction memory
     * @returns a boolean value indicates whether the current instruction address is pointed at the end of instruction memory
     */
    isEnd() {
        if (this.textOutpin == undefined)
            return true;
        return false;
    }
    /**
     * detect whether the input value is in correct format
     * @param binData the data that should be detected
     */
    dataFormatDetect(binData) {
        if (binData.length != 32)
            throw Error("The length of data in memory is not 32 bits");
        StringHandle_1.binaryDetect(binData);
    }
    /**
     * read data at designated index
     * @param binIndex the index in binary form
     * @returns the data at designated index
     */
    readDataAt(binIndex) {
        return this.MemoryArray[Math.floor(StringHandle_1.bin2dec(this.textReadAddress, true) / 4)];
    }
    /**
     * the logic if read data
     */
    readData() {
        let address = StringHandle_1.bin2dec(this.addressPin, true);
        let data1 = this.MemoryArray[Math.floor(address / 4)];
        let data2 = this.MemoryArray[Math.floor(address / 4) + 1];
        if (data2 == undefined) {
            data2 = BItsGenerator_1.init_bits(32);
        }
        this.setOutPin32(data1.slice(8 * (address % 4)) + data2.slice(0, (address % 4)));
    }
    /**
     * the logic of write data
     */
    writeData() {
        let address = StringHandle_1.bin2dec(this.addressPin, true);
        let data1 = this.MemoryArray[Math.floor(address / 4)];
        let data2 = this.MemoryArray[Math.floor(address / 4) + 1];
        let has2 = (address % 4 == 0) ? false : true;
        if (data1 == undefined) {
            data1 = BItsGenerator_1.init_bits(32);
        }
        if (data2 == undefined) {
            data2 = BItsGenerator_1.init_bits(32);
        }
        data1 = data1.slice(0, 8 * (address % 4)) + this.inPin32.slice(0, 8 * (4 - (address % 4)));
        data2 = this.inPin32.slice(8 * (4 - (address % 4))) + data2.slice(8 * (address % 4));
        this.MemoryArray[Math.floor(address / 4)] = data1;
        if (has2) {
            this.MemoryArray[Math.floor(address / 4) + 1] = data2;
            this.addedData.set(StringHandle_1.decToUnsignedBin32(Math.floor(address / 4) * 4), data1);
            this.addedData.set(StringHandle_1.decToUnsignedBin32(Math.floor(address / 4) * 4 + 4), data2);
        }
        else {
            this.addedData.set(this.addressPin, this.inPin32);
        }
    }
    /**
     * change the clock signal of this memory
     */
    clockSiganlChange() {
        this.clockSignal.changeSiganl();
        this.dataReact();
    }
    /**
     * set the clock signal of this memory
     * @param signal the new signal that will be assigned to clock signal of the memory
     * @returns nothing
     */
    setclockSiganl(signal) {
        if (this.isSignalSame(signal))
            return;
        this.clockSignal.setSignal(signal);
        this.dataReact();
    }
    /**
     * if the signal does not change,return true,false otherwise
     * @param signal the signal that will be detect changes
     * @returns a boolean value indicates whether the input signal changes
     */
    isSignalSame(signal) {
        if (this.clockSignal.getSignal() == signal)
            return true;
        return false;
    }
    /**
     * the logic if react to data changes
     * @returns
     */
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
    /**
     * call all the notifying instruction change functions stored
     */
    notifychange() {
        this.notifyFuncText.forEach(FuncText => {
            FuncText();
        });
    }
    /**
     * add a new instruction memory change notifying function
     * @param newFunc the new instruction notifying function that will be added.
     */
    addTextNotifyFunc(newFunc) {
        this.notifyFuncText.push(newFunc);
    }
    /**
     * call all the notifying data memory change functions stored
     */
    dataChange() {
        this.notifyFuncData.forEach(FuncData => {
            FuncData();
        });
    }
    /**
     * add a new data memory change notifying function
     * @param newFunc the new data memory change notifying function that will be added.
     */
    addDataNotifyFunc(newFunc) {
        this.notifyFuncData.push(newFunc);
    }
    /**
     * set the outPin32
     * @param newOutPin32 the binary sring that will be assigned to {@link outPin32}
     * @returns nothing
     */
    setOutPin32(newOutPin32) {
        this.outPin32 = newOutPin32;
        if (newOutPin32 == undefined)
            return;
        this.dataChange();
    }
    /**
     * get {@link outPin32}
     * @returns the value of {@link outPin32}
     */
    getOutPin32() {
        return this.outPin32;
    }
    /**
     * set {@link readSignal} and {@link writeSignal}
     * @param ReadEn the new {@link readSignal} that will be set
     * @param WriteEn the new {@link writeSignal} that will be set
     */
    setReadWriteEnable(ReadEn, WriteEn) {
        this.readSignal.setSignal(ReadEn);
        this.judgeReadCondition();
        this.writeSignal.setSignal(WriteEn);
        this.dataChange();
    }
    /**
     * judge whether the memory meets the conditions of read data
     */
    judgeReadCondition() {
        if (this.readSignal.getSignal()) {
            this.readData();
        }
        else {
            this.setOutPin32(undefined);
        }
    }
    /**
     * get all added data in the memory
     * @returns a map of address data pair
     */
    getAddedData() {
        return this.addedData;
    }
    /**
     * store static data in the form of a word
     * @param datum the 32 bits static data that will be stored in the memory
     */
    storeWordStaticData(datum) {
        let staticDataIndex = +datum[0] / 4;
        this.staticData.set(StringHandle_1.decToUnsignedBin32(+datum[0]), datum[1]);
        this.MemoryArray[staticDataIndex] = datum[1];
    }
    /**
     * store static data in the form of a byte
     * @param datum the 8 bits static data that will be stored in the memory
     */
    storeByteStaticData(datum) {
        let staticDataIndex = Math.floor(+datum[0] / 4);
        let position = +datum[0] % 4;
        let data1 = this.MemoryArray[staticDataIndex];
        if (data1 == undefined) {
            data1 = BItsGenerator_1.init_bits(32);
        }
        data1 = data1.slice(0, 8 * (3 - position)) + datum[1] + data1.slice(8 * (3 - position) + 8, 32);
        this.MemoryArray[staticDataIndex] = data1;
        this.staticData.set(StringHandle_1.decToUnsignedBin32(staticDataIndex * 4), data1);
    }
    /**
     * get all stored static data.
     * @returns a map of address data pair
     */
    getStaticData() {
        return this.staticData;
    }
    /**
     * get 8 bits character
     * @param addr the address of that char
     * @returns the char.
     */
    CharAt(addr) {
        let rtn = this.MemoryArray[Math.floor(addr / 4)];
        let position = addr % 4;
        if (rtn == undefined) {
            rtn = BItsGenerator_1.init_bits(32);
        }
        rtn = rtn.slice(position * 8, position * 8 + 8);
        return rtn;
    }
}
exports.Memory = Memory;

},{"../Library/BItsGenerator":45,"../Library/StringHandle":47,"./Signal":34}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._32BitsRegister = void 0;
const BooleanHandler_1 = require("../Library/BooleanHandler");
const StringHandle_1 = require("../Library/StringHandle");
const DFlipFlop_1 = require("./DFlipFlop");
const Signal_1 = require("./Signal");
/**
 * This class is an abstract model of 32 bits register<br/>
 * The fileds of this class contain all the necessary data of a register<br/>
 * The methods of this class implement basic functionalities of a register
 */
class _32BitsRegister {
    /**
     * constructor initializes all DFFs
     */
    constructor() {
        /**
         * The 32bits output Pin of this register
         */
        this.outPin32 = "00000000000000000000000000000000";
        /**
         * The clock signal of this register
         */
        this.clockSignal = new Signal_1.Signal(false);
        this.DFFs = new Array();
        for (let i = 0; i < _32BitsRegister.bitsCount; ++i) {
            this.DFFs[i] = new DFlipFlop_1.DFlipFlop();
        }
    }
    /**
     * set the inPin32 of this register
     * @param newInPins the new binary string that will be assigned to this register.
     */
    setInpin32(newInPins) {
        this.inputDetect(newInPins);
        this.inPin32 = newInPins;
        this.setDSiganls();
        // this.setOutpin32();
    }
    /**
     * reset the inPin32 of this register
     */
    resetInput() {
        this.inPin32 = undefined;
        this.resetDSignals();
    }
    /**
     * reset the Dsignal of all DFFs
     */
    resetDSignals() {
        let bits = StringHandle_1.stringToIntArray(this.outPin32);
        this.DFFs.forEach(DFF => {
            DFF.setDSiganl(BooleanHandler_1.num2bool(bits.shift()));
        });
    }
    /**
     * change the value of clock signal
     */
    changeClockSignal() {
        this.clockSignal.changeSiganl();
        this.DFFs.forEach(DFF => {
            DFF.changeClockSiganl();
        });
        this.setOutpin32();
    }
    /**
     * set the value of this clock signal
     * @param signal the new value that will be assigned to clock signal of this register
     */
    setClockSignal(signal) {
        if (typeof signal == "number")
            signal = BooleanHandler_1.num2bool(signal);
        this.clockSignal.setSignal(signal);
        this.DFFs.forEach(DFF => {
            DFF.setClockSiganl(signal);
        });
        this.setOutpin32();
    }
    /**
     * detect the value of input
     * @param input the input string
     */
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
    /**
     * set the DSignals of DFFs
     * @returns nothing
     */
    setDSiganls() {
        if (this.inPin32 == undefined)
            return;
        let bits = StringHandle_1.stringToIntArray(this.inPin32);
        this.DFFs.forEach(DFF => {
            DFF.setDSiganl(BooleanHandler_1.num2bool(bits.shift()));
        });
    }
    /**
     * set the value of {@link outPin32}
     */
    setOutpin32() {
        let OutPins = new Array();
        this.DFFs.forEach(flipflop => {
            OutPins.push(BooleanHandler_1.bool2num(flipflop.getOutPinA().getSignal()));
        });
        this.outPin32 = StringHandle_1.intArrayToString(OutPins);
    }
    /**
     * get inPin32
     * @returns the value of {@link inPin32}
     */
    getinPin32() {
        return this.inPin32;
    }
    /**
     * get the outPin32 of this register.
     * @returns the value of {@link outPin32}
     */
    getOutPin32() {
        return this.outPin32;
    }
    /**
     * get the clock signal of this register
     * @returns the clock signal of this register
     */
    getClockSignal() {
        return this.clockSignal;
    }
}
exports._32BitsRegister = _32BitsRegister;
/**
 * The number of bits in this register
 */
_32BitsRegister.bitsCount = 32;

},{"../Library/BooleanHandler":46,"../Library/StringHandle":47,"./DFlipFlop":27,"./Signal":34}],32:[function(require,module,exports){
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
/**
 * A register File is an array of 32 registers<br/>
 * This class is the abstract model of a real register file
 */
class RegisterFile extends Wired_1.Wired {
    /**
     * initialize all fields of this class
     */
    constructor() {
        super();
        /**
         * the data being read at this outPin
         */
        this.outDataA = "";
        /**
         * the data being read at this outPin
         */
        this.outDataB = "";
        /**
         * An array of 32 registers. The data is stored here
         */
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
    /**
     * Store data at the register indicates by index.<br/>
     * @param index the index of register that will store new data
     * @param datum the datum being stored
     */
    storeADataAt(index, datum) {
        this.registers[index].setInpin32(datum);
        this.registers[index].changeClockSignal();
        this.registers[index].changeClockSignal();
    }
    /**
     * get the outPinA
     * @returns the value of outPinA
     */
    getOutDataA() {
        return this.outDataA;
    }
    /**
     * get the outPinB
     * @returns the value of outPinB
     */
    getOutDataB() {
        return this.outDataB;
    }
    /**
     * set write enable signal
     * @param siganl the new signal
     */
    setWriteEnable(siganl) {
        this.writeEnable.setSignal(siganl);
        this.registerWrite();
    }
    /**
     * set data being written into register
     * @param data the data that will be stored in the register
     */
    setWriteData(data) {
        this.writeData = data;
        this.registerWrite();
    }
    /**
     * set register destination signal
     * @param signal the new signal
     */
    setRegDes(signal) {
        this.WriteMux.setSel(BooleanHandler_1.bool2num(signal));
        this.writeNumber = this.WriteMux.outPin32.slice(27, 32);
    }
    /**
     * change the value of clock signal
     */
    changeClockSignal() {
        this.clockSignal.changeSiganl();
        this.registers.forEach(register => {
            register.changeClockSignal();
        });
    }
    /**
     * set the value of clock signal
     * @param signal the new signal that will be assigned to clock signal
     */
    setClockSignal(signal) {
        this.clockSignal.setSignal(signal);
        this.registers.forEach(register => {
            register.setClockSignal(signal);
        });
    }
    /**
     * memory set the read number A and B's value
     * @param InsMem the Memory component that will change the value of read number
     */
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
    /**
     * set two write index of mux
     * @param InpinA the first inpin
     * @param InpinB the second inpin
     */
    setWriteNumber(InpinA, InpinB) {
        this.WriteMux.setInpin32A("000000000000000000000000000" + InpinA);
        this.WriteMux.setInpin32B("000000000000000000000000000" + InpinB);
        this.writeNumber = this.WriteMux.outPin32.slice(27, 32);
    }
    /**
     * the logic of register read
     */
    registerRead() {
        let data = new Array();
        this.registers.forEach(register => {
            data.push(register.getOutPin32());
        });
        this.outDataA = this.Mux32Way32(this.readNumberA, data);
        this.outDataB = this.Mux32Way32(this.readNumberB, data);
    }
    /**
     * the logic of register write
     * @returns nothing
     */
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
    /**
     * mux32way32
     * @param index the 5-bits selector
     * @param data the 32 input data of mux32way32
     * @returns
     */
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
    /**
     * get all the registers
     * @returns all registers
     */
    getRegisters() {
        return this.registers;
    }
    /**
     * get the write number
     * @returns a binary string represents write number
     */
    getWriteNumber() {
        return this.writeNumber;
    }
}
exports.RegisterFile = RegisterFile;
/**
 * the readNumber and writeNumber bitWidth
 */
RegisterFile.bitWidth = 5;

},{"../Conponent/DMux4Way":38,"../Conponent/DMux8Way":39,"../Conponent/Mux32":41,"../Conponent/Mux4Way32":42,"../Conponent/Mux8Way32":43,"../Library/BItsGenerator":45,"../Library/BooleanHandler":46,"../Library/StringHandle":47,"./Register":31,"./Signal":34,"./Wired":36}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignExtend = void 0;
const BItsGenerator_1 = require("../Library/BItsGenerator");
const StringHandle_1 = require("../Library/StringHandle");
/**
 * This class is the abstract model of a real sign extend componet
 */
class SignExtend {
    /**
     * The construcor initializes all the fields
     */
    constructor() {
        /**
         * the operation code will decides how the input data being sign extended
         */
        this.opCode = BItsGenerator_1.init_bits(6);
        this.inPin16 = "0000000000000000";
        this.outPin32 = "";
        this.signExtend([false, false]);
    }
    /**
     * set the 16bits inPin and set the outPin32 accordingto ALUOp
     * @param inPin the 16bits input Pin
     * @param ALUOp the ALUOp
     */
    setInPin16(inPin, ALUOp) {
        if (inPin.length != 16)
            throw Error("Sign Extend Input length is not 16.");
        StringHandle_1.binaryDetect(inPin);
        this.inPin16 = inPin;
        this.signExtend(ALUOp);
    }
    /**
     * the logic of sign extend.
     * @param ALUOp the ALUOp
     * @returns nothing
     */
    signExtend(ALUOp) {
        if (this.opCode == "001111") {
            this.outPin32 = this.inPin16 + "0000000000000000";
            return;
        }
        if (this.inPin16.charAt(0) == '0' || (ALUOp[0] && ALUOp[1] && this.opCode != "000101" && this.opCode != "001010" && this.opCode != "001011")) {
            this.outPin32 = "0000000000000000" + this.inPin16;
            return;
        }
        if (this.inPin16.charAt(0) == '1') {
            this.outPin32 = "1111111111111111" + this.inPin16;
        }
    }
    /**
     * get the OutPin32 of this SignExtend class
     * @returns the value of {@link outPin32}
     */
    getOutPin32() {
        return this.outPin32;
    }
}
exports.SignExtend = SignExtend;

},{"../Library/BItsGenerator":45,"../Library/StringHandle":47}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signal = void 0;
const BooleanHandler_1 = require("../Library/BooleanHandler");
/**
 * Class Signal is an abstract model for pin signal
 */
class Signal {
    //debug
    // public name:string="";
    /**
     * the constructor initializes the value of this signal and set the reactive function
     * @param signal the initial value of this signal class
     * @param reactFunc the initial reactive function
     */
    constructor(signal, reactFunc = function () { }) {
        this.signal = signal;
        this.reactFunc = reactFunc;
        this.notifyChangeFuncs = new Array();
    }
    /**
     * get the value of this signal
     * @returns the value of this signal
     */
    getSignal() {
        return this.signal;
    }
    /**
     * change the value of this signal
     */
    changeSiganl() {
        if (typeof this.signal === "boolean")
            this.signal = !this.signal;
        if (typeof this.signal === "number")
            this.signal = BooleanHandler_1.bool2num(!BooleanHandler_1.num2bool(this.signal));
        this.SignalKeep();
    }
    /**
     * set tje react Function of this signal
     * @param reactFunc the reactive function being set
     */
    setReactFunc(reactFunc) {
        this.reactFunc = reactFunc;
    }
    /**
     * set the value of this signal
     * @param signal the new value being set
     */
    setSignal(signal) {
        this.signal = signal;
        this.SignalKeep();
    }
    /**
     * keey the original signal
     */
    SignalKeep() {
        this.notifyChange();
        this.reactFunc();
    }
    /**
     * Add a new notifying function to this signal object
     * @param notifychangeFunc a new notifying signal
     */
    addNotifyChangeFunc(notifychangeFunc) {
        this.notifyChangeFuncs.push(notifychangeFunc);
    }
    /**
     * if the value of this signal changes, call all the notifying method in this {@link notifyChangeFuncs}
     * @returns
     */
    notifyChange() {
        if (this.notifyChangeFuncs.length === 0)
            return;
        this.notifyChangeFuncs.forEach(changeFuncs => {
            changeFuncs();
        });
    }
    /**
     * synchronize signal
     * @param changedSignal the changed signal
     * @param LogicFunc the calling function
     */
    syncSignal(changedSignal, LogicFunc) {
        this.setSignal(LogicFunc(changedSignal.getSignal()));
    }
}
exports.Signal = Signal;

},{"../Library/BooleanHandler":46}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wire = void 0;
/**
 * Class Wire is the base class for DFlipFlop and Register<br/>
 * if two components are connected by a wire object, then if the some values of component wrapped at changePin changes,
 * the component connected to reactPin will call reactive functions to change its state.
 */
class Wire {
    /**
     * initialize a wire and add a notifying function
     * @param changePin the changing signal
     * @param reactPin the signal that should react to the change
     * @param LogicFunc the notifying function
     */
    constructor(changePin, reactPin, LogicFunc = function (signal) { return signal; }) {
        this.changePin = changePin;
        this.reactPin = reactPin;
        this.reactPin.setSignal(LogicFunc(this.changePin.getSignal()));
        this.changePin.addNotifyChangeFunc(this.reactPin.syncSignal.bind(this.reactPin, this.changePin, LogicFunc));
    }
}
exports.Wire = Wire;

},{}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wired = void 0;
const Wire_1 = require("./Wire");
/**
 * Wrapper class for Wire<br/>
 * if a component is connected by wire, it should only extends this class
 */
class Wired {
    constructor() {
        this.Wires = new Array();
    }
    /**
     * Add a wire to the {@link Wires}
     * @param changeSignal the signal that changes
     * @param reactSiganl this signal that should react to changes
     * @param LogicFunc the reactive function
     */
    addWire(changeSignal, reactSiganl, LogicFunc) {
        let newWire = (LogicFunc === undefined) ? new Wire_1.Wire(changeSignal, reactSiganl) : new Wire_1.Wire(changeSignal, reactSiganl, LogicFunc);
        this.Wires.push(newWire);
    }
}
exports.Wired = Wired;

},{"./Wire":35}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DMux = void 0;
const AND_1 = require("../Logic/AND");
const NOT_1 = require("../Logic/NOT");
/**
 * This is the Demultiplexer in the cpu circuits<br/>
 * The class simulates how Demultiplexer works and fulfills some basic function of it<br/>
 * Note this is a 2-way Dmux
 */
class DMux {
    /**
     * The constructor initializes inpin and select and set two outPin accordingly<br/>
     * if set to 0, outpin1 = inpin,outpin2 = 0<br/>
     * if set to 1, outpin1 = 0,outpin2 = inpin
     * @param inPin the initial value of inpin
     * @param Select the initial value of selector
     */
    constructor(inPin, Select) {
        this.inPin = inPin;
        this.sel = Select;
        let temp = [];
        temp = DMux.DMux(this.inPin, this.sel);
        this.outPin1 = temp[0];
        this.outPin2 = temp[1];
    }
    /**
     * This is a static function that imitate how dmux works and thus can give correct output according to its input
     * @param inPin the inpin
     * @param Select the selector
     * @returns a array of integer. the first entry in this array is the outcome of outpin1 and the second is that of outpin2.
     */
    static DMux(inPin, Select) {
        let temp = [];
        let nots = new NOT_1.NOT(Select);
        temp.push(AND_1.AND.And(nots.outpin, inPin));
        temp.push(AND_1.AND.And(Select, inPin));
        return temp;
    }
}
exports.DMux = DMux;

},{"../Logic/AND":48,"../Logic/NOT":52}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DMux4Way = void 0;
const DMux_1 = require("./DMux");
const StringHandle_1 = require("../Library/StringHandle");
/**
 * This is the 4-way-Demultiplexer in the cpu circuits<br/>
 * The class simulates how Demultiplexer works and fulfills some basic function of it<br/>
 * Note this is a 4-way Dmux
 */
class DMux4Way {
    /**
     * The constructor initializes inpin and encoding elect and set encoding outPin accordingly<br/>
     * if set to 00, outpin1 = inpin,outpin2-4 = 0<br/>
     * if set to 01, outpin2 = inpin,outpin1,3,4 = 0<br/>
     * if set to 10, outpin3 = inpin,outpin1,2,4 = 0<br/>
     * if set to 11, outpin4 = inpin,outpin1-3 = 0
     * @param inPin the initial value of inpin
     * @param Select the initial encoding string of selector
     */
    constructor(inPin, Select) {
        this.inPin = inPin;
        this.sel = Select;
        this.outPin = StringHandle_1.intArrayToString(DMux4Way.DMux4Way(this.inPin, StringHandle_1.stringToIntArray(this.sel)));
    }
    /**
     * This method implements the 4way-dmux by combine two 2way dmux and add a new selector to determine which 2way-dmux's output is set to output
     * @param inPin the inpin number
     * @param Select the encoding selector
     * @returns a array of 4 number that indicates 4 outpin respectively
     */
    static DMux4Way(inPin, Select) {
        let temp = [];
        let dmux1 = new DMux_1.DMux(inPin, Select[0]);
        temp = DMux_1.DMux.DMux(dmux1.outPin1, Select[1]).concat(DMux_1.DMux.DMux(dmux1.outPin2, Select[1]));
        return temp;
    }
}
exports.DMux4Way = DMux4Way;

},{"../Library/StringHandle":47,"./DMux":37}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DMux8Way = void 0;
const DMux_1 = require("./DMux");
const DMux4Way_1 = require("./DMux4Way");
const StringHandle_1 = require("../Library/StringHandle");
/**
 * This is the 8-way-Demultiplexer in the cpu circuits<br/>
 * The class simulates how Demultiplexer works and fulfills some basic function of it<br/>
 * Note this is a 8-way Dmux
 */
class DMux8Way {
    /**
     * The constructor initializes inpin and encoding elect and set encoding outPin accordingly<br/>
     * if set to 000, outpin1 = inpin,other outpin = 0<br/>
     * if set to 001, outpin2 = inpin,other outpin = 0<br/>
     * if set to 010, outpin3 = inpin,other outpin = 0<br/>
     * if set to 011, outpin4 = inpin,other outpin = 0<br/>
     * if set to 100, outpin5 = inpin,other outpin = 0<br/>
     * if set to 101, outpin6 = inpin,other outpin = 0<br/>
     * if set to 110, outpin7 = inpin,other outpin = 0<br/>
     * if set to 111, outpin8 = inpin,other outpin = 0<br/>
     * @param inPin the initial value of inpin
     * @param Select the initial encoding string of selector
     */
    constructor(inPin, Select) {
        this.inPin = inPin;
        this.sel = Select;
        this.outPin = StringHandle_1.intArrayToString(DMux8Way.DMux8Way(this.inPin, StringHandle_1.stringToIntArray(this.sel)));
    }
    /**
     * This method implements the 8way-dmux by combine two 4way dmux and add a new selector to determine which 4way-dmux's output is set to output
     * @param inPin the inpin number
     * @param Select the encoding selector
     * @returns a array of 8 number that indicates 8 outpin respectively
     */
    static DMux8Way(inPin, Select) {
        let temp = [];
        let dmux1 = new DMux_1.DMux(inPin, Select[0]);
        temp = DMux4Way_1.DMux4Way.DMux4Way(dmux1.outPin1, Select.slice(1, 3)).concat(DMux4Way_1.DMux4Way.DMux4Way(dmux1.outPin2, Select.slice(1, 3)));
        return temp;
    }
}
exports.DMux8Way = DMux8Way;

},{"../Library/StringHandle":47,"./DMux":37,"./DMux4Way":38}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mux = void 0;
const AND_1 = require("../Logic/AND");
const NOT_1 = require("../Logic/NOT");
const OR_1 = require("../Logic/OR");
/**
 * This is the Multiplexer in the cpu circuits<br/>
 * The class simulates how Multiplexer works and fulfills some basic function of it<br/>
 * Note this is a 2-way Mux
 */
class Mux {
    /**
    * The constructor initializes inpin1,inpin2 and select and set the outPin accordingly<br/>
    * if set to 0, outpin = inpin1<br/>
    * if set to 1, outpin = inpin2
    * @param inPin1 the initial value of inpin1
    * @param inPin2 the initial value of inpin2
    * @param Select the initial value of selector
    */
    constructor(inPin1, inPin2, Select) {
        this.inPin1 = inPin1;
        this.inPin2 = inPin2;
        this.sel = Select;
        this.outPin = Mux.Mux(this.inPin1, this.inPin2, this.sel);
    }
    /**
     * This is a static function that imitate how mux works and thus can give correct output according to its input
     * @param inPin1 the inpin1
     * @param inPin1 the inpin2
     * @param Select the selector
     * @returns a number which indicates what the outpin will be set according to the inputs
     */
    static Mux(inPin1, inPin2, Select) {
        let nots = new NOT_1.NOT(Select);
        let and1 = new AND_1.AND(inPin2, Select);
        let and2 = new AND_1.AND(inPin1, nots.outpin);
        return OR_1.OR.Or(and1.outpin, and2.outpin);
    }
}
exports.Mux = Mux;

},{"../Logic/AND":48,"../Logic/NOT":52,"../Logic/OR":54}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mux32 = void 0;
const StringHandle_1 = require("../Library/StringHandle");
const Mux_1 = require("./Mux");
/**
 * This is the 32bits Multiplexer in the cpu circuits<br/>
 * The class simulates how 32bits Multiplexer works and fulfills some basic function of it<br/>
 * Note this is a 2-way 32bits Mux
 */
class Mux32 {
    /**
    * The constructor initializes inpin32A,inpin32B and select and set the outPin32 accordingly<br/>
    * if set to 0, {@link outPin32} = {@link inPin32A}<br/>
    * if set to 1, {@link outPin32} = {@link inPin32B}<br/>
    * the {@link outPin32} is set by static method {@link Mux32}
    * @param inSignalA the initial binary string of inpin32A
    * @param inSignalB the initial binary string of inpin32B
    * @param Select the initial value of selector
    */
    constructor(inSignalA, inSignalB, Select) {
        /**
         * a notify function is the function should be called when the value of outpin32 changed<br/>
         * This implements a observer design pattern
         */
        this.notifyFunc = new Array();
        this.inPin32A = inSignalA;
        this.inPin32B = inSignalB;
        this.sel = Select;
        let bitA = StringHandle_1.stringToIntArray(this.inPin32A);
        let bitB = StringHandle_1.stringToIntArray(this.inPin32B);
        this.outPin32 = StringHandle_1.intArrayToString(Mux32.Mux32(bitA, bitB, this.sel));
    }
    /**
     * This is a static method that imitate how mux32 works and thus can give correct output according to its input
     * @param inSignalA an array of integers that represents a 32bits binary data
     * @param inSignalB an array of integers that represents a 32bits binary data
     * @param Select the selector
     * @returns an array of integers which indicates what the outpin32 will be set according to two inputs
     */
    static Mux32(inSignalA, inSignalB, Select) {
        let i = 0;
        let outPin = [];
        inSignalA.forEach((bit) => {
            outPin.push(Mux_1.Mux.Mux(bit, inSignalB[i], Select));
            ++i;
        });
        return outPin;
    }
    /**
     * This method set the {@link inPin32A}.<br/>
     * Note that the output32 will be refreshed once the {@link inPin32A} being set.
     * @param newInPin the 32bits binary string that will be assigned to {@link inPin32A}
     */
    setInpin32A(newInPin) {
        this.inPin32A = newInPin;
        this.setOutPin();
    }
    /**
     * The Memory and PCAdder components assign combination of part of their outpin bits to {@link inpin32B}
     * @param _Memory the {@link Memory} components
     * @param _PCAdder the pc {@link Adder} components
     */
    memSetInpin32B(_Memory, _PCAdder) {
        let newInpin = StringHandle_1.bitsMapping(_PCAdder.getOutput(), 28, 32) + StringHandle_1.bitsMapping(StringHandle_1.shiftLeftBinary32Bits(_Memory.getTextOutpin()), 0, 28);
        this.setInpin32B(newInpin);
    }
    /**
     * The Memory components assigns part of its outpin bits to {@link inPin32B}
     * @param _Memory a {@link Memory} object that will set {@link inpin32B} of this {@link Mux32} component.
     * @returns void
     */
    dataMemSetInpin32B(_Memory) {
        if (_Memory.getOutPin32() == undefined)
            return;
        this.setInpin32B(_Memory.getOutPin32());
    }
    /**
     * This method set the {@link inpin32B}.<br/>
     * Note that the output32 will be refreshed once the {@link inpin32B} being set.
     * @param newInPin the 32bits binary string that will be assigned to {@link inpin32B}
     */
    setInpin32B(newInPin) {
        this.inPin32B = newInPin;
        this.setOutPin();
    }
    /**
     * The {@link inpin32A} is set by another {@link Mux32} component
     * @param MUX the {@link Mux32} component that will set this {@link Mux32}'s {@link inpin32A}
     */
    setMuxInpin32A(MUX) {
        this.setInpin32A(MUX.outPin32);
    }
    /**
     * This method set the selector of this Mux32 component.
     * @param newSel the new selector signal that will be assigned to this {@link Mux32}'s {@link sel}
     */
    setSel(newSel) {
        this.sel = newSel;
        this.setOutPin();
    }
    /**
     * This method set the {@link outPin32} of this {@link Mux32} component according to
     * {@link inPin32A} and {@link inPin32B} and {@link sel}
     */
    setOutPin() {
        this.outPin32 = StringHandle_1.intArrayToString(Mux32.Mux32(StringHandle_1.stringToIntArray(this.inPin32A), StringHandle_1.stringToIntArray(this.inPin32B), this.sel));
        this.notifychange();
    }
    /**
     * This method calls all the notifying functions stored in {@link notifyFunc}<br/>
     * Note that this is an obeserver design pattern
     */
    notifychange() {
        this.notifyFunc.forEach(Func => {
            Func();
        });
    }
    /**
     * This method adds a new notifying function to {@link notifyFunc}<br/>
     * When the {@link outPin32} changes, the functions stored in {@link notifyFunc} will be called.
     * @param newFunc a new notifying function
     */
    addNotifyFunc(newFunc) {
        this.notifyFunc.push(newFunc);
    }
}
exports.Mux32 = Mux32;

},{"../Library/StringHandle":47,"./Mux":40}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mux4Way32 = void 0;
const Mux32_1 = require("./Mux32");
const StringHandle_1 = require("../Library/StringHandle");
/**
 * This is the 4-way 32bits Multiplexer in the cpu circuits<br/>
 * The class simulates how 32bits Multiplexer works and fulfills some basic function of it<br/>
 * Note this is a 4-way 32bits Mux
 */
class Mux4Way32 {
    /**
     * The constructor initializes all inpin32 and select and set the outPin32 accordingly<br/>
     * if set to 00, {@link outPin32} = {@link inPin32}[0]<br/>
     * if set to 01, {@link outPin32} = {@link inPin32}[1]<br/>
     * if set to 10, {@link outPin32} = {@link inPin32}[2]<br/>
     * if set to 11, {@link outPin32} = {@link inPin32}[3]
     * the {@link outPin32} is set by static method {@link Mux4Way32}
     * @param inSignal a array of four initial binary string for four inpin pins stored in {@link inPin32}
     * @param Select the initial encoding string of selector
     */
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
    /**
     * This method implements the 4way-mux32 by combine two 2way-mux32 and add a new selector to determine which 2way-mux32's output is set to output
     * @param inPin an array of arrays of integers that represents four 32bits binary data
     * @param Select2Way the 2 way selector
     * @returns an array of integers which indicates what the {@link outPin32} will be set.
     */
    static Mux4Way32(inPin, Select2Way) {
        let mux32A = new Mux32_1.Mux32(StringHandle_1.intArrayToString(inPin[0]), StringHandle_1.intArrayToString(inPin[1]), Select2Way[1]);
        let mux32B = new Mux32_1.Mux32(StringHandle_1.intArrayToString(inPin[2]), StringHandle_1.intArrayToString(inPin[3]), Select2Way[1]);
        return Mux32_1.Mux32.Mux32(StringHandle_1.stringToIntArray(mux32A.outPin32), StringHandle_1.stringToIntArray(mux32B.outPin32), Select2Way[0]);
    }
}
exports.Mux4Way32 = Mux4Way32;

},{"../Library/StringHandle":47,"./Mux32":41}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mux8Way32 = void 0;
const Mux4Way32_1 = require("./Mux4Way32");
const Mux32_1 = require("./Mux32");
const StringHandle_1 = require("../Library/StringHandle");
/**
 * This is the 8-way 32bits Multiplexer in the cpu circuits<br/>
 * The class simulates how 32bits Multiplexer works and fulfills some basic function of it<br/>
 * Note this is a 8-way 32bits Mux
 */
class Mux8Way32 {
    /**
     * The constructor initializes all inpin32 and select and set the outPin32 accordingly<br/>
     * if set to 000, {@link outPin32} = {@link inPin32}[0]<br/>
     * if set to 001, {@link outPin32} = {@link inPin32}[1]<br/>
     * if set to 010, {@link outPin32} = {@link inPin32}[2]<br/>
     * if set to 011, {@link outPin32} = {@link inPin32}[3]<br/>
     * if set to 100, {@link outPin32} = {@link inPin32}[4]<br/>
     * if set to 101, {@link outPin32} = {@link inPin32}[5]<br/>
     * if set to 110, {@link outPin32} = {@link inPin32}[6]<br/>
     * if set to 111, {@link outPin32} = {@link inPin32}[7]<br/>
     * the {@link outPin32} is set by static method {@link Mux8Way32}
     * @param inSignal a array of eight initial binary string for four inpin pins stored in {@link inPin32}
     * @param Select the initial encoding string of selector
     */
    constructor(inSignal, Select) {
        this.inPin32 = inSignal;
        this.sel = Select;
        this.outPin32 = StringHandle_1.intArrayToString(Mux8Way32.Mux8Way32(this.inPin32, this.sel));
    }
    /**
     * This method implements the 8way-mux32 by combine two 4way-mux32 and add a new selector to determine which 4way-mux32's output is set to output
     * @param inPin an array of arrays of integers that represents eight 32bits binary data
     * @param Select2Way the 3 way selector
     * @returns an array of integers which indicates what the {@link outPin32} will be set.
     */
    static Mux8Way32(inPin, Select2Way) {
        let mux4Way32A = new Mux4Way32_1.Mux4Way32(inPin.slice(0, 4), Select2Way.slice(1, 3));
        let mux4Way32B = new Mux4Way32_1.Mux4Way32(inPin.slice(4, 8), Select2Way.slice(1, 3));
        // console.log(mux4Way32A);
        // console.log(mux4Way32B);
        return Mux32_1.Mux32.Mux32(StringHandle_1.stringToIntArray(mux4Way32A.outPin32), StringHandle_1.stringToIntArray(mux4Way32B.outPin32), parseInt(Select2Way.charAt(0)));
    }
}
exports.Mux8Way32 = Mux8Way32;

},{"../Library/StringHandle":47,"./Mux32":41,"./Mux4Way32":42}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This is the documentation for this file
 * @module
 * We are using browserify to pack our compiled code. However, the browserify will enclose all the module, which means we can not access class inside the packed file<br/>
 * To address this problem, I created a single file Hardware.ts to export neccessary class here and use this file as entrypoint for browserify.<br/>
 * by doing this, we can exposed the compiled class to the global namespace and thus can access objects anc classes in need.
 * @module
 */
const Single_CycleCPU_1 = require("./CPU/Single-CycleCPU");
module.exports = Single_CycleCPU_1.singleCycleCpu;

},{"./CPU/Single-CycleCPU":23}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init_bits = void 0;
const StringHandle_1 = require("./StringHandle");
/**
 * This function initialize a binary string of given length with 0
 * @param bitWidth the length of initialized string
 * @returns the initialized string
 */
function init_bits(bitWidth) {
    let bits = new Array();
    for (let i = 0; i < bitWidth; ++i) {
        bits.push(0);
    }
    return StringHandle_1.intArrayToString(bits);
}
exports.init_bits = init_bits;

},{"./StringHandle":47}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.num2bool = exports.bool2num = void 0;
/**
 * This is the function transfering bool to number
 * @param bool the bool need to be transfered.
 * @returns 1 if true, 0 if false
 */
function bool2num(bool) {
    if (bool)
        return 1;
    else
        return 0;
}
exports.bool2num = bool2num;
/**
 * This is the function transfering number to boolean
 * @param num the number need transfering
 * @returns true if not 0 ,false if 0
 */
function num2bool(num) {
    if (num != 0)
        return true;
    else
        return false;
}
exports.num2bool = num2bool;

},{}],47:[function(require,module,exports){
"use strict";
/**
 * This function do the transform between a binary string(which means only 0 or 1 are accepted) and an int array
 * @param binaryString The string need to be transformed
 * @returns a int Array which is the result of transform a string to int array
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.shiftLeftBinary32Bits = exports.bitsMapping = exports.binaryDetect = exports.bin2dec = exports.lengthDetect = exports.decToUnsignedBin32 = exports.decToSignedBin32 = exports.intArrayToString = exports.stringToIntArray = void 0;
function stringToIntArray(binaryString) {
    let intArray = [];
    for (var i = 0; i < binaryString.length; ++i) {
        intArray.push(parseInt(binaryString.charAt(i)));
    }
    return intArray;
}
exports.stringToIntArray = stringToIntArray;
/**
 * This function transform an binary int array(which means only 0 or 1 are accepted) to a string
 * @param intArray The binary int array need to be transformed
 * @returns a binary string
 */
function intArrayToString(intArray) {
    intArray.forEach((bit) => {
        if (bit != 0 && bit != 1) {
            throw new Error("The int array contains bit other than 0 or 1");
        }
    });
    return intArray.join("");
}
exports.intArrayToString = intArrayToString;
/**
 * This function transform a decimal number to signed binary number. The length of binary string should be 32. Therefore, if the number is too big, it will report error.
 * @param dec the decimal number which will be tranformed
 * @returns the transformed signed binary string or error message.
 */
function decToSignedBin32(dec) {
    let bin32 = (dec >>> 0).toString(2);
    if (dec != 0 && bin32 == "0") {
        let added = "";
        while (bin32 == "0") {
            added = added + dec % 2;
            dec = Math.floor(dec / 2);
            bin32 = (dec >>> 0).toString(2);
        }
        bin32 = bin32 + added;
        bin32 = bin32.slice(bin32.length - 32);
    }
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
        out32[0] = 0;
        return intArrayToString(out32);
    }
    lengthDetect(bin32);
    return bin32;
}
exports.decToSignedBin32 = decToSignedBin32;
/**
 * This function transform a decimal number to unsigned binary number. The length of binary string should be 32. Therefore, if the number is too big, it will report error.
 * @param dec the decimal number which will be tranformed
 * @returns the transformed unsigned binary string or error message.
 */
function decToUnsignedBin32(dec) {
    if (dec < 0)
        throw Error("Unsign number cannot less than zero!");
    let bin32 = (dec >>> 0).toString(2);
    if (dec != 0 && bin32 == "0") {
        let added = "";
        while (bin32 == "0") {
            added = added + dec % 2;
            dec = Math.floor(dec / 2);
            bin32 = (dec >>> 0).toString(2);
        }
        bin32 = bin32 + added;
        bin32 = bin32.slice(bin32.length - 32);
    }
    if (bin32.length < 32)
        return decToSignedBin32(dec);
    if (bin32.length == 32)
        return bin32;
    throw new Error("dec to unsigned binary string: Overflow");
}
exports.decToUnsignedBin32 = decToUnsignedBin32;
/**
 * This is the function that detect whether the length of a binary string is longger than 32
 * @param binNum the binary string to be detected
 */
function lengthDetect(binNum) {
    if (binNum.length > 32)
        throw Error("binary length is longer than 32!");
}
exports.lengthDetect = lengthDetect;
/**
 * This is the function that transform binary string to decimal number
 * @param bin The binary string that need to be transformed
 * @param isUnsigned a boolean indicates whether the input is a sign number or an unsign number
 * @returns the decimal number transfered from original binary number
 */
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
/**
 * This function decte whether a string is a binarya
 * @param bin the string need to be detected
 */
function binaryDetect(bin) {
    stringToIntArray(bin).forEach(bit => {
        if (bit != 0 && bit != 1)
            throw Error("Binary data " + bin + " has invalid bit.");
    });
}
exports.binaryDetect = binaryDetect;
/**
 * This function maps the index of binary string to its corresponding bits(substring)
 * @param bits the binary string
 * @param from from index
 * @param to to index
 * @returns the substring which is mapped.
 */
function bitsMapping(bits, from, to) {
    let newFrom = 32 - to;
    let newTo = 32 - from;
    return bits.slice(newFrom, newTo);
}
exports.bitsMapping = bitsMapping;
/**
 * This function logic left shift the binary string 2 bits by simply adding "00" to the end of the binary string.
 * @param binBits the string needed to be shifted
 * @returns the shifted binary string
 */
function shiftLeftBinary32Bits(binBits) {
    return binBits.slice(2) + "00";
}
exports.shiftLeftBinary32Bits = shiftLeftBinary32Bits;

},{}],48:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AND = void 0;
const Logic_1 = __importDefault(require("./Logic"));
const NAND_1 = require("./NAND");
/**
 * This is the AND logic. This components provide AND function for the circuit components
 */
class AND extends Logic_1.default {
    /**
     * @param inputPin1 the initial value for inpin 1
     * @param inputPin2 the initial value for inpin 2<br/>
     *
     * the constructor will then set the outpin according to inpin 1 and inpin 2.
     * This is done by call static method And {@link And}
    */
    constructor(inputPin1, inputPin2) {
        super(inputPin1, inputPin2);
        this.outpin = AND.And(this.pin1, this.pin2);
    }
    /**
     * the logic code that fulfill the function of and
    */
    static And(inputPin1, inputPin2) {
        let nand = new NAND_1.NAND(inputPin1, inputPin2);
        return NAND_1.NAND.Nand(nand.outpin, nand.outpin);
    }
}
exports.AND = AND;

},{"./Logic":50,"./NAND":51}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AND32 = void 0;
const AND_1 = require("./AND");
const StringHandle_1 = require("../Library/StringHandle");
/**
 * This is an integrated 32-bits AND Logic Components.The ALU will use this to caculate logic and
 * <br/>The inpinA and inpinB are both 32-bits
 * @category 32Logic
*/
class AND32 {
    /**
     * @param inputPin1 the initial value for inpinA.<br/>Note: only 32 binary encoding string, such as "00111100101011000011110010101100", can be accepted
     * @param inputPin2 the initial value for inpinB<br/>Note: only 32 binary encoding string, such as "00111100101011000011110010101100", can be accepted<br/>
     *
     * the constructor will then set the outpin according to bit-wise and operation of inpinA and inpinB.
     * This is done by call static method And32 {@link And32}
    */
    constructor(inSignalA, inSignalB) {
        this.inPin32A = inSignalA;
        this.inPin32B = inSignalB;
        let bitA = StringHandle_1.stringToIntArray(this.inPin32A);
        let bitB = StringHandle_1.stringToIntArray(this.inPin32B);
        this.outPin32 = StringHandle_1.intArrayToString(AND32.And32(bitA, bitB));
    }
    /**
     * this method will caculate the correct outcome of bitwise and operation of two inputs
     * @param BitsA Note that the type of this is array of number
     * @param BitsB Note that the type of this is array of number
     * @returns the return value of this method is also a array of number.<br/> The outcome of bit-wise and is stored in this array
    */
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

},{"../Library/StringHandle":47,"./AND":48}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logic = void 0;
/**
 * This comment _supports_ [Markdown](https://marked.js.org/)<br/>
 * Code blocks are great for examples
 *
 * ```typescript
 * // run typedoc --help for a list of supported languages
 * const instance = new MyClass();
 * ```
 * This is the base class for Logic Components<br/>
 * the input and output pins of logic components are defined here<br/>
 *
 * @category Logic
 */
class Logic {
    /**
     * initialize the input pin 1 and 2
    */
    constructor(inputPin1, inputPin2) {
        /**
         * outpin for logic components,the default value is 0
        */
        this.outpin = 0;
        this.pin1 = inputPin1;
        this.pin2 = inputPin2;
    }
    /**
     * This method encodes the input output pair
     *
    */
    toBinaryString() {
        let a = this.pin1 + "";
        let b = this.pin2 + "";
        let c = this.outpin + "";
        return a + b + c;
    }
}
exports.Logic = Logic;
/** @internal */
exports.default = Logic;

},{}],51:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NAND = void 0;
const Logic_1 = __importDefault(require("./Logic"));
/**
 * This is the NAND logic. This components provide NAND function for the circuit components
 *
 * @category Logic
*/
class NAND extends Logic_1.default {
    /**
     * @param inputPin1 the initial value for inpin 1
     * @param inputPin2 the initial value for inpin 2<br/>
     *
     * the constructor will then set the outpin according to inpin 1 and inpin 2.
     * This is done by call static method Nand {@link Nand}
    */
    constructor(inputPin1, inputPin2) {
        super(inputPin1, inputPin2);
        this.outpin = NAND.Nand(this.pin1, this.pin2);
    }
    /**
     * the logic code that fulfill the function of nand
    */
    static Nand(inputPin1, inputPin2) {
        return Math.abs((inputPin1 & inputPin2) - 1);
    }
}
exports.NAND = NAND;

},{"./Logic":50}],52:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOT = void 0;
const Logic_1 = __importDefault(require("./Logic"));
const NAND_1 = require("./NAND");
/**
 * This is NOT Logic. This components provide NOT function for the circuit components
 */
class NOT extends Logic_1.default {
    /**
     * @param inputPin1 the initial value for inpin 1
     *
     * the constructor will set the outpin according to inpin 1.
     * This is done by call static method Not {@link Not}
    */
    constructor(inputPin1) {
        super(inputPin1, 0);
        this.outpin = NOT.Not(this.pin1);
    }
    /**
     * the logic code that fulfill the function of not
    */
    static Not(inputPin1) {
        let nand = new NAND_1.NAND(inputPin1, inputPin1);
        return nand.outpin;
    }
}
exports.NOT = NOT;

},{"./Logic":50,"./NAND":51}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOT32 = void 0;
const NOT_1 = require("./NOT");
const StringHandle_1 = require("../Library/StringHandle");
/**
 * This is an integrated 32-bits NOT Logic Components.
 * <br/>There is only one input pin called inpin32A since not is a unary operator
 * @category 32Logic
*/
class NOT32 {
    /**
     * @param inSignalA the initial value for inpinA<br/>Note: only 32 binary encoding string, such as "00111100101011000011110010101100", can be accepted<br/>
     *
     * the constructor will then set the outpin according to bit-wise not operation of inpinA.
     * This is done by call static method Not32 {@link Not32}
    */
    constructor(inSignalA) {
        this.inPin32A = inSignalA;
        let bitA = StringHandle_1.stringToIntArray(this.inPin32A);
        this.outPin32 = StringHandle_1.intArrayToString(NOT32.Not32(bitA));
    }
    /**
     * this method will caculate the correct outcome of bitwise not operation of inputA
     * @param BitsA Note that the type of this is array of number
     * @returns the return value of this method is also a array of number.<br/> The outcome of bit-wise not is stored in this array
    */
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

},{"../Library/StringHandle":47,"./NOT":52}],54:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OR = void 0;
const Logic_1 = __importDefault(require("./Logic"));
const NAND_1 = require("./NAND");
/**
 * This is the OR logic. This components provide or function for the circuit components
 *
 * @category Logic
*/
class OR extends Logic_1.default {
    /**
     * @param inputPin1 the initial value for inpin 1
     * @param inputPin2 the initial value for inpin 2<br/>
     *
     * the constructor will then set the outpin according to inpin 1 and inpin 2.
     * This is done by call static method Or {@link Or}
    */
    constructor(inputPin1, inputPin2) {
        super(inputPin1, inputPin2);
        this.outpin = OR.Or(this.pin1, this.pin2);
    }
    /**
     * the logic code that fulfill the function of or
    */
    static Or(inputPin1, inputPin2) {
        let nand1 = new NAND_1.NAND(inputPin1, inputPin1);
        let nand2 = new NAND_1.NAND(inputPin2, inputPin2);
        return NAND_1.NAND.Nand(nand1.outpin, nand2.outpin);
    }
}
exports.OR = OR;

},{"./Logic":50,"./NAND":51}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OR32 = void 0;
const OR_1 = require("./OR");
const StringHandle_1 = require("../Library/StringHandle");
/**
 * This is an integrated 32-bits OR Logic Components.The ALU will use this to caculate logic or
 * <br/>The inpinA and inpinB are both 32-bits
 * @category 32Logic
*/
class OR32 {
    /**
     * @param inputPin1 the initial value for inpinA.<br/>Note: only 32 binary encoding string, such as "00111100101011000011110010101100", can be accepted
     * @param inputPin2 the initial value for inpinB<br/>Note: only 32 binary encoding string, such as "00111100101011000011110010101100", can be accepted<br/>
     *
     * the constructor will then set the outpin according to bit-wise or operation of inpinA and inpinB.
     * This is done by call static method Or32 {@link Or32}
    */
    constructor(inSignalA, inSignalB) {
        this.inPin32A = inSignalA;
        this.inPin32B = inSignalB;
        let bitA = StringHandle_1.stringToIntArray(this.inPin32A);
        let bitB = StringHandle_1.stringToIntArray(this.inPin32B);
        this.outPin32 = StringHandle_1.intArrayToString(OR32.Or32(bitA, bitB));
    }
    /**
     * this method will caculate the correct outcome of bitwise or operation of two 32 bits inputs
     * @param BitsA Note that the type of this is array of number
     * @param BitsB Note that the type of this is array of number
     * @returns the return value of this method is also a array of number.<br/> The outcome of bit-wise or is stored in this array
    */
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

},{"../Library/StringHandle":47,"./OR":54}],56:[function(require,module,exports){
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
 * This is the XOR logic. This components provide XOR function for the circuit components
 *
 * @category Logic
*/
class XOR extends Logic_1.default {
    /**
     * @param inputPin1 the initial value for inpin 1
     * @param inputPin2 the initial value for inpin 2<br/>
     *
     * the constructor will then set the outpin according to inpin 1 and inpin 2.
     * This is done by call static method Xor {@link Xor}
    */
    constructor(inputPin1, inputPin2) {
        super(inputPin1, inputPin2);
        this.outpin = XOR.Xor(this.pin1, this.pin2);
    }
    /**
     * the logic code that fulfill the function of xor
    */
    static Xor(inputPin1, inputPin2) {
        let nand = new NAND_1.NAND(inputPin1, inputPin2);
        let or = new OR_1.OR(inputPin1, inputPin2);
        return AND_1.AND.And(nand.outpin, or.outpin);
    }
}
exports.XOR = XOR;

},{"./AND":48,"./Logic":50,"./NAND":51,"./OR":54}]},{},[44])(44)
});
