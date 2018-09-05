import { Component, Engine, Entity, State, System } from "../../src";
import * as uuid from "uuid";

describe( "Entity", () => {

	// Create a new system instance to run tests on for each test
	let instance: Entity;
	beforeEach( () => {
		instance = new Entity({
			components: [
				{ type: "foo", data: { isFoo: true } }
			]
		});
	});

	/* This test may seem redundant but is helpful for explicitly detecting if an property or method was removed or
	 * renamed (as compared to a failed test which only indicates that method didn't work). i.e. Maybe it works but got
	 * renamed.
	 */
	it( "should contain all properties and methods.", () => {
		expect( instance.components ).toBeDefined();
		expect( instance.copy ).toBeDefined();
		expect( instance.clone ).toBeDefined();
	});

	test( "should be cloneable as a copy with a different UUID.", () => {
		const clone = instance.clone();
		expect( clone.uuid ).not.toEqual( instance.uuid );
		expect( clone.type ).toEqual( instance.type );
		for( let i = 0; i < instance.components.length; i++ ) {
			const original = instance.components[ i ];
			expect( clone.components[ i ].uuid ).not.toEqual( original.uuid );
			expect( clone.components[ i ].type ).toEqual( original.type );
			expect( clone.components[ i ].data ).toEqual( original.data );
		}
	});

	test( "should be able to copy another entity.", () => {
		const clone = new Entity();
		clone.copy( instance );
		expect( clone.uuid ).not.toEqual( instance.uuid );
		expect( clone.type ).toEqual( instance.type );
		for( let i = 0; i < instance.components.length; i++ ) {
			const original = instance.components[ i ];
			expect( clone.components[ i ].uuid ).not.toEqual( original.uuid );
			expect( clone.components[ i ].type ).toEqual( original.type );
			expect( clone.components[ i ].data ).toEqual( original.data );
		}
	});

	test( "should be able to merge in data for existing components.", () => {
		const data = {
			additionalProp: 7
		};
		instance.setComponentData( "foo", data );
		expect( instance.getComponentData( "foo" ) ).toEqual({
			isFoo: true,
			additionalProp: 7
		});
	});

	test( "should not be able to merge in data for missing components.", () => {
		expect( () => {
			instance.setComponentData( "bar", {});
		}).toThrowError();
	});

});

// ----

let instance: Entity;
const config = {
	uuid: uuid(),
	type: "foo-fighter",
	name: "Dave",
	components: [
		{ type: "foo", data: { isFoo: true } }
	]
};
beforeEach( () => {
	instance = new Entity( config );
});

describe( "new Entity( config )", () => {

	it( "should instantiate components defined in config.", () => {
		expect( instance.hasComponent( "foo" ) ).toBe( true );
	});

	// Extraneous, apparently
	it( "should copy the config name.", () => {
		expect( instance.name ).toEqual( config.name );
	});

	// Extraneous, apparently
	it( "should copy the config type.", () => {
		expect( instance.type ).toEqual( config.type );
	});

	// Extraneous, apparently
	it( "should copy the config UUID.", () => {
		expect( instance.uuid ).toEqual( config.uuid );
	});

});

// Getters & Setters

describe( "Entity.uuid", () => {

	it ( "should always be defined.", () => {
		expect( instance.uuid ).toBeDefined();
	});

});

describe( "Entity.json", () => {

	it( "should be a formatted JSON string representing the entity.", () => {
		const componentUUID = instance.getComponent( "foo" ).uuid;
		expect( JSON.parse( instance.json ) ).toEqual({
			"uuid": config.uuid,
			"type": "foo-fighter",
			"name": "Dave",
			"components": [
				{
					"data": { "isFoo": true },
					"type": "foo",
					"uuid": componentUUID
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

// Methods

describe( "Entity.addComponent()", () => {

	it( "should add the component if it doesn't exist already.", () => {
		const length = instance.components.length;
		instance.addComponent( new Component() ); // WHAT AN INTEGRATION TEST?
		expect( instance.components.length ).toEqual( length + 1 );
	});

	// it ( "should return the entity's component array.", () => {
	// 	expect( instance.removeComponent( "foo" ) ).toEqual( [] );
	// });

	it( "should throw an error if that component is already added.", () => {
		const component = new Component(); // WHAT AN INTEGRATION TEST?
		instance.addComponent( component );
		expect( () => {
			instance.addComponent( component );
		}).toThrowError();
	});

});

describe( "Entity.getComponentData()", () => {

	it( "should return the component data if it exists.", () => {
		expect( instance.getComponentData( "foo" ) ).toEqual({ isFoo: true });
	});

	it( "should throw an error if no component of that type exists.", () => {
		expect( () => {
			instance.getComponentData( "bar" );
		}).toThrowError();
	});

});

describe( "Entity.removeComponent()", () => {

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

// Apparently extraneous:

// describe( "Entity.getComponent()", () => {
// 	it( "should return the component instance of the given type.", () => {
// 		const component = instance.getComponent( "foo" );
// 		expect( component.type ).toEqual( "foo" );
// 		expect( component.data ).toEqual({ isFoo: true });
// 	});
// });
