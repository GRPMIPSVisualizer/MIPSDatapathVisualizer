/**
 * Translate a 16-bits binary number into an unsigned decimal number.
 * @param bin a string of a binary number(must be 16-bits) to be translated.
 * @returns a number which is the unsigned decimal format of the binary number, or 0 if the binary number is not 16-bits.
 */
export function binaryToUnsignedDecimal(bin: string) {
    let retNum: number = 0;
    if (bin.length != 16) {
      return 0;
    } else {
      let i: number = 1;
      let j: number = 0;
      for (; j < 16; j++) {
        retNum = retNum + +(bin.charAt(15 - j)) * i;
        i = 2 * i;
      }
    }
    return retNum;
}