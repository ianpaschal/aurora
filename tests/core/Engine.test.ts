import { Engine, Entity, System } from "../../src";

let instance: Engine;

beforeEach( () => {
	instance = new Engine();
});

// Constructor

describe( "Engine.constructor()", () => {
	it( "should create an empty assemblies array.", () => {
		expect( instance.assemblies ).toBeDefined();
		expect( Array.isArray( instance.assemblies ) ).toBe( true );
		expect( instance.assemblies.length ).toBe( 0 );
	});
	it( "should create an empty entities array.", () => {
		expect( instance.entities ).toBeDefined();
		expect( Array.isArray( instance.entities ) ).toBe( true );
		expect( instance.entities.length ).toBe( 0 );
	});
	it( "should create an empty systems array.", () => {
		expect( instance.systems ).toBeDefined();
		expect( Array.isArray( instance.systems ) ).toBe( true );
		expect( instance.systems.length ).toBe( 0 );
	});
	it( "should set last tick time as null.", () => {
		expect( instance.lastTickTime ).toBeDefined();
		expect( instance.lastTickTime ).toBe( null );
	});
	it( "should not have an .onUpdateStart() handler.", () => {
		expect( instance.onTickStart ).not.toBeDefined();
	});
	it( "should not have an .onUpdateComplete() handler.", () => {
		expect( instance.onTickComplete ).not.toBeDefined();
	});
});

// Adders

describe( "Engine.addAssembly( type )", () => {
	let assembly: Entity;
	beforeEach( () => {
		assembly = new Entity({
			type: "foo"
		});
		instance.addAssembly( assembly );
	});
	it( "should add the assembly to the engine.", () => {
		expect( instance.assemblies.length ).toBe( 1 );
	});
	it( "should throw an error if adding a duplicate assembly.", () => {
		expect( () => {
			instance.addAssembly( assembly );
		}).toThrowError();
	});
});

describe( "Engine.addEntity( entity )", () => {
	let entity: Entity;
	beforeEach( () => {
		entity = new Entity();
		instance.addEntity( entity );
	});
	it( "should add the entity to the engine.", () => {
		expect( instance.entities.length ).toBe( 1 );
	});
	it( "should throw an error if adding a duplicate entity.", () => {
		expect( () => {
			instance.addEntity( entity );
		}).toThrowError();
	});
});

describe( "Engine.addSystem( system )", () => {
	let system: System;
	beforeEach( () => {
		system = new System({
			name: "foo",
			componentTypes: [ "bar" ],
			onUpdate: function() {}
		});
		instance.addSystem( system );
	});
	it( "should add the system to the engine.", () => {
		expect( instance.systems.length ).toBe( 1 );
	});
	it( "should throw an error if adding a duplicate system.", () => {
		expect( () => {
			instance.addSystem( system );
		}).toThrowError();
	});
});

// Getters

describe( "Engine.getAssembly( type )", () => {
	it( "should retrive the correct assembly instance by type.", () => {
		const assembly = new Entity();
		instance.addAssembly( assembly );
		expect( instance.getAssembly( assembly.type ) ).toBe( assembly );
	});
	it( "should throw an error for invalid/missing types.", () => {
		expect( () => {
			instance.getAssembly( "bar" );
		}).toThrowError();
	});
});

describe( "Engine.getEntity( entity )", () => {
	it( "should retrive the correct entity instance by its UUID.", () => {
		const entity = new Entity();
		instance.addEntity( entity );
		expect( instance.getEntity( entity.uuid ) ).toBe( entity );
	});
	it( "should throw an error for invalid/missing UUIDs.", () => {
		expect( () => {
			instance.getEntity( "bar" );
		}).toThrowError();
	});
});

describe( "Engine.getSystem( name )", () => {
	it( "should retrive the correct system instance by name.", () => {
		const system = new System({
			name: "foo",
			componentTypes: [ "bar" ],
			onUpdate: function() {}
		});
		instance.addSystem( system );
		expect( instance.getSystem( system.name ) ).toBe( system );
	});
	it( "should throw an error for invalid/missing names.", () => {
		expect( () => {
			instance.getSystem( "bar" );
		}).toThrowError();
	});
});

// Checkers

describe( "Engine.hasAssembly( type )", () => {
	it( "should identify if an assembly has been added or not.", () => {
		const assembly = new Entity({
			type: "foo"
		});
		instance.addAssembly( assembly );
		expect( instance.hasAssembly( assembly.type ) ).toBe( true );
		expect( instance.hasAssembly( "bar" ) ).toBe( false );
	});
});

describe( "Engine.hasEntity( uuid )", () => {
	it( "should identify if an entity has been added or not.", () => {
		const entity = new Entity();
		instance.addEntity( entity );
		expect( instance.hasEntity( entity.uuid ) ).toBe( true );
		expect( instance.hasEntity( "bar" ) ).toBe( false );
	});
});

describe( "Engine.hasSystem( name )", () => {
	it( "should identify if a system has been added or not.", () => {
		const system = new System({
			name: "foo",
			componentTypes: [ "foo" ],
			onUpdate: function() {}
		});
		instance.addSystem( system );
		expect( instance.hasSystem( system.name ) ).toBe( true );
		expect( instance.hasSystem( "bar" ) ).toBe( false );
	});
});

// Other

describe( "Engine.start()", () => {
	let tickSpy;
	beforeEach( () => {
		tickSpy = jest.spyOn( Engine.prototype, "tick" );
	});
	it( ".should set the engine as running and trigger .tick().", () => {
		instance.start();
		expect( instance.running ).toBe( true );
	});
	it( "should only call .tick() once when no callback exists.", () => {
		expect( instance.onTickComplete ).not.toBeDefined();
		instance.start();
		expect( tickSpy ).toHaveBeenCalledTimes( 1 );
	});
	afterEach( () => {
		tickSpy.mockClear();
	});
});

describe( "Engine.stop()", () => {
	it( "should set the engine as not running.", () => {
		instance.stop();
		expect( instance.running ).toBe( false );
	});
});

describe( "Engine.tick()", () => {
	let handler;
	beforeEach( () => {
		handler = jest.fn();
	});
	it( "should call .onTickStart() if it's defined.", () => {
		instance.onTickStart = handler;
		instance.start();
		expect( instance.onTickStart ).toHaveBeenCalledTimes( 1 );
	});
	it( "should call .onTickComplete() if it's defined.", () => {
		instance.onTickComplete = handler;
		instance.start();
		expect( instance.onTickComplete ).toHaveBeenCalledTimes( 1 );
	});
});
