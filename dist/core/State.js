"use strict";
// Aurora is distributed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module core
 * @classdesc Class representing a state.
 */
var State = /** @class */ (function () {
    /**
     * @description Create a state instance from an engine.
     * @param {Engine} engine - Engine instance
     */
    function State(engine, complete) {
        if (complete === void 0) { complete = false; }
        var _this = this;
        this._timestamp = engine.lastTickTime;
        this._entities = [];
        engine.entities.forEach(function (entity) {
            // If not performing a full state capture and the entity is not dirty, skip it
            if (complete || entity.dirty || entity.destroy) {
                return;
            }
            // Otherwise, flatten it to a JSON object and push it to the array
            _this._entities.push(entity.flattened);
        });
        return this;
    }
    Object.defineProperty(State.prototype, "flattened", {
        get: function () {
            return {
                timestamp: this._timestamp,
                entities: this._entities
            };
        },
        enumerable: true,
        configurable: true
    });
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
    Object.defineProperty(State.prototype, "json", {
        get: function () {
            return JSON.stringify(this.flattened, null, 4);
        },
        enumerable: true,
        configurable: true
    });
    return State;
}());
exports.default = State;
//# sourceMappingURL=State.js.map