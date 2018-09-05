// Aurora is distributed under the MIT license.

import * as uuid from "uuid";
import { copy } from "../utils";
import * as merge from "deepmerge";
import { ComponentConfig } from "../utils/interfaces"; // Typing

/**
 * @classdesc Class representing a component.
 */
export default class Component {

	private _data: {}|[];
	private _type: string;
	private _uuid: string;

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

		// Define defaults
		this._uuid = uuid();
		this._type = "noname";
		this._data = {}; // NOTE: Some components use an array

		// Apply config values
		if ( config ) {
			for ( const prop in config ) {
				if ( config.hasOwnProperty( prop ) ) {

					// Handle data slightly differently, otherwise simply overwite props with config values
					if ( prop === "data" ) {
						this._data = copy( config.data );
					} else {
						this[ "_" + prop ] = config[ prop ];
					}
				}
			}
		}
	}

	/**
	 * @description Get the component's data.
	 * @readonly
	 * @returns {Object} - The component's data
	 */
	get data(): {}|[] {
		return this._data;
	}

	/**
	 * @description Set the data for the component. Note: This method differs from `.mergeData()` in that it completely
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

		// Provide new keys instead of stringifying private properties (with '_')
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

	/**
	 * @description Merge a data object into this component.
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

		// Don't copy the UUID, only the type and data
		this._type = source.type;
		this._data = copy( source.data );
	}

}
