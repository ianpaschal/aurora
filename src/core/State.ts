// Aurora is distributed under the MIT license.

import Engine from "./Engine"; // Typing
import Entity from "./Entity"; // Typing

/**
 * @module fuck
 * @classdesc Class representing a state.
 */
export default class State {

	private _timestamp: number;
	private _entities:  any[];

	/**
	 * @description Create a state instance from an engine.
	 * @param {number} timestamp - Timestamp in milliseconds
	 * @param {Engine} engine - Engine instance
	 */
	constructor( engine: Engine ) {
		this._timestamp = engine.lastTickTime;
		this._entities = [];
		engine.entities.forEach( ( entity ) => {
			// Copy of the entity's data using non-private property keys
			const components = [];
			entity.components.forEach( ( component ) => {
				components.push( component.data );
			});
			this._entities.push({
				uuid: entity.uuid,
				type: entity.type,
				name: entity.name,
				components: components
			});
		});
		return this;
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
}
