// Aurora is distributed under the MIT license.

import Present from "present";
import { Scene, JSONLoader, TextureLoader } from "three";
import Entity from "./Entity";
import State from "./State";
import validate from "../utils/validate";
import { getItem, hasItem } from "../utils";
import buildLoadStack from "../utils/buildLoadStack";
import EntityLoader from "../loaders/EntityLoader";

/** @classdesc Core singleton representing an instance of the Aurora Engine. The
	* engine is responsible for the creation (and registration) of entities, as
	* well as initialization and running of systems containing game logic.
	* @returns - The newly created Engine.
	*/
class Engine {

	/** @description Create an instance of the Aurora Engine. */
	constructor() {
		console.log( "Initializing a new Engine." );

		this._scene = new Scene();
		this._pluginLocations = [];
		this._pluginStack = [];

		// These are the things which are actually saved per game
		this._entities = [];
		this._systems = [];

		// IDEA: Store players as components?
		this._players = [];

		this._assets = {
			assembly: {},
			geometry: {},
			sound: {},
			texture: {}
		};

		// Timing:
		this._running = false;
		this._lastTickTime = null;
		this._step = 100;
		this._accumulator = 0;
		this._ticks = 0;
		this._states = [];
		this._maxStates = 10;

		return this;
	}

	addState( state ) {

		if ( !state ) {
			const timestamp = this._ticks * this._step;
			state = new State( timestamp, this );
		}

		// Unshift so that _states[0] is always the most recent state.
		this._states.unshift( state );

		/* To avoid using too much memory, if _states is now longer than _maxStates,
			trim _states to _maxStates length. */
		if ( this._states.length > this._maxStates ) {
			this._states = this._states.slice( 0, this._maxStates );
		}
	}

	applyState( state ) {
		this._lastTickTime = state.timestamp;
		state.entities.forEach( ( entity ) => {
			if ( hasItem( entity._uuid, this._entities, "_uuid" ) ) {
				const instance = this.getEntity( entity._uuid );
				/* Don't bother checking if entity has component because if it's already
					been registered it will be frozen. */
				instance.getComponents.forEach( ( component ) => {
					const type = component.getType();
					const data = entity.components[ type ];
					component.apply( data );
				});
			}
			else {
				const instance = new Entity( entity );
				this.registerEntity( instance );
			}
		});
		state.players.forEach( ( entity ) => {
			if ( hasItem( entity._uuid, this._entities, "_uuid" ) ) {
				const instance = this.getEntity( entity._uuid );
				/* Don't bother checking if entity has component because if it's already
					been registered it will be frozen. */
				instance.getComponents.forEach( ( component ) => {
					const type = component.getType();
					const data = entity._components[ type ];
					component.apply( data );
				});
			}
			else {
				const instance = new Entity( entity );
				this.registerEntity( instance );
			}
		});
	}

	/** @description Build the load stack. NOTE: Right now, this is essentially a
		* just a wrapper for buildLoadStack(), which should be moved from utils into
		* this file eventually.
		* @readonly
		* @returns {Array} - Array of asset items.
		*/
	findPlugins() {
		return buildLoadStack( this._pluginLocations, this._pluginStack );
	}

	getAsset( type, id ) {
		if ( !this._assets[ type ] ) {
			return console.log( "No assets of type " + type + " exist." );
		}
		const asset = this._assets[ type ][ id ];
		if ( !asset ) {
			return console.log( "Asset " + id + " does not exist." );
		}
		return asset;
	}

	// // TODO: Phase out in favor of getting asset.
	// /** @description Get an assembly (Entity instance) by type.
	// 	* @readonly
	// 	* @param {String} type - Type of assembly to fetch.
	// 	* @returns {(Assembly|null)} - Requested assembly, or null if not found.
	// 	*/
	// getAssembly( type ) {
	// 	const assembly = getItem( type, this._assemblies, "_type" );
	// 	if ( !assembly ) {
	// 		return console.error( "Assembly not found!" );
	// 	}
	// 	return assembly;
	// }

	/** @description Get an Entity instance by UUID.
		* @readonly
		* @param {String} uuid - UUID of the entity to fetch.
		* @returns {(Entity|null)} - Requested entity, or null if not found.
		*/
	getEntity( uuid ) {
		return getItem( uuid, this._entities, "_uuid" );
	}

	// // TODO: Phase out in favor of getting asset.
	// /** @description Get a Three.Geometry instance by type.
	// 	* @readonly
	// 	* @param {String} type - Type of geometry to fetch.
	// 	* @returns {(Geometry|null)} - Requested geometry, or null if not found.
	// 	*/
	// getGeometry( type ) {
	// 	if ( this._geometries[ type ] ) {
	// 		return this._geometries[ type ];
	// 	}
	// 	else {
	// 		console.error( "Please supply a valid geometry type." );
	// 	}
	// }

	/** @description Get a number of states from the end of the state stack.
		* @readonly
		* @param {Number} num - Number of recent states to fetch.
		* @returns {Array} - Array of states, starting with the most recent.
		*/
	getLastStates( num ) {
		return this._states.slice( 0, num ).reverse();
	}

	/** @description Get the timestamp of the last update.
		* @readonly
		* @returns {Number} - Timestamp of the last update.
		*/
	getLastTickTime() {
		return this._lastTickTime;
	}

	/** @description Get a number of states in the state stack.
		* @readonly
		* @returns {Number} - The number of states in the state stack.
		*/
	getNumStates() {
		return this._states.length;
	}

	/** @description Get a Player instance by index.
		* @readonly
		* @param {Number} index - Index (player number) to fetch.
		* @returns {(Player|null)} - Requested player, or null if not found.
		*/
	getPlayer( index ) {
		if ( validate( "playerIndex", index ) ) {
			return this._players[ index ];
		}
		console.error( "Please supply a valid player index." );
		return null;
	}

	// TODO: This should eventually be phased out. Scenes should be handled by clients.
	/** @description Get the glogal scene instance. NOTE: This will likely become
		* depreciated once rendering is handled exclusively by the client.
		* @readonly
		* @returns {Three.Scene}
		*/
	getScene() {
		return this._scene;
	}

	/** @description Add an Entity instance to to the engine.
		* After being registered and initialized, systems are immutable and updated
		* every game loop.
		* @param {Entity} entity - Entity instance to add.
		* @returns {Array} - Updated array of entities.
		*/
	registerEntity( entity ) {

		// Make entity immutable (component data is still mutable though)
		Object.seal( entity );

		this._entities.push( entity );

		// Check all systems to see if they should be watching this entity
		this._systems.forEach( ( system ) => {
			if ( system.isWatchable( entity ) ) {
				system.addEntity( entity );
			}
		});

		return this._entities;
	}

	/** @description Add a Player instance to to the engine.
		* @param {Player} player - Player instance to add.
		* @returns {(Array|null)} - Updated array of players, or null if invalid.
		*/
	registerPlayer( player ) {
		if ( validate( "isPlayer", player ) ) {
			this._players.push( player );
			return this._players;
		}
		console.error( "Please supply a valid player instance." );
		return null;
	}

	/** @description Add a location to scan for plugins.
		* @param {String} path - Location (file path) to add.
		* @returns {Array} - Updated array of plugin locations.
		*/
	registerPluginLocation( path ) {
		// TODO: Validation.
		this._pluginLocations.push( path );
		return this._pluginLocations;
	}

	/** @description Add a System instance to the engine.
		* After being registered and initialized, systems are immutable and updated
		* every game loop.
		* @param {System} system - System instance to initialize and add.
		* @returns {(Array|null)} - Updated array of Systems, or null if invalid.
		*/
	registerSystem( system ) {
		if ( !validate( "isSystem", system ) ) {
			console.error( "Please supply a valid system instance." );
			return null;
		}
		system.init( this );
		this._systems.push( system );
		return this._systems;
	}

	/** @description Set the Engine's plugin stack.
		* @param {Array} stack - Array of plugins to load.
		* @returns {Array} - Updated array of plugins.
		*/
	setPluginStack( stack ) {
		this._pluginStack = stack;
		return this._pluginStack;
	}

	/** @description Set a function to execute after every update tick.
		* @param {Function} fn - Function to execute.
		* @returns {(Function|Null)} - Updated handler function, or null if invalid.
		*/
	setOnUpdateEnd( fn ) {
		if ( typeof fn != "function" ) {
			console.error( "Please supply a valid function." );
			return null;
		}
		this._onUpdateEnd = fn;
		return this._onUpdateEnd;
	}

	/** @description Set a function to execute before every update tick.
		* @param {Function} fn - Function to execute.
		* @returns {(Function|Null)} - Updated handler function, or null if invalid.
		*/
	setOnUpdateStart( fn ) {
		if ( typeof fn != "function" ) {
			console.error( "Please supply a valid function." );
			return null;
		}
		this._onUpdateStart = fn;
		return this._onUpdateStart;
	}

	/** @description Start the execution of the update loop. */
	start() {
		// Always reset in case engine was stopped and restarted.
		this._lastTickTime = Present();
		this._running = true;
		setInterval( tick.bind( this ), this._step );
		function tick() {
			if ( this._running ) {
				const now = Present();
				const delta = now - this._lastTickTime;
				this._lastTickTime = now;
				this._accumulator += delta;
				while ( this._accumulator > this._step ) {
					this._update();
					this._accumulator -= this._step;
				}
			}
		}
	}

	/** @description Stop the execution of the update loop. */
	stop() {
		this._running = false;
	}

	/** @description Update all systems.
		* @private
		*/
	_update() {

		// Run any pre-update behavior.
		if ( this._onUpdateStart ) {
			this._onUpdateStart();
		}

		// Perform the update on every system.
		this._systems.forEach( ( system ) => {
			system.update( this._step );
		});

		// Keep track of which tick this was.
		this._ticks++;

		// Run any post-update behavior.
		if ( this._onUpdateEnd ) {
			this._onUpdateEnd();
		}
	}

	loadAssets( stack, onProgress, onFinished ) {
		const scope = this;
		let loaded = 0;

		// If nothing to load, skip straight to on finished:
		if ( stack.length === 0 ) {
			onFinished();
		}

		const loaders = {
			"assembly": new EntityLoader(),
			"texture": new TextureLoader(),
			"geometry": new JSONLoader()
		};

		stack.forEach( ( item ) => {
			if ( !loaders[ item.type ] ) {
				console.error( "No loader for type " + item.type );
				return;
			}
			loaders[ item.type ].load(
				item.path,
				( asset ) => {
					scope._assets[ item.type ][ item.name ] = asset;
					loaded++;
					onProgress( item.name );
					if ( loaded === stack.length ) {
						onFinished();
					}
				},
				undefined,
				( err ) => {
					console.error( "Failed to load", stack.textures[ name ], err );
				}
			);
		});
	}
}

export default Engine;
