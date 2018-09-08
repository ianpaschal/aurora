import { capitalize } from "../../src";

describe( "capitalize", () => {
	const str = "interloper";
	it( "should capitalize the first character of the string.", () => {
		expect( capitalize( str ) ).toEqual( "Interloper" );
	});
	it( "should return a new string.", () => {
		expect( capitalize( str ) ).not.toBe( str );
	});
});
