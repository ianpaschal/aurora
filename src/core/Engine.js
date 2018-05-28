// Aurora is distributed under the MIT license.

import Present from "present";
import { Scene, JSONLoader, TextureLoader } from "three";
import Entity from "./Entity";
import State from "./State";
import PluginManager from "../managers/PluginManager";
import StateManager from "../managers/StateManager";
import validate from "../utils/validate";
import { getItem, hasItem } from "../utils";
import EntityLoader from "../loaders/EntityLoader";

/** @classdesc Core singleton representing an instance of the Aurora Engine. The
	* engine is responsible for the creation (and registration) of entities, as
	* well as initialization and running of systems containing game logic. */
class Engine {

	/** @description Create an instance of the Aurora Engine. */
	constructor() {
		console.log( "Initializing a new Engine." );

		// These are the things which are actually saved per game
		this._entities = [];
		this._systems = [];

		// IDEA: Store players as components?
		this._players = [];

		// IDEA: Create a separate 3D class handling assets and scenes
		this._assets = {
			assembly: {},
			geometry: {},
			sound: {},
			texture: {}
		};
		this._scene = new Scene();

		// IDEA: Create a separate timer class which the engine queries
		this._loop = null;
		this._running = false;
		this._lastTickTime = null;
		this._step = 100;
		this._accumulator = 0;
		this._ticks = 0;

		this._stateManager = new StateManager();
		this._pluginManager = new PluginManager();

		this._onUpdateStart = undefined;
		this._onUpdateFinished = undefined;

		// Make structure immutable and return
		Object.seal( this );
		return this;
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

	/** @description Get an Entity instance by UUID.
		* @readonly
		* @param {String} uuid - UUID of the entity to fetch.
		* @returns {(Entity|null)} - Requested entity, or null if not found.
		*/
	getEntity( uuid ) {
		return getItem( uuid, this._entities, "_uuid" );
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

	// GETTERS

	/** @description Get the timestamp of the last update.
		* @readonly
		* @returns {Number} - Timestamp of the last update.
		*/
	get lastTickTime() {
		return this._lastTickTime;
	}

	get onUpdateDone() {
		return this._onUpdateDone;
	}

	get onUpdateStart() {
		return this._onUpdateStart;
	}

	/** @description Get the glogal PluginManager instance.
		* @readonly
		* @returns {PluginManager}
		*/
	get pluginManager() {
		return this._pluginManager;
	}

	/** @description Get the glogal scene instance. NOTE: This will likely become
		* depreciated once rendering is handled exclusively by the client.
		* @readonly
		* @returns {Three.Scene}
		*/
	get scene() {
		return this._scene;
	}

	get stateManager() {
		return this._stateManager;
	}

	// SETTERS

	set pluginManager( pluginManager ) {
		// TODO: Add validation
		this._pluginManager = pluginManager;
	}

	set stateManager( stateManager ) {
		// TODO: Add validation
		this._stateManager = stateManager;
	}

	/** @description Set a function to execute after every update tick.
		* @param {Function} fn - Function to execute.
		* @returns {(Function|Null)} - Updated handler function, or null if invalid.
		*/
	set onUpdateFinished( fn ) {
		if ( typeof fn != "function" ) {
			console.error( "Please supply a valid function." );
			return null;
		}
		this._onUpdateFinished = fn;
	}

	/** @description Set a function to execute before every update tick.
		* @param {Function} fn - Function to execute.
		* @returns {(Function|Null)} - Updated handler function, or null if invalid.
		*/
	set onUpdateStart( fn ) {
		if ( typeof fn != "function" ) {
			console.error( "Please supply a valid function." );
			return null;
		}
		this._onUpdateStart = fn;
	}

	// MISC.

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
		if ( this._onUpdateFinished ) {
			this._onUpdateFinished();
		}
	}

	// IDEA: Handled by PluginStack?
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
