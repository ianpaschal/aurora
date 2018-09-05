// Aurora is distributed under the MIT license.

// This is removed via Parcel when creating a production bundle
console.warn(
	"If you are seeing this message, you are running Aurora in development mode.",
	"Make sure to turn on production mode when deploying for production.",
	"See more tips at https://ianpaschal.github.io/aurora/guide/deployment"
);

// Core
export { default as Component } from "./core/Component";
export { default as Engine } from "./core/Engine";
export { default as Entity } from "./core/Entity";
export { default as State } from "./core/State";
export { default as System } from "./core/System";

// Math
export { default as isBetween } from "./math/isBetween";
export { default as math2D } from "./math/math2D";
export { default as math3D } from "./math/math3D";

// Utils
import * as utils from "./utils";
export { utils };
