// Aurora is distributed under the MIT license.

import FS from "fs";
import Path from "path";

/** @classdesc [Insert Here]
	* @returns - The newly created Plugin Manager.
	*/
class PluginManager {

	/** @description Create a Plugin Manager instance. */
	constructor() {

		this._pluginLocations = [];
		this._pluginStack = [];

		return this;
	}

	/** @description Add a location to scan for plugins.
		* @param {String} path - Location (file path) to add.
		* @returns {Array} - Updated array of plugin locations.
		*/
	addLocation( path ) {
		// TODO: Validation.
		this._pluginLocations.push( path );
		return this._pluginLocations;
	}

	/** @description Flatten the plugin load stack into an asset stack comprised
		* of unique asset types and IDs.
		* @returns {Array} - Array of asset items.
		*/
	_flatten( pluginLocations, pluginStack ) {
		const stack = [];

		// Scan each plugin location for each plugin in the stack.
		pluginLocations.forEach( ( location ) => {
			pluginStack.forEach( ( plugin ) => {

				const basePath = Path.join( location, plugin );
				const fullPath = Path.join( basePath, "package.json" );

				// Search for package.json per plugin. Skip if not found.
				if ( !FS.existsSync( basePath ) ) {
					console.warn( "Skipping " + plugin + ". Not found." );
					return;
				}
				if ( !FS.existsSync( fullPath ) ) {
					console.warn( "Skipping " + plugin + ". 'package.json' not found." );
					return;
				}

				// If found, parse list of assets (contents)
				const data = FS.readFileSync( fullPath, "utf8" );
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
					item.path = Path.join( basePath, item.path );
					stack.push( item );
				});
			});
		});
		return stack;
	}

	/** @description Get the flattened asset stack generated from all plugin
		* locations.
		* @returns {Array} - Array of asset items.
		*/
	get stack() {
		return this._flatten( this._pluginLocations, this._pluginStack );
	}

	/** @description Set the Engine's plugin stack.
		* @param {Array} stack - Array of plugins to load.
		* @returns {Array} - Updated array of plugins.
		*/
	set pluginStack( stack ) {
		this._pluginStack = stack;
	}
}

export default PluginManager;
