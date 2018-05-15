// Aurora is distributed under the MIT license.

class Percentage {
	constructor( a, b, places ) {
		places = places || 2;
		const percent = ( a / b ) * 100;
		return Number.parseFloat( percent ).toFixed( places );
	}
}
export default Percentage;
