// Aurora is distributed under the MIT license.

/**
 * @description Check if a number is between two other numbers.
 * @param {Number} x - The number to check
 * @param {Number} a - The lower bound of the range
 * @param {Number} b - The upper bound of the range
 * @returns {Boolean} - True if x is between a and b
 */
export default function( x, a, b ) {
	if ( !b ) {
		b = a;
		a = 0;
	}
	const min = Math.min( a, b );
	const max = Math.max( a, b );
	return x >= min && x <= max;
};
