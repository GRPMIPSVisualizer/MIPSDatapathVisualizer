/**
 * This comment _supports_ [Markdown](https://marked.js.org/)<br/>
 * Code blocks are great for examples
 *
 * ```typescript
 * // run typedoc --help for a list of supported languages
 * const instance = new MyClass();
 * ```
 * This is the base class for Logic Components<br/>
 * the input and output pins of logic components are defined here<br/>
 * 
 * @category Logic
 */
export class Logic{
    /**
     * input pin 1 for logic components
    */
    pin1:number;
    /**
     * input pin 2 for logic components
    */
    pin2:number;
    /**
     * outpin for logic components,the default value is 0
    */
    outpin:number = 0;
    /**
     * initialize the input pin 1 and 2
    */
    constructor(inputPin1:number,inputPin2:number){
        this.pin1 = inputPin1;
        this.pin2 = inputPin2;
    }
    /**
     * This method encodes the input output pair
     * 
    */
    public toBinaryString():string{
        let a:string = this.pin1+""; 
        let b:string = this.pin2+"";
        let c:string = this.outpin+"";
        return a+b+c;
    }
}

/** @internal */
export default Logic;