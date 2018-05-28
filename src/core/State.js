// Aurora is distributed under the MIT license.

/** @classdesc Class representing a State.*/
class State {

	/** @description Create a Player instance.
		* @param {Number} timestamp - Properties of the player. When loading a saved
		* player, this will likely be a JSON object.
		* @param {Array} engine - Engine which should be copied.
		* @returns {State} - The newly created State.
		*/
	constructor( engine ) {
		this.timestamp = engine.lastTickTime;
		this.entities = [];
		this.players = [];
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
