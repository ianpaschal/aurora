import FS from "fs";
import Entity from "../core/Entity";

function calcPercent( a, b ) {
	return Math.round( ( a / b ) * 1000 ) / 10;
}

class EntityLoader {

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
			const percent = calcPercent( stream.bytesRead / stats.size );
			if ( typeof onProgress !== "function" ) {
				onProgress( percent );
			}
		});

		// File is done being read
		stream.on( "close", () => {
			// Create a buffer of the chunks from the stream
			const entity = this.parse( Buffer.concat( chunks ) );
			return onLoad( entity );
		});
	}

	parse( data ) {
		return new Entity( data );
	}
}

export default EntityLoader;
