import { Engine, Entity, System } from "../../src";

// Do set up to create an engine with
// - at least 2 systems
// - at least 5 entities, each with slightly different data
// - Each entity should have a different number of components
// - At least one of each component should be unique and at least one should be shared

const systemFooConfig = {
	componentTypes: [ "foo-data" ],
	name: "foo-system",
	fixed: false,
	onUpdate( t ) {
		alert( "The Foo system has updated!" );
	},
	methods: {
		"foo": function() {
			alert( "Foo!" );
		},
		"bar": function() {
			alert( "Bar!" );
		}
	}
};
const systemBarConfig = {
	componentTypes: [ "bar-data" ],
	name: "bar-system",
	fixed: false,
	onUpdate( t ) {
		alert( "The Foo system has updated!" );
	},
	methods: {
		"foo": function() {
			alert( "Foo!" );
		},
		"bar": function() {
			alert( "Bar!" );
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
