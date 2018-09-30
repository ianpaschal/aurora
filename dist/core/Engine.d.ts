import Entity from "./Entity";
import System from "./System";
/**
 * @module fuck
 * @classdesc Core singleton representing an instance of the Aurora engine. The engine is responsible for the creation
 * (and registration) of entities, as well as initialization and running of systems containing game logic.
 */
export default class Engine {
    private _assemblies;
    private _entities;
    private _lastTickTime;
    private _onTickComplete;
    private _onTickStart;
    private _running;
    private _systems;
    /**
     * @description Create an instance of the Aurora engine.
     */
    constructor();
    /**
     * @description Get all of the engine's assemblies.
     * @readonly
     * @returns {Entity[]} - Array of assembly (entity) instances
     */
    readonly assemblies: Entity[];
    /**
     * @description Get all of the engine's entities.
     * @readonly
     * @returns {Entity[]} - Array of entity instances
     */
    readonly entities: Entity[];
    /**
     * @description Get the function currently set to execute after every tick.
     * @readonly
     * @returns {Function} - Function currently set to execute
     */
    /**
    * @description Set a function to execute after every update tick.
    * @param {Function} fn - Function to execute
    */
    onTickComplete: Function;
    /**
     * @description Get the function currently set to execute before every tick.
     * @readonly
     * @returns {Function} - Function currently set to execute
     */
    /**
    * @description Set a function to execute before every update tick.
    * @param {Function} fn - Function to execute
    */
    onTickStart: Function;
    /**
     * @description Get whether or not the engine is currently running.
     * @readonly
     * @returns {boolean} - True if the engine is running
     */
    readonly running: boolean;
    /**
     * @description Get all of the engine's systems.
     * @readonly
     * @returns {System[]} - Array of system instances
     */
    readonly systems: System[];
    /**
     * @description Get the timestamp of the engine's last tick.
     * @readonly
     * @returns {number} - Timestamp in milliseconds
     */
    readonly lastTickTime: number;
    /**
     * @description Add an assembly (entity) instance to the engine.
     * @param {Entity} assembly - Assembly instance
     * @returns {Entity[]} - Array of assembly (entity) instances
     */
    addAssembly(assembly: Entity): Entity[];
    /**
     * @description Add an entity instance to the engine. This will check which systems should watch it, and add it to
     * those systems (running the entity through each system's onAdd hook. After being added and initialized, entities are
     * immutable (although their component data is not).
     * @param {Entity} entity - Entity instance
     * @returns {Entity[]} - Array of entity instances
     */
    addEntity(entity: Entity): Entity[];
    /**
     * @description Add a system instance to the engine. This will run the system's onInit hook. After being added and
     * initialized, systems are immutable and are updated every game tick.
     * @param {System} system - System instance
     * @returns {System[]} - Array of system instances
     */
    addSystem(system: System): System[];
    /**
     * @description Get an assembly (entity) instance by type from the engine.
     * @readonly
     * @param {string} type - Assembly type
     * @returns {Entity} - Requested assembly (entity) instance
     */
    getAssembly(type: string): Entity;
    /**
     * @description Get an entity instance by UUID from the engine.
     * @readonly
     * @param {string} uuid - Entity UUID
     * @returns {Entity} - Requested entity instance
     */
    getEntity(uuid: string): Entity;
    /**
     * @description Get a system instance by name from the engine.
     * @readonly
     * @param {string} name - System name
     * @returns {System} - Requested system instance
     */
    getSystem(name: string): System;
    /**
     * @description Check if an assembly is present within the engine.
     * @readonly
     * @param {string} name - Assembly name
     * @returns {boolean} - True if the assembly is present
     */
    hasAssembly(type: string): boolean;
    /**
     * @description Check if a system is present within the engine.
     * @readonly
     * @param {string} name - System name
     * @returns {boolean} - True if the entity is present
     */
    hasEntity(uuid: string): boolean;
    /**
     * @description Check if a system is present within the engine.
     * @readonly
     * @param {string} name - System name
     * @returns {boolean} - True if the system is present
     */
    hasSystem(name: string): boolean;
    /**
     * @description Start the execution of the update loop.
     */
    start(): void;
    /**
     * @description Stop the execution of the update loop.
     */
    stop(): void;
    /**
     * @description Perform one tick and update all systems.
     * @private
     */
    tick(): void;
}
