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
	const loadStack = {};

	// Scan each plugin location for each plugin in the stack.
	pluginLocations.forEach( ( location ) => {
		pluginStack.forEach( ( plugin ) => {

			// Search for package.json per plugin. Skip if not found.
			const path = Path.join( location, plugin, "package.json" );
			if ( !FS.existsSync( Path.join( location, plugin ) ) ) {
				console.warn( "Skipping " + plugin + ". Not found." );
				return;
			}
			if ( !FS.existsSync( path ) ) {
				console.warn( "Skipping " + plugin + ". 'package.json' was missing." );
				return;
			}

			// If found, parse list of assets (contents).
			const data = FS.readFileSync( path, "utf8" );
			const contents = JSON.parse( data ).contents;
			contents.forEach( ( item ) => {

				// Add a section for this type if it doesn't exist yet.
				if ( !loadStack[ item.type ] ) {
					loadStack[ item.type ] = {};
				}

				// Save the actual asset path to the stack.
				const assetPath = Path.join( location, plugin, item.path );
				loadStack[ item.type ][ item.name ] = assetPath;
			});
		});
	});
	return loadStack;
}
