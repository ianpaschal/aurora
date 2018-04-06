// Aurora is distributed under the MIT license.

import FS from "fs";
import Path from "path";
import * as Three from "three";
import Entity from "./Entity";
import Player from "./Player";
import World from "./World";
import validate from "../utils/validate";
import getItem from "../utils/getItem";
import graphicsSystem from "../plugins/systems/graphics.js";
import terrainSystem from "../plugins/systems/terrain.js";
import productionSystem from "../plugins/systems/production.js";
import movementSystem from "../plugins/systems/movement.js";
import visibilitySystem from "../plugins/systems/visibility";

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

		// These are the things which are actually saved per game:
		this._entities = [];
		this._players = [];

		// Static Resources:
		this._assemblies = [];
		this._systems = [];

		// TODO: Make these into arrays. ,map, .filter and .find all give us what we need.
		this._geometries = {}; // Three.Geometry class does not have .getType() method.
		this._materials = {}; // Three.Material class does not have .getType() method.
		this._sounds = {}; // Sound does not have .getType() method.
		this._textures = {}; // Three.Texture class does not have .getType() method.

		// Timing:
		this._running = false;
		this._lastFrameTime = null;

		return this;
	}

	/** @description Get an assembly (Entity instance) by type.
		* @readonly
		* @param {String} type - Type of assembly to fetch.
		* @returns {(Assembly|null)} - Requested assembly, or null if not found.
		*/
	getAssembly( type ) {
		return getItem( type, this._assemblies, "_type" );
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

	/** @description Get the glogal scene instance.
		* @readonly
		* @returns {Three.Scene}
		*/
	getScene() {
		return this._scene;
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
		this._pluginsDir = path;
		this._pluginLocations.push( path );
		return this._pluginLocations;
	}

	/** @description Add a System instance to the engine.
		* After being registered and initialized, systems are immutable and updated
		* every game loop.
		* @param {System} system - System instance to initialize and add.
		* @returns {(Array|null)} - Updated array of systems, or null if invalid.
		*/
	registerSystem( system ) {
		if ( validate( "isSystem", system ) ) {
			system.init( this );
			this._systems.push( system );
			return this._systems;
		}
		console.error( "Please supply a valid system instance." );
		return null;
	}

	/** @description Start the execution of the update loop. */
	start() {
		/* Always reset. If engine was stopped and restarted, not resetting could
			cause a massive time jump to be added to all systems. */
		this._lastFrameTime = performance.now();
		this._running = true;
		setInterval( this._update.bind( this ), 1000 / 60 );
	}

	/** @description Stop the execution of the update loop. */
	stop() {
		this._running = false;
	}

	/** @description Update all systems.
		* @private
		*/
	_update() {
		if ( this._running ) {
			const now = performance.now();
			const delta = now - this._lastFrameTime;
			this._lastFrameTime = now;
			this._systems.forEach( ( system ) => {
				system.update( delta );
			});
		}
	}

	init( stack, world, onProgress, onFinished ) {
		// Compute total length:
		let length = 0;
		let loaded = 0;
		for ( const section in stack ) {
			length += Object.keys( stack[ section ] ).length;
		}
		if ( world ) {
			length += Object.keys( world.entities ).length;
		}
		function updateProgress( itemName ) {
			loaded++;
			onProgress( ( loaded / length ) * 100, "Loaded " + itemName );
		}

		// Load assets. On finished, start the world loading/generation routine:
		// onProgress is called when an asset is loaded and passed the
		this.loadAssets( stack, updateProgress, () => {

			// Systems must be intialized after loading so they can use assets:
			this.registerSystem( graphicsSystem );
			this.registerSystem( terrainSystem );
			this.registerSystem( productionSystem );
			this.registerSystem( movementSystem );
			this.registerSystem( visibilitySystem );

			this._world = new World();
			this._world.setTime( 0 );

			// If no source is provided, generate a new world:
			if ( !world ) {
				console.warn( "World is missing, a new one will be generated!" );
				this.generateWorld( false, updateProgress, onFinished );
			}
			else {
				this.loadWorld( world, updateProgress, onFinished );
			}
		});
	}

	loadAssets( stack, onProgress, onFinished ) {
		const scope = this;
		let loaded = 0;
		let length = 0;
		for ( const section in stack ) {
			length += Object.keys( stack[ section ] ).length;
		}
		const pluginDir = this._pluginsDir;
		const textureLoader = new Three.TextureLoader();
		const JSONLoader = new Three.JSONLoader();

		// Load these backwards (textures, materials, geometries, aseemblies)
		const loaders = {
			loadTextures() {
				for ( const name in stack.texture ) {
					textureLoader.load(
						Path.join( pluginDir, stack.texture[ name ] ),
						( texture ) => {
							scope._textures[ name ] = texture;
							addLoaded( name );
						},
						undefined,
						( err ) => {
							console.error( "Failed to load", stack.textures[ name ], err );
						}
					);
				}
			},
			loadMaterials() {
				for ( const name in stack.material ) {
					addLoaded( name );
				}
			},
			loadGeometries() {
				for ( const type in stack.geometry ) {
					JSONLoader.load(
						Path.join( pluginDir, stack.geometry[ type ] ),
						( geometry ) => {
							scope._geometries[ type ] = geometry;
							addLoaded( type );
						},
						undefined,
						( err ) => {
							console.error( err );
						}
					);
				}
			},
			loadAssemblies() {
				for ( const name in stack.assembly ) {
					const path = Path.join( pluginDir, stack.assembly[ name ] );
					const json = JSON.parse( FS.readFileSync( path, "utf8" ) );
					scope.registerAssembly( new Entity( json ) );
					addLoaded( name );
				}
			},
			loadIcons() {
				for ( const name in stack.icon ) {
					addLoaded( name );
				}
			}
		};
		for ( const loader in loaders ) {
			loaders[ loader ]();
		}
		function addLoaded( name ) {
			loaded++;
			onProgress( name );
			if ( loaded === length ) {
				onFinished();
			}
		}
	}

	generateWorld( config, onProgress, onFinished ) {

		if ( !config ) {
			const path = Path.join( __dirname, "../plugins/maps/default.json" );
			config = JSON.parse( FS.readFileSync( path, "utf8" ) );
		}

		config.players.forEach( ( data ) => {
			const player = new Player( data );
			this.registerPlayer( player );

			// Generate test entities:
			const entity = new Entity();
			player.own( entity );
			entity.copy( this.getAssembly( "greek-settlement-age-0" ) );
			entity.getComponent( "player" ).apply({
				index: this._players.indexOf( player )
			});
			entity.getComponent( "position" ).apply({
				x: player.start.x,
				y: player.start.y
			});
			entity.getComponent( "production" ).apply({
				queue: [
					{ "type": "greek-villager-male", "progress": 100 },
					{ "type": "greek-villager-male", "progress": 100 },
					{ "type": "greek-villager-male", "progress": 100 }
				]
			});
			this.registerEntity( entity );
		});

		onFinished();
	}
}

export default Engine;
