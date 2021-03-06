(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.singleCycleCpu = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayList = void 0;
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
            //add an element using index
            this.ensureExplicitCapacity();
            this.rangeCheck(arg0);
            this.elementData.splice(arg0, 0, arg1);
            this.sizeNum++;
        }
        else {
            //
            this.ensureExplicitCapacity();
            this.elementData[this.sizeNum] = arg0;
            this.sizeNum++;
        }
    }
    /**
     * Get the object specified by the index
     * @param index
     * @return Object
     */
    get(index) {
        this.rangeCheck(index);
        return this.elementData[index];
    }
    /**
     * Update the object at the specified index
     * @param index
     * @param Object
     * @return void
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
     * Get the size of the ArrayList
     * @return the size of the ArrayList
     */
    size() {
        return this.sizeNum;
    }
    /**
     * Check whether the index exceeds the capacity
     * @param index
     */
    rangeCheck(index) {
        if (index >= this.sizeNum || index < 0) {
            throw new Error("is no index--->" + index);
        }
    }
    /**
     *  Expand the capacity of the ArrayList to 1.5 times
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

},{"./ArrayList":1,"./BinaryToDecimal":4,"./DecimalToBinary":5,"./DecoderForI":7,"./DecoderForJ":8,"./DecoderForR":9,"./MapForCommaNum":14,"./MapForInsType":16,"./TrimSpace":22}],3:[function(require,module,exports){
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
// export function stringToIntArray(binaryString:string):number[]{
//     let intArray:number[] = [];
//     for(var i = 0;i < binaryString.length;++i){
//         intArray.push(parseInt(binaryString.charAt(i)));
//     }
//     return intArray;
// } 
Object.defineProperty(exports, "__esModule", { value: true });
exports.binaryToDecimal = void 0;
// export function bin2dec(bin:string,isUnsigned:boolean):number{
//     if (bin.length != 16)
//         throw Error("binary length is longer than 32!");
//     let binArr:number[] = stringToIntArray(bin);
//     let retNum:number = 0;
//     if (isUnsigned)
//         retNum += binArr[0]*Math.pow(2,31);
//     else{
//         retNum += -binArr[0]*Math.pow(2,31);
//     }
//     for (let i:number=1;i<bin.length;++i){
//         retNum += binArr[i]*Math.pow(2,(31-i));
//     }
//     return retNum;
// }
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

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecoderForI = void 0;
const Decoder_1 = require("./Decoder");
const InstructionI_1 = require("./InstructionI");
const MapForRegister_1 = require("./MapForRegister");
class DecoderForI extends Decoder_1.Decoder {
    constructor() {
        super();
        this.errMsg = "";
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
                break;
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
    decode() {
        let instruction = new InstructionI_1.InstructionI(this.ins);
        this.binIns = instruction.getBinIns();
    }
    getErrMsg() {
        return this.errMsg;
    }
}
exports.DecoderForI = DecoderForI;
DecoderForI.decoder = new DecoderForI();

},{"./Decoder":6,"./InstructionI":11,"./MapForRegister":19}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecoderForJ = void 0;
const Decoder_1 = require("./Decoder");
const InstructionJ_1 = require("./InstructionJ");
class DecoderForJ extends Decoder_1.Decoder {
    constructor() {
        super();
        this.errMsg = "";
    }
    static getDecoder() {
        return this.decoder;
    }
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
    decode() {
        let instruction = new InstructionJ_1.InstructionJ(this.ins);
        this.binIns = instruction.getBinIns();
    }
    getErrMsg() {
        return this.errMsg;
    }
}
exports.DecoderForJ = DecoderForJ;
DecoderForJ.decoder = new DecoderForJ();

},{"./Decoder":6,"./InstructionJ":12}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecoderForR = void 0;
const Decoder_1 = require("./Decoder");
const InstructionR_1 = require("./InstructionR");
const MapForRegister_1 = require("./MapForRegister");
class DecoderForR extends Decoder_1.Decoder {
    constructor() {
        super();
        this.errMsg = "";
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
        else if (this.operator == "sll" || this.operator == "srl" || this.operator == "sra") {
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
        let patt3 = /^(\+)?\d+$/;
        if ((!(SHAMT == "" || patt3.test(SHAMT))) || (patt3.test(SHAMT) && +SHAMT >= 32)) {
            this.errMsg = this.errMsg + "Error 209: Invalid shift amount. -- " + this.getIns() + "\n";
            return false;
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
                break;
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
    decode() {
        let instruction = new InstructionR_1.InstructionR(this.ins);
        this.binIns = instruction.getBinIns();
    }
    getErrMsg() {
        return this.errMsg;
    }
}
exports.DecoderForR = DecoderForR;
DecoderForR.decoder = new DecoderForR();

},{"./Decoder":6,"./InstructionR":13,"./MapForRegister":19}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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
class InstructionJ extends Instruction_1.Instruction {
    //The ins should be in the form like "j 10000".
    //There should be only one space between the operator and the first operand, no other space existing.
    //The address should be represented by a decimal number.
    constructor(ins) {
        super(ins);
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
class InstructionR extends Instruction_1.Instruction {
    //The ins should be in the form like "add $8,$16,$17".
    //There should be only one space between the operator and the first operand, no other space existing.
    //The register should be in dollar sign and a number.
    constructor(ins) {
        super(ins);
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
    getErrMsg() {
        return this.errMsg;
    }
}
exports.InstructionR = InstructionR;

},{"./DecimalToBinary":5,"./Instruction":10,"./MapForR":18}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapForCommaNum = void 0;
class MapForCommaNum {
    constructor() { }
    static getMap() {
        return this.map;
    }
}
exports.MapForCommaNum = MapForCommaNum;
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
 * MapForI stores some type I core instructions and their corresponding 6 bits opcodes.
 */
class MapForI {
    //MapForI is a singleton
    constructor() { }
    static getMap() {
        return this.map;
    }
}
exports.MapForI = MapForI;
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
class MapForInsType {
    constructor() { }
    static getMap() {
        return this.map;
    }
}
exports.MapForInsType = MapForInsType;
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
    ["llOp", "I"],
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
class MapForJ {
    constructor() { }
    static getMap() {
        return this.map;
    }
}
exports.MapForJ = MapForJ;
MapForJ.map = new Map([
    ["j", "000010"],
    ["jal", "000011"]
]);

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapForR = void 0;
class MapForR {
    constructor() { }
    static getMap() {
        return this.map;
    }
}
exports.MapForR = MapForR;
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
class MapForRegister {
    constructor() { }
    static getMap() {
        return this.map;
    }
}
exports.MapForRegister = MapForRegister;
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

},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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
        this.opCode = Mem.getTextOutpin().slice(0, 6);
        this.setInPin16(StringHandle_1.bitsMapping(Mem.getTextOutpin(), 0, 16), con.getALUOp());
    }
}
class conALUControl extends ControlUnits_1.ALUControl {
    constructor(ALU) {
        super(ALU);
        this.reportOverflow = false;
    }
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
    setALUOp(controlUnits) {
        super.setALUOp(controlUnits);
        this.ALU.setControlBits(this.getOperationCode());
    }
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
    setBne(ben) {
        this.ALU.bne = ben;
    }
    setALUReportOverflow() {
        this.ALU.setReportOverflow(this.reportOverflow);
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
        if (this.bne) {
            this.isZero = !this.isZero;
        }
        this.zeroAnd.setInpinB(this.isZero);
    }
    setOutPin(outPin) {
        super.setOutPin(outPin);
        this.dataMemory.setDataAddress(this.getOutPin32());
        this.MemoryMux.setInpin32A(this.getOutPin32());
    }
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
        this.currentInsAddr = BItsGenerator_1.init_bits(32);
        this.asciiString = new Map();
        this.StdOut = "";
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
    readFromConsole(readCode) {
        // 浣犱滑鏉ュ啓锛屾妸鐢ㄦ埛杈撳叆鍦╟onsole涓婄殑涓滆タ浣滀负涓€涓猻tring杩斿洖
        return "";
    }
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
        return this.currentInsAddr;
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
class ALU {
    constructor(inPinA, inPinB, control) {
        this.outPin32 = "";
        this.shamt = BItsGenerator_1.init_bits(5);
        this.bne = false;
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
    getOutPin32() {
        return this.outPin32;
    }
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
    reportOverflowException() {
        if (!this.isOverflow)
            return;
        let exceptionReporter = ExceptionReporter_1.ExceptionReporter.getReporter();
        exceptionReporter.addException("ALU Overflow Exception!");
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
    setReportOverflow(b) {
        this.reportOverflow = b;
    }
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
    getInpinB() {
        return this.inPin32B;
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

},{"../Conponent/Mux":40,"../Library/StringHandle":47,"../Logic/AND":48,"../Logic/OR":54,"../Logic/XOR":56}],26:[function(require,module,exports){
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
        this.bne = false; // bne signal
        // private controlUnits:ControlUnits;
        this.InsCodeStr = "000000";
        this.InsCode = new Array();
        // this.controlUnits = ConUni;
        this.ALU = ALU;
        this._4OperationBits = this.conLogic();
    }
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
    getInsCodeStr() {
        return this.InsCodeStr;
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

},{"../Library/BooleanHandler":46,"../Logic/NOT":52,"./Latch":29,"./Wired":36}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionReporter = void 0;
class ExceptionReporter {
    constructor() {
        this.ExceptionArray = new Array();
    }
    static getReporter() {
        return this.exceptionReporter;
    }
    addException(newExcp) {
        this.ExceptionArray.push(newExcp);
    }
    isEmpty() {
        if (this.ExceptionArray.length == 0)
            return true;
        return false;
    }
    reportException() {
        return this.ExceptionArray;
    }
    clearException() {
        this.ExceptionArray = new Array();
    }
}
exports.ExceptionReporter = ExceptionReporter;
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

},{"../Library/BooleanHandler":46,"../Logic/AND":48,"../Logic/NOT":52,"../Logic/OR":54,"./Signal":34}],30:[function(require,module,exports){
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
    isEnd() {
        if (this.textOutpin == undefined)
            return true;
        return false;
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
    storeWordStaticData(datum) {
        let staticDataIndex = +datum[0] / 4;
        this.staticData.set(StringHandle_1.decToUnsignedBin32(+datum[0]), datum[1]);
        this.MemoryArray[staticDataIndex] = datum[1];
    }
    storeByteStaticData(datum) {
        let staticDataIndex = Math.floor(+datum[0] / 4);
        let position = +datum[0] % 4;
        let data1 = this.MemoryArray[staticDataIndex];
        if (data1 == undefined) {
            data1 = BItsGenerator_1.init_bits(32);
        }
        data1 = data1.slice(0, 8 * (3 - position)) + datum + data1.slice(8 * (3 - position) + 8, 32);
        this.MemoryArray[staticDataIndex] = data1;
        this.staticData.set(StringHandle_1.decToUnsignedBin32(staticDataIndex * 4), data1);
    }
    getStaticData() {
        return this.staticData;
    }
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
    storeADataAt(index, datum) {
        this.registers[index].setInpin32(datum);
        this.registers[index].changeClockSignal();
        this.registers[index].changeClockSignal();
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

},{"../Conponent/DMux4Way":38,"../Conponent/DMux8Way":39,"../Conponent/Mux32":41,"../Conponent/Mux4Way32":42,"../Conponent/Mux8Way32":43,"../Library/BItsGenerator":45,"../Library/BooleanHandler":46,"../Library/StringHandle":47,"./Register":31,"./Signal":34,"./Wired":36}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignExtend = void 0;
const BItsGenerator_1 = require("../Library/BItsGenerator");
const StringHandle_1 = require("../Library/StringHandle");
class SignExtend {
    constructor() {
        this.opCode = BItsGenerator_1.init_bits(6);
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

},{"../Library/BooleanHandler":46}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
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

},{"./Wire":35}],37:[function(require,module,exports){
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

},{"../Logic/AND":48,"../Logic/NOT":52}],38:[function(require,module,exports){
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

},{"../Library/StringHandle":47,"./DMux":37}],39:[function(require,module,exports){
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

},{"../Library/StringHandle":47,"./DMux":37,"./DMux4Way":38}],40:[function(require,module,exports){
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

},{"../Logic/AND":48,"../Logic/NOT":52,"../Logic/OR":54}],41:[function(require,module,exports){
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

},{"../Library/StringHandle":47,"./Mux":40}],42:[function(require,module,exports){
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

},{"../Library/StringHandle":47,"./Mux32":41}],43:[function(require,module,exports){
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

},{"../Library/StringHandle":47,"./Mux32":41,"./Mux4Way32":42}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Single_CycleCPU_1 = require("./CPU/Single-CycleCPU");
module.exports = Single_CycleCPU_1.singleCycleCpu;

},{"./CPU/Single-CycleCPU":23}],45:[function(require,module,exports){
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

},{"./StringHandle":47}],46:[function(require,module,exports){
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

},{}],47:[function(require,module,exports){
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

},{}],48:[function(require,module,exports){
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

},{"./Logic":50,"./NAND":51}],49:[function(require,module,exports){
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

},{"../Library/StringHandle":47,"./AND":48}],50:[function(require,module,exports){
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

},{}],51:[function(require,module,exports){
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

},{"./Logic":50,"./NAND":51}],53:[function(require,module,exports){
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

},{"./Logic":50,"./NAND":51}],55:[function(require,module,exports){
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

},{"./AND":48,"./Logic":50,"./NAND":51,"./OR":54}]},{},[44])(44)
});
