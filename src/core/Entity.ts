// Aurora is distributed under the MIT license.

import UUID from "uuid/v4";
import { getItem, hasItem } from "../utils";
import Component from "./Component";

interface Config {
	components: [Component];
}

/**
 * @classdesc Class representing an Entity.
 */
class Entity {

	_components: any[];
	_dirty: boolean;
	_tasks: any;
	_UUID: any;
	_type: any;
	_name: any;
	tasksDirty: boolean;

	setDirty(): any {
		throw new Error( "Method not implemented." );
	}

	/**
	 * Create an entity. A JSON object can be used when loading a previously created entity from disk, or creating an
	 * entity to be used as an assembly to clone into new entity instances.
	 * @param {Object} [config] - JSON object containing entity data
	 * @param {String} [config.uuid] - UUID of the entity
	 * @param {String} [config.type] - Type of the entity
	 * @param {String} [config.name] - Name of the entity (typically also called "unit type" in-game)
	 * @param {Array} [config.components] - Array of component data to generate component instances from
	 * @param {Array} [config.tasks] - Array of task objects (upcoming) for the entity to execute
	 */
	constructor( config?: Config ) {

		const defaults = {
			UUID: UUID(),
			type: "no-type",
			name: "No Name",
			components: [],
			tasks: []
		};

		// For every property in the defaults, apply the config value if it exists, otherwise use the default value
		for ( const prop in defaults ) {
			if ( defaults.hasOwnProperty( prop ) ) {

				// Treat the components property slightly differently, for all else use the value in defaults
				if ( prop === "components" && config.components ) {
					this._components = [];
					config.components.forEach( ( data ) => {
						this._addComponent( new Component( data ) );
					});
				} else {
					this[ "_" + prop ] = config[ prop ] || defaults[ prop ];
				}
			}
		}

		// Newly constructed entities should never be dirty after creation
		this._dirty = false;

		return this;
	}

	// Getters & Setters

	/**
	 * @description Get all of the entity's components.
	 * @readonly
	 * @returns {Array} - Array of the entity's components
	 */
	get components() {
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
			componentTypes.push( component.getType() );
		});
		return componentTypes;
	}

	/**
	 * @description Get the entity's current task.
	 * @readonly
	 * @returns {Object} - The entity's current task
	 */
	get currentTask() {
		return this._tasks[ 0 ];
	}

	/**
	 * @description Check if any component has been changed since the last update.
	 * @readonly
	 * @returns {Bool} - True if the entity has been changed
	 */
	get dirty() {
		return this._dirty;
	}

	/**
	 * @description Set the entity as dirty or clean.
	 * @param {Bool} dirty - Value to set the dirty flag
	 * @returns {Bool} - The Component's dirty flag
	 */
	set dirty( dirty ) {
		this._dirty = dirty;
	}

	/**
	 * @description Get the Entity's data as a JSON string.
	 * @readonly
	 * @returns {String} - The Entity's data as a JSON string
	 */
	get JSON() {
		// Provide new keys instead of stringifying private properties (with '_')
		const data = {
			UUID: this._UUID,
			type: this._type,
			name: this._name,
			tasks: this._tasks,
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
	 * @description Get the Entity's task list.
	 * @readonly
	 * @returns {Array} - The Entity's task list
	 */
	get tasks() {
		return this._tasks;
	}

	/**
	 * @description Overwite the current task list with an array tasks.
	 * @param {Array} tasks - Array of task objects to replace existing tasks
	 * @returns {Array} - Updated array of tasks
	 */
	set tasks( tasks ) {
		// TODO: Add validation
		this._tasks = tasks;
		this.tasksDirty = true;
		this.setDirty();
	};

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
	get UUID() {
		return this._UUID;
	}

	// Other methods

	/**
	 * @description Add a component instance to the entity. This method should only be called internally, and never after
	 * the entity has been registered.
	 * @private
	 * @param {Component} component - The component to add
	 * @returns {(Array|null)} - Updated array of components, or null if the component already existed
	 */
	_addComponent( component ) {
		// Don't add if it already exists:
		if ( this.hasComponent( component.getType() ) ) {
			console.warn( "Couldn't add "
				+ component.getType() + " to " + this.getUUID()
				+ ": Component already exists!"
			);
			return null;
		}
		this._components.push( component );
		this._dirty = true;
		return this._components;
	}
	getUUID(): any {
		throw new Error( "Method not implemented." );
	}

	/**
	 * @description Remove a Component instance from the Entity. This method should only be called internally, and never
	 * after the Entity has been registered.
	 * @private
	 * @param {String} type - Type of the Component to remove.
	 * @returns {(Array|null)} - Updated array of Components, or null the component already existed.
	 */
	_removeComponent( type ) {
		const index = this._components.indexOf( this.getComponent( type ) );
		if ( index < 0 ) {
			console.warn( "Component with id " + type + "doesn't exist!" );
			return null;
		}
		this._components.splice( index, 1 );
		this._dirty = true;
		return this._components;
	}

	/**
	 * @description Clone the entity.
	 * @returns {Entity} - New instance with the same components
	 */
	clone() {
		return new Entity().copy( this );
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
		this._dirty = true;
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
		return hasItem( type, this._components, "_type" );
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
				this.setDirty();
				return this._components[ i ];
			}
		}
		console.warn( "Component with type " + type + " doesn't exist!" );
		return null;
	}

	/** @description Append an array of tasks to the current task queue.
		* @param {Array} tasks - Array of task objects to replace existing tasks.
		* @returns {Array} - Updated array of tasks.
		*/
	appendTasks( tasks ) {
		// TODO: Add validation
		this._tasks.concat( tasks );
		this.setDirty();
		return this.tasks;
	};

	/** @description Insert an array of tasks into the front of the current task
		* queue.
		* @param {Array} tasks - Array of task objects to replace existing tasks.
		* @returns {Array} - Updated array of tasks.
		*/
	insertTasks( tasks ) {
		this._tasks = tasks.concat( this._tasks );
		this.tasksDirty = true;
		this.setDirty();
		return this.tasks;
	};

	/** @description Advance the current task by one.
		* @returns {Array} - Updated array of tasks.
		*/
	// Advance forward in the task queue:
	advanceTasks() {
		this._tasks.shift();
		this.tasksDirty = true;
		this.setDirty();
		return this.tasks;
	};

}

export default Entity;
