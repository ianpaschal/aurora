import { Component, Engine, Entity, State, System } from "../../src";
import uuid from "uuid";

let instance: Component;

beforeEach( () => {
	instance = new Component();
});

// Constructor

describe( "Component.constructor()", () => {
	// TODO: it should generate a valid UUID
	it( "should set type as 'noname'.", () => {
		expect( instance.type ).toBe( "noname" );
	});
	it( "should create an empty data object.", () => {
		expect( instance.data ).toEqual({});
	});
});

describe( "Component.constructor( config )", () => {
	let config;
	beforeEach( () => {
		config = {
			uuid: uuid(),
			type: "foo",
			data: {}
		};
		instance = new Component( config );
	});
	it( "should copy the config's uuid if it exists.", () => {
		expect( instance.uuid ).toEqual( config.uuid );
	});
	it( "should copy the config's type if it exists.", () => {
		expect( instance.type ).toEqual( config.type );
	});
	it( "should copy, not reference, the config's type if it exists.", () => {
		// Make sure to clone the original data, not reference it:
		expect( instance.data ).not.toBe( config.data );
		expect( instance.data ).toEqual( config.data );
	});
});

// Getters

describe( "Component.json", () => {
	it( "should return the correct JSON, without underscores.", () => {
		expect( instance.json ).toEqual( JSON.stringify({
			data: instance.data,
			type: instance.type,
			uuid: instance.uuid
		}, null, 4 ) );
	});
});

// Setters

describe( "Component.data = ", () => {
	it( "should copy, not reference, the new data, replacing everything.", () => {
		const data = {
			foo: "bar"
		};
		instance.data = data;
		expect( instance.data ).toEqual( data );
	});
});

describe( "Component.type = ", () => {
	it( "should set the type accordingly.", () => {
		const type = "foo";
		instance.type = type;
		expect( instance.type ).toEqual( type );
	});
});

// Other

describe( "Component.clone()", () => {
	let clone: Component;
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
		// Ensure data is a copy, not a reference
		expect( clone.data ).not.toBe( instance.data );
		expect( clone.data ).toEqual( instance.data );
	});
});

describe( "Component.copy( component )", () => {
	let source: Component;
	beforeEach( () => {
		source = new Component({
			uuid: uuid(),
			type: "foo",
			data: {
				foo: 5
			}
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
		// Ensure data is a copy, not a reference
		expect( instance.data ).not.toBe( source.data );
		expect( instance.data ).toEqual( source.data );
	});
});

describe( "Component.mergeData( data )", () => {
	// TODO: Refine the tests for copying vs. overwriting data
	it( "should add missing data to the instance.", () => {
		instance.data = {
			foo: true
		};
		instance.mergeData({
			bar: 5
		});
		expect( instance.data ).toEqual({
			foo: true,
			bar: 5
		});
	});
	it( "should overwrite existing data on the instance.", () => {
		instance.data = {
			foo: true
		};
		instance.mergeData({
			foo: false
		});
		expect( instance.data ).toEqual({
			foo: false
		});
	});
});
