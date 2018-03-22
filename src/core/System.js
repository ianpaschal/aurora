// Aurora is distributed under the MIT license.

/** @classdesc Class representing a System. */
class System {

	/** @description Create a System.
		* @param {Object} config - Properties of this system.
		* @param {String} config.name - Name of this system (primiarly used for logging purposes).
		* @param {Bool} config.fixed - Whether the system should update as often as possible or use a fixed step size.
		* @param {Number} config.step - Step size (in ms). Only used if `props.fixed` is `false`.
		* @param {Array} config.componentTypes - Types to watch
		* @param {Function} config.init - Function to run when first connecting the system to the engine.
		* @param {Function} config.add - Function to run on an entity when adding it to the system.
		* @param {Function} config.update - Function to run each time the engine updates the main loop.
		* @returns {System} - The newly created System.
		*/
	constructor( config ) {
		console.log( config.fixed );
		this._name = config.name || "unnamed";
		this._fixed = config.fixed || false;
		this._step = config.step || 100;

		this._watchedComponents = [];
		this._addWatchedComponents( config.componentTypes );

		this._entityUUIDs = [];

		this._initFn = config.init;
		this._addFn = config.add;
		this._updateFn = config.update;

		this._savedTime = 0;

		console.log( "Created system: " + this._name + "." );
		return this;
	}

	/** @description Watch an entity by adding its UUID to to the system. After
		* adding, the system will run the entity through the internal add function
		* to do any additional processing.
		* @param {Entity} entity - Entity instance to add.
		* @returns {Array} - Updated array of entity UUIDs.
		*/
	addEntity( entity ) {
		this._entityUUIDs.push( entity.getUUID() );
		this._addFn( entity );
		return this._entityUUIDs;
	}

	/** @description Initialize the system (as a part of linking to the engine).
		* After linking the engine, the system will run its stored init function.
		* @param {Engine} engine - Engine instance to link to.
		*/
	init( engine ) {
		if( !engine ) {
			console.warn(
				"System " + this._name + ":",
				"Attempted to initalize system without an engine!"
			);
			return;
		}
		console.log(
			"System " + this._name + ":",
			"Linked system to engine."
		);
		this._engine = engine;

		// Run the actual init behavior:
		this._initFn();
	}

	/** @description Update the system with a given amount of time to simulate.
		* The system will run its stored update function using either a fixed step
		* or variable step (specified at creation) and the supplied delta time.
		* @param {Number} delta - Time in milliseconds to simulate.
		*/
	update( delta ) {
		if ( this._fixed ) {
			// Add time to the accumulator & simulate if greater than the step size:
			this._savedTime += delta;
			if ( this._savedTime >= this._step ) {
				this._updateFn( this._step );
				this._savedTime -= this._step;
			}
		}
		else {
			this._updateFn( delta );
		}
	}

	/** @description Check if an entity's component list includes all of the
		* system's required components. Instead of checking every component on an
		* entity, including unneeded ones, cycle through the system's components and
		* check that each one is present within the entity's component list.
		* @readonly
		* @param {Array} entityComponents - Array of components to check.
		* @returns {Boolean} - Whether the system should be watching the entity.
		*/
	isWatchable( entity ) {
		for ( const type of this._watchedComponents ) {
			if ( !entity.hasComponent( type ) ) {
				// Return early if any required component is missing on entity:
				return false;
			}
		}
		return true;
	}

	/** @description Add component types to the system's watch list. Cannot be
		* modified after creation.
		* @private
		* @param {Array} componentTypes - The component types to add.
		*/
	_addWatchedComponents( componentTypes ) {
		componentTypes.forEach( ( type ) => {
			const index = this._watchedComponents.indexOf( type );
			if ( index < 0 ) {
				this._watchedComponents.push( type );
			}
		});
	}

	/** @description Remove component types from the system's watch list. Cannot
		* be modified after creation.
		* @private
		* @param {Array} componentTypes - The component types to remove.
		*/
	_removeWatchedComponents( componentTypes ) {
		componentTypes.forEach( ( type ) => {
			const index = this._watchedComponents.indexOf( type );
			if ( index >= 0 ) {
				this._watchedComponents.splice( index, 1 );
			}
		});
	}

	/** @description Set the system to watch all entities. Not used for now.
		* @private
		*/
	_setWatchAll( watch = true ) {
		this._watchAll = watch;
	}

}

export default System;
