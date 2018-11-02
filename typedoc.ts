module.exports = {
	out: "./docs",
	readme: "./README.md",
	includes: "src",
	name: "Aurora",
	hideGenerator: true,
	exclude: [
		"**/__mocks__/**/*",
		"**/__tests__/**/*",
	],
	mode: "file",
	excludeNotExported: true,
	excludePrivate: true,
	excludeProtected: true
};
