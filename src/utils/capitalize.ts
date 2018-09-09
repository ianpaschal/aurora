// Aurora is distributed under the MIT license.

/**
 * @module utils
 */
export default function capitalize( str ) {
	// TODO: Capitalize per word
	return str.charAt( 0 ).toUpperCase() + str.slice( 1 );
}
