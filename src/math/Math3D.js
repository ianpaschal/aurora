// Aurora is distributed under the MIT license.

import validate from "../utils/validate";

export default {
	distance( p1, p2 ) {

		// Validate that p1 and p2 are both valid for calculation.
		if ( !validate( "vector3", p1 ) || !validate( "vector3", p2 ) ) {
			console.error( "Could not compute with an invalid coordinate." );
			return;
		}

		const x = Math.abs( p2.x - p1.x );
		const y = Math.abs( p2.y - p1.y );
		const z = Math.abs( p2.z - p1.z );
		return Math.sqrt( Math.pow( x, 2 ) + Math.pow( y, 2 ) + Math.pow( z, 2 ) );
	},
	midpoint( p1, p2 ) {

		// Validate that p1 and p2 are both valid for calculation.
		if ( !validate( "vector3", p1 ) || !validate( "vector3", p2 ) ) {
			console.error( "Could not compute with an invalid coordinate." );
			return;
		}

		return {
			x: ( p1.x + p2.x ) / 2,
			y: ( p1.y + p2.y ) / 2,
			z: ( p1.z + p2.z ) / 2
		};
	}
};
