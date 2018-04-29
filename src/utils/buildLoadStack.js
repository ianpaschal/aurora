// Aurora is distributed under the MIT license.

import FS from "fs";
import Path from "path";

/** @description Construct a loadStack object from plugin locations.
	* @param {Array} pluginLocations - Type of assembly to fetch.
	* @param {Array} pluginStack - Array of plugins to search each location for.
	* Lower indices within the array indicate earlier loading; assets within those
	* plugins can be overwritten by assets within plugins with higher indices.
	* @returns {Array} - A loadStack; an array of sorted filepaths to laod assets
	* from.
	*/
export default function( pluginLocations, pluginStack ) {
	const stack = [];

	// Scan each plugin location for each plugin in the stack.
	pluginLocations.forEach( ( location ) => {
		pluginStack.forEach( ( plugin ) => {

			// Search for package.json per plugin. Skip if not found.
			const base = Path.join( location, plugin );
			if ( !FS.existsSync( base ) ) {
				console.warn( "Skipping " + plugin + ". Not found." );
				return;
			}
			if ( !FS.existsSync( Path.join( base, "package.json" ) ) ) {
				console.warn( "Skipping " + plugin + ". 'package.json' was missing." );
				return;
			}

			// If found, parse list of assets (contents)
			const data = FS.readFileSync( Path.join( base, "package.json" ), "utf8" );
			const contents = JSON.parse( data ).contents;
			contents.forEach( ( item ) => {

				// If an asset has already been registered with that name, remove it
				const index = stack.findIndex( ( asset ) => {
					return asset.name === item.name;
				});
				if ( index >= 0 ) {
					stack.splice( index, 1 );
				}
				// Save the actual asset path to the stack
				item.path = Path.join( base, item.path );
				stack.push( item );
			});
		});
	});
	return stack;
}
