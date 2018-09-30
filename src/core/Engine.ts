// Aurora is distributed under the MIT license.

import present from "present";
import Entity from "./Entity";
import System from "./System";
import getItem from "../utils/getItem";
import hasItem from "../utils/hasItem";

/**
 * @module core
 * @classdesc Core singleton representing an instance of the Aurora engine. The engine is responsible for the creation
 * (and registration) of entities, as well as initialization and running of systems containing game logic.
 */
export default class Engine {

	private _assemblies:     Entity[];
	private _entities:       Entity[];
	private _lastTickTime:   number;
	private _onTickComplete: Function; // Hook called when update is complete
	private _onTickStart:    Function; // Hook called when update starts
	private _running:        boolean;  // Whether or not the engine is running
	private _systems:        System[];

	/**
	 * @description Create an instance of the Aurora engine.
	 */
	constructor() {

		// TODO: Build from JSON in the case of loading a save

		console.log( "Aurora: Initializing a new engine." );

		// These are the things which are actually saved per game
		this._assemblies = [];
		this._entities = [];
		this._systems = [];

		// The heart of the engine
		this._running = false;
		this._lastTickTime = null;

		this._onTickStart = undefined;
		this._onTickComplete = undefined;

		return this;
	}

	/**
	 * @description Get all of the engine's assemblies.
	 * @readonly
	 * @returns {Entity[]} - Array of assembly (entity) instances
	 */
	get assemblies(): Entity[] {
		return this._assemblies;
	}

	/**
	 * @description Get all of the engine's entities.
	 * @readonly
	 * @returns {Entity[]} - Array of entity instances
	 */
	get entities(): Entity[] {
		return this._entities;
	}

	/**
	 * @description Get the function currently set to execute after every tick.
	 * @readonly
	 * @returns {Function} - Function currently set to execute
	 */
	get onTickComplete(): Function {
		return this._onTickComplete;
	}

	/**
	 * @description Get the function currently set to execute before every tick.
	 * @readonly
	 * @returns {Function} - Function currently set to execute
	 */
	get onTickStart(): Function {
		return this._onTickStart;
	}

	/**
	 * @description Get whether or not the engine is currently running.
	 * @readonly
	 * @returns {boolean} - True if the engine is running
	 */
	get running(): boolean {
		return this._running;
	}

	/**
	 * @description Get all of the engine's systems.
	 * @readonly
	 * @returns {System[]} - Array of system instances
	 */
	get systems(): System[] {
		return this._systems;
	}

	/**
	 * @description Get the timestamp of the engine's last tick.
	 * @readonly
	 * @returns {number} - Timestamp in milliseconds
	 */
	get lastTickTime() {
		return this._lastTickTime;
	}

	/**
	 * @description Set a function to execute after every update tick.
	 * @param {Function} fn - Function to execute
	 */
	set onTickComplete( fn: Function ) {
		this._onTickComplete = fn;
	}

	/**
	 * @description Set a function to execute before every update tick.
	 * @param {Function} fn - Function to execute
	 */
	set onTickStart( fn: Function ) {
		this._onTickStart = fn;
	}

	/**
	 * @description Add an assembly (entity) instance to the engine.
	 * @param {Entity} assembly - Assembly instance
	 * @returns {Entity[]} - Array of assembly (entity) instances
	 */
	addAssembly( assembly: Entity ): Entity[] {

		// Validate
		if ( this.hasAssembly( assembly.type ) ) {
			throw Error( "Assembly of that type has already been added!" );
		}

		// Freeze entity's structure
		Object.seal( assembly );

		this._assemblies.push( assembly );

		return this._assemblies;
	}

	/**
	 * @description Add an entity instance to the engine. This will check which systems should watch it, and add it to
	 * those systems (running the entity through each system's onAdd hook. After being added and initialized, entities are
	 * immutable (although their component data is not).
	 * @param {Entity} entity - Entity instance
	 * @returns {Entity[]} - Array of entity instances
	 */
	addEntity( entity: Entity ): Entity[] {

		// Validate
		if ( this.hasEntity( entity.uuid ) ) {
			throw Error( "Entity with that UUID has already been added!" );
		}

		// Freeze entity's structure
		Object.seal( entity );

		this._entities.push( entity );

		// Check all systems to see if they should be watching this entity
		this._systems.forEach( ( system ) => {
			if ( entity.isWatchableBy( system ) ) {
				system.watchEntity( entity );
			}
		});

		return this._entities;
	}

	/**
	 * @description Add a system instance to the engine. This will run the system's onInit hook. After being added and
	 * initialized, systems are immutable and are updated every game tick.
	 * @param {System} system - System instance
	 * @returns {System[]} - Array of system instances
	 */
	addSystem( system: System ): System[] {

		// Validate
		if ( this.hasSystem( system.name ) ) {
			throw Error( "System with that name has already been added!" );
		}

		// Add it and start it
		this._systems.push( system );
		system.init( this );

		// Freeze entity's structure
		Object.freeze( system );

		return this._systems;
	}

	/**
	 * @description Get an assembly (entity) instance by type from the engine.
	 * @readonly
	 * @param {string} type - Assembly type
	 * @returns {Entity} - Requested assembly (entity) instance
	 */
	getAssembly( type: string ): Entity {
		if ( !this.hasAssembly( type ) ) {
			throw Error( "No assembly of that type found!" );
		}
		return getItem( type, this._assemblies, "type" );
	}

	/**
	 * @description Get an entity instance by UUID from the engine.
	 * @readonly
	 * @param {string} uuid - Entity UUID
	 * @returns {Entity} - Requested entity instance
	 */
	getEntity( uuid: string ): Entity {
		if ( !this.hasEntity( uuid ) ) {
			throw Error( "No enitity with that UUID found!" );
		}
		return getItem( uuid, this._entities, "uuid" );
	}

	/**
	 * @description Get a system instance by name from the engine.
	 * @readonly
	 * @param {string} name - System name
	 * @returns {System} - Requested system instance
	 */
	getSystem( name: string ): System {
		if ( !this.hasSystem( name ) ) {
			throw Error( "No system with that name found!" );
		}
		return getItem( name, this._systems, "name" );
	}

	/**
	 * @description Check if an assembly is present within the engine.
	 * @readonly
	 * @param {string} name - Assembly name
	 * @returns {boolean} - True if the assembly is present
	 */
	hasAssembly( type: string ): boolean {
		return hasItem( type, this._assemblies, "type" );
	}

	/**
	 * @description Check if a system is present within the engine.
	 * @readonly
	 * @param {string} name - System name
	 * @returns {boolean} - True if the entity is present
	 */
	hasEntity( uuid: string ): boolean {
		return hasItem( uuid, this._entities, "uuid" );
	}

	/**
	 * @description Check if a system is present within the engine.
	 * @readonly
	 * @param {string} name - System name
	 * @returns {boolean} - True if the system is present
	 */
	hasSystem( name: string ): boolean {
		return hasItem( name, this._systems, "name" );
	}

	/**
	 * @description Start the execution of the update loop.
	 */
	start(): void {

		// Always reset in case engine was stopped and restarted
		this._lastTickTime = present();

		// Start ticking!
		this._running = true;
		this.tick();
	}

	/**
	 * @description Stop the execution of the update loop.
	 */
	stop(): void {
		this._running = false;
	}

	/**
	 * @description Perform one tick and update all systems.
	 * @private
	 */
	tick(): void {
		if ( this._running ) {
			const now = present();
			const delta = now - this._lastTickTime;
			this._lastTickTime = now;

			// Run any pre-update behavior
			if ( this._onTickStart ) {
				this._onTickStart();
			}

			// Perform the update on every system
			this._systems.forEach( ( system ) => {
				system.update( delta );
			});

			// Run any post-update behavior
			if ( this._onTickComplete ) {
				this._onTickComplete();
			}
		}
	}

}
