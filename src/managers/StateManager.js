// Aurora is distributed under the MIT license.

/** @classdesc [Insert Here] */
class StateManager {

	/** @description Create a State Manager instance. */
	constructor( maxStates ) {
		this._states = [];
		this._maxStates = maxStates || 10;
		return this;
	}

	addState( state ) {
		this._states.push( state );
		/* To avoid using too much memory, if _states is now longer than _maxStates,
			trim _states to _maxStates length. */
		if ( this._states.length > this._maxStates ) {
			const toRemove = this._states.length - this._maxStates;
			this._states = this._states.slice( 0, toRemove );
		}
	}

	/** @description Get the first state in the stack. Note: This is not might not
		* be the oldest state; use .oldestState to ensure that you get the oldest.
		* @readonly
		* @returns {State} - The first State instance.
		*/
	get firstState() {
		return this._states[ 0 ];
	}

	/** @description Get the last state in the stack. Note: This is not might not
		* be the newest state; use .newestState to ensure that you get the newest.
		* @readonly
		* @returns {State} - The last State instance.
		*/
	get lastState() {
		return this._states[ this._states.length - 1 ];
	}

	/** @description Get the maximum number of states the stack may contain.
		* @readonly
		* @returns {Number}
		*/
	get maxStates() {
		return this._maxStates;
	}

	/** @description Get the newest state in the stack.
		* @readonly
		* @returns {State}
		*/
	get newestState() {
		const ordered = this.order( false );
		return ordered[ ordered.length - 1 ];
	}

	/** @description Get the number of states in the stack.
		* @readonly
		* @returns {Number}
		*/
	get numStates() {
		return this._states.length;
	}

	/** @description Get the oldest state in the stack.
		* @readonly
		* @returns {State}
		*/
	get oldestState() {
		const ordered = this.order( false );
		return ordered[ 0 ];
	}

	/** @description Get the complete state stack, sorted. Note: This will also
		* sort the state stack into ascending order.
		* @readonly
		* @returns {State}
		*/
	get stack() {
		return this.order( true );
	}

	order( modify ) {
		const ordered = modify ? this._states : this._states.slice( 0 );
		ordered.sort( ( a, b ) => {
			return a - b;
		});
		return ordered;
	}

	applyState( state: State ) {
		this._lastTickTime = state.timestamp;
		state.entities.forEach( ( entity ) => {
			if ( hasItem( entity.uuid, this._entities, "uuid" ) ) {
				const instance = this.getEntity( entity.uuid );
				/* Don't bother checking if entity has component because if it's already
					been registered it will be frozen. */
				instance.components.forEach( ( component ) => {
					const type = component.type;
					const data = entity.components[ type ];
					component.mergeData( data );
				});
			} else {
				const instance = new Entity( entity );
				this.addEntity( instance );
			}
		});
	}
}

export default StateManager;
