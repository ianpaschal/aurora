import * as Three from "three";

export default class {
	constructor( name ) {
		this._name = name || "Unamed World";
	}

	init( engine ) {
		if( !engine ) {
			console.error(
				"World " + this._name + ":",
				"Attempted to initalize without attaching to the engine!"
			);
			return;
		}

		// Generate the world (hardcoded for now):

	}
	setTime() {}
}
