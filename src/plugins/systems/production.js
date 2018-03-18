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
						x: entity.getData( "position" ).x + ( ( Math.random() * 40 ) - 20 ),
						y: entity.getData( "position" ).y + ( ( Math.random() * 40 ) - 20 )
					});
					fresh.setTasks( [
						{ action: "walk", target: { x: 50, y: 50, z: 0 } },
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
