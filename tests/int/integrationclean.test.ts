import { Engine, Entity, System, State } from "../../src";

let engine: Engine;
let entityA: Entity;
let entityB: Entity;
let systemFoo: System;
let systemBar: System;

beforeEach( () => {
	engine = new Engine();
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
	entityA = new Entity({
		components: [
			{ type: "foo" }
		]
	});
	entityB = new Entity({
		components: [
			{ type: "bar" }
		]
	});
	engine.addSystem( systemFoo );
	engine.addSystem( systemBar );
	engine.addEntity( entityA );
	engine.addEntity( entityB );
});

// Systems + Engine
describe( "Systems added to the engine", () => {

	beforeEach( () => {
		// No specific set-up for now...
	});

	test( "should automatically watch compatible entities.", () => {
		expect( systemFoo.isWatchingEntity( entityA ) ).toBe( true );
	});

	test( "should not automatically watch incompatible entities.", () => {
		expect( systemFoo.isWatchingEntity( entityB ) ).toBe( false );
	});

});

// Entities + Engine
describe( "Entities added to the engine", () => {

	beforeEach( () => {
		// No specific set-up for now...
	});

	test( "should be identifiable as having been added.", () => {
		expect( engine.hasEntity( entityA.uuid ) ).toBe( true );
		// TODO: False scenario
	});

	test( "should be retrievable from the engine by their UUID.", () => {
		expect( engine.getEntity( entityA.uuid ) ).toBe( entityA );
		// TODO: False scenario
	});

});

// Entities + Systems + Engine
describe( "Entities added to a system", () => {

	beforeEach( () => {
		// No specific set-up for now...
	});

	test( "should be removable from the system by their UUID.", () => {
		const originalLength = systemFoo.watchedEntityUUIDs.length;
		expect( () => {
			systemFoo.unwatchEntity( entityA );
		}).not.toThrowError();
		expect( systemFoo.watchedEntityUUIDs.length ).toBe( originalLength - 1 );
	});

	test( "should not be removable if they haven't been added.", () => {
		expect( () => {
			systemFoo.unwatchEntity( new Entity() );
		}).toThrowError();
	});

});

// Should be a unit test using a mock:
describe( "Entities, in general,", () => {

	test( "should determine if they can be watched by a given system.", () => {
		expect( entityA.isWatchableBy( systemFoo ) ).toBe( true );
		expect( entityB.isWatchableBy( systemFoo ) ).toBe( false );
	});

});
