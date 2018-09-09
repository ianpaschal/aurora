// Aurora is distributed under the MIT license.

/**
 * @module utils
 */
export default function copy( obj ) {
	return JSON.parse( JSON.stringify( obj ) );
}
