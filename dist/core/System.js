"use strict";
// Aurora is distributed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module core
 * @classdesc Class representing a system.
 */
var System = /** @class */ (function () {
    /**
     * @description Create a System.
     * @param {Object} config - Configuration object
     * @param {string} config.name - System name
     * @param {boolean} config.fixed - Fixed step size or update as often as possible
     * @param {number} config.step - Step size in milliseconds (only used if `fixed` is `false`)
     * @param {array} config.componentTypes - Types to watch
     * @param {Function} config.onInit - Function to run when first connecting the system to the engine
     * @param {Function} config.onAddEntity - Function to run on an entity when adding it to the system's watchlist
     * @param {Function} config.onRemoveEntity - Function to run on an entity when removing it from the system's watchlist
     * @param {Function} config.onUpdate - Function to run each time the engine updates the main loop
     */
    function System(config) {
        var _this = this;
        // Define defaults
        this._accumulator = 0;
        this._componentTypes = [];
        this._engine = undefined;
        this._entityUUIDs = [];
        this._fixed = false;
        this._frozen = false;
        this._methods = {};
        this._name = "no-name";
        this._onAddEntity = function (entity) { };
        this._onInit = function () { };
        this._onRemoveEntity = function (entity) { };
        this._onUpdate = function (delta) { };
        this._step = 100;
        // Apply config values
        Object.keys(config).forEach(function (key) {
            // Handle component types and methods slightly differently, otherwise simply overwite props with config values
            var specialCases = ["componentTypes", "methods", "entityUUIDs"];
            // If not a special case
            if (specialCases.indexOf(key) > -1) {
                switch (key) {
                    case "methods":
                        Object.keys(config.methods).forEach(function (key) {
                            _this.addMethod(key, config.methods[key]);
                        });
                        break;
                    case "componentTypes":
                        Object.keys(config.componentTypes).forEach(function (key) {
                            _this.watchComponentType(config.componentTypes[key]);
                        });
                        break;
                }
            }
            else {
                _this["_" + key] = config[key];
            }
        });
    }
    Object.defineProperty(System.prototype, "accumulator", {
        /**
         * @description Get the accumulated time of the system.
         * @readonly
         * @returns {number} - Time in milliseconds
         */
        get: function () {
            return this._accumulator;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(System.prototype, "fixed", {
        /**
         * @description Get whether or not the system uses a fixed step.
         * @readonly
         * @returns {boolean} - True if the system uses a fixed step
         */
        get: function () {
            return this._fixed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(System.prototype, "step", {
        /**
         * @description Get the step size of the system in milliseconds.
         * @readonly
         * @returns {number} - Time in milliseconds
         */
        get: function () {
            return this._step;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(System.prototype, "name", {
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
    Object.defineProperty(System.prototype, "watchedComponentTypes", {
        /**
         * @description Get all of the component types the system is watching.
         * @readonly
         * @returns {string[]} - Array of component types
         */
        get: function () {
            return this._componentTypes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(System.prototype, "watchedEntityUUIDs", {
        /**
         * @description Get all of the entity UUIDs the system is watching.
         * @readonly
         * @returns {string[]} - Array of UUID strings
         */
        get: function () {
            return this._entityUUIDs;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @description Add an extra method to the system. Cannot be modified after the system is registered with the engine.
     * @param {string} key - Method identifier
     * @param {function} fn - Method to be called by user in the future
     */
    System.prototype.addMethod = function (key, fn) {
        // TODO: Error handling
        this._methods[key] = fn.bind(this);
    };
    /**
     * @description Check if the system can watch a given entity.
     * @readonly
     * @param {Entity} entity - Entity to check
     * @returns {boolean} - True if the given entity is watchable
     */
    System.prototype.canWatch = function (entity) {
        // TODO: Error handling
        // Faster to loop through search criteria vs. all components on entity
        for (var _i = 0, _a = this._componentTypes; _i < _a.length; _i++) {
            var type = _a[_i];
            // Return early if any required component is missing on entity
            if (!entity.hasComponent(type)) {
                return false;
            }
        }
        return true;
    };
    /**
     * @description Call a user-added method from outside the system. Cannot be modified after the system is registered
     * with the engine.
     * @param {string} key - Method identifier
     * @param {any} payload - Any data which should be passed to the method
     * @returns {any} - Any data which the method returns
     */
    System.prototype.dispatch = function (key, payload) {
        if (!this._methods[key]) {
            throw Error("Method " + key + " does not exist!");
        }
        return this._methods[key](payload);
    };
    /**
     * @description Initialize the system (as a part of linking to the engine). After linking the engine, the system will
     * run its stored init hook method. Cannot be modified after the system is registered with the engine.
     * @param {Engine} engine - Engine instance to link to
     */
    System.prototype.init = function (engine) {
        console.log("Initializing a new system: " + this._name + ".");
        this._engine = engine;
        // Run the actual init behavior:
        if (this._onInit) {
            this._onInit();
        }
        // Freeze the system to make it immutable:
        this._frozen = true;
    };
    /**
     * @description Check if the system is watching a given component type.
     * @readonly
     * @param {Entity} entity - Component type to check
     * @returns {boolean} - True if the given component type is being watched
     */
    System.prototype.isWatchingComponentType = function (componentType) {
        if (this._componentTypes.indexOf(componentType) > -1) {
            return true;
        }
        return false;
    };
    /**
     * @description Check if the system is watching a given entity.
     * @readonly
     * @param {Entity} entity - Entity instance to check
     * @returns {boolean} - True if the given entity instance is being watched
     */
    System.prototype.isWatchingEntity = function (entity) {
        if (this._entityUUIDs.indexOf(entity.uuid) > -1) {
            return true;
        }
        return false;
    };
    /**
     * @description Remove a user-added method from the system. Cannot be modified after the system is registered with the
     * engine.
     * @param {string} key - Method identifier
     */
    System.prototype.removeMethod = function (key) {
        if (!this._methods[key]) {
            throw Error("Method " + key + " does not exist!");
        }
        delete this._methods[key];
    };
    /**
     * @description Remove a component type to the system's watch list. Cannot be modified after the system is registered
     * with the engine.
     * @param {string} componentType - Component type to stop watching
     * @returns {array} - Array of watched component types
     */
    System.prototype.unwatchComponentType = function (componentType) {
        var index = this._componentTypes.indexOf(componentType);
        if (this._componentTypes.length < 2) {
            throw Error("Cannot remove component type, this system will be left with 0.");
        }
        if (index == -1) {
            throw Error("Component type not found on system.");
        }
        this._componentTypes.splice(index, 1);
        return this._componentTypes;
    };
    /**
     * @description Remove an entity UUID to the system's watch list.
     * @param {Entity} entity - Entity instance to stop watching
     * @returns {array} - Array of watched entity UUIDs
     */
    System.prototype.unwatchEntity = function (entity) {
        var index = this._entityUUIDs.indexOf(entity.uuid);
        if (index < 0) {
            throw Error("Could not unwatch entity " + entity.uuid + "; not watched.");
        }
        this._entityUUIDs.splice(index, 1);
        return this._entityUUIDs;
    };
    /**
     * @description Update the system with a given amount of time to simulate. The system will run its stored update
     * function using either a fixed step or variable step (specified at creation) and the supplied delta time. Cannot be
     * modified after the system is registered with the engine.
     * @param {number} delta - Time in milliseconds to simulate
     */
    System.prototype.update = function (delta) {
        if (this._fixed) {
            // Add time to the accumulator & simulate if greater than the step size:
            this._accumulator += delta;
            while (this._accumulator >= this._step) {
                this._onUpdate(this._step);
                this._accumulator -= this._step;
            }
        }
        else {
            this._onUpdate(delta);
        }
    };
    /**
     * @description Add a single component type to the system's watch list. Cannot be modified after the system is
     * registered with the engine.
     * @param {string} componentType - Component type to watch
     * @returns {array} - Array of watched component types
     */
    System.prototype.watchComponentType = function (componentType) {
        // Early return if frozen; this avoids updating the entity watch list during
        // execution.
        if (this._frozen) {
            throw Error("Cannot modify watchedComponentTypes after adding to engine.");
        }
        // Check if this component type is already present
        if (this._componentTypes.indexOf(componentType) > -1) {
            throw Error("Component type " + componentType + " is already being watched!");
        }
        // If not, add it to the system
        this._componentTypes.push(componentType);
        return this._componentTypes;
    };
    /**
     * @description Watch an entity by adding its UUID to to the system. After adding, the system will run the entity
     * through the internal add function to do any additional processing.
     * @param {Entity} entity - Entity instance to watch
     * @returns {array} - Array of watched entity UUIDs
     */
    System.prototype.watchEntity = function (entity) {
        // Check if this entity is already being watched
        if (this._entityUUIDs.indexOf(entity.uuid) >= 0) {
            throw Error("Entity " + entity.uuid + " is already being watched!");
        }
        this._entityUUIDs.push(entity.uuid);
        this._onAddEntity(entity);
        return this._entityUUIDs;
    };
    return System;
}());
exports.default = System;
//# sourceMappingURL=System.js.map