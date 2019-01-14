// Aurora is distributed under the MIT license.

import uuid from "uuid";
import getItem from "../utils/getItem";
import hasItem from "../utils/hasItem";
import Component from "./Component";
import System from "./System"; // Typing
import { EntityConfig } from "../utils/interfaces"; // Typing

/**
 * @module core
 * @classdesc Class representing an entity.
 */
export default class Entity {

	private _components: any[];
	private _dirty:      boolean;
	private _name:       string;
	private _type:       string;
	private _uuid:       string;

	/**
	 * @description Create an entity. An object can be used when loading a previously created entity
	 * from disk, or creating an entity to be used as an assembly to clone into new entity instances.
	 * @param {Object} [config] - Configuration object
	 * @param {string} [config.uuid] - Entity UUID
	 * @param {string} [config.type] - Entity type
	 * @param {string} [config.name] - Entity name (typically also called "unit type" in-game)
	 * @param {Array} [config.components] - Array of component data objects to generate component
	 * instances from
	 */
	constructor( config?: EntityConfig ) {

		// Define defaults
		this._uuid = uuid();
		this._type = "no-type";
		this._name = "No Name";
		this._components = [];
		this._dirty = true;

		// Apply config values
		if ( config ) {
			Object.keys( config ).forEach( ( key ) => {

				// Handle components slightly differently, otherwise simply overwite props with config value
				if ( key === "components" ) {
					config.components.forEach( ( data ) => {
						this.addComponent( new Component( data ) );
					});
				} else {
					this[ "_" + key ] = config[ key ];
				}
			});
		}
	}

	/**
	 * @description Get all of the entity's component instances.
	 * @readonly
	 * @returns {Component[]} - Array of component instances
	 */
	get components(): Component[] {
		return this._components;
	}

	/**
	 * @description Get all of the entity's component types.
	 * @readonly
	 * @returns {string[]} - Array of component types
	 */
	get componentTypes(): string[] {
		const componentTypes = [];
		this._components.forEach( ( component ) => {
			componentTypes.push( component.type );
		});
		return componentTypes;
	}

	get dirty(): boolean {
		return this._dirty;
	}

	set dirty( boolean ) {
		this._dirty = boolean;
	}

	/**
	 * @description Get the entity's data as a pure object (as compared to a class instance).
	 * @readonly
	 * @returns {Object} - Entity data as an object
	 */
	get flattened(): any {
		const data = {
			uuid: this._uuid,
			type: this._type,
			name: this._name,
			components: []
		};
		this._components.forEach( ( component ) => {
			data.components.push({
				data: component.data,
				type: component.type,
				uuid: component.uuid
			});
		});
		return data;
	}

	/**
	 * @description Get the entity's data as a JSON string.
	 * @readonly
	 * @returns {string} - JSON string
	 */
	get json(): string {
		return JSON.stringify( this.flattened, null, 4 );
	}

	/**
	 * @description Get the entity's name.
	 * @readonly
	 * @returns {string} - Name string
	 */
	get name(): string {
		return this._name;
	}

	/**
	 * @description Get the entity's type.
	 * @readonly
	 * @returns {string} - Type string
	 */
	get type(): string {
		return this._type;
	}

	/**
	 * @description Get the entity's UUID.
	 * @readonly
	 * @returns {string} - UUID string
	 */
	get uuid(): string {
		return this._uuid;
	}

	/**
	 * @description Add a component instance to the entity. This method should only be called
	 * internally, and never after the entity has been registered.
	 * @private
	 * @param {Component} component - The component to add
	 * @returns {Component[]} - Updated array of components, or null if the component already existed
	 */
	addComponent( component: Component ): Component[] {
		if ( this.hasComponent( component.type ) ) {
			throw Error( `Component with type ${ component.type } was already added!` );
		}
		this._components.push( component );
		return this._components;
	}

	/**
	 * @description Clone the entity.
	 * @returns {Entity} - New Entity instance
	 */
	clone(): Entity {
		const clone = new Entity();
		clone.copy( this );
		return clone;
	}

	/**
	 * @description Copy another entity (such as an assembly) into the entity, replacing all
	 * components.
	 * @param {Entity} source - Entity to copy
	 */
	copy( source ): void {
		this._type = source.type;
		this._name = source.name;
		this._components = [];
		source.components.forEach( ( component ) => {
			this._components.push( component.clone() );
		});
	}

	/**
	 * @description Get a component instance by type from the entity.
	 * @readonly
	 * @param {string} type - Component type
	 * @returns {Component} - Requested component instance
	 */
	getComponent( type: string ): Component {
		return getItem( type, this._components, "_type" );
	}

	/**
	 * @description Get data by component type from the entity. This is basically a shorthand for
	 * .getComponent.getData();
	 * @readonly
	 * @param {string} type - Component type
	 * @returns {any} - Requested component data
	 */
	getComponentData( type: string ): any {
		const component = this.getComponent( type );
		if ( !component ) {
			throw Error( `Component with type ${ type } doesn't exist!` );
		}
		return component.data;
	}

	/**
	 * @description Check if a component is present within the entity.
	 * @readonly
	 * @param {string} type - Component type
	 * @returns {boolean} - True if the component is present
	 */
	hasComponent( type: string ): boolean {
		return hasItem( type, this._components, "type" );
	}

	/**
	 * @description Check if the entity is watchable by a given system.
	 * @readonly
	 * @param {System} system - System instance
	 * @returns {boolean} - True if the entity is watchable
	 */
	isWatchableBy( system: System ) {

		// Faster to loop through search criteria vs. all components on entity
		for ( const type of system.watchedComponentTypes ) {

			// Return early if any required component is missing on entity
			if ( !this.hasComponent( type ) ) {
				return false;
			}
		}
		return true;
	}

	/**
	 * @description Remove a component instance from the entity. This method should only be called
	 * internally, and never after the entity has been registered.
	 * @private
	 * @param {string} type - Component type
	 * @returns {Component[]} - Array of component instances
	 */
	removeComponent( type: string ): Component[] {
		const index = this._components.indexOf( this.getComponent( type ) );
		if ( index === -1 ) {
			throw Error( `Component with type ${ type } doesn't exist!` );
		}
		this._components.splice( index, 1 );
		return this._components;
	}

	/**
	 * @description Overwrite the data for a component of the given type within the entity.
	 * @param {string} type - Component type
	 * @param {Object} data - Data object
	 */
	setComponentData( type: string, data: {}): void {
		const index = this._components.indexOf( this.getComponent( type ) );
		if ( index === -1 ) {
			throw Error( `Component with type ${ type } doesn't exist!` );
		}
		const component = this.getComponent( type );
		component.mergeData( data );
	}

}
