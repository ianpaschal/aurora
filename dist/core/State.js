"use strict";
// Aurora is distributed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module fuck
 * @classdesc Class representing a state.
 */
var State = /** @class */ (function () {
    /**
     * @description Create a state instance from an engine.
     * @param {number} timestamp - Timestamp in milliseconds
     * @param {Engine} engine - Engine instance
     */
    function State(engine) {
        var _this = this;
        this._timestamp = engine.lastTickTime;
        this._entities = [];
        engine.entities.forEach(function (entity) {
            // Copy of the entity's data using non-private property keys
            var components = [];
            entity.components.forEach(function (component) {
                components.push(component.data);
            });
            _this._entities.push({
                uuid: entity.uuid,
                type: entity.type,
                name: entity.name,
                components: components
            });
        });
        return this;
    }
    Object.defineProperty(State.prototype, "entities", {
        /**
         * @description Get the state's entities.
         * @readonly
         * @returns {Entity[]} - Array of entity instances
         */
        get: function () {
            return this._entities;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "timestamp", {
        /**
         * @description Get the state's timestamp in milliseconds.
         * @readonly
         * @returns {number} - Timestamp in milliseconds
         */
        get: function () {
            return this._timestamp;
        },
        enumerable: true,
        configurable: true
    });
    return State;
}());
exports.default = State;
//# sourceMappingURL=State.js.map