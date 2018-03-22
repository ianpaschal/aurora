// Aurora is distributed under the MIT license.

import FS from "fs";
import Path from "path";

export default function( dir, callback ) {

	if ( typeof callback != "function" ) {
		return "No valid callback provided!";
	}

	let err;
	let obj = {};
	const file = Path.join( dir, "package.json" );
	console.log( file );

	FS.readFile( file, "utf8", ( err, data ) => {
		if ( err ) return err;
		obj = JSON.parse( data );

		// Check if object has 'name' (and is valid):
		if ( !obj.name ) {
			err = "Property 'name' is missing!";
		}
		else if ( typeof obj.name !== "string" ) {
			err = "Property 'name' is not a valid string!";
		}
		// Check if object has 'version' (and is valid):
		else if ( !obj.version ) {
			err = "Property 'version' is missing!";
		}
		// Check if object has 'contents' (and is valid):
		else if ( !obj.contents ) {
			err = "Property 'contents' is missing!";
		}
		else if ( typeof obj.contents !== "array" ) {
			err = "Property 'contents' is not a valid array!";
		}
		else if ( obj.contents.length < 1 ) {
			err = "Property 'contents' is empty!";
		}
		// Check if plugin exists twice (only first copy is registered)
		// Check if dependencies are missing

	});

	callback( "Error: " + dir + ": " + err, obj );
};
