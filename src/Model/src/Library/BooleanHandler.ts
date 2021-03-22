import { signalType } from "../Circuit/Signal";
/**
 * This is the function transfering bool to number
 * @param bool the bool need to be transfered.
 * @returns 1 if true, 0 if false
 */
export function bool2num(bool:signalType):number{
    if (bool)
        return 1;
    else
        return 0;
}
/**
 * This is the function transfering number to boolean
 * @param num the number need transfering
 * @returns true if not 0 ,false if 0
 */
export function num2bool(num:signalType):boolean{
    if (num != 0)
        return true;
    else
        return false;
}