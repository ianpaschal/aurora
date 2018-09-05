import isBetween from "../../../src/math/isBetween";

describe( "isBetween", () => {

	test( "0 is between -5 and 5.", () => {
		expect( isBetween( 0, -5, 5 ) ).toBe( true );
	});

	test( "5 is between 0 and 9.", () => {
		expect( isBetween( 5, 0, 9 ) ).toBe( true );
	});

	// A backwards test
	test( "2 is between 4 and 0.", () => {
		expect( isBetween( 2, 4, 0 ) ).toBe( true );
	});

});
