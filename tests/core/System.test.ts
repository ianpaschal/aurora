import { Component, Engine, Entity, State, System } from "../../src";

describe( "System", () => {
	let instance: System;
	let mockMethod;
	const mockOnInit = jest.fn();
	mockOnInit.mockReturnValue( true );
	const config = {
		name: "my-system-name",
		step: 100,
		componentTypes: [ "position", "velocity" ],
		fixed: true,
		onUpdate( delta: number ) {},
		onInit: mockOnInit
	};

	// Create a new system instance to run tests on
	beforeEach( () => {
		instance = new System( config );
		mockMethod = jest.fn();
		mockMethod.mockReturnValue( true );
		instance.addMethod( "mock-method", mockMethod );
	});

	it( "should be named via config object.", () => {
		expect( instance.name ).toBe( config.name );
	});

	it( "should have at least one watched component type.", () => {
		expect( instance.watchedComponentTypes.length ).toBeGreaterThan( 0 );
	});

	it( "should have user defined methods.", () => {
		expect( instance.dispatch( "mock-method" ) ).toBe( true );
	});

	test( "Dispatch calls the user-defined method once.", () => {
		instance.dispatch( "mock-method" );
		expect( mockMethod.mock.calls.length ).toBe( 1 );
	});

	test( "Accumulator should save left over time", () => {
		instance.update( 105 );
		expect( instance.accumulator ).toBe( 5 );
	});

	test( "Set step from config.", () => {
		expect( instance.step ).toBe( config.step );
	});

	test ( "Set fixed from config.", () => {
		expect( instance.fixed ).toBe( config.fixed );
	});

	test( "Can't remove component type if only one exists", () => {
		expect( () => {
			instance.unwatchComponentType( "position" ); // Remove 1 of 2
		}).not.toThrowError();
		expect( () => {
			instance.unwatchComponentType( "velocity" ); // Remove 2 of 2
		}).toThrowError();
	});

	test( "Only remove component types which are present.", () => {
		const originalLength = instance.watchedComponentTypes.length;
		expect( () => {
			instance.unwatchComponentType( "position" );
		}).not.toThrowError();
		expect( instance.watchedComponentTypes.length ).toBe( originalLength - 1 );
		expect( () => {
			instance.unwatchComponentType( "foo" );
		}).toThrow();
	});

	test( ".unwatchComponentTypes() with 1 item array", () => {
		expect( () => {
			instance.unwatchComponentTypes( [ "position" ] );
		}).not.toThrowError();
	});

	test( ".unwatchComponentTypes() with 2 item array should fail", () => {
		expect( () => {
			instance.unwatchComponentTypes( [ "position", "velocity" ] );
		}).toThrowError();

	});

	test( ".unwatchComponentTypes() with invalid item in array should fail", () => {
		expect( () => {
			instance.unwatchComponentTypes( [ "foo", "position" ] );
		}).toThrowError();
	});

	test( "is watching component type", () => {

		// Expect success
		expect( instance.isWatchingComponentType( "position" ) ).toBe( true );

		// Expect failure
		expect( instance.isWatchingComponentType( "foo" ) ).toBe( false );
	});

	test( "watch component type", () => {
		const originalLength = instance.watchedComponentTypes.length;
		instance.watchComponentType( "foo" );
		expect( instance.watchedComponentTypes.length ).toBe( originalLength + 1 );
	});

	test( "watch component type which already exists should fail", () => {
		expect( () => {
			instance.watchComponentType( "position" );
		}).toThrowError();
	});

	// See integration tests for entity removal

});

// Clean style:

let instance: System;
let entityA: Entity;
let entityB: Entity;
let engine: Engine;
const mockMethod = jest.fn();
const mockOnInit = jest.fn();
mockOnInit.mockReturnValue( true );
mockMethod.mockReturnValue( true );
const config = {
	name: "foo-system",
	step: 100,
	componentTypes: [ "foo", "bar" ],
	fixed: true,
	onUpdate( delta: number ) {},
	onInit: mockOnInit,
	methods: {
		"foo": mockMethod
	}
};
beforeEach( () => {
	engine = new Engine();
	instance = new System( config );
	entityA = new Entity({
		components: [
			{ type: "foo" },
			{ type: "bar" }
		]
	});
	entityB = new Entity({
		components: [
			{ type: "foo" }
		]
	});

});

describe( "System.init()", () => {

	// TODO: Test if it doesn't exist

	it( "should call its ._onInit handler function if it exists.", () => {
		instance.init( engine );
		expect( mockOnInit.mock.calls.length ).toBe( 1 );
	});

});

describe( "System.removeMethod( key )", () => {

	it( "should remove the method with the given key if it exists.", () => {
		instance.removeMethod( "foo" );
		expect( () => {
			instance.dispatch( "foo", {});
		}).toThrowError();
	});

	it( "should throw an error if no method for that key exists.", () => {
		expect( () => {
			instance.removeMethod( "bar" );
		}).toThrowError();
	});
});

describe( "System.canWatch( entity )", () => {

	it( "should return true if all system component types are present.", () => {
		expect( instance.canWatch( entityA ) ).toBe( true );
	});

	it ( "should return false if any system component types are missing.", () => {
		expect( instance.canWatch( entityB ) ).toBe( false );
	});

});
