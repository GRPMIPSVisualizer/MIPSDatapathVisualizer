"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This is the documentation for this file
 * @module
 * We are using browserify to pack our compiled code. However, the browserify will enclose all the module, which means we can not access class inside the packed file<br/>
 * To address this problem, I created a single file Hardware.ts to export neccessary class here and use this file as entrypoint for browserify.<br/>
 * by doing this, we can exposed the compiled class to the global namespace and thus can access objects anc classes in need.
 * @module
 */
const Single_CycleCPU_1 = require("./CPU/Single-CycleCPU");
module.exports = Single_CycleCPU_1.singleCycleCpu;
//# sourceMappingURL=Hardware.js.map