// Aurora is distributed under the MIT license.

export default function copy( obj ) {
	return JSON.parse( JSON.stringify( obj ) );
}
