import FS from "fs";
import Entity from "../core/Entity";
class AssemblyLoader {
	load( item ) {
		const json = JSON.parse( FS.readFileSync( item.path, "utf8" ) );
		return new Entity( json );
	}
}

export default AssemblyLoader;
