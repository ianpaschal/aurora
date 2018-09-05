import EntityLoader from "../loaders/EntityLoader";
import { TextureLoader, JSONLoader } from "three";
export default class AssetManager {
	_assets: { geometry: {}; sound: {}; texture: {}; };
	constructor() {
		this._assets = {
			geometry: {},
			sound: {},
			texture: {}
		};
	}
	getAsset( type, id ) {
		if ( !this._assets[ type ] ) {
			return console.log( "No assets of type " + type + " exist." );
		}
		const asset = this._assets[ type ][ id ];
		if ( !asset ) {
			return console.log( "Asset " + id + " does not exist." );
		}
		return asset;
	}
	loadAssets( stack, onProgress, onFinished ) {
		const scope = this;
		let loaded = 0;

		// If nothing to load, skip straight to on finished:
		if ( stack.length === 0 ) {
			onFinished();
		}

		const loaders = {
			"assembly": new EntityLoader(),
			"texture": new TextureLoader(),
			"geometry": new JSONLoader()
		};

		stack.forEach( ( item ) => {
			if ( !loaders[ item.type ] ) {
				console.error( "No loader for type " + item.type );
				return;
			}
			loaders[ item.type ].load(
				item.path,
				( asset ) => {
					scope._assets[ item.type ][ item.name ] = asset;
					loaded++;
					onProgress( item.name );
					if ( loaded === stack.length ) {
						onFinished();
					}
				},
				undefined,
				( err ) => {
					console.error( "Failed to load", stack.textures[ name ], err );
				}
			);
		});
	}
}
