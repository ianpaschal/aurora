import FS from "fs";
import Path from "path";

// List all files in a directory in Node.js recursively in a synchronous fashion
const walkDirSync = function( dir, filelist ) {

	const files = FS.readdirSync( dir );

	// If this is the 2nd level of the file tree, reuse the old file list:
	filelist = filelist || [];

	files.forEach( ( file ) => {

		// If directory is found, perform walk recursively:
		if ( FS.statSync( Path.join( dir, file ) ).isDirectory() ) {
			filelist = walkDirSync( Path.join( dir, file ), filelist );
		}
		else {
			// Check if file is an approved type:
			if (
				file.indexOf( ".png" ) == file.length - 4 ||
				file.indexOf( ".ogg" ) == file.length - 4 ||
				file.indexOf( ".json" ) == file.length - 5
			) {
				filelist.push( Path.join( dir, file ) );
			}
		}
	});
	return filelist;
};

export default walkDirSync;
