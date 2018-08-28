// Aurora is distributed under the MIT license.

/**
 * @description Check if a number is between two other numbers.
 * @param {number} x - The number to check
 * @param {number} a - The lower bound of the range
 * @param {number} b - The upper bound of the range
 * @returns {boolean} - True if x is between a and b
 */
export default function( x: number, a: number, b: number ): boolean {
	if ( !b ) {
		b = a;
		a = 0;
	}
	const min = Math.min( a, b );
	const max = Math.max( a, b );
	return x >= min && x <= max;
};
