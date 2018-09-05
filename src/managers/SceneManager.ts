import { Scene } from "three";
export default class SceneManager {
	_scene: Scene;

	constructor() {
		this._scene = new Scene();
	}

	/** @description Get the glogal scene instance. This will likely become
		* depreciated once rendering is handled exclusively by the client.
		* @readonly
		* @returns {Three.Scene}
		*/
	get scene() {
		return this._scene;
	}
}
