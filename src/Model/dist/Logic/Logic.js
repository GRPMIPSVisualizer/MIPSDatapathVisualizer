"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logic = void 0;
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
class Logic {
    /**
     * initialize the input pin 1 and 2
    */
    constructor(inputPin1, inputPin2) {
        /**
         * outpin for logic components,the default value is 0
        */
        this.outpin = 0;
        this.pin1 = inputPin1;
        this.pin2 = inputPin2;
    }
    /**
     * This method encodes the input output pair
     *
    */
    toBinaryString() {
        let a = this.pin1 + "";
        let b = this.pin2 + "";
        let c = this.outpin + "";
        return a + b + c;
    }
}
exports.Logic = Logic;
/** @internal */
exports.default = Logic;
//# sourceMappingURL=Logic.js.map