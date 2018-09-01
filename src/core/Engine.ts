// Aurora is distributed under the MIT license.

import Present from "present";
import Entity from "./Entity";
import System from "./System";
import { getItem, hasItem } from "../utils";

/**
 * @classdesc Core singleton representing an instance of the Aurora engine. The engine is responsible for the creation
 * (and registration) of entities, as well as initialization and running of systems containing game logic.
 */
export default class Engine {
	private _assemblies:       Entity[];
	private _entities:         Entity[];
	private _lastTickTime:     number;
	private _onUpdateComplete: Function; // Hook called when update is complete
	private _onUpdateStart:    Function; // Hook called when update starts
	private _running:          boolean;  // Whether or not the engine is running
	private _systems:          System[];

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

		this._onUpdateStart = undefined;
		this._onUpdateComplete = undefined;

		// Make structure immutable and return
		Object.freeze( this );
		return this;
	}

	getAssembly( type ) {
		return getItem( type, this._assemblies, "type" );
	}

	hasAssembly() {

	}

	/** @description Get an Entity instance by UUID.
		* @readonly
		* @param {String} uuid - UUID of the entity to fetch.
		* @returns {(Entity|null)} - Requested entity, or null if not found.
		*/
	getEntity( uuid: string ): Entity|null {
		return getItem( uuid, this._entities, "uuid" );
	}

	hasEntity( uuid ) {
		return hasItem( uuid, this._entities, "uuid" );
	}

	get entities() {
		return this._entities;
	}

	getSystem( name: string ): System|null {
		return getItem( name, this._systems, "name" );
	}

	hasSystem( name ) {

	}

	/**
	 * @description Add an entity instance to to the engine. After being added and
	 * initialized, entities are immutable and updated every game loop.
	 * @param {Entity} entity - Entity instance to add
	 * @returns {Entity[]} - Updated array of entity instances
	 */
	addEntity( entity: Entity ): Entity[] {

		// Freeze entity's structure
		Object.seal( entity );

		this._entities.push( entity );

		// Check all systems to see if they should be watching this entity
		this._systems.forEach( ( system ) => {
			if ( entity.isWatchable( system ) ) {
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

		// Freeze entity's structure
		Object.seal( system );

		this._systems.push( system );
		system.init( this );

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
	set onUpdateComplete( fn: Function ) {
		this._onUpdateComplete = fn;
	}
	/**
	 * @description Get the function currently set to execute after every tick.
	 * @returns {Function} - Function currently set to execute
	 */
	get onUpdateComplete(): Function {
		return this._onUpdateComplete;
	}

	/**
	 * @description Set a function to execute before every update tick.
	 * @param {Function} fn - Function to execute
	 */
	set onUpdateStart( fn: Function ) {
		this._onUpdateStart = fn;
	}
	/**
	 * @description Get the function currently set to execute before every tick.
	 * @returns {Function} - Function currently set to execute
	 */
	get onUpdateStart(): Function {
		return this._onUpdateStart;
	}

	/**
	 * @description Start the execution of the update loop.
	 */
	start(): void {

		// Always reset in case engine was stopped and restarted
		this._lastTickTime = Present();

		this._running = true;

		// Start ticking!
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
			const now = Present();
			const delta = now - this._lastTickTime;
			this._lastTickTime = now;
			// Run any pre-update behavior
			if ( this._onUpdateStart ) {
				this._onUpdateStart();
			}

			// Perform the update on every system
			this._systems.forEach( ( system ) => {
				system.update( delta );
			});

			// Run any post-update behavior
			if ( this._onUpdateComplete ) {
				this._onUpdateComplete();
			}
		}
	}

}
