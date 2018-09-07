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

// Utils
export { default as capitalize } from "./utils/capitalize";
export { default as copy } from "./utils/copy";
export { default as getItem } from "./utils/getItem";
export { default as hasItem } from "./utils/hasItem";
