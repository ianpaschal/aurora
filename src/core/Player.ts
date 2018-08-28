// Aurora is distributed under the MIT license.

import { Color, Vector3 } from "three";
import UUID from "uuid/v4";

/**
 * @classdesc Class representing a Player. At the time of writing the Player class is very lightweight but the likely
 * areas of expansion are world visibility ("fog-of-war"), assigning AIs, and resource/economy tracking.
 */
class Player {
	_dirty: boolean;
	_entityUUIDs: any;
	_UUID: any;
	_name: any;
	_tasks: any;
	_start: any;
	_visibilityMap: HTMLCanvasElement;

	/**
	 * @description Create a Player instance.
	 * @param {Object} [config] - Properties of the player. When loading a saved player, this will likely be a JSON object
	 * @param {String} [config.UUID] - UUID of the player, used primarily for loading from JSON
	 * @param {String} [config.name] - Name of the player
	 * @param {Color} [config.color] - Color of the player
	 * @param {Vector3} [config.start] - Starting location in the world
	 * @param {Array} [config.entityUUIDs] - Array of strings of entity UUIDs
	 * @returns {Player} - The newly created player
	 */
	constructor( config ) {

		const defaults = {
			UUID: UUID(),
			name: "Unnamed Player",
			color: new Color( 0xCCCCCC ),
			start: new Vector3(),
			entityUUIDs: []
		};

		// For every property in the defaults, apply the config value if it exists, otherwise use the default value
		for ( const prop in defaults ) {
			if ( defaults.hasOwnProperty( prop ) ) {
				this[ "_" + prop ] = config[ prop ] || defaults[ prop ];
			}
		}

		// Newly constructed entities should never be dirty after creation
		this._dirty = false;

		return this;
	}

	// Getters & Setters

	/**
	 * @description Check if any component has been changed since the last update.
	 * @readonly
	 * @returns {Boolean} - True if the entity has been changed
	 */
	get dirty() {
		return this._dirty;
	}

	/**
	 * @description Set the player as dirty or clean.
	 * @param {Boolean} dirty - Value to set the dirty flag
	 * @returns {Boolean} - The player's dirty flag
	 */
	set dirty( dirty ) {
		this._dirty = dirty;
	}

	/**
	 * @description Get all entity UUIDs owned by player.
	 * @readonly
	 * @returns {Array} - Array of entity UUIDs
	 */
	get entityUUIDs() {
		return this._entityUUIDs;
	}

	/**
	 * @description Get the player's data as a JSON string.
	 * @readonly
	 * @returns {String} - The player's data as a JSON string
	 */
	get JSON() {

		// Provide new keys instead of stringifying private properties (with '_')
		return JSON.stringify({
			UUID: this._UUID,
			name: this._name,
			color: this._tasks,
			start: this._start,
			entityUUIDs: this._entityUUIDs,
			dirty: this._dirty
		}, null, 4 );
	}

	/**
	 * @description Get the player's UUID.
	 * @readonly
	 * @returns {String} - The player's UUID
	 */
	get UUID() {
		return this._UUID;
	}

	/**
	 * @description Get the player's name.
	 * @readonly
	 * @returns {String} - The player's name
	 */
	get name() {
		return this._name;
	}

	/**
	 * @description Set the player's name.
	 * @param {String} name - Name to set the player's name
	 */
	set name( name ) {
		this._name = name;
	}

	// Other methods

	/**
	 * @description Own an entity by adding its UUID to to the player.
	 * @param {Entity} entity - Entity instance to add
	 * @returns {Array} - Updated array of entity UUIDs
	 */
	own( entity ) {
		// TODO: Add validation
		this._entityUUIDs.push( entity.getUUID() );
		return this._entityUUIDs;
	}

	addVisibilityMap() {
		// Create the canvas:
		const canvas = document.createElement( "canvas" );
		canvas.setAttribute( "width", "1024" );
		canvas.setAttribute( "height", "1024" );
		// Paint it black:
		const context = canvas.getContext( "2d" );
		context.fillStyle = "white";
		context.fillRect( 0, 0, canvas.width, canvas.height );
		// And save it:
		this._visibilityMap = canvas;
	}
}

export default Player;
