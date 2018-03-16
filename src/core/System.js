// Aurora is distributed under the MIT license.

/** @classdesc Class representing a System. */
class System {

	/** @description Create a System.
		* @param {Object} props - Properties of this system.
		* @param {String} props.name - Name of this system (primiarly used for logging purposes).
		* @param {Bool} props.fixed - Whether the system should update as often as possible or use a fixed step size.
		* @param {Number} props.step - Step size (in ms). Only used if `props.fixed` is `false`.
		* @param {Function} initFn - Function to run when first connecting the system to the engine.
		* @param {Function} updateFn - Function to run each time the engine updates the main loop.
		* @returns {System} - The newly created system.
		*/
	constructor( props, componentTypes, initFn, updateFn ) {
		this._name = props.name || "unnamed";
		this._step = props.step || 100;
		this._fixed = props.fixed || true;

		this._watchedComponents = [];
		this._addWatchedComponents( componentTypes );

		this._entityUUIDs = [];

		this.initFn = initFn;
		this.updateFn = updateFn;

		this._savedTime = 0;

		console.log( "Created system: " + this._name + "." );
		return this;
	}

	/** @description Create a System.
		*
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
		this.initFn();
	}

	/** @description Create a System.
		*
		*/
	update( delta ) {
		if ( this._fixed ) {
			// Add time to the accumulator & simulate if greater than the step size:
			this._savedTime += delta;
			if ( this._savedTime >= this._step ) {
				this.updateFn( this._step );
				this._savedTime -= this._step;
			}
		}
		else {
			this.updateFn( delta );
		}
	}

	/** @description A component type from the system's watch list. Cannot be modified after creation.
		* @readonly
		*/
	isWatching( searchTypes ) {
		this._watchedComponents.forEach( ( type ) => {
			const index = searchTypes.indexOf( type );
			/* Instead of checking that the entity has every component, instead check
			if any of the system's required components are not present. If at least
			one missing component is detected, the entity should be excluded. */
			if ( index < 0 ) {
				return false;
			}
		});
		return true;
	}

	/** @description Add component types to the system's watch list. Cannot be modified after creation.
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

	/** @description Remove component types from the system's watch list. Cannot be modified after creation.
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

	/** @description Set the system to watch all entities
		* @private
		*/
	_setWatchAll( watch = true ) {
		this._watchAll = watch;
	}

	watchEntity( entity ) {
		this._entityUUIDs.push( entity.getUUID() );
	}
}

export default System;
