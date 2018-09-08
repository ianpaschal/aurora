import { Engine, Entity, System } from "../../src";

let instance: System;
let entityA: Entity;
let entityB: Entity;
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

// Constructor

describe( "System.constructor( config )", () => {
	it( "should set name from the config.", () => {
		expect( instance.name ).toBe( config.name );
	});
	it( "should set step size from the config.", () => {
		expect( instance.step ).toBe( config.step );
	});
	it ( "should set fixed step from config.", () => {
		expect( instance.fixed ).toBe( config.fixed );
	});
	it( "should watch the config's component list.", () => {
		expect( instance.isWatchingComponentType( "foo" ) ).toBe( true );
		expect( instance.isWatchingComponentType( "bar" ) ).toBe( true );
	});
	it( "should have at least one watched component type.", () => {
		expect( instance.watchedComponentTypes.length ).toBeGreaterThan( 0 );
	});
});

// Other

describe( "System.canWatch( entity )", () => {
	it( "should return true if all system component types are present.", () => {
		expect( instance.canWatch( entityA ) ).toBe( true );
	});
	it ( "should return false if any system component types are missing.", () => {
		expect( instance.canWatch( entityB ) ).toBe( false );
	});
});

describe( "System.dispatch( key )", () => {
	it( "should call the the user-defined method once.", () => {
		instance.dispatch( "foo" );
		expect( mockMethod.mock.calls.length ).toBe( 1 );
	});
});

describe( "System.init()", () => {
	// TODO: Test if it doesn't exist
	it( "should call its ._onInit handler function if it exists.", () => {
		instance.init( new Engine() );
		expect( mockOnInit.mock.calls.length ).toBe( 1 );
	});
});

describe( "System.isWatchingComponentType( type )", () => {
	it( "should identify if an assembly has been added or not.", () => {
		expect( instance.isWatchingComponentType( "foo" ) ).toBe( true );
		expect( instance.isWatchingComponentType( "not-present" ) ).toBe( false );
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

describe( "System.unwatchComponentType( type )", () => {
	it( "should remove the component type if it exists.", () => {
		const originalLength = instance.watchedComponentTypes.length;
		expect( () => {
			instance.unwatchComponentType( "foo" );
		}).not.toThrowError();
		expect( instance.watchedComponentTypes.length ).toBe( originalLength - 1 );
	});
	it( "should throw an error if less than one type is left.", () => {
		instance.unwatchComponentType( "foo" );
		expect( () => {
			instance.unwatchComponentType( "bar" );
		}).toThrowError();
	});
	it( "should throw an error if that component type does not exist.", () => {
		expect( () => {
			instance.unwatchComponentType( "not-present" );
		}).toThrow();
	});
});

describe( "System.unwatchEntity", () => {
	it( "should removable the entity with the given UUID.", () => {
		instance.watchEntity( entityA );
		const originalLength = instance.watchedEntityUUIDs.length;
		expect( () => {
			instance.unwatchEntity( entityA );
		}).not.toThrowError();
		expect( instance.watchedEntityUUIDs.length ).toBe( originalLength - 1 );
	});
	it( "should throw an error if that entity is not being watched.", () => {
		expect( () => {
			instance.unwatchEntity( new Entity() );
		}).toThrowError();
	});
});

describe( "System.unwatchComponentTypes( typesArray )", () => {
	it( "should unwatch arrays with one type in them.", () => {
		expect( () => {
			instance.unwatchComponentTypes( [ "foo" ] );
		}).not.toThrowError();
	});
	it( "should throw an error if the array contains an invalid type.", () => {
		expect( () => {
			instance.unwatchComponentTypes( [ "foo", "not-present" ] );
		}).toThrowError();
	});
});

describe( "System.update()", () => {
	it( "should save left over time in the accumulator.", () => {
		instance.update( 105 );
		expect( instance.accumulator ).toBe( 5 );
	});
});

describe( "System.watchComponentType( type )", () => {
	it( "should watch the component type.", () => {
		instance.watchComponentType( "new-type" );
		expect( instance.watchedComponentTypes ).toContain( "new-type" );
	});
	it( "should throw an error if watching a duplicate type.", () => {
		expect( () => {
			instance.watchComponentType( "foo" );
		}).toThrowError();
	});
});

describe( "System.watchEntity( entity )", () => {
	let entity: Entity;
	beforeEach( () => {
		entity = new Entity();
	});
	it( "should watch the entity.", () => {
		const originalLength = instance.watchedEntityUUIDs.length;
		instance.watchEntity( entity );
		expect( instance.watchedEntityUUIDs ).toContain( entity.uuid );
	});
	it( "should throw an error if watching a duplicate type.", () => {
		instance.watchEntity( entity );
		expect( () => {
			instance.watchEntity( entity );
		}).toThrowError();
	});
});
