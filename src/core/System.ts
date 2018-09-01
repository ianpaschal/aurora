// Aurora is distributed under the MIT license.

import Engine from "./Engine"; // Typing
import Entity from "./Entity"; // Typing
import { SystemConfig } from "../utils/interfaces"; // Typing

/**
 * @classdesc Class representing a System.
 */
export default class System {
	private _displayName:    string;
	private _engine:         Engine;
	private _entityUUIDs:    string[];
	private _fixed:          boolean;
	private _methods:        {};
	private _name:           string;
	private _onAddEntity:    ( entity: Entity ) => void;
	private _onInit:         () => void;
	private _onRemoveEntity: ( entity: Entity ) => void;
	private _onUpdate:       ( delta: number ) => void;
	private _accumulator:    number;
	private _step:           number;
	private _componentTypes: string[];

	/**
	 * @description Create a System.
	 * @param {Object} config - Properties of this system
	 * @param {string} config.name - Name of this system
	 * @param {boolean} config.fixed - Whether the system should update as often as possible or use a fixed step size
	 * @param {number} config.step - Step size in milliseconds (only used if `props.fixed` is `false`)
	 * @param {array} config.componentTypes - Types to watch
	 * @param {Function} config.onInit - Function to run when first connecting the system to the engine
	 * @param {Function} config.onAddEntity - Function to run on an entity when adding it to the system's watchlist
	 * @param {Function} config.onRemoveEntity - Function to run on an entity when removing it from the system's watchlist
	 * @param {Function} config.onUpdate - Function to run each time the engine updates the main loop
	 * @returns {System} - The newly created system
	 */
	constructor( config?: SystemConfig ) {
		this._name = "no-name";
		this._fixed = false;
		this._step = 100;
		this._accumulator = 0;
		this._displayName = this._name[ 0 ].toUpperCase() + this._name.substr( 1 );

		for ( const prop in config ) {
			this[ "_" + prop ] = config[ prop ];
		}

		if ( !config.onUpdate ) {
			// TODO: Error handling/warn this system will do nothing
		}

		this._componentTypes = [];
		if ( config.componentTypes ) {
			this.watchComponentTypes( config.componentTypes );
		} else {
			// TODO: Error handling/warn no components exist
		}

		this._methods = {};

		/* It's not possible to instantiate with a list of entity IDs since the entities might not exist, and the actual
			entity is needed so that the add hook can be run successfully on the entity instance. */
		this._entityUUIDs = [];
	}

	// INIT & UPDATE

	/**
	 * @description Initialize the system (as a part of linking to the engine). After linking the engine, the system will
	 * run its stored init hook method. Cannot be modified after the system is registered with the engine.
	 * @param {Engine} engine - Engine instance to link to
	 */
	init( engine: Engine ): void {
		if( !engine ) {
			console.warn(
				"System " + this._displayName + ":",
				"Attempted to initialize system without an engine!"
			);
			return;
		}
		console.log( "Initializing a new system: " + this._displayName + "." );
		this._engine = engine;

		// Run the actual init behavior:
		if ( this._onInit ) {
			this._onInit();
		}
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
			if ( this._accumulator >= this._step ) {
				this._onUpdate( this._step );
				this._accumulator -= this._step;
			}
		} else {
			this._onUpdate( delta );
		}
	}

	// USER-ADDED METHODS

	/**
	 * @description Add an extra method to the system. Cannot be modified after
	 * the system is registered with the engine.
	 * @param {string} key - Identifier for the method
	 * @param {function} method - Method to be called by user in the future
	 */
	addMethod( key: string, method: Function ): void {
		// TODO: Error handling
		this._methods[ key ] = method;
	}

	/**
	 * @description Call a user-added method from outside the system. Cannot be modified after the system is registered
	 * with the engine.
	 * @param {string} key - Identifier for the method
	 * @param {any} payload - Any data which should be passed to the method
	 */
	dispatch( key: string, payload?: any ): void {
		// TODO: Error handling
		return this._methods[ key ]( payload );
	}

	/**
	 * @description Remove a user-added method from the system. Cannot be modified after the system is registered with the
	 * engine.
	 * @param {string} key - Identifier for the method
	 */
	removeMethod( key: string ): void {
		// TODO: Error handling
		delete this._methods[ key ];
	}

	// ADDING ENTITIES/COMPONENTS TO THE SYSTEM

	/**
	 * @description Check if this system can watch a given entity.
	 * @readonly
	 * @param {Entity} entity - Entity to check
	 * @returns {boolean} - True if the given entity is watchable
	 */
	isWatchable( entity: Entity ): boolean {
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
	 * @description Check if this system is watching a given entity.
	 * @readonly
	 * @param {Entity} entity - Entity to check
	 * @returns {boolean} - True if the given entity is being watched
	 */
	isWatchingEntity( entity: Entity ): boolean {
		if ( this._entityUUIDs.indexOf( entity.uuid ) > -1 ) {
			return true;
		}
		return false;
	}

	/**
	 * @description Check if this system is watching a given component type.
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
	 * @description Watch an entity by adding its UUID to to the system. After adding, the system will run the entity
	 * through the internal add function to do any additional processing.
	 * @param {Entity} entity - Entity instance to watch
	 * @returns {array} - Updated array of watched entity UUIDs
	 */
	watchEntity( entity: Entity ): string[] {

		// Check if this entity is already being watched
		if ( this._entityUUIDs.indexOf( entity.uuid ) > -1 ) {
			// TODO: Error handling
			// Already exists
			return;
		}
		this._entityUUIDs.push( entity.uuid );
		this._onAddEntity( entity );
		return this._entityUUIDs;
	}

	/**
	 * @description Add a single component type to the system's watch list. Cannot be modified after the system is
	 * registered with the engine.
	 * @param {string} componentType - Component type to watch
	 * @returns {array} - Updated array of watched component types
	 */
	watchComponentType( componentType: string ): string[] {

		// Check if this component type is already present
		if ( this._componentTypes.indexOf( componentType ) > -1 ) {
			// TODO: Error handling
			// Already exists
			return;
		}

		// If not, add it to the system
		this._componentTypes.push( componentType );
		return this._componentTypes;
	}

	/**
	 * @description Add component types to the system's watch list. Cannot be modified after the system is registered with
	 * the engine.
	 * @param {Array} componentTypes - The component types to watch
	 * @returns {array} - Updated array of watched component types
	 */
	watchComponentTypes( componentTypes: string[] ): string[] {
		// TODO: Error handling
		componentTypes.forEach( ( type ) => {
			this.watchComponentType( type );
		});
		return this._componentTypes;
	}

	/**
	 * @description Stop watching an entity.
	 * @param {Entity} entity - Entity instance to stop watching
	 * @returns {array} - Updated array of watched entity UUIDs
	 */
	unwatchEntity( entity: Entity ): string[] {
		const index = this._entityUUIDs.indexOf( entity.uuid );
		if ( index < 0 ) {
			// TODO: Add error handling
			return;
		}
		this._entityUUIDs.splice( index, 1 );
		return this._entityUUIDs;
	}

	/**
	 * @description Remove a single component type to the system's watch list. Cannot be modified after the system is
	 * registered with the engine.
	 * @param {string} componentType - Component type to stop watching
	 * @returns {array} - Updated array of watched component types
	 */
	unwatchComponentType( componentType: string ): string[] {
		const index = this._componentTypes.indexOf( componentType );
		if ( index > -1 ) {
			this._componentTypes.splice( index, 1 );
		}
		return this._componentTypes;
	}

	/**
	 * @description Remove component types from the system's watch list. Cannot be modified after the system is registered
	 * with the engine.
	 * @param {Array} componentTypes - The component types to remove
	 * @returns {array} - Updated array of watched component types
	 * */
	unwatchComponentTypes( componentTypes: string[] ): string[] {
		componentTypes.forEach( ( type ) => {
			this.unwatchComponentType( type );
		});
		return this._componentTypes;
	}

	// TODO: Add documentation to these methods
	get fixed() {
		return this._fixed;
	}
	get step() {
		return this._step;
	}
	get accumulator() {
		return this._accumulator;
	}
	get watchedComponentTypes() {
		return this._componentTypes;
	}
	get watchedEntityUUIDs() {
		return this._entityUUIDs;
	}
	get name() {
		return this._name;
	}
}
