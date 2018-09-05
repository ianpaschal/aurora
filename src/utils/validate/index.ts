// Aurora is distributed under the MIT license.

import System from "../../core/System";
/**
	* Defines if validator returns true or false when unable to find a matching
	* validation check.
	*/
const optimistic = true;

const validators = {
	vector2( input ) {
		if ( !input.x || typeof input.x != "number" ) {
			return false;
		}
		if ( !input.y || typeof input.y != "number" ) {
			return false;
		}
		return true;
	},
	vector3( input ) {
		if ( !input.x || typeof input.x != "number" ) {
			return false;
		}
		if ( !input.y || typeof input.y != "number" ) {
			return false;
		}
		if ( !input.z || typeof input.z != "number" ) {
			return false;
		}
		return true;
	},
	playerIndex( input ) {
		if ( typeof input !== "number" ) {
			return false;
		}
		if ( input < 0 ) {
			return false;
		}
		return true;
	},
	isSystem( input ) {
		if ( input instanceof System ) {
			return true;
		}
		return false;
	}
};

export default function( check, input ) {
	if ( !validators[ check ] ) {
		console.warn(
			"Could not check " + input + "; No \"" + check + "\" validator found."
		);
		return optimistic;
	}
	return validators[ check ]( input );
}
