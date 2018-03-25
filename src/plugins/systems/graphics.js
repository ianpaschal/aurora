// Aurora is distributed under the MIT license.

import * as Three from "three";
import Path from "path";
import DecalGeometry from "../../utils/DecalGeometry";
import System from "../../core/System";

export default new System({
	name: "graphics",
	fixed: false,
	componentTypes: [
		"geometry",
		"material",
		"position",
		"rotation"
	],
	init() {
		// Create an easier reference to the global scene:
		this._scene = this._engine.getScene();
		this._entityMeshes = {};
		this._mixers = {};
	},
	add( entity ) {
		const geometryData = entity.getData( "geometry" );
		const animationData = entity.getData( "animation" );
		const materialData = entity.getData( "material" );
		const geoIndex = Math.floor( Math.random() * geometryData.length );
		const geometry = this._engine.getGeometry( geometryData[ geoIndex ] );
		const materials = [];
		materialData.forEach( ( name ) => {
			const material = new Three.MeshLambertMaterial({
				color: new Three.Color( 1, 1, 1 ),
				map: this._engine._textures[ name + "-diffuse" ],
				alphaTest: 0.5, // if transparent is false
				transparent: false
			});
			if ( animationData ) {
				material.morphTargets = true;
			}
			if ( this._engine._textures[ name + "-alpha" ] ) {
				material.alphaMap = this._engine._textures[ name + "-alpha" ];
			}
			materials.push( material );
		});
		const mesh = new Three.Mesh( geometry, materials );
		mesh.position.copy( entity.getData( "position" ) );
		mesh.rotation.z = entity.getData( "rotation" ).z;
		mesh.entityID = entity.getUUID();
		this._scene.add( mesh );
		this._entityMeshes[ entity.getUUID() ] = mesh;
		if ( geometry.morphTargets.length > 0 ) {

			// Seriously, Mr. Doob? ------------------------------------------->|
			const clips = Three.AnimationClip.CreateClipsFromMorphTargetSequences(
				geometry.morphTargets,
				30
			);
			const mixer = new Three.AnimationMixer( mesh );
			mixer.clipAction( "idle" ).setDuration( 2 );
			mixer.clipAction( "walk" ).setDuration( 1 );
			mixer.existingAction( "walk" ).clampWhenFinished = false;
			mixer.clipAction( "harvest" ).setDuration( 2 );
			this._mixers[ entity.getUUID() ] = mixer;
			mixer.clipAction( "walk" ).play();
		}

		/*
		// Decal
		const ground = this._scene.getObjectByName( "ground" );
		const textureLoader = new Three.TextureLoader();

		const decalMap = textureLoader.load(
			Path.join(
				this._engine._pluginsDir,
				"forge-aom-mod/texture/nature-rock-base-decal-diffuse.png"
			),
			undefined,
			undefined,
			( err ) => {
				console.error( "Failed to load", err );
			}
		);
		const decalMapAlpha = textureLoader.load(
			Path.join(
				this._engine._pluginsDir,
				"forge-aom-mod/texture/nature-rock-base-decal-alpha.png"
			),
			undefined,
			undefined,
			( err ) => {
				console.error( "Failed to load", err );
			}
		);
		const decalGeo = new DecalGeometry(
			ground,
			mesh.position,
			mesh.rotation,
			new Three.Vector3( 4, 4, 4 )
		);
		const decalMat = new Three.MeshLambertMaterial({

			// normalMap: decalNormal,
			// normalScale: new Three.Vector2( 1, 1 ),

			map: decalMap,
			alphaMap: decalMapAlpha,
			transparent: true,
			depthTest: true,
			depthWrite: false,
			polygonOffset: true,
			polygonOffsetFactor: - 4
		});
		const decalMesh = new Three.Mesh( decalGeo, decalMat );
		this._entityMeshes[ entity.getUUID() ].add( decalMesh );
		*/
	},
	update( time ) {
		this._entityUUIDs.forEach( ( uuid ) => {
			const entity = this._engine.getEntity( uuid );
			const mesh = this._entityMeshes[ uuid ];
			mesh.position.copy( entity.getData( "position" ) );
			mesh.rotation.z = entity.getData( "rotation" ).z;
			const mixer = this._mixers[ uuid ];
			if ( mixer ) {
				/*
				if ( entity.tasksDirty ) {
					entity.tasksDirty = false;
					mixer.stopAllAction();
					// mixer.existingAction( entity.getCurrentTask().action ).play();
				}
				*/
				mixer.update( time / 1000 );
			}
		});
	}
});
