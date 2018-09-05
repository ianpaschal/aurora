// Aurora is distributed under the MIT license.

export default {

	/**
	 * @description Find the distance between two points in 2D space.
	 * @param {Vector2} p1 - Starting point
	 * @param {Vector2} p2 - Ending point
	 * @returns {Number} - Distance between the points
	 */
	distance( p1: Vector2, p2: Vector2 ): number {
		const dX = p2.x - p1.x;
		const dY = p2.y - p1.y;
		return Math.sqrt( Math.pow( dX, 2 ) + Math.pow( dY, 2 ) );
	},

	/**
	 * @description Find the angle between the line formed by two points and 0 on
	 * the unit circle.
	 * @param {Vector2} p1 - Starting point
	 * @param {Vector2} p2 - Ending point
	 * @param {Boolean} deg=false - Use degrees instead of radians
	 * @returns {Number} - The resulting angle on the unit circle
	 */
	heading( p1: Vector2, p2: Vector2, deg: boolean = false ): number {
		const dX = p2.x - p1.x;
		const dY = p2.y - p1.y;
		const radians = Math.atan2( dY, dX );
		if ( deg ) {
			return radians * ( 180 / Math.PI );
		}
		return radians;
	}
};
