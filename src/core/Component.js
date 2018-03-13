// Forge is distributed under the MIT license.

import UUID from "uuid/v4";
import deepCopy from "../utils/deepCopy";
import deepMerge from "deepmerge";

/** @classdesc Class representing a Component. */
class Component {

	/** Create a Component.
		* @param {Object} json - JSON object containing component data. This is used
		* when loading a previously created ecomponent from disk, or creating the
		* components which comprise an Assembly.
		*/
	constructor( json ) {

		// If building from JSON:
		if ( json ) {
			this._uuid = json.uuid;
			this._type = json.type;
			this._data = json.data;
		}

		// If creating a fresh instance:
		else {
			this._uuid = UUID();
			this._type = "noname";
			this._data = {};
		}
	}

	/** Apply JSON data to this component. Note: When merging an object and an
		* array, the item in `JSON` will overwrite the existing object for that key.``
		* @param {Object} json - New instance of `Component` with the same data.
		*/
	apply( json ) {
		this._data = deepMerge( this._data, json );
	}

	/** Clone this component.
		* @returns {Component} - New instance of `Component` with the same data.
		*/
	clone() {
		const clone = new this.constructor();
		clone.copy( this );
		return clone;
	}

	/** @description Copy another component's data, replacing all existing data.
		* @param {Component} source - Component to copy from.
		*/
	copy( source ) {
		this._type = source.getType();
		this._data = deepCopy( source.getData() );
	}

	/** @description Get the component's data.
		* @readonly
		* @returns {Object} - The component's data.
		*/
	getData() {
		return this._data;
	}

	/** @description Get the component's type.
		* @readonly
		* @returns {String} - The component's type.
		*/
	getType() {
		return this._type;
	}

	/** @description Get the component's UUID.
		* @readonly
		* @returns {String} - The component's UUID.
		*/
	getUUID() {
		return this._uuid;
	}

	/** Set the component's type.
		* @param {String} type - New type for the component.
		*/
	setType( type ) {
		this._type = type;
	}
}

export default Component;
