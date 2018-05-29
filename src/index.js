// Aurora is distributed under the MIT license.

// This is removed via Webpack when creating a production pack
console.warn(
	"You are running Aurora in development mode.",
	"Make sure to turn on production mode when deploying for production.",
	"See more tips at https://ianpaschal.github.io/aurora/guide/deployment"
);

// Core
export { default as Component } from "./core/Component";
export { default as Engine } from "./core/Engine";
export { default as Entity } from "./core/Entity";
export { default as Player } from "./core/Player";
export { default as State } from "./core/State";
export { default as System } from "./core/System";

// Loaders
export { default as EntityLoader } from "./loaders/EntityLoader";
export { default as JSONLoader } from "./loaders/JSONLoader";
export { default as MaterialLoader } from "./loaders/MaterialLoader";

// Managers
export { default as PluginManager } from "./managers/PluginManager";
export { default as StateManager } from "./managers/StateManager";

// Math
export { default as isBetween } from "./math/isBetween";
export { default as Math2D } from "./math/Math2D";
export { default as Math3D } from "./math/Math3D";
export { default as Percentage } from "./math/Percentage";

// Utils
import * as utils from "./utils";
export { utils };
