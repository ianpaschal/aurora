import Engine from "./Engine";
import Entity from "./Entity";
import { SystemConfig } from "../utils/interfaces";
/**
 * @module core
 * @classdesc Class representing a system.
 */
export default class System {
    private _accumulator;
    private _componentTypes;
    private _engine;
    private _entityUUIDs;
    private _fixed;
    private _frozen;
    private _methods;
    private _name;
    private _onAddEntity;
    private _onInit;
    private _onRemoveEntity;
    private _onUpdate;
    private _step;
    /**
     * @description Create a System.
     * @param {Object} config - Configuration object
     * @param {string} config.name - System name
     * @param {boolean} config.fixed - Fixed step size or update as often as possible
     * @param {number} config.step - Step size in milliseconds (only used if `fixed` is `false`)
     * @param {array} config.componentTypes - Types to watch
     * @param {Function} config.onInit - Function to run when first connecting the system to the
     * engine
     * @param {Function} config.onAddEntity - Function to run on an entity when adding it to the
     * system's watchlist
     * @param {Function} config.onRemoveEntity - Function to run on an entity when removing it from
     * the system's watchlist
     * @param {Function} config.onUpdate - Function to run each time the engine updates the main loop
     */
    constructor(config: SystemConfig);
    /**
     * @description Get the accumulated time of the system.
     * @readonly
     * @returns {number} - Time in milliseconds
     */
    readonly accumulator: number;
    /**
     * @description Get whether or not the system uses a fixed step.
     * @readonly
     * @returns {boolean} - True if the system uses a fixed step
     */
    readonly fixed: boolean;
    /**
     * @description Get the step size of the system in milliseconds.
     * @readonly
     * @returns {number} - Time in milliseconds
     */
    readonly step: number;
    /**
     * @description Get the entity's name.
     * @readonly
     * @returns {string} - Name string
     */
    readonly name: string;
    /**
     * @description Get all of the component types the system is watching.
     * @readonly
     * @returns {string[]} - Array of component types
     */
    readonly watchedComponentTypes: string[];
    /**
     * @description Get all of the entity UUIDs the system is watching.
     * @readonly
     * @returns {string[]} - Array of UUID strings
     */
    readonly watchedEntityUUIDs: string[];
    /**
     * @description Add an extra method to the system. Cannot be modified after the system is
     * registered with the engine.
     * @param {string} key - Method identifier
     * @param {function} fn - Method to be called by user in the future
     */
    addMethod(key: string, fn: Function): void;
    /**
     * @description Check if the system can watch a given entity.
     * @readonly
     * @param {Entity} entity - Entity to check
     * @returns {boolean} - True if the given entity is watchable
     */
    canWatch(entity: Entity): boolean;
    /**
     * @description Call a user-added method from outside the system. Cannot be modified after the
     * system is registered with the engine.
     * @param {string} key - Method identifier
     * @param {any} payload - Any data which should be passed to the method
     * @returns {any} - Any data which the method returns
     */
    dispatch(key: string, payload?: any): any;
    /**
     * @description Initialize the system (as a part of linking to the engine). After linking the
     * engine, the system will run its stored init hook method. Cannot be modified after the system is
     * registered with the engine.
     * @param {Engine} engine - Engine instance to link to
     */
    init(engine: Engine): void;
    /**
     * @description Check if the system is watching a given component type.
     * @readonly
     * @param {Entity} entity - Component type to check
     * @returns {boolean} - True if the given component type is being watched
     */
    isWatchingComponentType(componentType: string): boolean;
    /**
     * @description Check if the system is watching a given entity.
     * @readonly
     * @param {Entity} entity - Entity instance to check
     * @returns {boolean} - True if the given entity instance is being watched
     */
    isWatchingEntity(entity: Entity): boolean;
    /**
     * @description Remove a user-added method from the system. Cannot be modified after the system is
     * registered with the
     * engine.
     * @param {string} key - Method identifier
     */
    removeMethod(key: string): void;
    /**
     * @description Remove a component type to the system's watch list. Cannot be modified after the
     * system is registered
     * with the engine.
     * @param {string} componentType - Component type to stop watching
     * @returns {array} - Array of watched component types
     */
    unwatchComponentType(componentType: string): string[];
    /**
     * @description Remove an entity UUID to the system's watch list.
     * @param {Entity} entity - Entity instance to stop watching
     * @returns {array} - Array of watched entity UUIDs
     */
    unwatchEntity(entity: Entity): string[];
    /**
     * @description Update the system with a given amount of time to simulate. The system will run its
     * stored update function using either a fixed step or variable step (specified at creation) and
     * the supplied delta time. Cannot be modified after the system is registered with the engine.
     * @param {number} delta - Time in milliseconds to simulate
     */
    update(delta: number): void;
    /**
     * @description Add a single component type to the system's watch list. Cannot be modified after
     * the system is registered with the engine.
     * @param {string} componentType - Component type to watch
     * @returns {array} - Array of watched component types
     */
    watchComponentType(componentType: string): string[];
    /**
     * @description Watch an entity by adding its UUID to to the system. After adding, the system will
     * run the entity through the internal add function to do any additional processing.
     * @param {Entity} entity - Entity instance to watch
     * @returns {array} - Array of watched entity UUIDs
     */
    watchEntity(entity: Entity): string[];
}
