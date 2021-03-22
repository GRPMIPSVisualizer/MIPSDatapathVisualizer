import { intArrayToString } from "./StringHandle";
/**
 * This function initialize a binary string of given length with 0
 * @param bitWidth the length of initialized string
 * @returns the initialized string
 */
export function init_bits(bitWidth:number):string{
    let bits:number[] = new Array<number>();
    for(let i:number=0;i<bitWidth;++i){
        bits.push(0);
    }
    return intArrayToString(bits);
}
