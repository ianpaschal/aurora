"use strict";
// Aurora is distributed under the MIT license.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var present_1 = __importDefault(require("present"));
var getItem_1 = __importDefault(require("../utils/getItem"));
var hasItem_1 = __importDefault(require("../utils/hasItem"));
/**
 * @module core
 * @classdesc Core singleton representing an instance of the Aurora engine. The engine is responsible for the creation
 * (and registration) of entities, as well as initialization and running of systems containing game logic.
 */
var Engine = /** @class */ (function () {
    /**
     * @description Create an instance of the Aurora engine.
     */
    function Engine() {
        // TODO: Build from JSON in the case of loading a save
        console.log("Aurora: Initializing a new engine.");
        // These are the things which are actually saved per game
        this._assemblies = [];
        this._entities = [];
        this._systems = [];
        // The heart of the engine
        this._running = false;
        this._lastTickTime = null;
        this._onTickStart = undefined;
        this._onTickComplete = undefined;
        return this;
    }
    Object.defineProperty(Engine.prototype, "assemblies", {
        /**
         * @description Get all of the engine's assemblies.
         * @readonly
         * @returns {Entity[]} - Array of assembly (entity) instances
         */
        get: function () {
            return this._assemblies;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "entities", {
        /**
         * @description Get all of the engine's entities.
         * @readonly
         * @returns {Entity[]} - Array of entity instances
         */
        get: function () {
            return this._entities;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "onTickComplete", {
        /**
         * @description Get the function currently set to execute after every tick.
         * @readonly
         * @returns {Function} - Function currently set to execute
         */
        get: function () {
            return this._onTickComplete;
        },
        /**
         * @description Set a function to execute after every update tick.
         * @param {Function} fn - Function to execute
         */
        set: function (fn) {
            this._onTickComplete = fn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "onTickStart", {
        /**
         * @description Get the function currently set to execute before every tick.
         * @readonly
         * @returns {Function} - Function currently set to execute
         */
        get: function () {
            return this._onTickStart;
        },
        /**
         * @description Set a function to execute before every update tick.
         * @param {Function} fn - Function to execute
         */
        set: function (fn) {
            this._onTickStart = fn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "running", {
        /**
         * @description Get whether or not the engine is currently running.
         * @readonly
         * @returns {boolean} - True if the engine is running
         */
        get: function () {
            return this._running;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "systems", {
        /**
         * @description Get all of the engine's systems.
         * @readonly
         * @returns {System[]} - Array of system instances
         */
        get: function () {
            return this._systems;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "lastTickTime", {
        /**
         * @description Get the timestamp of the engine's last tick.
         * @readonly
         * @returns {number} - Timestamp in milliseconds
         */
        get: function () {
            return this._lastTickTime;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @description Add an assembly (entity) instance to the engine.
     * @param {Entity} assembly - Assembly instance
     * @returns {Entity[]} - Array of assembly (entity) instances
     */
    Engine.prototype.addAssembly = function (assembly) {
        // Validate
        if (this.hasAssembly(assembly.type)) {
            throw Error("Assembly of that type has already been added!");
        }
        // Freeze entity's structure
        Object.seal(assembly);
        this._assemblies.push(assembly);
        return this._assemblies;
    };
    /**
     * @description Add an entity instance to the engine. This will check which systems should watch it, and add it to
     * those systems (running the entity through each system's onAdd hook. After being added and initialized, entities are
     * immutable (although their component data is not).
     * @param {Entity} entity - Entity instance
     * @returns {Entity[]} - Array of entity instances
     */
    Engine.prototype.addEntity = function (entity) {
        // Validate
        if (this.hasEntity(entity.uuid)) {
            throw Error("Entity with that UUID has already been added!");
        }
        // Freeze entity's structure
        Object.seal(entity);
        this._entities.push(entity);
        // Check all systems to see if they should be watching this entity
        this._systems.forEach(function (system) {
            if (entity.isWatchableBy(system)) {
                system.watchEntity(entity);
            }
        });
        return this._entities;
    };
    /**
     * @description Add a system instance to the engine. This will run the system's onInit hook. After being added and
     * initialized, systems are immutable and are updated every game tick.
     * @param {System} system - System instance
     * @returns {System[]} - Array of system instances
     */
    Engine.prototype.addSystem = function (system) {
        // Validate
        if (this.hasSystem(system.name)) {
            throw Error("System with that name has already been added!");
        }
        // Add it and start it
        this._systems.push(system);
        system.init(this);
        // Freeze entity's structure
        Object.freeze(system);
        return this._systems;
    };
    /**
     * @description Get an assembly (entity) instance by type from the engine.
     * @readonly
     * @param {string} type - Assembly type
     * @returns {Entity} - Requested assembly (entity) instance
     */
    Engine.prototype.getAssembly = function (type) {
        if (!this.hasAssembly(type)) {
            throw Error("No assembly of that type found!");
        }
        return getItem_1.default(type, this._assemblies, "type");
    };
    /**
     * @description Get an entity instance by UUID from the engine.
     * @readonly
     * @param {string} uuid - Entity UUID
     * @returns {Entity} - Requested entity instance
     */
    Engine.prototype.getEntity = function (uuid) {
        if (!this.hasEntity(uuid)) {
            throw Error("No enitity with that UUID found!");
        }
        return getItem_1.default(uuid, this._entities, "uuid");
    };
    /**
     * @description Get a system instance by name from the engine.
     * @readonly
     * @param {string} name - System name
     * @returns {System} - Requested system instance
     */
    Engine.prototype.getSystem = function (name) {
        if (!this.hasSystem(name)) {
            throw Error("No system with that name found!");
        }
        return getItem_1.default(name, this._systems, "name");
    };
    /**
     * @description Check if an assembly is present within the engine.
     * @readonly
     * @param {string} name - Assembly name
     * @returns {boolean} - True if the assembly is present
     */
    Engine.prototype.hasAssembly = function (type) {
        return hasItem_1.default(type, this._assemblies, "type");
    };
    /**
     * @description Check if a system is present within the engine.
     * @readonly
     * @param {string} name - System name
     * @returns {boolean} - True if the entity is present
     */
    Engine.prototype.hasEntity = function (uuid) {
        return hasItem_1.default(uuid, this._entities, "uuid");
    };
    /**
     * @description Check if a system is present within the engine.
     * @readonly
     * @param {string} name - System name
     * @returns {boolean} - True if the system is present
     */
    Engine.prototype.hasSystem = function (name) {
        return hasItem_1.default(name, this._systems, "name");
    };
    /**
     * @description Start the execution of the update loop.
     */
    Engine.prototype.start = function () {
        // Always reset in case engine was stopped and restarted
        this._lastTickTime = present_1.default();
        // Start ticking!
        this._running = true;
        this.tick();
    };
    /**
     * @description Stop the execution of the update loop.
     */
    Engine.prototype.stop = function () {
        this._running = false;
    };
    /**
     * @description Perform one tick and update all systems.
     * @private
     */
    Engine.prototype.tick = function () {
        if (this._running) {
            var now = present_1.default();
            var delta_1 = now - this._lastTickTime;
            this._lastTickTime = now;
            // Run any pre-update behavior
            if (this._onTickStart) {
                this._onTickStart();
            }
            // Perform the update on every system
            this._systems.forEach(function (system) {
                system.update(delta_1);
            });
            // Run any post-update behavior
            if (this._onTickComplete) {
                this._onTickComplete();
            }
        }
    };
    return Engine;
}());
exports.default = Engine;
//# sourceMappingURL=Engine.js.map