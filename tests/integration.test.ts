import { Engine, Entity, System, State } from "../src";

const systemFooConfig = {
	componentTypes: [ "foo" ],
	name: "foo-system",
	fixed: false,
	onUpdate( t ) {
		console.log( "The Foo system has updated!" );
	},
	methods: {
		"foo": function() {
			console.log( "Foo!" );
		},
		"bar": function() {
			console.log( "Bar!" );
		}
	}
};
const systemBarConfig = {
	componentTypes: [ "bar-data" ],
	name: "bar-system",
	fixed: false,
	onUpdate( t ) {
		console.log( "The Foo system has updated!" );
	},
	methods: {
		"foo": function() {
			console.log( "Foo!" );
		},
		"bar": function() {
			console.log( "Bar!" );
		}
	}
};

describe( "Typical set-up", () => {
	let engine: Engine;
	let entity: Entity;
	beforeEach( () => {

		const systemFoo = new System( systemFooConfig );
		const systemBar = new System( systemBarConfig );
		const systemDuplicate = new System( systemFooConfig );

		// Set up the generic environment
		engine = new Engine();
		entity = new Entity();
	});

	test( "Prevent adding duplicate systems.", () => {
		const system = new System({
			name: "foo",
			componentTypes: [ "bar" ],
			onUpdate: function() {}
		});
		engine.addSystem( system );
		expect( () => {
			engine.addSystem( system );
		}).toThrowError();
	});

	test( "Prevent adding duplicate entities.", () => {
		const entity = new Entity({
			components: [
				{ type: "foo", data: {} },
				{ type: "bar", data: {} }
			],
			name: "Foo Unit",
			type: "foo-unit"
		});
		engine.addEntity( entity );
		expect( () => {
			engine.addEntity( entity );
		}).toThrowError();
	});

	test( ".getAssembly() should retrieve the correct assembly.", () => {
		const assembly = new Entity({ type: "foo" });
		engine.addAssembly( assembly );
		expect( engine.getAssembly( assembly.type ) ).toBe( assembly );
	});

	test( ".getSystem() should retrieve the correct system.", () => {
		const system = new System({
			name: "foo",
			componentTypes: [ "bar" ],
			onUpdate: function() {}
		});
		engine.addSystem( system );
		expect( engine.getSystem( system.name ) ).toBe( system );
	});

	test( ".hasAssembly() should identify which assemblies were added.", () => {
		engine.addAssembly( new Entity({ type: "foo" }) );
		expect( engine.hasAssembly( "foo" ) ).toBe( true );
		expect( engine.hasAssembly( "bar" ) ).toBe( false );
	});

	test( ".hasSystem() should identify which systems were added.", () => {
		engine.addSystem( new System({
			name: "foo",
			componentTypes: [ "bar" ],
			onUpdate: function() {}
		}) );
		expect( engine.hasSystem( "foo" ) ).toBe( true );
		expect( engine.hasSystem( "bar" ) ).toBe( false );
	});

	test ( ".addEntity() should add an entity to the engine.", () => {
		engine.addEntity( entity );
		expect( engine.entities.length ).toBe( 1 );
	});

	// Assemblies + Engine
	test( ".addAssembly() should add an assembly to the engine", () => {
		engine.addAssembly( entity );
		expect( engine.assemblies.length ).toBe( 1 );
	});

	test( ".addAssembly() should throw an error if assembly of that type exists", () => {
		engine.addAssembly( entity );
		expect( () => {
			engine.addAssembly( entity );
		}).toThrowError();
	});

	test( ".hasEntity() should identify which entities were added.", () => {
		engine.addEntity( entity );
		expect( engine.hasEntity( entity.uuid ) ).toBe( true );
		expect( engine.hasEntity( "foo" ) ).toBe( false );
	});

	test( ".getEntity() should retrieve the correct entity.", () => {
		engine.addEntity( entity );
		expect( engine.getEntity( entity.uuid ) ).toBe( entity );
	});
});

// -----

/*
- Describe: Entities added to the engine...
	- Test: ...should be identifiable as having been added.
	- Test: ...should be retrievable by their UUID.
	- Test: ...should have their UUIDs added to any systems which watch one or more of that entity’s component types.
*/

describe( "Entities added to the engine…", () => {
	let engine: Engine;
	let entity: Entity;
	let system: System;
	beforeEach( () => {
		engine = new Engine();
		system = new System( systemFooConfig );
		entity = new Entity({ components: [ { type: "foo" } ] });
		engine.addSystem( system );
		engine.addEntity( entity );
	});

	test( "should be addable to the system, if components match.", () => {

		// New entity which was not already added
		const entity2 = new Entity({ components: [ { type: "foo" } ] });

		// Expect success
		const originalLength = system.watchedEntityUUIDs.length;
		expect( () => {
			system.watchEntity( entity2 );
		}).not.toThrowError();
		expect( system.watchedEntityUUIDs.length ).toBe( originalLength + 1 );

		// Expect failure; entity has already been added
		expect( () => {
			system.watchEntity( entity2 );
		}).toThrowError();
	});

});

// State stuff

describe( "states", () => {
	let engine: Engine;
	let entity: Entity;
	let system: System;
	beforeEach( () => {
		engine = new Engine();
		system = new System( systemFooConfig );
		entity = new Entity({ components: [ { type: "foo" } ] });
		engine.addSystem( system );
		engine.addEntity( entity );
	});

	test( "state should have entities", () => {
		const state = new State( engine );
		expect( state.entities.length ).toBe( 1 );
	});

	test( "timestamp should be correct", () => {

		engine.start();
		const state = new State( engine );
		expect( state.timestamp ).toBeGreaterThan( 0 );
	});
});
