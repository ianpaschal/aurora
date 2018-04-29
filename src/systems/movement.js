// Aurora is distributed under the MIT license.

import System from "../core/System";
import Math2D from "../math/Math2D";

export default new System({
	name: "movement",
	fixed: false,
	componentTypes: [
		"movement"
	],
	init() {
		// Do nothing for now.
	},
	add() {
		// Do nothing for now.
	},
	update( time ) {

		this._entityUUIDs.forEach( ( uuid ) => {

			const entity = this._engine.getEntity( uuid );
			const tasks = entity.getTasks();
			const currentTask = tasks[ 0 ];

			if ( currentTask.action === "walk" ) {

				const position = entity.getData( "position" );
				const target = currentTask.target;
				const heading = Math2D.heading( position, target );
				const distance = entity.getData( "movement" ).speed * ( time / 1000 );
				const distanceToGo = Math2D.distance( position, target );

				// Apply old position plus computed offset to position:
				entity.getComponent( "position" ).apply({
					x: position.x + distance * Math.cos( heading ),
					y: position.y + distance * Math.sin( heading )
				});
				entity.getComponent( "rotation" ).apply({
					z: heading + Math.PI / 2
				});

				// If distance is greater than 0.1 m, move towards the target:
				if ( distanceToGo < 0.1 ) {
					// Entity has arrived. Next task.
					entity.advanceTasks();
				}
			}
		});
	}
});
