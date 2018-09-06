import { Component, Engine, Entity, State, System } from "../../src";
import uuid from "uuid";

describe( "Component (with config)", () => {

	// Create a new system instance to run tests on for each test
	let instance: Component;
	let secondaryConfig;
	let config;
	beforeEach( () => {
		config = {
			data: {
				x: 0,
				y: 0,
				z: 0,
				required: true
			},
			type: "position",
			uuid: uuid()
		};
		secondaryConfig = {
			uuid: uuid.v4(),
			type: "different-type",
			data: {
				name: "a string",
				required: false,
				children: [
					{ key: "data" },
					{ key: 0 }
				]
			}
		};
		instance = new Component( config );
	});

	/* This test may seem redundant but is helpful for explicitly detecting if an property or method was removed or
		renamed (as compared to a failed test which only indicates that method didn't work). i.e. Maybe it works but got
		renamed. */
	it( "should contain all properties and methods.", () => {
		expect( instance.copy ).toBeDefined();
		expect( instance.clone ).toBeDefined();
		expect( instance.mergeData ).toBeDefined();
	});

	it( "should apply config correctly.", () => {
		expect( instance.uuid ).toEqual( config.uuid );
		expect( instance.type ).toEqual( config.type );

		// Make sure to clone the original data, not reference it:
		expect( instance.data ).not.toBe( config.data );
		expect( instance.data ).toEqual( config.data );
	});

	test( "clones correctly.", () => {
		const clone = instance.clone();
		expect( clone.uuid ).not.toEqual( instance.uuid );
		expect( clone.type ).toEqual( instance.type );
		expect( clone.data ).toEqual( instance.data );
	});

	test( "copies from other component correctly.", () => {
		const source = new Component( secondaryConfig );
		instance.copy( source );

		// Copy should have it's own uuid
		expect( instance.uuid ).not.toEqual( source.uuid );

		// Should copy the type
		expect( instance.type ).toBe( source.type );

		// Ensure data is a copy, not a reference
		expect( instance.data ).not.toBe( source.data );
		expect( instance.data ).toEqual( source.data );
	});

	test( "can have data applied to it.", () => {

		// .data should be overwritten/merged by source where applicable
		instance.mergeData( secondaryConfig.data );
		expect( instance.data ).toEqual({
			name: "a string",
			x: 0,
			y: 0,
			z: 0,
			required: false,
			children: [
				{ key: "data" },
				{ key: 0 }
			]
		});
	});

	test( "Converting component to JSON", () => {
		expect( instance.json ).toEqual( JSON.stringify( config, null, 4 ) );
	});

});

describe( "Component (without config)", () => {

	// Create a new system instance to run tests on for each test
	let instance: Component;
	let config: {};
	let secondaryConfig: {};
	beforeEach( () => {
		instance = new Component();
		config = {
			uuid: uuid.v4(),
			type: "position",
			data: {
				x: 0,
				y: 0,
				z: 0,
				required: true
			}
		};
		secondaryConfig = {
			uuid: uuid.v4(),
			type: "different-type",
			data: {
				name: "a string",
				required: false,
				children: [
					{ key: "data" },
					{ key: 0 }
				]
			}
		};
	});

	test( "is instantiated correctly.", () => {
		// Validate it's an empty component:
		expect( instance.type ).toBe( "noname" );
		expect( instance.data ).toEqual({});
	});

	test( "can have data applied to it.", () => {

		// .data should match source object
	});

	test( "can be converted to JSON.", () => {
		expect( instance.json ).toEqual( JSON.stringify({
			data: instance.data,
			type: instance.type,
			uuid: instance.uuid
		}, null, 4 ) );
	});

	test( "set data", () => {
		const data = {
			foo: "bar"
		};
		instance.data = data;
		expect( instance.data ).toEqual( data );
	});

	test( "set type", () => {
		const type = "foo";
		instance.type = type;
		expect( instance.type ).toEqual( type );
	});
});
