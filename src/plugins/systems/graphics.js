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
	},
	add( entity ) {
		const geometryData = entity.getData( "geometry" );
		const materialData = entity.getData( "material" );
		const geoIndex = Math.floor( Math.random() * geometryData.length );
		const geometry = this._engine.getGeometry( geometryData[ geoIndex ] );

		const materials = [];
		materialData.forEach( ( material ) => {
			materials.push( new Three.MeshLambertMaterial({
				color: new Three.Color( 1, 1, 1 ),
				map: this._engine._textures[ material + "-diffuse" ],
				alphaMap: this._engine._textures[ material + "-alpha" ],
				alphaTest: 0.5, // if transparent is false
				transparent: false
			}) );
		});
		const mesh = new Three.Mesh( geometry, materials );
		mesh.position.copy( entity.getData( "position" ) );
		mesh.rotation.copy( entity.getData( "rotation" ) );
		mesh.entityID = entity.getUUID();
		this._scene.add( mesh );
		this._entityMeshes[ entity.getUUID() ] = mesh;
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
		this._scene.add( decalMesh );
		*/
	},
	update( time ) {
		this._entityUUIDs.forEach( ( uuid ) => {
			const entity = this._engine.getEntity( uuid );
			const mesh = this._entityMeshes[ uuid ];
			mesh.position.copy( entity.getData( "position" ) );
			// mesh.position.x += time / 1000;
		});

	}
});

// OLD:
/*
class AnimationSystem {

	constructor() {
		this.name = "rendering";
		this._mixers = [];
		this.walking = undefined;
		this._savedTime = 0;
		this._maxFPS = 60;
		console.log( "Created a new " + this.name + " system." );
		return this;
	}

	init( engine ) {
		if( !engine ) {
			console.warn( capitalize( this.name ) + ": Attempted to initalize system without an engine!" );
			return;
		}
		console.log( capitalize( this.name ) + ": Linked system to engine." );

		const loader = new Three.JSONLoader();
		// console.log( "IN ANIMATION:", engine );
		const scope = this;

		const paths = [];
		paths.push( "../../plugins/age-of-mythology/model/greek-villager-female.js" );

		paths.forEach( ( path ) => {
			loader.load( path, ( geometry, materials ) => {
				for ( var i = 0; i < materials.length; i++ ) {
					materials[ i ].color.setRGB( 1.0, 1.0, 1.0 );
					materials[ i ].morphTargets = true;
				}
				const mesh = new Three.Mesh( geometry, new Three.MeshLambertMaterial({
					color: 0x999999
				}) );
				mesh.material.morphTargets = true;

				const clips = Three.AnimationClip.CreateClipsFromMorphTargetSequences( geometry.morphTargets, 30 );
				// const forageClip = Three.AnimationClip.CreateFromMorphTargetSequence( "forage", geometry.morphTargets, 30 );

				console.log( clips );
				const mixer = new Three.AnimationMixer( mesh );
				const walkAction = mixer.clipAction( clips[ 0 ] );
				const forageAction = mixer.clipAction( clips[ 1 ] );

				walkAction.setDuration( 2 );
				walkAction.play();
				// forageAction.play();

				// engine.getScene().add( mesh );
				mesh.position.x = paths.indexOf( path ) * 2;
				scope._mixers.push( mixer );
				if ( paths.indexOf( path ) === 1 ) {
					scope.walking = mesh;
				}
			});
		});
	}
	update( delta ) {
		this._savedTime += delta;
		if ( this._savedTime > this._stepSize ) {
			this._savedTime -= delta;
		}
		this._mixers.forEach( ( mixer ) => {
			mixer.update( delta / 1000 );
		});
	}

}

export default AnimationSystem;
*/
