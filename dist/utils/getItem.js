"use strict";
// Aurora is distributed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module utils
 */
function getItem(target, array, prop) {
    var match = array.find(function (item) {
        return item[prop] === target;
    });
    if (!match) {
        return null;
    }
    return match;
}
exports.default = getItem;
//# sourceMappingURL=getItem.js.map