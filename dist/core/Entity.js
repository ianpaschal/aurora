"use strict";
// Aurora is distributed under the MIT license.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = __importDefault(require("uuid"));
var getItem_1 = __importDefault(require("../utils/getItem"));
var hasItem_1 = __importDefault(require("../utils/hasItem"));
var Component_1 = __importDefault(require("./Component"));
/**
 * @module fuck
 * @classdesc Class representing an entity.
 */
var Entity = /** @class */ (function () {
    /**
     * @description Create an entity. An object can be used when loading a previously created entity from disk, or
     * creating an entity to be used as an assembly to clone into new entity instances.
     * @param {Object} [config] - Configuration object
     * @param {string} [config.uuid] - Entity UUID
     * @param {string} [config.type] - Entity type
     * @param {string} [config.name] - Entity name (typically also called "unit type" in-game)
     * @param {Array} [config.components] - Array of component data objects to generate component instances from
     */
    function Entity(config) {
        var _this = this;
        // Define defaults
        this._uuid = uuid_1.default();
        this._type = "no-type";
        this._name = "No Name";
        this._components = [];
        // Apply config values
        if (config) {
            Object.keys(config).forEach(function (key) {
                // Handle components slightly differently, otherwise simply overwite props with config values
                if (key === "components") {
                    config.components.forEach(function (data) {
                        _this.addComponent(new Component_1.default(data));
                    });
                }
                else {
                    _this["_" + key] = config[key];
                }
            });
        }
    }
    Object.defineProperty(Entity.prototype, "components", {
        /**
         * @description Get all of the entity's component instances.
         * @readonly
         * @returns {Component[]} - Array of component instances
         */
        get: function () {
            return this._components;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "componentTypes", {
        /**
         * @description Get all of the entity's component types.
         * @readonly
         * @returns {string[]} - Array of component types
         */
        get: function () {
            var componentTypes = [];
            this._components.forEach(function (component) {
                componentTypes.push(component.type);
            });
            return componentTypes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "json", {
        /**
         * @description Get the entity's data as a JSON string.
         * @readonly
         * @returns {string} - JSON string
         */
        get: function () {
            var data = {
                uuid: this._uuid,
                type: this._type,
                name: this._name,
                components: []
            };
            this._components.forEach(function (component) {
                data.components.push({
                    data: component.data,
                    type: component.type,
                    uuid: component.uuid
                });
            });
            return JSON.stringify(data, null, 4);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "name", {
        /**
         * @description Get the entity's name.
         * @readonly
         * @returns {string} - Name string
         */
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "type", {
        /**
         * @description Get the entity's type.
         * @readonly
         * @returns {string} - Type string
         */
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "uuid", {
        /**
         * @description Get the entity's UUID.
         * @readonly
         * @returns {string} - UUID string
         */
        get: function () {
            return this._uuid;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @description Add a component instance to the entity. This method should only be called internally, and never after
     * the entity has been registered.
     * @private
     * @param {Component} component - The component to add
     * @returns {Component[]} - Updated array of components, or null if the component already existed
     */
    Entity.prototype.addComponent = function (component) {
        if (this.hasComponent(component.type)) {
            throw Error("Component with type " + component.type + " was already added!");
        }
        this._components.push(component);
        return this._components;
    };
    /**
     * @description Clone the entity.
     * @returns {Entity} - New Entity instance
     */
    Entity.prototype.clone = function () {
        var clone = new Entity();
        clone.copy(this);
        return clone;
    };
    /**
     * @description Copy another entity (such as an assembly) into the entity, replacing all components.
     * @param {Entity} source - Entity to copy
     */
    Entity.prototype.copy = function (source) {
        var _this = this;
        this._type = source.type;
        this._name = source.name;
        this._components = [];
        source.components.forEach(function (component) {
            _this._components.push(component.clone());
        });
    };
    /**
     * @description Get a component instance by type from the entity.
     * @readonly
     * @param {string} type - Component type
     * @returns {Component} - Requested component instance
     */
    Entity.prototype.getComponent = function (type) {
        return getItem_1.default(type, this._components, "_type");
    };
    /**
     * @description Get data by component type from the entity. This is basically a shorthand for .getComponent.getData();
     * @readonly
     * @param {string} type - Component type
     * @returns {any} - Requested component data
     */
    Entity.prototype.getComponentData = function (type) {
        var component = this.getComponent(type);
        if (!component) {
            throw Error("Component with type " + type + " doesn't exist!");
        }
        return component.data;
    };
    /**
     * @description Check if a component is present within the entity.
     * @readonly
     * @param {string} type - Component type
     * @returns {boolean} - True if the component is present
     */
    Entity.prototype.hasComponent = function (type) {
        return hasItem_1.default(type, this._components, "type");
    };
    /**
     * @description Check if the entity is watchable by a given system.
     * @readonly
     * @param {System} system - System instance
     * @returns {boolean} - True if the entity is watchable
     */
    Entity.prototype.isWatchableBy = function (system) {
        // Faster to loop through search criteria vs. all components on entity
        for (var _i = 0, _a = system.watchedComponentTypes; _i < _a.length; _i++) {
            var type = _a[_i];
            // Return early if any required component is missing on entity
            if (!this.hasComponent(type)) {
                return false;
            }
        }
        return true;
    };
    /**
     * @description Remove a component instance from the entity. This method should only be called internally, and never
     * after the entity has been registered.
     * @private
     * @param {string} type - Component type
     * @returns {Component[]} - Array of component instances
     */
    Entity.prototype.removeComponent = function (type) {
        var index = this._components.indexOf(this.getComponent(type));
        if (index === -1) {
            throw Error("Component with type " + type + " doesn't exist!");
        }
        this._components.splice(index, 1);
        return this._components;
    };
    /**
     * @description Overwrite the data for a component of the given type within the entity.
     * @param {string} type - Component type
     * @param {Object} data - Data object
     */
    Entity.prototype.setComponentData = function (type, data) {
        var index = this._components.indexOf(this.getComponent(type));
        if (index === -1) {
            throw Error("Component with type " + type + " doesn't exist!");
        }
        var component = this.getComponent(type);
        component.mergeData(data);
    };
    return Entity;
}());
exports.default = Entity;
//# sourceMappingURL=Entity.js.map