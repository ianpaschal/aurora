import Engine from "./Engine";
import Entity from "./Entity";
/**
 * @module core
 * @classdesc Class representing a state.
 */
export default class State {
    private _timestamp;
    private _entities;
    /**
     * @description Create a state instance from an engine.
     * @param {Engine} engine - Engine instance
     */
    constructor(engine: Engine, complete?: boolean);
    readonly flattened: Object;
    /**
     * @description Get the state's entities.
     * @readonly
     * @returns {Entity[]} - Array of entity instances
     */
    readonly entities: Entity[];
    /**
     * @description Get the state's timestamp in milliseconds.
     * @readonly
     * @returns {number} - Timestamp in milliseconds
     */
    readonly timestamp: number;
    readonly json: string;
}
