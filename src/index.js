// Aurora is distributed under the MIT license.

// This is removed via Webpack when creating a production pack
console.warn(
	"You are running Aurora in development mode.",
	"Make sure to turn on production mode when deploying for production.",
	"See more tips at https://ianpaschal.github.io/aurora/guide/deployment"
);

export { default as Component } from "./core/Component";
export { default as Engine } from "./core/Engine";
export { default as Entity } from "./core/Entity";
export { default as Player } from "./core/Player";
export { default as System } from "./core/System";

export { default as isBetween } from "./math/isBetween";
export { default as Math2D } from "./math/Math2D";
export { default as Math3D } from "./math/Math3D";
export { default as Percentage } from "./math/Percentage";
import * as utils from "./utils";
export { utils };
