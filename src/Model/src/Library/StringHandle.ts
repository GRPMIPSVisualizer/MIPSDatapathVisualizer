
/**
 * This function do the transform between a binary string(which means only 0 or 1 are accepted) and an int array
 * @param binaryString The string need to be transformed
 * @returns a int Array which is the result of transform a string to int array
 */

export function stringToIntArray(binaryString:string):number[]{
    let intArray:number[] = [];
    for(var i = 0;i < binaryString.length;++i){
        intArray.push(parseInt(binaryString.charAt(i)));
    }
    return intArray;
}


/**
 * This function transform an binary int array(which means only 0 or 1 are accepted) to a string
 * @param intArray The binary int array need to be transformed
 * @returns a binary string
 */
export function intArrayToString(intArray:number[]):string{
    intArray.forEach((bit)=>{
        if (bit != 0 && bit !=1){
            throw new Error("The int array contains bit other than 0 or 1");
        }
    });
    return intArray.join("");
}


/**
 * This function transform a decimal number to signed binary number. The length of binary string should be 32. Therefore, if the number is too big, it will report error.
 * @param dec the decimal number which will be tranformed
 * @returns the transformed signed binary string or error message.
 */
export function decToSignedBin32(dec:number):string{
    let bin32:string = (dec >>> 0).toString(2);
    if (dec != 0 && bin32=="0"){
        let added:string = "";
        while(bin32 == "0"){
            added = added + dec % 2;
            dec = Math.floor(dec/2);
            bin32 = (dec >>> 0).toString(2);    
        }
        bin32 = bin32 + added;
        bin32 = bin32.slice(bin32.length-32);
    }

    if (dec >= 0){
        let binArr32:number[] = stringToIntArray(bin32);
        let i:number = 32;
        let out32:number[] = new Array(i);
        
        let j:number = bin32.length;
        while (i > 0){
            out32[--i] = binArr32[--j];
            if (j == 0)
                break;
        }
        while (i > 0){
            out32[--i] = 0;
        }
        out32[0] = 0;
        return intArrayToString(out32);
    }
    lengthDetect(bin32);
    return bin32;
}


/**
 * This function transform a decimal number to unsigned binary number. The length of binary string should be 32. Therefore, if the number is too big, it will report error.
 * @param dec the decimal number which will be tranformed
 * @returns the transformed unsigned binary string or error message.
 */
export function decToUnsignedBin32(dec:number):string{
    if (dec < 0)
        throw Error("Unsign number cannot less than zero!");
    let bin32:string = (dec >>> 0).toString(2);

    if (dec != 0 && bin32=="0"){
        let added:string = "";
        while(bin32 == "0"){
            added = added + dec % 2;
            dec = Math.floor(dec/2);
            bin32 = (dec >>> 0).toString(2);    
        }
        bin32 = bin32 + added;
        bin32 = bin32.slice(bin32.length-32);
    }
    
    if (bin32.length < 32)
        return decToSignedBin32(dec);
    if (bin32.length == 32)
        return bin32;
    throw new Error("dec to unsigned binary string: Overflow");
}


/**
 * This is the function that detect whether the length of a binary string is longger than 32
 * @param binNum the binary string to be detected
 */
export function lengthDetect(binNum:string):void{
    if (binNum.length > 32)
        throw Error("binary length is longer than 32!");
}

/**
 * This is the function that transform binary string to decimal number
 * @param bin The binary string that need to be transformed
 * @param isUnsigned a boolean indicates whether the input is a sign number or an unsign number
 * @returns the decimal number transfered from original binary number
 */
export function bin2dec(bin:string,isUnsigned:boolean):number{
    if (bin.length != 32)
        throw Error("binary length is longer than 32!");

    let binArr:number[] = stringToIntArray(bin);
    let retNum:number = 0;
    
    if (isUnsigned)
        retNum += binArr[0]*Math.pow(2,31);
    else{
        retNum += -binArr[0]*Math.pow(2,31);
    }
    for (let i:number=1;i<bin.length;++i){
        retNum += binArr[i]*Math.pow(2,(31-i));
    }

    return retNum;
    
}
/**
 * This function decte whether a string is a binarya
 * @param bin the string need to be detected 
 */
export function binaryDetect(bin:string):void{
    stringToIntArray(bin).forEach(
        bit =>{
            if (bit != 0 && bit != 1)
                throw Error("Binary data " + bin + " has invalid bit.");
        }
    );
}

/**
 * This function maps the index of binary string to its corresponding bits(substring)
 * @param bits the binary string
 * @param from from index
 * @param to to index
 * @returns the substring which is mapped.
 */
export function bitsMapping(bits:string,from:number,to:number):string{
    let newFrom:number = 32 - to;
    let newTo:number = 32 - from;
    return bits.slice(newFrom,newTo);
}

/**
 * This function logic left shift the binary string 2 bits by simply adding "00" to the end of the binary string. 
 * @param binBits the string needed to be shifted
 * @returns the shifted binary string
 */
export function shiftLeftBinary32Bits(binBits:string):string{
    return binBits.slice(2) + "00";
}