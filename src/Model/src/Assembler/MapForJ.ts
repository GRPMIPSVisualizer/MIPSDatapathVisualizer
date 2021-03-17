export class MapForJ {

    private static map = new Map([
        ["j", "000010"],
        ["jal", "000011"]
    ]);

    private constructor() { }

    public static getMap(): Map<string, string> {
        return this.map;
    }
}
