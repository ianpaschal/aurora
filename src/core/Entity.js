// Forge is distributed under the MIT license.

import UUID from "uuid/v4";

/** @classdesc Class representing an Entity. */
class Entity {

	/** Create an Entity.
		* @param {Object} json - JSON object containing entity data. This is used
		* when loading a previously created entity from disk, or creating an Entity
		* which will be used as an Assembly to clone into new Entity instances.
		*/
	constructor( json ) {

		// If building from JSON:
		if ( json ) {
			this._uuid = json._uuid;
			this._type = json._type;
			this._components = [];
			json._components.forEach( ( data ) => {
				this.addComponent( new Component( data ) );
			});
		}

		// If creating a fresh instance:
		else {
			this._uuid = UUID();
			this._type = "untyped";
			this._components = [];
		}
	}

	/** Add a `Component` to the entity.
		* @param {Component} component - The component to add.
		*/
	addComponent( component ) {
		if ( this.hasComponent( component.getType() ) ) {
			return "Component already exists!";
		}
		this._components.push( component );
	}

	/** Clone the entity.
		* @returns {Entity} - New instance with the same components.
		*/
	clone() {
		return new this.constructor().copy( this );
	}

	/** Copy an assembly into the entity, replacing all components.
		* @param {Entity} source - Assembly to clone into the new entity.
		*/
	copy( source ) {
		this._type = source.getType();
		this._components = [];
		source.getComponents().forEach( ( component ) => {
			this._components.push( component.clone() );
		});
	}

	/** Get a component instance by  within the entity.
		* @param {String} type - Type of the component to get.
		* @returns {Component}
		*/
	getComponent( type ) {
		const match = this._components.find( ( component ) => {
			return component.getType() === type;
		});
		if ( match ) {
			return match;
		}
		return "Component with type " + type + "doesn't exist";
	}

	/** Get all of the entity's components.
		* @readonly
		* @returns {Array} - The entity's components.
		*/
	getComponents() {
		return this._components;
	}

	/** Get data by component type from the entity.
		* @readonly
		* @param {String} type - Type of the component to get data from.
		* @returns {Object}
		*/
	getData( type ) {
		const component = this.getComponent( type );
		if ( component ) {
			return component.getData();
		}
		return "Component with type " + type + "doesn't exist";
	}

	/** Get the entity's type.
		* @readonly
		* @returns {String} - The entity's type.
		*/
	getType() {
		return this._type;
	}

	/** Get the entity's UUID.
		* @readonly
		* @returns {String} - The entity's UUID.
		*/
	getUUID() {
		return this._uuid;
	}

	hasComponent( type ) {
		const match = this._components.find( ( component ) => {
			return component.getType() === type;
		});
		if ( match ) {
			return true;
		}
		return false;
	}

	print () {
		console.info( JSON.stringify( this, null, 4 ) );
		return this;
	};

	/** Remove a component by type from the entity.
		* @param {String} type - Type of the component to remove.
		*/
	removeComponent( type ) {
		const index = this._components.indexOf( this.getComponent( type ) );
		if ( index > 0 ) {
			delete this.components[ index ];
		}
		else {
			return "Component with id " + type + "doesn't exist";
		}
	}

	setComponentData( type, data ) {
		for ( let i = 0; i < this._components.length; i++ ) {
			if ( this._components[ i ].getType() === type ) {
				return this._components[ i ].apply( data );
			}
		}
		return "Component with type " + type + "doesn't exist";
	}

	setType( type ) {
		this._type = type;
	}
}

export default Entity;
