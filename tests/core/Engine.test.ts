import { Component, Engine, Entity, State, System } from "../../src";

/* Instantiation Tests
 * -
 * These tests may seem redundant becuse other tests implicitly test these things as well (by failing if they don't
 * exist), but is helpful to explicitly test them as well, particularly for detecting if an property or method was
 * removed or renamed.
 */
describe( "Engine", () => {

	let instance: Engine;

	beforeEach( () => {
		instance = new Engine();
	});

	it( "should have an empty entities array.", () => {
		expect( instance.entities ).toBeDefined();
		expect( Array.isArray( instance.entities ) ).toBe( true );
		expect( instance.entities.length ).toBe( 0 );
	});

	it( "should have an empty systems array.", () => {
		expect( instance.systems ).toBeDefined();
		expect( Array.isArray( instance.systems ) ).toBe( true );
		expect( instance.systems.length ).toBe( 0 );
	});

	it( "should have last tick time be null.", () => {
		expect( instance.lastTickTime ).toBeDefined();
		expect( instance.lastTickTime ).toBe( null );
	});

	it( "should not have an onUpdateStart handler.", () => {
		expect( instance.onTickStart ).not.toBeDefined();
	});

	it( "should not have an onUpdateComplete handler.", () => {
		expect( instance.onTickComplete ).not.toBeDefined();
	});
});

/* Unit Tests
 * -
 * These tests test each method of the engine.
 */
let instance: Engine;
let handler;
let tickSpy;
beforeEach( () => {
	instance = new Engine();
	handler = jest.fn();
	tickSpy = jest.spyOn( Engine.prototype, "tick" );
});
afterEach( () => {
	tickSpy.mockClear();
});

test( ".tick() should call .onTickStart() if it's defined.", () => {
	instance.onTickStart = handler;
	instance.start();
	expect( instance.onTickStart ).toHaveBeenCalledTimes( 1 );
});

test( ".tick() should call .onTickComplete() if it's defined.", () => {
	instance.onTickComplete = handler;
	instance.start();
	expect( instance.onTickComplete ).toHaveBeenCalledTimes( 1 );
});

test( ".start() should only call .tick() once when no callback exists.", () => {
	expect( instance.onTickComplete ).not.toBeDefined();
	instance.start();
	expect( tickSpy ).toHaveBeenCalledTimes( 1 );
});

test( ".start() should set the engine as running and trigger .tick().", () => {
	instance.start();
	expect( instance.running ).toBe( true );
});

test( ".stop() should set the engine as not running.", () => {
	instance.stop();
	expect( instance.running ).toBe( false );
});
