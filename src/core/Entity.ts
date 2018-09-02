// Aurora is distributed under the MIT license.

import * as uuid from "uuid";
import { getItem, hasItem } from "../utils";
import Component from "./Component";
import System from "./System"; // Typing
import { EntityConfig } from "../utils/interfaces"; // Typing

/**
 * @classdesc Class representing an Entity.
 */
export default class Entity {

	private _components: any[];
	private _name:       string;
	private _type:       string;
	private _uuid:       string;

	/**
	 * @description Create an entity. A JSON object can be used when loading a previously created entity from disk, or
	 * creating an entity to be used as an assembly to clone into new entity instances.
	 * @param {Object} [config] - JSON object containing entity data
	 * @param {String} [config.uuid] - UUID of the entity
	 * @param {String} [config.type] - Type of the entity
	 * @param {String} [config.name] - Name of the entity (typically also called "unit type" in-game)
	 * @param {Array} [config.components] - Array of component data to generate component instances from
	 */
	constructor( config?: EntityConfig ) {

		// Define defaults
		this._uuid = uuid();
		this._type = "no-type";
		this._name = "No Name";
		this._components = [];

		// Apply config values
		if ( config ) {
			for ( const prop in config ) {
				if ( config.hasOwnProperty( prop ) ) {

					// Handle components slightly differently, otherwise simply overwite props with config values
					if ( prop === "components" ) {
						config.components.forEach( ( data ) => {
							this.addComponent( new Component( data ) );
						});
					} else {
						this[ "_" + prop ] = config[ prop ];
					}
				}
			}
		}
	}

	/**
	 * @description Get all of the entity's components.
	 * @readonly
	 * @returns {Array} - Array of the entity's components
	 */
	get components(): Component[] {
		return this._components;
	}

	/**
	 * @description Get all of the entity's component types.
	 * @readonly
	 * @returns {Array} - Array of component types present within the entity
	 */
	get componentTypes() {
		const componentTypes = [];
		this._components.forEach( ( component ) => {
			componentTypes.push( component.type );
		});
		return componentTypes;
	}

	/**
	 * @description Get the Entity's data as a JSON string.
	 * @readonly
	 * @returns {String} - The Entity's data as a JSON string
	 */
	get JSON() {
		// Provide new keys instead of stringifying private properties (with '_')
		const data = {
			uuid: this._uuid,
			type: this._type,
			name: this._name,
			components: []
		};
		this._components.forEach( ( component ) => {
			data.components.push( component.getJSON() );
		});
		return JSON.stringify( data, null, 4 );
	}

	/**
	 * @description Get the Entity's name.
	 * @readonly
	 * @returns {String} - The Entity's name
	 */
	get name() {
		return this._name;
	}

	/**
	 * @description Get the Entity's type.
	 * @readonly
	 * @returns {String} - The Entity's type.
	 */
	get type() {
		return this._type;
	}

	/**
	 * @description Get the Entity's UUID.
	 * @readonly
	 * @returns {String} - The Entity's UUID.
	 */
	get uuid() {
		return this._uuid;
	}

	/**
	 * @description Add a component instance to the entity. This method should only be called internally, and never after
	 * the entity has been registered.
	 * @private
	 * @param {Component} component - The component to add
	 * @returns {(Array|null)} - Updated array of components, or null if the component already existed
	 */
	addComponent( component: Component ) {
		// Don't add if it already exists:
		if ( this.hasComponent( component.type ) ) {
			console.warn( "Couldn't add "
				+ component.type + " to " + this._uuid
				+ ": Component already exists!"
			);
			return null;
		}
		this._components.push( component );
		return this._components;
	}

	/**
	 * @description Remove a Component instance from the Entity. This method should only be called internally, and never
	 * after the Entity has been registered.
	 * @private
	 * @param {String} type - Type of the Component to remove.
	 * @returns {(Array|null)} - Updated array of Components, or null the component already existed.
	 */
	removeComponent( type: string ) {
		const index = this._components.indexOf( this.getComponent( type ) );
		if ( index < 0 ) {
			console.warn( "Component with id " + type + "doesn't exist!" );
			return null;
		}
		this._components.splice( index, 1 );
		return this._components;
	}

	/**
	 * @description Clone the entity.
	 * @returns {Entity} - New instance with the same components
	 */
	clone(): Entity {
		const clone = new Entity();
		clone.copy( this );
		return clone;
	}

	/**
	 * @description Copy another entity (such as an assembly) into the entity, replacing all components.
	 * @param {Entity} source - Assembly to clone into the new entity
	 * @returns {Array} - Updated array of Components copied from source
	 */
	copy( source ) {
		this._type = source.type;
		this._name = source.name;
		this._components = [];
		source.getComponents().forEach( ( component ) => {
			this._components.push( component.clone() );
		});
		return this._components;
	}

	/** @description Get a component instance by within the entity.
		* @readonly
		* @param {String} type - Type of the component to get.
		* @returns {(Component|null)} - Requested component, or null if not found.
		*/
	getComponent( type ) {
		return getItem( type, this._components, "_type" );
	}
	/**
	 * @description Get data by component type from the entity. This is basically a shorthand for .getComponent.getData();
	 * @readonly
	 * @param {String} type - Type of the component to get data from
	 * @returns {(Object|null)} - Requested component data, or null if not found
	 */
	getComponentData( type ) {
		const component = this.getComponent( type );
		if ( !component ) {
			console.warn( "Component with type " + type + " doesn't exist!" );
			return null;
		}
		return component.getData();
	}

	/** @description Check if a component is present within the Entity.
		* @readonly
		* @param {String} type - Type of the component to check.
		* @returns {Bool} - True if the component is present within the Entity.
		*/
	hasComponent( type ) {
		return hasItem( type, this._components, "type" );
	}

	/** @description Overwrite the data for a Component with the given type within
		* the Entity.
		* @param {String} type - Type of the Component to check.
		* @param {Object} data - JSON data to apply to the Component.
		* @returns {(Array|null)} - Updated Component, or null if invalid.
		*/
	setComponentData( type, data ) {
		for ( let i = 0; i < this._components.length; i++ ) {
			if ( this._components[ i ].getType() === type ) {
				this._components[ i ].apply( data );
				return this._components[ i ];
			}
		}
		console.warn( "Component with type " + type + " doesn't exist!" );
		return null;
	}

	isWatchable( system: System ) {
		// Faster to loop through search criteria vs. all components on entity
		for ( const type of system.watchedComponentTypes ) {

			// Return early if any required component is missing on entity
			if ( !this.hasComponent( type ) ) {
				return false;
			}
		}
		return true;
	}

}
