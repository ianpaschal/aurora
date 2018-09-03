import System from "../../../src/core/System";

describe( "System", () => {
	let instance: System;
	let mockMethod;
	const config = {
		name: "my-system-name",
		step: 100,
		componentTypes: [ "position", "velocity" ],
		fixed: true,
		onUpdate( delta: number ) {}
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
