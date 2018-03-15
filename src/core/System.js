// Forge is distributed under the MIT license.

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
	constructor( props, initFn, updateFn ) {
		this._name = props.name || "unnamed";
		this._step = props.step || 100;
		this._fixed = props.fixed || true;

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

	addWatchedComponents( componentTypes ) {
		componentTypes.forEach( ( type ) => {
			const found = this._watchedComponents.find( ( existingType ) => {
				return type === existingType;
			});
			if ( !found ) {
				this._watchedComponents.push( type );
			}
		});
	}

	removeWatchedComponents( componentTypes ) {
		componentTypes.forEach( ( type ) => {
			const found = this._watchedComponents.find( ( existingType ) => {
				return type === existingType;
			});
			if ( found ) {
				// Remove:
				this._watchedComponents.push( type );
			}
		});
	}

	isWatching( componentType ) {

	}

	setWatchAll( watch = true ) {
		this._watchAll = watch;
	}
}

export default System;
