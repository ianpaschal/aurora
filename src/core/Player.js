// Aurora is distributed under the MIT license.

import * as Three from "three";
import UUID from "uuid/v4";

/** @classdesc Class representing a Player. */
class Player {
	constructor( uuid, config ) {
		this.uuid = uuid || UUID();
		this.name = config.name;
		this.color = config.color;
		this.start = config.start;
		this._entities = [];
		console.log( "Created player " + this.uuid + " with name " + this.name + "." );
		return this;
	}

	own( entity ) {
		this._entities.push( entity.getUUID() );
	}

	getEntityIDs() {
		return this._entities;
	}
}

export default Player;
