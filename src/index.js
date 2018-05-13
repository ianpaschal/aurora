// Aurora is distributed under the MIT license.

import Component from "./core/Component";
import Engine from "./core/Engine";
import Entity from "./core/Entity";
import Player from "./core/Player";
import System from "./core/System";
import Math2D from "./math/Math2D";
import Math3D from "./math/Math3D";
import * as utils from "./utils";

export default {

	// Core
	Component: Component,
	Engine: Engine,
	Entity: Entity,
	Player: Player,
	System: System,

	// Math & utils
	Math2D: Math2D,
	Math3D: Math3D,
	utils: utils
};
