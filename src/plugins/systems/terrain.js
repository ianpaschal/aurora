// Aurora is distributed under the MIT license.

import * as Three from "three";
import System from "../../core/System";

export default new System({
	name: "terrain",
	fixed: false,
	componentTypes: [],
	init() {
		// Create an easier reference to the global scene:
		this._scene = this._engine.getScene();
		const groundTexture = this._engine._textures[ "nature-grass-75-dirt-25" ];
		groundTexture.wrapS = Three.RepeatWrapping;
		groundTexture.wrapT = Three.RepeatWrapping;
		groundTexture.repeat.set( 32, 32 );
		const ground = new Three.Mesh(
			new Three.PlaneGeometry( 512, 512 ),
			new Three.MeshLambertMaterial({
				color: 0xffffff,
				map: groundTexture
			})
		);
		ground.name = "ground";
		this._scene.add( ground );
	},
	add() {
		// Do nothing for now.
	},
	update() {
		// Do nothing for now.
	}
});
