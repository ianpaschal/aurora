// Aurora is distributed under the MIT license.

/**
 * @classdesc Number representing the percentage between two numbers.
 */
class Percentage {

	/**
	 * @description Create an instance of a percentage.
	 * @param {*} a - Numerator of the percentage
	 * @param {*} b - Demoninator of the percentage
	 * @param {*} places - Number of decimal places to round to
	 * @returns {Number} - A float number representing the percentage
	 */
	constructor( a, b, places ) {
		places = places || 2;
		const percent = ( a / b ) * 100;
		return Number.parseFloat( percent ).toFixed( places );
	}
}
export default Percentage;
