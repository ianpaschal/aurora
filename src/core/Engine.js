// Forge is distributed under the MIT license.

// External libraries:
import FS from "fs";
import Path from "path";
import * as Three from "three";

// Internal modules:
import Component from "./Component";
import Entity from "./Entity";
import Player from "./Player";

// Systems:
/* In the future, it may be desireable to replace this with directory scanning
	to automatically load all availible systems. Maybe... */
import animationSystem from "../systems/animation";
import lightingSystem from "../systems/lighting";
import soundSystem from "../systems/sound";
import resourceSystem from "../systems/resources";

// Additional utilities:
import validate from "../utils/validate";
import DecalGeometry from "../utils/DecalGeometry";

/** @classdesc Core singleton representing an instance of the Forge Engine. */
class Engine {

	/** Create an instance of the Forge Engine. */
	constructor() {
		console.log( "Initializing a new Engine." );

		this._scene = new Three.Scene();

		// These are the things which are actually saved per game:
		this._entities = [];
		this._world = {
			time: 0,
			name: ""
		};
		this._players = [];

		// Static Resources:
		// TODO: Make these into arrays. ,map, .filter and .find all give us what we need.
		this._assemblies = [];
		this._components = [];
		this._systems = [];

		this._geometries = {}; // Three.Geometry class does not have .getType() method.
		this._materials = {}; // Three.Material class does not have .getType() method.
		this._sounds = {}; // Sound does not have .getType() method.
		this._textures = {}; // Three.Texture class does not have .getType() method.

		// Timing:
		this._running = false;
		this._lastFrameTime = null;
	}

	addPluginsLocation( path ) {
		this._pluginsDir = path;
		console.log( this._pluginsDir );
	}

	// Getters:

	getAssembly( type ) {
		const match = this._assemblies.find( ( assembly ) => {
			return assembly.getType() === type;
		});
		if ( match ) {
			return match;
		}
		console.warn( "Assembly " + type + " could not be found in the engine." );
	}

	getComponent( type ) {
		const match = this._components.find( ( component ) => {
			return component.getType() === type;
		});
		if ( match ) {
			return match;
		}
		console.warn( "Component " + type + " could not be found in the engine." );
	}

	/** Get an `Entity` instance by UUID.
		* @param {String} uuid - The entity's uuid.
		*/
	getEntity( uuid ) {
		const match = this._entities.find( ( entity ) => {
			return entity.getUUID() === uuid;
		});
		if ( match ) {
			return match;
		}
		console.warn( "Entity " + uuid + " could not be found in the engine." );
	}

	/** Get a `Three.Geometry` instance by type.
		* @param {String} type - The geometry's type.
		*/
	getGeometry( type ) {
		if ( this._geometries[ type ] ) {
			return this._geometries[ type ];
		}
		else {
			console.error( "Please supply a valid geometry type." );
		}
	}

	/** Get a `Player` instance by index (player number).
		* @param {Number} index - The player number (in order of creation).
		*/
	getPlayer( index ) {
		if ( validate( "playerIndex", index ) ) {
			return this._players[ index ];
		}
		console.error( "Please supply a valid player index." );
		return null;
	}

	/*
	getLocation( mouse, camera ) {

	}
	getSelection( max, min, camera ) {
		return this._entityCache.getScreenPoints( max, min );
	}
	*/

	/** Get the glogal scene instance.
		*/
	getScene() {
		return this._scene;
	}

	// Registers:

	/** Add an `Entity` instance to to the engine as a re-usable assembly.
		* @param {Entity} assembly - The instance to add.
		*/
	registerAssembly( assembly ) {
		this._assemblies.push( assembly );
		return;
	}

	/** Add a `Component` instance to to the engine.
		* @param {Component} component - The instance to add.
		*/
	registerComponent( component ) {
		this._components.push( component );
		return;
	}

	/** Add an `Entity` instance to to the engine.
		* @param {Entity} entity - The instance to add.
		*/
	registerEntity( entity ) {
		this._entities.push( entity );
		return;
	}

	/** Add a `Player` instance to to the engine.
		* @param {Player} player - The instance to add.
		*/
	registerPlayer( player ) {
		if ( validate( "isPlayer", player ) ) {
			this._players.push( player );
			return;
		}
		console.error( "Please supply a valid player instance." );
		return null;
	}

	/** @description Register a system with the engine (so it can be updated later).
		* Used internally by `.registerSystems()`.
		*/
	registerSystem( system ) {
		if ( validate( "isSystem", system ) ) {
			system.init( this );
			this._systems.push( system );
			return;
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
		setInterval( this.update.bind( this ), 1000 / 60 );
	}

	/** @description Stop the execution of the update loop. */
	stop() {
		this._running = false;
	}

	/** @description Update all systems (if the engine is currently running). */
	update() {
		if ( this._running ) {
			const now = performance.now();
			const delta = now - this._lastFrameTime;
			this._lastFrameTime = now;
			this._systems.forEach( ( system ) => {
				system.update( delta );
			});
		}
	}

	// Everything south of here is pretty gnarly. Not sure what to do with it for now.

	//---

	//---

	//---

	// TODO: Move this to it's own system. Maybe animation. Animated models need
	// to be registered there anyway.
	spawn( entity ) {
		const geoIndex = Math.floor( Math.random() * entity.getData( "geometry" ).length );
		const geometry = this.getGeometry( entity.getData( "geometry" )[ geoIndex ] );
		const material = new Three.MeshLambertMaterial({
			color: new Three.Color( 1, 1, 1 ),
			map: this._textures[ entity.getData( "material" ) + "-diffuse" ],
			alphaMap: this._textures[ entity.getData( "material" ) + "-alpha" ],
			alphaTest: 0.5, // if transparent is false
			transparent: false
		});
		const mesh = new Three.Mesh( geometry, material );
		mesh.position.copy( entity.getData( "position" ) );
		mesh.rotation.copy( entity.getData( "rotation" ) );
		mesh.entityID = entity.getUUID();
		this._scene.add( mesh );

		// Decal
		const ground = this._scene.getObjectByName( "ground" );
		const textureLoader = new Three.TextureLoader();

		const decalMap = textureLoader.load(
			Path.join( this._pluginsDir, "forge-aom-mod/texture/nature-rock-base-decal-diffuse.png" ),
			undefined,
			undefined,
			( err ) => {
				console.error( "Failed to load", err );
			}
		);
		const decalMapAlpha = textureLoader.load(
			Path.join( this._pluginsDir, "forge-aom-mod/texture/nature-rock-base-decal-alpha.png" ),
			undefined,
			undefined,
			( err ) => {
				console.error( "Failed to load", err );
			}
		);
		const decalGeo = new DecalGeometry( ground, mesh.position, mesh.rotation, new Three.Vector3( 4, 4, 4 ) );
		const decalMat = new Three.MeshLambertMaterial({
			/*
			normalMap: decalNormal,
			normalScale: new Three.Vector2( 1, 1 ),
			*/
			map: decalMap,
			alphaMap: decalMapAlpha,
			transparent: true,
			depthTest: true,
			depthWrite: false,
			polygonOffset: true,
			polygonOffsetFactor: - 4
		});
		const decalMesh = new Three.Mesh( decalGeo, decalMat );
		this._scene.add( decalMesh );
	}

	generateWorld( config, onProgress, onFinished ) {

		/* Later, config should be loaded from disk, for now it's hard coded. */
		const resources = {
			food: 100,
			wood: 100,
			metal: 100
		};
		config = config || {
			name: "Test World",
			players: [
				new Player( null, {
					color: new Three.Color( 0xA0B35D ),
					name: "Gaia",
					start: new Three.Vector3( 0, 0, 0 ),
					resources: {}
				}),
				new Player( null, {
					color: new Three.Color( 0x0000ff ),
					name: "Ian",
					start: new Three.Vector3( 0, 0, 0 ),
					resources: resources
				}),
				new Player( null, {
					color: new Three.Color( 0xff0000 ),
					name: "Thomas",
					start: new Three.Vector3( 200, -100, 0 ),
					resources: resources
				}),
				new Player( null, {
					color: new Three.Color( 0x00ff00 ),
					name: "Winston",
					start: new Three.Vector3( -100, 200, 0 ),
					resources: resources
				})
			]
		};

		config.players.forEach( ( player ) => {
			this.registerPlayer( player );

			// Create ground:
			const groundTexture = this._textures[ "nature-grass-75-dirt-25" ];
			groundTexture.wrapS = Three.RepeatWrapping;
			groundTexture.wrapT = Three.RepeatWrapping;
			groundTexture.repeat.set( 32, 32 );
			const ground = new Three.Mesh(
				new Three.PlaneGeometry( 512, 512 ),
				new Three.MeshLambertMaterial({
					color: 0xffffff,
					map: groundTexture
				})
			);
			ground.name = "ground";
			this._scene.add( ground );

			// Generate test entities:
			for ( let i = 0; i < 4; i++ ) {
				const entity = new Entity();
				player.own( entity );
				entity.copy( this.getAssembly( "nature-rock-granite" ) );
				entity.setComponentData( "player", this._players.indexOf( player ) );
				entity.setComponentData( "position", {
					x: player.start.x + ( Math.random() * 32 - 16 ),
					y: player.start.y + ( Math.random() * 32 - 16 )
				});
				entity.setComponentData( "rotation", {
					z: Math.random() * Math.PI
				});
				this.registerEntity( entity );
				this.spawn( entity );
			}
		});

		onFinished();
	}

	init( stack, world, onProgress, onFinished ) {

		// Start systems:
		const systems = [
			animationSystem,
			lightingSystem,
			resourceSystem,
			soundSystem
		];
		systems.forEach( ( system ) => {
			this.registerSystem( system );
		});

		/* TODO: This should be more elegant. But for now I'm not sure if components
		need their own class or not. The whole idea is kind of that they're just
		data. */
		const componentFiles = FS.readdirSync( Path.join( __dirname, "../components" ) );
		componentFiles.forEach( ( file ) => {
			const path = Path.join( __dirname, "../components", file );
			const data = FS.readFileSync( path, "utf8" );
			const json = JSON.parse( data );
			const name = file.replace( /\.[^/.]+$/, "" );
			this.registerComponent( new Component( name, json ) );
		});

		// Compute total length:
		let length = 0;
		let loaded = 0;
		for ( const section in stack ) {
			length += Object.keys( stack[ section ] ).length;
		}
		if ( world ) {
			length += Object.keys( world.entities ).length;
		}
		function update( item ) {
			loaded++;
			onProgress( ( loaded / length ) * 100, "Loaded " + item );
		}

		// Load assets. On finished, start the world loading/generation routine:
		// onProgress is called when an asset is loaded and passed the
		this.loadAssets( stack, update, () => {
			// If no source is provided, generate a new world:
			if ( !world ) {
				console.warn( "World is missing, a new one will be generated!" );
				this.generateWorld( false, update, onFinished );
			}
			else {
				this.loadWorld( world, update, onFinished );
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
				console.log( stack.texture );
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
					const file = FS.readFileSync( path, "utf8" );
					const json = JSON.parse( file );
					const assembly = new Entity();
					assembly.setType( json.type ); // "my-type"
					json.components.forEach( ( data ) => {
						//let comp = scope.getComponent( data.name );
						/*if ( !comp ) {
							console.log( "Adding a new component..." );
							comp = new Component();
							comp.setName( data.name );
						}*/
						const comp = new Component();
						comp.setType( data.type );
						comp.apply( data.data );
						assembly.addComponent( comp );
					});
					scope.registerAssembly( assembly );
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

}

export default Engine;
