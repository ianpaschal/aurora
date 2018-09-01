// Aurora is distributed under the MIT license.

import Engine from "./Engine"; // Typing

/**
 * @classdesc Class representing a State.
 */
export default class State {
	_timestamp: any;
	_entities:  any[];

	/**
	 * @description Create a Player instance.
	 * @param {number} timestamp
	 * @param {Engine} engine - Engine which should be copied
	 * @returns {State} - The newly created State
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

	get entities() {
		return this._entities;
	}

	get timestamp() {
		return this._timestamp;
	}
}
