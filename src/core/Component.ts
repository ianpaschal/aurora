// Aurora is distributed under the MIT license.

import uuid from "uuid";
import copy from "../utils/copy";
import merge from "deepmerge";
import { ComponentConfig } from "../utils/interfaces"; // Typing

/**
 * @module core
 * @classdesc Class representing a component.
 */
export default class Component {

	private _data: {}|[];
	private _type: string;
	private _uuid: string;

	/**
	 * @description Create a Component.
	 * @param {Object} [config] - Configuration object
	 * @param {string} [config.uuid] - Component UUID
	 * @param {string} [config.type] - Component type
	 * @param {Object} [config.data] - Object containing data for the component
	 */
	constructor( config?: ComponentConfig ) {

		// Define defaults
		this._uuid = uuid();
		this._type = "noname";
		this._data = {}; // NOTE: Some components use an array

		// Apply config values
		if ( config ) {
			Object.keys( config ).forEach( ( key ) => {

				// Handle data slightly differently, otherwise simply overwite props with config values
				if ( key === "data" ) {
					this._data = copy( config.data );
				} else {
					this[ "_" + key ] = config[ key ];
				}
			});
		}
	}

	// Expose properties

	/**
	 * @description Get the component's data.
	 * @readonly
	 * @returns {Object} - The component's data
	 */
	get data(): {}|[] {
		return this._data;
	}

	/**
	 * @description Set the component's data. Note: This method differs from `.mergeData()` in that it completely
	 * overwrites any existing data within the component.
	 * @param {Object} data - Data object to apply
	 * @returns {Object} - The component's updated updated data object
	 */
	set data( data: {}|[] ) {
		this._data = copy( data );
	}

	/**
	 * @description Get the component's data as a JSON string.
	 * @readonly
	 * @returns {string} - The component's data as a JSON string
	 */
	get json() {
		return JSON.stringify({
			data: this._data,
			type: this._type,
			uuid: this._uuid
		}, null, 4 );
	}

	/**
	 * @description Get the component's type.
	 * @readonly
	 * @returns {string} - The component's type
	 */
	get type(): string {
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
	get uuid(): string {
		return this._uuid;
	}
	// Where is the set uuid() method? Doesn't exist! Don't change the UUID!

	// Other

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
	 * @description Copy another component's data, resetting existing data.
	 * @param {Component} source - Component to copy from
	 */
	copy( source: Component ): void {

		// Don't copy the UUID, only the type and data
		this._type = source.type;
		this._data = copy( source.data );
	}

	/**
	 * @description Merge a data object into this component.
	 * @param {Object} data - JSON data to apply to the component
	 * @returns {(Object|Array)} - Updated data object/array
	 */
	mergeData( data: {}|[] ): {}|[] {
		this._data = merge( this._data, data );
		return this._data;
	}

}
