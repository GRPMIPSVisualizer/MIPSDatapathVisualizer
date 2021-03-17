/**
 * MapForI stores some type I core instructions and their corresponding 6 bits opcodes.
 */
export class MapForI {

    private static map = new Map([
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

    //MapForI is a singleton
    private constructor() { }

    public static getMap(): Map<string, string> {
        return this.map;
    }
}