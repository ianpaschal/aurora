// Aurora is distributed under the MIT license.

import System from "../../core/System";
import * as Three from "three";

export default new System({
	name: "visibility",
	fixed: true,
	step: 500,
	componentTypes: [
		"movement"
	],
	init() {
		const material = new Three.MeshBasicMaterial({
			color: 0x000000,
			depthTest: false,
			alphaTest: 0.5
		});
		const geometry = new Three.PlaneGeometry( 512, 512 );
		const mesh = new Three.Mesh( geometry, material );
		mesh.name = "fogOfWar";
		// mesh.position.z = 4;
		this._engine.getScene().add( mesh );

		this._plane = mesh;
	},
	add() {
		// Do nothing for now.
	},
	update() {
		this._engine._players.forEach( ( player ) => {
			// Paint visible areas:
			const context = player._visibilityMap.getContext( "2d" );
			player._entityUUIDs.forEach( ( uuid ) => {
				const entity = this._engine.getEntity( uuid );
				const tasks = entity.getTasks();
				if ( tasks[ 0 ] && tasks[ 0 ].action === "walk" ) {
					const position = entity.getData( "position" );
					const center = {
						x: 512 + position.x * 2,
						y: 512 - position.y * 2
					};
					const radius = entity.getData( "visibility" ).distance;

					context.beginPath();
					context.arc( center.x, center.y, radius, 0, 2 * Math.PI, false );
					context.fillStyle = "black";
					context.fill();
				}
			});
		});

		const texture = new Three.Texture( this._engine.getPlayer( 0 )._visibilityMap );
		texture.needsUpdate = true;
		this._plane.material.alphaMap = texture;
		this._plane.material.needsUpdate = true;
	}
});
