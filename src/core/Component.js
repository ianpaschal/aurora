// Aurora is distributed under the MIT license.

import UUID from "uuid/v4";
import { deepCopy } from "../utils";
import deepMerge from "deepmerge";

/** @classdesc Class representing a Component. */
class Component {

	/** Create a Component.
		* @param {Object} [config] - JSON object containing component data. This is used
		* when loading a previously created ecomponent from disk, or creating the
		* components which comprise an Assembly.
		* @param {String} [config.uuid] - UUID of the component.
		* @param {String} [config.type] - Type of the component.
		* @param {Object} [config.data] - JSON object containing the actual data for
		* the component.
		* @returns {Component} - The newly created Component.
		*/
	constructor( config ) {

		// If building from JSON:
		if ( config ) {
			this._uuid = config.uuid;
			this._type = config.type;
			this._data = config.data;
		}

		// If creating a fresh instance:
		else {
			this._uuid = UUID();
			this._type = "noname";
			this._data = {}; // NOTE: Some components use an array.
		}

		return this;
	}

	/** @description Apply JSON data to this Component. Note: When two different
		* types share the same key (i.e. a string and a boolean), the new value (in
		* the JSON) will overwrite the existing value. This also applies to objects
		* and arrays.
		* @param {Object} json - JSON data to apply to the Component.
		* @returns {Object} - Updated data object.
		*/
	apply( json ) {
		this._data = deepMerge( this._data, json );
		return this._data;
	}

	/** @description Clone the component.
		* @returns {Component} - New Component instance with the same data.
		*/
	clone() {
		const clone = new this.constructor();
		clone.copy( this );
		return clone;
	}

	/** @description Copy another Component's data, replacing all existing data.
		* @param {Component} source - Component to copy from.
		* @returns {Component} - Component with updated data.
		*/
	copy( source ) {
		// TODO: Add validation
		this._type = source.getType();
		this._data = deepCopy( source.getData() );
		return this;
	}

	/** @description Get the component's data.
		* @readonly
		* @returns {Object} - The component's data.
		*/
	getData() {
		return this._data;
	}

	/** @description Get the component's data as a JSON string.
		* @readonly
		* @returns {String} - The component's data as a JSON string.
		*/
	getJSON() {
		// Provide new keys instead of stringifying private properties (with '_')
		return JSON.stringify({
			uuid: this.getUUID(),
			type: this.getType(),
			data: this.getData()
		}, null, 4 );
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

	/** @description Set JSON data in this Component. Note: This method differs
		* from `.apply()` in that it completely overwrites any existing data.
		* @param {Object} json - JSON data to apply to the Component.
		* @returns {Object} - Updated data object.
		*/
	setData( json ) {
		// TODO: Add validation
		this._data = json;
		return this._data;
	}

	/** @description Set the component's type.
		* @param {String} type - New type for the Component.
		* @returns {String} - Updated type for the Component.
		*/
	setType( type ) {
		// TODO: Add validation
		this._type = type;
		return this._type;
	}
}

export default Component;
