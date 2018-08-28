// Aurora is distributed under the MIT license.

import UUID from "uuid/v4";
import { deepCopy } from "../utils";
import deepMerge from "deepmerge";

interface Config {
	UUID: string;
	type: string;
	data: {};
}

/**
 * @classdesc Class representing a component.
 */
class Component {
	_UUID: string;
	_type: string;
	_data: any;

	/**
	 * @description Create a Component.
	 * @param {Object} [config] - JSON object containing component data. This is
	 * used when loading a previously created ecomponent from disk, or creating
	 * the components which comprise an assembly.
	 * @param {String} [config.uuid] - UUID of the component
	 * @param {String} [config.type] - Type of the component
	 * @param {Object} [config.data] - JSON object containing the actual data for
	 * the component
	 * @returns {Component} - The newly created component
	 */
	constructor( config?:Config ) {

		// If building from JSON
		if ( config ) {
			this._UUID = config.UUID;
			this._type = config.type;
			this._data = config.data;
		} else {
			this._UUID = UUID();
			this._type = "noname";
			this._data = {}; // NOTE: Some components use an array
		}

		return this;
	}

	// Getters & Setters

	/**
	 * @description Get the component's data.
	 * @readonly
	 * @returns {Object} - The component's data
	 */
	get data(): {} {
		return this._data;
	}

	/**
	 * @description Set JSON data in this Component. Note: This method differs
	 * from `.apply()` in that it completely overwrites any existing data.
	 * @param {Object} json - JSON data to apply to the Component.
	 * @returns {Object} - Updated data object.
	 */
	set data( data: {}) {
		// TODO: Add validation
		this._data = data;
	}

	/**
	 * @description Get the component's data as a JSON string.
	 * @readonly
	 * @returns {String} - The component's data as a JSON string
	 */
	get JSON() {
		// Provide new keys instead of stringifying private properties (with '_')
		return JSON.stringify({
			data: this._data,
			type: this._type,
			UUID: this._UUID
		}, null, 4 );
	}

	/**
	 * @description Get the component's type.
	 * @readonly
	 * @returns {String} - The component's type
	 */
	get type() {
		return this._type;
	}

	/**
	 * @description Set the component's type.
	 * @param {String} type - New type for the component
	 * @returns {String} - Updated type for the component
	 */
	set type( type: string ) {
		// TODO: Add validation
		this._type = type;
	}

	/**
	 * @description Get the component's UUID.
	 * @readonly
	 * @returns {String} - The component's UUID
	 */
	get UUID() {
		return this._UUID;
	}

	// Other methods

	/**
	 * @description Apply JSON data to this Component. Note: When two different
	 * types share the same key (i.e. a string and a boolean), the new value (in
	 * the JSON) will overwrite the existing value. This also applies to objects
	 * and arrays.
	 * @param {Object} json - JSON data to apply to the component
	 * @returns {Object} - Updated data object
	 */
	applyData( json ) {
		this._data = deepMerge( this._data, json );
		return this._data;
	}

	/**
	 * @description Clone the component.
	 * @returns {Component} - New component instance with the same data
	 */
	clone() {
		return new Component().copy( this );
	}

	/**
	 * @description Copy another Component's data, replacing all existing data.
	 * @param {Component} source - Component to copy from
	 * @returns {Component} - Component with updated data
	 */
	copy( source: Component ): void {
		// TODO: Add validation
		this._type = source.type;
		this._data = deepCopy( source.data );
	}
}

export default Component;
