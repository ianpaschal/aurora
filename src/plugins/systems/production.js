// Aurora is distributed under the MIT license.

import System from "../../core/System";
import Entity from "../../core/Entity";

export default new System({
	name: "production",
	fixed: true,
	step: 100,
	componentTypes: [ "production" ],
	init() {
		// Do nothing for now.
	},
	add() {
		// Do nothing for now.
	},
	update() {
		this._entityUUIDs.forEach( ( uuid ) => {

			const entity = this._engine.getEntity( uuid );
			const queue = entity.getData( "production" ).queue;
			let spawn = entity.getData( "production" ).spawn;
			if ( spawn === null ) {
				spawn = entity.getData( "position" );
			}
			const playerIndex = entity.getData( "player" ).index;
			const player = this._engine.getPlayer( playerIndex );
			// Update progress:
			queue.forEach( ( item ) => {

				// If complete:
				if ( item.progress >= 100 ) {
					const fresh = new Entity();
					player.own( fresh );
					fresh.copy( this._engine.getAssembly( item.type ) );
					fresh.getComponent( "player" ).apply({
						index: playerIndex
					});
					fresh.getComponent( "position" ).apply({
						x: spawn.x,
						y: spawn.y
					});
					fresh.setTasks( [
						{ action: "walk", target: {
							x: spawn.x + Math.random() * 12,
							y: spawn.y + Math.random() * 12,
							z: 0
						} },
						{ action: "idle", target: null }
					] );
					this._engine.registerEntity( fresh );
					queue.shift();
				}

				// Otherwise advance a bit:
				else {
					// Get required time for item.type.
					// Elapsed = item.progress/100 * required;
					// Elapsed += delta.
					// item.progress = Math.round(elapsed/required);
				}
			});
		});
	}
});
