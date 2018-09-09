// Aurora is distributed under the MIT license.

import Engine from "./Engine"; // Typing
import Entity from "./Entity"; // Typing
import { SystemConfig } from "../utils/interfaces"; // Typing

/**
 * @classdesc Class representing a System.
 */
export default class System {

	private _accumulator:    number;
	private _componentTypes: string[];
	private _engine:         Engine;
	private _entityUUIDs:    string[];
	private _fixed:          boolean;
	private _frozen:         boolean;
	private _methods:        {};
	private _name:           string;
	private _onAddEntity:    ( entity: Entity ) => void;
	private _onInit:         () => void;
	private _onRemoveEntity: ( entity: Entity ) => void;
	private _onUpdate:       ( delta: number ) => void;
	private _step:           number;

	/**
	 * @description Create a System.
	 * @param {Object} config - Configuration object
	 * @param {string} config.name - System name
	 * @param {boolean} config.fixed - Fixed step size or update as often as possible
	 * @param {number} config.step - Step size in milliseconds (only used if `fixed` is `false`)
	 * @param {array} config.componentTypes - Types to watch
	 * @param {Function} config.onInit - Function to run when first connecting the system to the engine
	 * @param {Function} config.onAddEntity - Function to run on an entity when adding it to the system's watchlist
	 * @param {Function} config.onRemoveEntity - Function to run on an entity when removing it from the system's watchlist
	 * @param {Function} config.onUpdate - Function to run each time the engine updates the main loop
	 */
	constructor( config: SystemConfig ) {

		// Define defaults
		this._accumulator    = 0;
		this._componentTypes = [];
		this._engine         = undefined;
		this._entityUUIDs    = [];
		this._fixed          = false;
		this._frozen         = false;
		this._methods        = {};
		this._name           = "no-name";
		this._onAddEntity    = ( entity: Entity ) => {};
		this._onInit         = () => {};
		this._onRemoveEntity = ( entity: Entity ) => {};
		this._onUpdate       = ( delta: number ) => {};
		this._step           = 100;

		// Apply config values
		Object.keys( config ).forEach( ( key ) => {

			// Handle component types and methods slightly differently, otherwise simply overwite props with config values
			const specialCases = [ "componentTypes", "methods", "entityUUIDs" ];

			// If not a special case
			if ( specialCases.indexOf( key ) > -1 ) {
				switch( key ) {
					case "methods":
						Object.keys( config.methods ).forEach( ( key ) => {
							this.addMethod( key, config.methods[ key ] );
						});
						break;
					case "componentTypes":
						Object.keys( config.componentTypes ).forEach( ( key ) => {
							this.watchComponentType( config.componentTypes[ key ] );
						});
						break;
				}
			} else {
				this[ "_" + key ] = config[ key ];
			}
		});
	}

	/**
	 * @description Get the accumulated time of the system.
	 * @readonly
	 * @returns {number} - Time in milliseconds
	 */
	get accumulator(): number {
		return this._accumulator;
	}

	/**
	 * @description Get whether or not the system uses a fixed step.
	 * @readonly
	 * @returns {boolean} - True if the system uses a fixed step
	 */
	get fixed(): boolean {
		return this._fixed;
	}

	/**
	 * @description Get the step size of the system in milliseconds.
	 * @readonly
	 * @returns {number} - Time in milliseconds
	 */
	get step(): number {
		return this._step;
	}

	/**
	 * @description Get the entity's name.
	 * @readonly
	 * @returns {string} - Name string
	 */
	get name(): string {
		return this._name;
	}

	/**
	 * @description Get all of the component types the system is watching.
	 * @readonly
	 * @returns {string[]} - Array of component types
	 */
	get watchedComponentTypes(): string[] {
		return this._componentTypes;
	}

	/**
	 * @description Get all of the entity UUIDs the system is watching.
	 * @readonly
	 * @returns {string[]} - Array of UUID strings
	 */
	get watchedEntityUUIDs(): string[] {
		return this._entityUUIDs;
	}

	/**
	 * @description Add an extra method to the system. Cannot be modified after the system is registered with the engine.
	 * @param {string} key - Method identifier
	 * @param {function} fn - Method to be called by user in the future
	 */
	addMethod( key: string, fn: Function ): void {
		// TODO: Error handling
		this._methods[ key ] = fn;
	}

	/**
	 * @description Check if the system can watch a given entity.
	 * @readonly
	 * @param {Entity} entity - Entity to check
	 * @returns {boolean} - True if the given entity is watchable
	 */
	canWatch( entity: Entity ): boolean {
		// TODO: Error handling
		// Faster to loop through search criteria vs. all components on entity
		for ( const type of this._componentTypes ) {

			// Return early if any required component is missing on entity
			if ( !entity.hasComponent( type ) ) {
				return false;
			}
		}
		return true;
	}

	/**
	 * @description Call a user-added method from outside the system. Cannot be modified after the system is registered
	 * with the engine.
	 * @param {string} key - Method identifier
	 * @param {any} payload - Any data which should be passed to the method
	 * @returns {any} - Any data which the method returns
	 */
	dispatch( key: string, payload?: any ): any {
		if ( !this._methods[ key ] ) {
			throw Error( `Method ${ key } does not exist!` );
		}
		return this._methods[ key ]( payload );
	}

	/**
	 * @description Initialize the system (as a part of linking to the engine). After linking the engine, the system will
	 * run its stored init hook method. Cannot be modified after the system is registered with the engine.
	 * @param {Engine} engine - Engine instance to link to
	 */
	init( engine: Engine ): void {
		console.log( "Initializing a new system: " + this._name + "." );
		this._engine = engine;

		// Run the actual init behavior:
		if ( this._onInit ) {
			this._onInit();
		}

		// Freeze the system to make it immutable:
		this._frozen = true;
	}

	/**
	 * @description Check if the system is watching a given component type.
	 * @readonly
	 * @param {Entity} entity - Component type to check
	 * @returns {boolean} - True if the given component type is being watched
	 */
	isWatchingComponentType( componentType: string ): boolean {
		if ( this._componentTypes.indexOf( componentType ) > -1 ) {
			return true;
		}
		return false;
	}

	/**
	 * @description Check if the system is watching a given entity.
	 * @readonly
	 * @param {Entity} entity - Entity instance to check
	 * @returns {boolean} - True if the given entity instance is being watched
	 */
	isWatchingEntity( entity: Entity ): boolean {
		if ( this._entityUUIDs.indexOf( entity.uuid ) > -1 ) {
			return true;
		}
		return false;
	}

	/**
	 * @description Remove a user-added method from the system. Cannot be modified after the system is registered with the
	 * engine.
	 * @param {string} key - Method identifier
	 */
	removeMethod( key: string ): void {
		if ( !this._methods[ key ] ) {
			throw Error( `Method ${ key } does not exist!` );
		}
		delete this._methods[ key ];
	}

	/**
	 * @description Remove a component type to the system's watch list. Cannot be modified after the system is registered
	 * with the engine.
	 * @param {string} componentType - Component type to stop watching
	 * @returns {array} - Array of watched component types
	 */
	unwatchComponentType( componentType: string ): string[] {
		const index = this._componentTypes.indexOf( componentType );
		if ( this._componentTypes.length < 2 ) {
			throw Error( "Cannot remove component type, this system will be left with 0." );
		}
		if ( index == -1 ) {
			throw Error( "Component type not found on system." );
		}
		this._componentTypes.splice( index, 1 );
		return this._componentTypes;
	}

	/**
	 * @description Remove an entity UUID to the system's watch list.
	 * @param {Entity} entity - Entity instance to stop watching
	 * @returns {array} - Array of watched entity UUIDs
	 */
	unwatchEntity( entity: Entity ): string[] {
		const index = this._entityUUIDs.indexOf( entity.uuid );
		if ( index < 0 ) {
			throw Error( `Could not unwatch entity ${ entity.uuid }; not watched.` );
		}
		this._entityUUIDs.splice( index, 1 );
		return this._entityUUIDs;
	}

	/**
	 * @description Update the system with a given amount of time to simulate. The system will run its stored update
	 * function using either a fixed step or variable step (specified at creation) and the supplied delta time. Cannot be
	 * modified after the system is registered with the engine.
	 * @param {number} delta - Time in milliseconds to simulate
	 */
	update( delta: number ): void {
		if ( this._fixed ) {
			// Add time to the accumulator & simulate if greater than the step size:
			this._accumulator += delta;
			while ( this._accumulator >= this._step ) {
				this._onUpdate( this._step );
				this._accumulator -= this._step;
			}
		} else {
			this._onUpdate( delta );
		}
	}

	/**
	 * @description Add a single component type to the system's watch list. Cannot be modified after the system is
	 * registered with the engine.
	 * @param {string} componentType - Component type to watch
	 * @returns {array} - Array of watched component types
	 */
	watchComponentType( componentType: string ): string[] {

		// Early return if frozen; this avoids updating the entity watch list during
		// execution.
		if ( this._frozen ) {
			throw Error( "Cannot modify watchedComponentTypes after adding to engine." );
		}

		// Check if this component type is already present
		if ( this._componentTypes.indexOf( componentType ) > -1 ) {
			throw Error( `Component type ${ componentType } is already being watched!` );
		}

		// If not, add it to the system
		this._componentTypes.push( componentType );
		return this._componentTypes;
	}

	/**
	 * @description Watch an entity by adding its UUID to to the system. After adding, the system will run the entity
	 * through the internal add function to do any additional processing.
	 * @param {Entity} entity - Entity instance to watch
	 * @returns {array} - Array of watched entity UUIDs
	 */
	watchEntity( entity: Entity ): string[] {

		// Check if this entity is already being watched
		if ( this._entityUUIDs.indexOf( entity.uuid ) >= 0 ) {
			throw Error( `Entity ${ entity.uuid } is already being watched!` );
		}
		this._entityUUIDs.push( entity.uuid );
		this._onAddEntity( entity );
		return this._entityUUIDs;
	}

}
