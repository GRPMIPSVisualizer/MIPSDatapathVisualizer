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
//# sourceMappingURL=BinaryToDecimal.js.map