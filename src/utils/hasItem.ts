// Aurora is distributed under the MIT license.

/**
 * @module utils
 */
export default function hasItem( target, array, prop ) {
	const match = array.find( ( item ) => {
		return item[ prop ] === target;
	});
	if ( !match ) {
		return false;
	}
	return true;
}
