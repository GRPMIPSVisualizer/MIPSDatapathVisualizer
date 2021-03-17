"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayList = void 0;
class ArrayList {
    constructor(initialCapacity) {
        // The array used to store the elements
        this.elementData = [];
        // The number of elements stored in the ArrayList
        this.sizeNum = 0;
        if (typeof initialCapacity === 'number') {
            //initialize the capacity of the ArrayList
            if (initialCapacity < 0) {
                throw new Error("is no arrayList index : " + initialCapacity);
            }
            this.elementData = new Array(initialCapacity);
        }
        else {
            //initialize the capacity of the ArrayList
            this.elementData = new Array(10);
        }
    }
    add(arg0, arg1) {
        if (typeof arg0 === 'number') {
            //add an element using index
            this.ensureExplicitCapacity();
            this.rangeCheck(arg0);
            this.elementData.splice(arg0, 0, arg1);
            this.sizeNum++;
        }
        else {
            //
            this.ensureExplicitCapacity();
            this.elementData[this.sizeNum] = arg0;
            this.sizeNum++;
        }
    }
    /**
     * Get the object specified by the index
     * @param index
     * @return Object
     */
    get(index) {
        this.rangeCheck(index);
        return this.elementData[index];
    }
    /**
     * Update the object at the specified index
     * @param index
     * @param Object
     * @return void
     */
    update(index, Object) {
        this.rangeCheck(index);
        this.elementData[index] = Object;
    }
    remove(arg0) {
        if (typeof arg0 === 'number') {
            this.elementData.splice(arg0, 1);
            this.sizeNum--;
            return true;
        }
        else {
            let result = false;
            for (let i = 0; i < this.sizeNum; i++) {
                if (this.get(i) === arg0) {
                    result = this.remove(i);
                }
            }
            if (result == false) {
                console.log("is no object?");
            }
            return result;
        }
    }
    /**
     * Get the size of the ArrayList
     * @return the size of the ArrayList
     */
    size() {
        return this.sizeNum;
    }
    /**
     * Check whether the index exceeds the capacity
     * @param index
     */
    rangeCheck(index) {
        if (index >= this.sizeNum || index < 0) {
            throw new Error("is no index--->" + index);
        }
    }
    /**
     *  Expand the capacity of the ArrayList to 1.5 times
     */
    ensureExplicitCapacity() {
        if (this.elementData.length < this.sizeNum + 1) {
            let oldCapacity = this.elementData.length;
            let newCapacity = oldCapacity + (oldCapacity >> 1);
            this.elementData.length = newCapacity;
        }
    }
}
exports.ArrayList = ArrayList;
//# sourceMappingURL=ArrayList.js.map