// Aurora is distributed under the MIT license.

/**
 * @module utils
 */
export default function getItem( target, array, prop ) {
	const match = array.find( ( item ) => {
		return item[ prop ] === target;
	});
	if ( !match ) {
		return null;
	}
	return match;
}
