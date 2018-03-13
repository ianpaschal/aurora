import System from "../core/System";

const props = {
	name: "sound",
	fixed: false
};

const init = function() {
	this._scene = this._engine.getScene();
	// Do nothing for now.
};

const update = function( time ) {
	// Do nothing for now.
};

export default new System( props, init, update );
