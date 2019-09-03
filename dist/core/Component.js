"use strict";
// Aurora is distributed under the MIT license.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = __importDefault(require("uuid"));
var copy_1 = __importDefault(require("../utils/copy"));
var deepmerge_1 = __importDefault(require("deepmerge"));
/**
 * @module core
 * @classdesc Class representing a component.
 */
var Component = /** @class */ (function () {
    /**
     * @description Create a Component.
     * @param {Object} [config] - Configuration object
     * @param {string} [config.uuid] - Component UUID
     * @param {string} [config.type] - Component type
     * @param {Object} [config.data] - Object containing data for the component
     */
    function Component(config) {
        var _this = this;
        // Define defaults
        this._uuid = uuid_1.default();
        this._type = "noname";
        this._data = {}; // NOTE: Some components use an array
        // Apply config values
        if (config) {
            Object.keys(config).forEach(function (key) {
                // Handle data slightly differently, otherwise simply overwite props with config values
                if (key === "data") {
                    _this._data = copy_1.default(config.data);
                }
                else {
                    _this["_" + key] = config[key];
                }
            });
        }
    }
    Object.defineProperty(Component.prototype, "data", {
        // Expose properties
        /**
         * @description Get the component's data.
         * @readonly
         * @returns {Object} - The component's data
         */
        get: function () {
            return this._data;
        },
        /**
         * @description Set the component's data. Note: This method differs from `.mergeData()` in that it
         * completely overwrites any existing data within the component.
         * @param {Object} data - Data object to apply
         * @returns {Object} - The component's updated updated data object
         */
        set: function (data) {
            this._data = copy_1.default(data);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "json", {
        /**
         * @description Get the component's data as a JSON string.
         * @readonly
         * @returns {string} - The component's data as a JSON string
         */
        get: function () {
            return JSON.stringify({
                data: this._data,
                type: this._type,
                uuid: this._uuid
            }, null, 4);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "type", {
        /**
         * @description Get the component's type.
         * @readonly
         * @returns {string} - The component's type
         */
        get: function () {
            return this._type;
        },
        /**
         * @description Set the component's type.
         * @param {string} type - New type for the component
         */
        set: function (type) {
            this._type = type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "uuid", {
        /**
         * @description Get the component's UUID.
         * @readonly
         * @returns {String} - The component's UUID
         */
        get: function () {
            return this._uuid;
        },
        enumerable: true,
        configurable: true
    });
    // Where is the set uuid() method? Doesn't exist! Don't change the UUID!
    // Other
    /**
     * @description Clone the component.
     * @returns {Component} - New component instance with the same data
     */
    Component.prototype.clone = function () {
        var clone = new Component();
        clone.copy(this);
        return clone;
    };
    /**
     * @description Copy another component's data, resetting existing data.
     * @param {Component} source - Component to copy from
     */
    Component.prototype.copy = function (source) {
        // Don't copy the UUID, only the type and data
        this._type = source.type;
        this._data = copy_1.default(source.data);
    };
    /**
     * @description Merge a data object into this component.
     * @param {Object} data - JSON data to apply to the component
     * @returns {(Object|Array)} - Updated data object/array
     */
    Component.prototype.mergeData = function (data) {
        this._data = deepmerge_1.default(this._data, data);
        return this._data;
    };
    return Component;
}());
exports.default = Component;
//# sourceMappingURL=Component.js.map