import System from "../src/core/System";

describe( "System", () => {
	let instance: System;

	const config = {
		name: "my-system-name"
	};
	beforeEach( () => {
		instance = new System( config );
	});

	it( "should be named via config object", () => {
		expect( instance.name ).toBe( "my-system-name" );
	});
});
