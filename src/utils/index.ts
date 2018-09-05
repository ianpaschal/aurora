// Aurora is distributed under the MIT license.

export function capitalize( str ) {
	return str.charAt( 0 ).toUpperCase() + str.slice( 1 );
}

export function copy( obj ) {
	return JSON.parse( JSON.stringify( obj ) );
}

export function getItem( target, array, prop ) {
	const match = array.find( ( item ) => {
		return item[ prop ] === target;
	});
	if ( !match ) {
		return null;
	}
	return match;
}

export function hasItem( target, array, prop ) {
	const match = array.find( ( item ) => {
		return item[ prop ] === target;
	});
	if ( !match ) {
		return false;
	}
	return true;
}
