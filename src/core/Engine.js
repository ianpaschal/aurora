// Aurora is distributed under the MIT license.

import FS from "fs";
import Path from "path";
import Present from "present";
import * as Three from "three";
import Entity from "./Entity";
import validate from "../utils/validate";
import { deepCopy, getItem } from "../utils";
import buildLoadStack from "../utils/buildLoadStack";
import terrainSystem from "../systems/terrain.js";
import productionSystem from "../systems/production.js";
import movementSystem from "../systems/movement.js";

/** @classdesc Core singleton representing an instance of the Aurora Engine. The
	* engine is responsible for the creation (and registration) of entities, as
	* well as initialization and running of systems containing game logic.
	* @returns - The newly created Engine.
	*/
class Engine {

	/** @description Create an instance of the Aurora Engine. */
	constructor() {
		console.log( "Initializing a new Engine." );

		this._scene = new Three.Scene();
		this._pluginLocations = [];
		this._pluginStack = [];

		// These are the things which are actually saved per game
		this._entities = [];
		this._players = [];

		// These are loaded each run
		this._assemblies = [];
		this._systems = [];

		// TODO: Make these into arrays. .map, .filter, and .find all give us what we need.
		// TODO: Replace these with a Resource class.
		this._geometries = {}; // Three.Geometry class does not have .getType() method.
		this._materials = {}; // Three.Material class does not have .getType() method.
		this._sounds = {}; // Sound does not have .getType() method.
		this._textures = {}; // Three.Texture class does not have .getType() method.

		// Timing:
		this._running = false;
		this._lastFrameTime = null;
		this._step = 100;
		this._accumulator = 0;
		this._ticks = 0;
		this._states = [];
		this._maxStates = 10;

		return this;
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

	/** @description Get an assembly (Entity instance) by type.
		* @readonly
		* @param {String} type - Type of assembly to fetch.
		* @returns {(Assembly|null)} - Requested assembly, or null if not found.
		*/
	getAssembly( type ) {
		const assembly = getItem( type, this._assemblies, "_type" );
		if ( !assembly ) {
			return console.error( "Assembly not found!" );
		}
		return assembly;
	}

	/** @description Get an Entity instance by UUID.
		* @readonly
		* @param {String} uuid - UUID of the entity to fetch.
		* @returns {(Entity|null)} - Requested entity, or null if not found.
		*/
	getEntity( uuid ) {
		return getItem( uuid, this._entities, "_uuid" );
	}

	/** @description Get a Three.Geometry instance by type.
		* @readonly
		* @param {String} type - Type of geometry to fetch.
		* @returns {(Geometry|null)} - Requested geometry, or null if not found.
		*/
	getGeometry( type ) {
		if ( this._geometries[ type ] ) {
			return this._geometries[ type ];
		}
		else {
			console.error( "Please supply a valid geometry type." );
		}
	}

	/** @description Get a number of states from the end of the state stack.
		* @readonly
		* @param {Number} num - Number of recent states to fetch.
		* @returns {Array} - Array of states, starting with the most recent.
		*/
	getLastStates( num ) {
		return this._states.slice( 0, num ).reverse();
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

	/** @description Get the glogal scene instance. NOTE: This will likely become
		* depreciated once rendering is handled exclusively by the client.
		* @readonly
		* @returns {Three.Scene}
		*/
	getScene() {
		return this._scene;
	}

	/** @description Registers Systems and starts the Engine.
		*/
	launch() {
		this.registerSystem( terrainSystem );
		this.registerSystem( productionSystem );
		this.registerSystem( movementSystem );
		this.start();
	}

	/** @description Add an Entity instance to to the engine as an assembly.
		* @param {Entity} assembly - Entity instance to add.
		* @returns {Array} - Updated array of assemblies.
		*/
	registerAssembly( assembly ) {
		// TODO: Validation.
		this._assemblies.push( assembly );
		return this._assemblies;
	}

	/** @description Add an Entity instance to to the engine.
		* After being registered and initialized, systems are immutable and updated
		* every game loop.
		* @param {Entity} entity - Entity instance to add.
		* @returns {Array} - Updated array of entities.
		*/
	registerEntity( entity ) {
		// Make entity immutable (component data is still mutable though):
		Object.seal( entity );
		this._entities.push( entity );
		// Check all systems to see if they should be watching this entity:
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
		/* Always reset. If engine was stopped and restarted, not resetting could
			cause a massive time jump to be added to all systems. */
		this._lastFrameTime = Present();
		this._running = true;
		setInterval( tick.bind( this ), this._step );
		function tick() {
			if ( this._running ) {
				const now = Present();
				const delta = now - this._lastFrameTime;
				this._lastFrameTime = now;
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

		// TODO: Create and save state.
		const timestamp = this._ticks * this._step;

		// Unshift so that _states[0] is always the most recent state.
		this._states.unshift( this._snapshot( timestamp ) );

		/* To avoid using too much memory, if _states is now longer than _maxStates,
			trim _states to _maxStates length. */
		if ( this._states.length > this._maxStates ) {
			this._states = this._states.slice( 0, this._maxStates );
		}

		// Run any post-update behavior.
		if ( this._onUpdateEnd ) {
			this._onUpdateEnd();
		}
	}

	/** @description Create a state object containing all player and entity data.
		* @private
		* @param {Number} timestamp - Timestamp to record this state under.
		* @param {Boolean} complete - Whether to include all players and entities in
		* the state or only dirty ones.
		* @returns {Object} - Object including saved data for players and entities.
		*/
	_snapshot( timestamp, complete ) {
		const data = {
			timestamp: timestamp,
			players: [],
			entities: []
		};

		// TODO: Add filtering instead of sending every entity every update.
		this._entities.forEach( ( entity ) => {
			data.entities.push( deepCopy( entity ) );
		});
		this._players.forEach( ( player ) => {
			data.players.push( deepCopy( player ) );
		});
		return data;
	}

	// TODO: These functions are gnarly. Clean them up!

	loadAssets( stack, onProgress, onFinished ) {
		const scope = this;
		let loaded = 0;

		// If nothing to load, skip straight to on finished:
		if ( stack.length === 0 ) {
			onFinished();
		}

		const textureLoader = new Three.TextureLoader();
		const JSONLoader = new Three.JSONLoader();

		// Load these backwards (textures, materials, geometries, aseemblies)
		const loaders = {
			texture( item ) {
				textureLoader.load(
					item.path,
					( texture ) => {
						scope._textures[ item.name ] = texture;
						addLoaded( item.name );
					},
					undefined,
					( err ) => {
						console.error( "Failed to load", stack.textures[ name ], err );
					}
				);
			},
			loadMaterials() {
				for ( const name in stack.material ) {
					addLoaded( name );
				}
			},
			geometry( item ) {
				JSONLoader.load(
					item.path,
					( geometry ) => {
						scope._geometries[ item.type ] = geometry;
						addLoaded( item.name );
					},
					undefined,
					( err ) => {
						console.error( err );
					}
				);
			},
			assembly( item ) {
				const json = JSON.parse( FS.readFileSync( item.path, "utf8" ) );
				scope.registerAssembly( new Entity( json ) );
				addLoaded( item.name );
			},
			loadIcons() {
				for ( const name in stack.icon ) {
					addLoaded( name );
				}
			}
		};

		stack.forEach( ( item ) => {
			loaders[ item.type ]( item );
		});

		function addLoaded( name ) {
			loaded++;
			onProgress( name );
			if ( loaded === stack.length ) {
				onFinished();
			}
		}
	}

	// init( stack, world, onProgress, onFinished ) {
	// 	// Compute total length:
	// 	let length = 0;
	// 	let loaded = 0;
	// 	for ( const section in stack ) {
	// 		length += Object.keys( stack[ section ] ).length;
	// 	}
	// 	if ( world ) {
	// 		length += Object.keys( world.entities ).length;
	// 	}
	// 	function updateProgress( itemName ) {
	// 		loaded++;
	// 		onProgress( ( loaded / length ) * 100, "Loaded " + itemName );
	// 	}
	// 	function onLoadComplete() {
	//
	// 		// Systems must be intialized after loading so they can use assets:
	// 		// this.registerSystem( graphicsSystem );
	// 		this.registerSystem( terrainSystem );
	// 		this.registerSystem( productionSystem );
	// 		this.registerSystem( movementSystem );
	// 		// this.registerSystem( visibilitySystem );
	//
	// 		// this._world = new World();
	// 		// this._world.setTime( 0 );
	//
	// 		// If no source is provided, generate a new world:
	// 		if ( !world ) {
	// 			console.warn( "World is missing, a new one will be generated!" );
	// 			this.testPopulateWorld( 4, updateProgress, onFinished );
	// 		}
	// 		else {
	// 			this.loadWorld( world, updateProgress, onFinished );
	// 		}
	// 	}
	//
	// 	// Load assets. On finished, start the world loading/generation routine:
	// 	// onProgress is called when an asset is loaded and passed the
	// 	if ( stack.length > 0 ) {
	// 		console.log( "Going to load stuff" );
	// 		this.loadAssets( stack, updateProgress, onLoadComplete.bind( this ) );
	// 	}
	// 	else {
	// 		onLoadComplete.bind( this )();
	// 	}
	// }

}

export default Engine;
