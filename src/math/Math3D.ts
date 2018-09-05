// Aurora is distributed under the MIT license.

export default {

	/**
	 * @description Find the distance between two points in 3D space.
	 * @param {Vector3} p1 - Starting point
	 * @param {Vector3} p2 - Ending point
	 * @returns {number} - Distance between the points
	 */
	distance( p1: Vector3, p2: Vector3 ): number {
		const x = Math.abs( p2.x - p1.x );
		const y = Math.abs( p2.y - p1.y );
		const z = Math.abs( p2.z - p1.z );
		return Math.sqrt( Math.pow( x, 2 ) + Math.pow( y, 2 ) + Math.pow( z, 2 ) );
	},

	/**
	 * @description Find the midpoint between two points in 3D space.
	 * @param {Vector3} p1 - Starting point
	 * @param {Vector3} p2 - Ending point
	 * @returns {Vector3} - Midpoint between the points
	 */
	midpoint( p1: Vector3, p2: Vector3 ): Vector3 {
		return {
			x: ( p1.x + p2.x ) / 2,
			y: ( p1.y + p2.y ) / 2,
			z: ( p1.z + p2.z ) / 2
		};
	}
};
