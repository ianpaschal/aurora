import Component from "./Component";
import System from "./System";
import { EntityConfig } from "../utils/interfaces";
/**
 * @module core
 * @classdesc Class representing an entity.
 */
export default class Entity {
    private _components;
    private _name;
    private _type;
    private _uuid;
    /**
     * @description Create an entity. An object can be used when loading a previously created entity from disk, or
     * creating an entity to be used as an assembly to clone into new entity instances.
     * @param {Object} [config] - Configuration object
     * @param {string} [config.uuid] - Entity UUID
     * @param {string} [config.type] - Entity type
     * @param {string} [config.name] - Entity name (typically also called "unit type" in-game)
     * @param {Array} [config.components] - Array of component data objects to generate component instances from
     */
    constructor(config?: EntityConfig);
    /**
     * @description Get all of the entity's component instances.
     * @readonly
     * @returns {Component[]} - Array of component instances
     */
    readonly components: Component[];
    /**
     * @description Get all of the entity's component types.
     * @readonly
     * @returns {string[]} - Array of component types
     */
    readonly componentTypes: string[];
    /**
     * @description Get the entity's data as a JSON string.
     * @readonly
     * @returns {string} - JSON string
     */
    readonly json: string;
    /**
     * @description Get the entity's name.
     * @readonly
     * @returns {string} - Name string
     */
    readonly name: string;
    /**
     * @description Get the entity's type.
     * @readonly
     * @returns {string} - Type string
     */
    readonly type: string;
    /**
     * @description Get the entity's UUID.
     * @readonly
     * @returns {string} - UUID string
     */
    readonly uuid: string;
    /**
     * @description Add a component instance to the entity. This method should only be called internally, and never after
     * the entity has been registered.
     * @private
     * @param {Component} component - The component to add
     * @returns {Component[]} - Updated array of components, or null if the component already existed
     */
    addComponent(component: Component): Component[];
    /**
     * @description Clone the entity.
     * @returns {Entity} - New Entity instance
     */
    clone(): Entity;
    /**
     * @description Copy another entity (such as an assembly) into the entity, replacing all components.
     * @param {Entity} source - Entity to copy
     */
    copy(source: any): void;
    /**
     * @description Get a component instance by type from the entity.
     * @readonly
     * @param {string} type - Component type
     * @returns {Component} - Requested component instance
     */
    getComponent(type: string): Component;
    /**
     * @description Get data by component type from the entity. This is basically a shorthand for .getComponent.getData();
     * @readonly
     * @param {string} type - Component type
     * @returns {any} - Requested component data
     */
    getComponentData(type: string): any;
    /**
     * @description Check if a component is present within the entity.
     * @readonly
     * @param {string} type - Component type
     * @returns {boolean} - True if the component is present
     */
    hasComponent(type: string): boolean;
    /**
     * @description Check if the entity is watchable by a given system.
     * @readonly
     * @param {System} system - System instance
     * @returns {boolean} - True if the entity is watchable
     */
    isWatchableBy(system: System): boolean;
    /**
     * @description Remove a component instance from the entity. This method should only be called internally, and never
     * after the entity has been registered.
     * @private
     * @param {string} type - Component type
     * @returns {Component[]} - Array of component instances
     */
    removeComponent(type: string): Component[];
    /**
     * @description Overwrite the data for a component of the given type within the entity.
     * @param {string} type - Component type
     * @param {Object} data - Data object
     */
    setComponentData(type: string, data: {}): void;
}
