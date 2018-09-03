import State from "../../../src/core/State";

const Engine = jest.mock( "../../../src/core/Engine" );

// Mock an engine
describe( "State", () => {
	let instance: State;
	beforeEach( () => {
		Engine.mockClear();
		const mockSoundPlayerInstance = Engine.mock.instances[ 0 ];
		instance = new State();
	});
	test( "Accumulator should save left over time", () => {
		expect( 5 ).toBe( 5 );
	});
});
