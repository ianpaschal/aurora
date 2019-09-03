// Aurora is distributed under the MIT license.

import Engine from "./Engine"; // Typing
import Entity from "./Entity"; // Typing

/**
 * @module core
 * @classdesc Class representing a state.
 */
export default class State {

	private _timestamp: number;
	private _entities:  any[];

	/**
	 * @description Create a state instance from an engine.
	 * @param {Engine} engine - Engine instance
	 */
	constructor( engine: Engine, complete: boolean = false ) {
		this._timestamp = engine.lastTickTime;
		this._entities = [];
		engine.entities.forEach( ( entity ) => {

			// If not performing a full state capture and the entity is not dirty, skip it
			if ( complete || entity.dirty || entity.destroy ) {
				return;
			}

			// Otherwise, flatten it to a JSON object and push it to the array
			this._entities.push( entity.flattened );
		});
		return this;
	}

	get flattened(): Object {
		return {
			timestamp: this._timestamp,
			entities: this._entities
		};
	}

	/**
	 * @description Get the state's entities.
	 * @readonly
	 * @returns {Entity[]} - Array of entity instances
	 */
	get entities(): Entity[] {
		return this._entities;
	}

	/**
	 * @description Get the state's timestamp in milliseconds.
	 * @readonly
	 * @returns {number} - Timestamp in milliseconds
	 */
	get timestamp(): number {
		return this._timestamp;
	}

	get json(): string {
		return JSON.stringify( this.flattened, null, 4 );
	}
}
