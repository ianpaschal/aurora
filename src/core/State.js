// Aurora is distributed under the MIT license.

/**
 * @classdesc Class representing a State.
 */
class State {

	/**
	 * @description Create a Player instance.
	 * @param {Number} timestamp
	 * @param {Array} engine - Engine which should be copied
	 * @returns {State} - The newly created State
	 */
	constructor( engine ) {
		this._timestamp = engine.lastTickTime;
		this._entities = [];
		this._players = [];
		engine._entities.forEach( ( entity ) => {
			this.entities.push( entity.getJSON() );
		});
		engine._players.forEach( ( player ) => {
			this.players.push( player.getJSON() );
		});
		return this;
	}
}

export default State;
