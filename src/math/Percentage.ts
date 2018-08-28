// Aurora is distributed under the MIT license.

/**
 * @classdesc Number representing the percentage between two numbers.
 */
class Percentage {

	/**
	 * @description Create an instance of a percentage.
	 * @param {number} a - Numerator of the percentage
	 * @param {number} b - Demoninator of the percentage
	 * @param {number} places - Number of decimal places to round to
	 * @returns {Percentage} - A float number representing the percentage
	 */
	constructor( a: number, b: number, places: number ) {
		places = places || 2;
		const percent = ( a / b ) * 100;
		return Number.parseFloat( percent ).toFixed( places );
	}
}
export default Percentage;
