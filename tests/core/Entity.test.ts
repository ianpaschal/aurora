import { Component, Entity, System } from "../../src";
import uuid from "uuid";

let instance: Entity;
const config = {
	uuid: uuid(),
	type: "foo",
	name: "FooBar",
	components: [
		{ type: "foo", data: { isFoo: true } }
	]
};

beforeEach( () => {
	instance = new Entity( config );
});

// Constructor

describe( "Entity.constructor( config )", () => {
	it( "should copy the config's name if it exists.", () => {
		expect( instance.name ).toEqual( config.name );
	});
	it( "should copy the config's type if it exists.", () => {
		expect( instance.type ).toEqual( config.type );
	});
	it( "should copy the config's UUID if it exists.", () => {
		expect( instance.uuid ).toEqual( config.uuid );
	});
	it( "should instantiate components defined in config.", () => {
		expect( instance.hasComponent( "foo" ) ).toBe( true );
	});
});

// Getters

describe( "Entity.uuid", () => {
	it ( "should always be defined.", () => {
		expect( instance.uuid ).toBeDefined();
	});
});

describe( "Entity.json", () => {
	it( "should be a formatted JSON string representing the entity.", () => {
		expect( JSON.parse( instance.json ) ).toEqual({
			"uuid": config.uuid,
			"type": config.type,
			"name": config.name,
			"components": [
				{
					"data": { "isFoo": true },
					"type": "foo",
					"uuid": instance.getComponent( "foo" ).uuid
				}
			]
		});
	});
});

describe( "Entity.componentTypes", () => {
	it( "should return an array of component types.", () => {
		expect( instance.componentTypes ).toEqual( [ "foo" ] );
	});
});

// Other

describe( "Entity.addComponent( component )", () => {
	let component: Component;
	let length: number;
	beforeEach( () => {
		component = new Component();
		length = instance.components.length;
		instance.addComponent( component );
	});
	it( "should add the component if it doesn't exist already.", () => {
		expect( instance.components.length ).toEqual( length + 1 );
	});
	it( "should throw an error if that component is already added.", () => {
		expect( () => {
			instance.addComponent( component );
		}).toThrowError();
	});
});

describe( "Entity.clone()", () => {
	let clone: Entity;
	beforeEach( () => {
		clone = instance.clone();
	});
	it( "should not clone the UUID.", () => {
		expect( clone.uuid ).not.toEqual( instance.uuid );
	});
	it( "should clone the type.", () => {
		expect( clone.type ).toEqual( instance.type );
	});
	it( "should clone the data.", () => {
		for( let i = 0; i < instance.components.length; i++ ) {
			const original = instance.components[ i ];
			expect( clone.components[ i ].uuid ).not.toEqual( original.uuid );
			expect( clone.components[ i ].type ).toEqual( original.type );
			expect( clone.components[ i ].data ).toEqual( original.data );
		}
	});
});

describe( "Entity.copy( entity )", () => {
	let source: Entity;
	beforeEach( () => {
		source = new Entity({
			uuid: uuid(),
			type: "foo",
			components: []
		});
		instance.copy( source );
	});
	it( "should not copy the UUID.", () => {
		expect( instance.uuid ).not.toEqual( source.uuid );
	});
	it( "should copy the type.", () => {
		expect( instance.type ).toEqual( source.type );
	});
	it( "should copy the data.", () => {
		for( let i = 0; i < source.components.length; i++ ) {
			const original = source.components[ i ];
			expect( instance.components[ i ].uuid ).not.toEqual( original.uuid );
			expect( instance.components[ i ].type ).toEqual( original.type );
			expect( instance.components[ i ].data ).toEqual( original.data );
		}
	});
});

describe( "Entity.getComponentData( type )", () => {
	it( "should return the component data if it exists.", () => {
		expect( instance.getComponentData( "foo" ) ).toEqual({ isFoo: true });
	});
	it( "should throw an error if no component of that type exists.", () => {
		expect( () => {
			instance.getComponentData( "bar" );
		}).toThrowError();
	});
});

describe( "Entity.isWatchableBy( system )", () => {
	let systemFoo: System;
	let systemBar: System;
	beforeEach( () => {
		systemFoo = new System({
			componentTypes: [ "foo" ],
			name: "foo-system",
			onUpdate( t ) {}
		});
		systemBar = new System({
			componentTypes: [ "bar" ],
			name: "bar-system",
			onUpdate( t ) {}
		});
	});
	test( "should return true if the entity has all required components.", () => {
		expect( instance.isWatchableBy( systemFoo ) ).toBe( true );
	});
	test( "should return false if the entity is missing a component.", () => {
		expect( instance.isWatchableBy( systemBar ) ).toBe( false );
	});
});

describe( "Entity.removeComponent( type )", () => {
	it( "should remove the component if it exists.", () => {
		const length = instance.components.length;
		instance.removeComponent( "foo" );
		expect( instance.components.length ).toEqual( length - 1 );
	});
	it ( "should return the entity's component array.", () => {
		expect( instance.removeComponent( "foo" ) ).toEqual( [] );
	});
	it( "should throw an error if no component of that type exists.", () => {
		expect( () => {
			instance.removeComponent( "bar" );
		}).toThrowError();
	});
});

describe( "Entity.setComponentData( key, data )", () => {
	it( "should merge data into existing components with the given key.", () => {
		const data = {
			additionalProp: 7
		};
		instance.setComponentData( "foo", data );
		const component = instance.getComponent( "foo" );
		expect( Object.keys( component.data ) ).toContain( "additionalProp" );
		console.log( "data:", component.data );
		expect( component.data.additionalProp ).toEqual( data.additionalProp );
	});
	it( "should throw an error for components which are invalid/missing.", () => {
		expect( () => {
			instance.setComponentData( "bar", {});
		}).toThrowError();
	});
});
