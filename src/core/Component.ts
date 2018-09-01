// Aurora is distributed under the MIT license.

import * as uuid from "uuid";
import { copy } from "../utils";
import * as merge from "deepmerge";
import { ComponentConfig } from "../utils/interfaces"; // Typing

/**
 * @classdesc Class representing a component.
 */
export default class Component {
	_uuid: string;
	_type: string;
	_data: any;

	/**
	 * @description Create a Component.
	 * @param {Object} [config] - Object containing component data. This is used when loading a previously created
	 * component from disk, or creating the components which comprise an assembly.
	 * @param {string} [config.uuid] - UUID of the component
	 * @param {string} [config.type] - Type of the component
	 * @param {Object} [config.data] - Object containing the actual data for the component
	 * @returns {Component} - The newly created component
	 */
	constructor( config?: ComponentConfig ) {

		// If building from existing data
		if ( config ) {
			this._uuid = config.uuid;
			this._type = config.type;
			this._data = copy( config.data ); // Copy instead of referencing the data
			return this;
		}

		// Assign default values
		this._uuid = uuid();
		this._type = "noname";
		this._data = {}; // NOTE: Some components use an array
		return this;
	}

	/**
	 * @description Get the component's data.
	 * @readonly
	 * @returns {Object} - The component's data
	 */
	get data(): {} {
		return this._data;
	}

	/**
	 * @description Set the data for the component. Note: This method differs from `.mergeData()` in that it completely
	 * overwrites any existing data within the component.
	 * @param {Object} data - Data object to apply
	 * @returns {Object} - The component's updated updated data object
	 */
	set data( data: {}) {
		// TODO: Add validation
		this._data = copy( data );
	}

	/**
	 * @description Get the component's data as a JSON string.
	 * @readonly
	 * @returns {string} - The component's data as a JSON string
	 */
	get JSON() {
		// Provide new keys instead of stringifying private properties (with '_')
		return JSON.stringify({
			data: this._data, // TODO: This should get each component and stringify that
			type: this._type,
			uuid: this._uuid
		}, null, 4 );
	}

	/**
	 * @description Get the component's type.
	 * @readonly
	 * @returns {string} - The component's type
	 */
	get type() {
		return this._type;
	}

	/**
	 * @description Set the component's type.
	 * @param {string} type - New type for the component
	 */
	set type( type: string ) {
		this._type = type;
	}

	/**
	 * @description Get the component's UUID.
	 * @readonly
	 * @returns {String} - The component's UUID
	 */
	get uuid() {
		return this._uuid;
	}

	/**
	 * @description Merge a data object into this component. Note: When two different types share the same key (i.e. a
	 * string and a boolean), the new value (in the JSON) will overwrite the existing value. This also applies to objects
	 * and arrays.
	 * @param {Object} data - JSON data to apply to the component
	 * @returns {(Object|Array)} - Updated data object/array
	 */
	mergeData( data ): {}|[] {
		this._data = merge( this._data, data );
		return this._data;
	}

	/**
	 * @description Clone the component.
	 * @returns {Component} - New component instance with the same data
	 */
	clone(): Component {
		const clone = new Component();
		clone.copy( this );
		return clone;
	}

	/**
	 * @description Copy another Component's data, replacing all existing data.
	 * @param {Component} source - Component to copy from
	 * @returns {Component} - Component with updated data
	 */
	copy( source: Component ): void {

		// Don't copy the UUID!
		this._type = source.type;
		this._data = copy( source.data );
	}

}
