import { Signal,signalType  } from "./Signal";
import { Wire} from "./Wire";
/**
 * Wrapper class for Wire<br/>
 * if a component is connected by wire, it should only extends this class
 */
export class Wired{
    private Wires:Wire[];
    constructor(){
        this.Wires = new Array<Wire>();
    }
    /**
     * Add a wire to the {@link Wires}
     * @param changeSignal the signal that changes
     * @param reactSiganl this signal that should react to changes
     * @param LogicFunc the reactive function
     */
    public addWire(changeSignal:Signal,reactSiganl:Signal,LogicFunc?:(Signal:signalType)=>signalType):void{
        let newWire = (LogicFunc === undefined)?new Wire(changeSignal,reactSiganl):new Wire(changeSignal,reactSiganl,LogicFunc);
        this.Wires.push(newWire);
    }
}