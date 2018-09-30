"use strict";
// Aurora is distributed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
// This is removed via Parcel when creating a production bundle
console.warn("If you are seeing this message, you are running Aurora in development mode.", "Make sure to turn on production mode when deploying for production.", "See more tips at https://ianpaschal.github.io/aurora/guide/deployment");
// Core
var Component_1 = require("./core/Component");
exports.Component = Component_1.default;
var Engine_1 = require("./core/Engine");
exports.Engine = Engine_1.default;
var Entity_1 = require("./core/Entity");
exports.Entity = Entity_1.default;
var State_1 = require("./core/State");
exports.State = State_1.default;
var System_1 = require("./core/System");
exports.System = System_1.default;
// Utils
var capitalize_1 = require("./utils/capitalize");
exports.capitalize = capitalize_1.default;
var copy_1 = require("./utils/copy");
exports.copy = copy_1.default;
var getItem_1 = require("./utils/getItem");
exports.getItem = getItem_1.default;
var hasItem_1 = require("./utils/hasItem");
exports.hasItem = hasItem_1.default;
//# sourceMappingURL=index.js.map