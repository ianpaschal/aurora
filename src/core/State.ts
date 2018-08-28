// Aurora is distributed under the MIT license.

// For typing
interface Engine {
	lastTickTime: number;
	_entities:    any[];
	_players:     any[];
}

/**
 * @classdesc Class representing a State.
 */
export default class State {
	_timestamp: any;
	_entities:  any[];
	_players:   any[];

	/**
	 * @description Create a Player instance.
	 * @param {Number} timestamp
	 * @param {Array} engine - Engine which should be copied
	 * @returns {State} - The newly created State
	 */
	constructor( engine: Engine ) {
		this._timestamp = engine.lastTickTime;
		this._entities = [];
		this._players = [];
		engine._entities.forEach( ( entity ) => {
			this._entities.push( entity.getJSON() );
		});
		engine._players.forEach( ( player ) => {
			this._players.push( player.getJSON() );
		});
		return this;
	}

	get entities() {
		return this._entities;
	}

	get players() {
		return this._players;
	}

	get timestamp() {
		return this._timestamp;
	}
}
