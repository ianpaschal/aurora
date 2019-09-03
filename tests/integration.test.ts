import { Engine, Entity, System, State } from "../src";

let engine: Engine;
let system: System;
let entityA: Entity;
let entityB: Entity;

beforeEach( () => {
	engine = new Engine();
	system = new System({
		componentTypes: [ "foo" ],
		name: "foo-system",
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
	engine.addSystem( system );
	engine.addEntity( entityA );
	engine.addEntity( entityB );
});

describe( "A state created from the engine", () => {
	let state: State;
	beforeEach( () => {
		engine.start();
		state = new State( engine, true );
	});
	it( "should have all entities added.", () => {
		expect( state.entities.length ).toBe( 2 );
	});
	// TODO: Ensure data is copied, not referenced
	it( "should have the correct timestamp.", () => {
		expect( state.timestamp ).toBeGreaterThan( 0 );
	});
});

describe( "A system added to the engine", () => {
	it( "should automatically watch compatible entities.", () => {
		expect( system.isWatchingEntity( entityA ) ).toBe( true );
	});
	it( "should not automatically watch incompatible entities.", () => {
		expect( system.isWatchingEntity( entityB ) ).toBe( false );
	});
	it( "should throw an error if attempting to modify component watch list.", () => {
		expect( () => {
			system.watchComponentType( "bar" );
		}).toThrowError();
	});
});
