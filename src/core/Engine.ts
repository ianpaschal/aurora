// Aurora is distributed under the MIT license.

import present from "present";
import Entity from "./Entity";
import System from "./System";
import { getItem, hasItem } from "../utils";

/**
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

	get assemblies() {
		return this._assemblies;
	}

	getAssembly( type ) {
		if ( !this.hasAssembly( type ) ) {
			throw Error( "No assembly of that type found!" );
		}
		return getItem( type, this._assemblies, "type" );
	}

	hasAssembly( type ) {
		return hasItem( type, this._assemblies, "type" );
	}

	/** @description Get an Entity instance by UUID.
		* @readonly
		* @param {String} uuid - UUID of the entity to fetch.
		* @returns {(Entity|null)} - Requested entity, or null if not found.
		*/
	getEntity( uuid: string ): Entity|null {
		if ( !this.hasEntity( uuid ) ) {
			throw Error( "No enitity with that UUID found!" );
		}
		return getItem( uuid, this._entities, "uuid" );
	}

	hasEntity( uuid ) {
		return hasItem( uuid, this._entities, "uuid" );
	}

	get entities() {
		return this._entities;
	}

	getSystem( name: string ): System|null {
		if ( !this.hasSystem( name ) ) {
			throw Error( "No system with that name found!" );
		}
		return getItem( name, this._systems, "name" );
	}

	hasSystem( name ) {
		return hasItem( name, this._systems, "name" );
	}

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
	 * @description Add an entity instance to to the engine. After being added and
	 * initialized, entities are immutable and updated every game loop.
	 * @param {Entity} entity - Entity instance to add
	 * @returns {Entity[]} - Updated array of entity instances
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
	 * @description Add a system instance to the engine. After being added and
	 * initialized, systems are immutable and are updated every game loop.
	 * @param {System} system - System instance to initialize and add
	 * @returns {System[]} - Updated array of system instances
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

	get systems(): System[] {
		return this._systems;
	}

	// Everything from here down is depreciated because the user supplies their own loop function
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
	 * @description Get the function currently set to execute after every tick.
	 * @returns {Function} - Function currently set to execute
	 */
	get onTickComplete(): Function {
		return this._onTickComplete;
	}

	/**
	 * @description Set a function to execute before every update tick.
	 * @param {Function} fn - Function to execute
	 */
	set onTickStart( fn: Function ) {
		this._onTickStart = fn;
	}

	/**
	 * @description Get the function currently set to execute before every tick.
	 * @returns {Function} - Function currently set to execute
	 */
	get onTickStart(): Function {
		return this._onTickStart;
	}

	get running(): boolean {
		return this._running;
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
	 * @description Update all systems.
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
