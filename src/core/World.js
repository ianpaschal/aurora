import * as Three from "three";
// import store from "../ui/store";

export default class {

	constructor( name ) {

		this.name = name || "Unamed World";

		const mesh = new Three.Mesh( new Three.PlaneGeometry( 1024, 1024 ), new Three.MeshLambertMaterial({
			color: 0x999999
		}) );

		// store.state.scene.add( mesh );

		const loader = new Three.TextureLoader();

		let material;

		// load a resource
		loader.load(
			// resource URL
			"../assets/texture/TexturesCom_SoilSand0187_1_seamless_S.jpg",

			// onLoad callback
			function ( texture ) {
				// in this example we create the material when the texture is loaded
				texture.wrapS = Three.RepeatWrapping;
				texture.wrapT = Three.RepeatWrapping;

				// how many times to repeat in each direction; the default is (1,1),
				//   which is probably why your example wasn't working
				texture.repeat.set( 64, 64 );

				material = new Three.MeshBasicMaterial({
					map: texture
				});
				const plane = new Three.Mesh( new Three.PlaneGeometry( 1024, 1024 ), material );
				// engine.getScene().add( plane );
			},

			// onProgress callback currently not supported
			undefined,

			// onError callback
			function ( err ) {
				console.error( "An error happened." );
			}
		);

	}

	registerEntity() {

	}

	deregisterEntity() {

	}

}
