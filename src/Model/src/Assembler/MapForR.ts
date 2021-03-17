export class MapForR {

    private static map = new Map([
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

    private constructor() { }

    public static getMap(): Map<string, string> {
        return this.map;
    }
}