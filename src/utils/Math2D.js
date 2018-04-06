// Aurora is distributed under the MIT license.

import validate from "./validate";

export default {
	distance( p1, p2 ) {

		// Validate that p1 and p2 are both valid for calculation.
		if ( !validate( "vector2", p1 ) || !validate( "vector2", p2 ) ) {
			console.error( "Could not compute with an invalid coordinate." );
			return;
		}
		
		const dX = p2.x - p1.x;
		const dY = p2.y - p1.y;
		return Math.sqrt( Math.pow( dX, 2 ) + Math.pow( dY, 2 ) );
	},
	heading( p1, p2, deg = false ) {

		// Validate that p1 and p2 are both valid for calculation.
		if ( !validate( "vector2", p1 ) || !validate( "vector2", p2 ) ) {
			console.error( "Could not compute with an invalid coordinate." );
			return;
		}

		const dX = p2.x - p1.x;
		const dY = p2.y - p1.y;
		const radians = Math.atan2( dY, dX );
		if ( deg ) {
			return radians * ( 180 / Math.PI );
		}
		return radians;
	}
};
