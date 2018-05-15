// Aurora is distributed under the MIT license.

import FS from "fs";
import Entity from "../core/Entity";
import Percentage from "../math/Percentage";

/** @classdesc Core singleton representing an instance of the Aurora Engine. The
	* engine is responsible for the creation (and registration) of entities, as
	* well as initialization and running of systems containing game logic.
	* @returns - The newly created Engine.
	*/
class EntityLoader {

	/** @description Load an Entity from a JSON file.
		* @param {String} src - Filepath to load.
		* @param {Function} onLoad - Callback to execute on successful load.
		* @param {Function} onProgress - Callback to execute on progress.
		* @param {Function} onError - Callback to execute on error.
		* @returns {Entity} - A new Enity instance loaded from JSON.
		*/
	load( src, onLoad, onProgress, onError ) {
		if ( typeof onLoad !== "function" ) {
			return;
		}
		if ( typeof onError !== "function" ) {
			return;
		}

		const stats = FS.statSync( src );
		const stream = FS.createReadStream( src, { highWaterMark: 16 });
		const chunks = [];

		// Handle any errors while reading
		stream.on( "error", ( err ) => {
			return onError( err );
		});

		// Listen for data
		stream.on( "data", ( chunk ) => {
			chunks.push( chunk );
			if ( typeof onProgress !== "function" ) {
				onProgress( new Percentage( stream.bytesRead / stats.size ) );
			}
		});

		// File is done being read
		stream.on( "close", () => {
			// Create a buffer of the chunks from the stream
			const entity = this.parse( Buffer.concat( chunks ) );
			return onLoad( entity );
		});
	}

	/** @description Create an Entity from a JSON object.
		* @param {Object} data - JSON object to parse.
		* @returns {Entity} - A new Enity instance created from JSON.
		*/
	parse( data ) {
		return new Entity( data );
	}
}

export default EntityLoader;
