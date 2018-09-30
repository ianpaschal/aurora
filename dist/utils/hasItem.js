"use strict";
// Aurora is distributed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module utils
 */
function hasItem(target, array, prop) {
    var match = array.find(function (item) {
        return item[prop] === target;
    });
    if (!match) {
        return false;
    }
    return true;
}
exports.default = hasItem;
//# sourceMappingURL=hasItem.js.map