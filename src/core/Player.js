// Aurora is distributed under the MIT license.

import * as Three from "three";
import UUID from "uuid/v4";

/** @classdesc Class representing a Player. At the time of writing the Player
	* class is very lightweight but the likely areas of expansion are world
	* visibility ("fog-of-war"), assigning AIs, and resource/economy tracking. */
class Player {

	/** @description Create a Player instance.
		* @param {Object} config - Properties of the player. When loading a saved player, this will likely be a JSON object.
		* @param {String} config.uiud - UUID of the player, used primarily for loading from JSON.
		* @param {String} config.name - Name of the player.
		* @param {Color} config.color - Color of the player, expressed as a HEX string.
		* @param {Object} config.start={x:0,y:0,z:0} - Starting location expressed as an XYZ object.
		* @returns {System} - The newly created Player.
		*/
	constructor( config ) {
		// TODO: Make these private and supply getter functions:
		this.uuid = config.uuid || UUID();
		this.name = config.name || "Unnamed Player";
		if ( !config.color ) {
			config.color = "#CCCCCC";
		}
		this.color = new Three.Color( config.color );

		this.start = new Three.Vector3();
		if ( config.start ) {
			this.start.copy( config.start );
		}
		this._entityUUIDs = [];
		console.log( "Created player " + this.uuid + ": " + this.name + "." );
		this.addVisibilityMap();
		return this;
	}

	/** @description Own an entity by adding its UUID to to the player.
		* @param {Entity} entity - Entity instance to add.
		* @returns {Array} - Updated array of entity UUIDs.
		*/
	own( entity ) {
		// TODO: Validation.
		this._entityUUIDs.push( entity.getUUID() );
		return this._entityUUIDs;
	}

	/** @description Get all entity UUIDs owned by player.
		* @readonly
		* @returns {Array} - Array of entity UUIDs.
		*/
	getEntityUUIDs() {
		return this._entityUUIDs;
	}

	addVisibilityMap() {
		// Create the canvas:
		const canvas = document.createElement( "canvas" );
		canvas.setAttribute( "width", 1024 );
		canvas.setAttribute( "height", 1024 );
		// Paint it black:
		const context = canvas.getContext( "2d" );
		context.fillStyle = "white";
		context.fillRect( 0, 0, canvas.width, canvas.height );
		// And save it:
		this._visibilityMap = canvas;
	}
}

export default Player;
