// Aurora is distributed under the MIT license.

export default function( num, a, b ) {
	if ( !b ) {
		b = a;
		a = 0;
	}
	const min = Math.min( a, b );
	const max = Math.max( a, b );
	return num > min && num < max;
};
