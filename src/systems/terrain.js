// Aurora is distributed under the MIT license.

import * as Three from "three";
import SimplexNoise from "simplex-noise";
import System from "../core/System";

export default new System({
	name: "terrain",
	fixed: false,
	componentTypes: [],
	init() {
		// Create an easier reference to the global scene:
		this._scene = this._engine.getScene();
		/*
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
		*/
		this._simplex = new SimplexNoise();

		// TODO: This should be generating a number of tiles around the origin

		const groundGeometry = new Three.PlaneGeometry( 64, 64, 16, 16 );

		groundGeometry.vertices.forEach( ( vertex ) => {
			vertex.z = this._simplex.noise2D( vertex.x, vertex.y );
			// console.log( vertex.z );
		});

		const ground = new Three.Mesh(
			groundGeometry,
			new Three.MeshLambertMaterial({ color: 0xffffff })
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
