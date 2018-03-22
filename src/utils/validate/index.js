// Aurora is distributed under the MIT license.

import Player from "../../core/Player";
import System from "../../core/System";
/**
	* Defines if validator returns true or false when unable to find a matching
	* validation check.
	*/
const optimistic = true;

const validators = {
	playerIndex( input ) {
		if ( typeof input !== "number" ) {
			return false;
		}
		if ( input < 0 ) {
			return false;
		}
		return true;
	},
	isPlayer( input ) {
		if ( input instanceof Player ) {
			return true;
		}
		return false;
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
