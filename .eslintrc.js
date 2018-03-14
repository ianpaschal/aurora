module.exports = {
	"env": {
		"browser": true,
		"es6": true,
		"node": true
	},
	"plugins": [],
	"parserOptions": {
		"ecmaVersion": 6,
		"sourceType": "module"
	},
	"rules": {

		// Fat-Arrow Functions:
		"prefer-arrow-callback":     [ 2 ],
		"arrow-parens":              [ 2, "always" ],
		"arrow-spacing":             [ 2, { "before": true, "after": true } ],
		"no-confusing-arrow":        [ 2, { "allowParens": false } ],

		"indent":                    [ 2, "tab", { "SwitchCase": 1 } ],
		"space-in-parens":           [ 2, "always", { "exceptions": [ "{}" ] } ],
		"space-before-blocks":       [ 2, "always" ],
		"comma-spacing":             [ 2, { "before": false, "after": true } ],
		"space-infix-ops":           [ 2 ],
		"template-curly-spacing":    [ 2, "always" ],
		"array-bracket-spacing":     [ 2, "always" ],
		"object-curly-spacing":      [ 2, "always" ],
		"computed-property-spacing": [ 2, "always" ],
		"no-multiple-empty-lines":   [ 2, { "max": 1, "maxEOF": 0, "maxBOF": 0 } ],
		"semi":                      [ 2, "always" ],
		"quotes":                    [ 2, "double" ],
		"no-dupe-class-members":     [ 2 ],
		"no-useless-constructor":    [ 2 ],
		"no-duplicate-imports":      [ 2 ],
		"no-undef":                  [ 2 ],
		"operator-linebreak":        [ 2, "after", { "overrides": { "+": "before" } } ],
		"comma-style":               [ 2, "last" ],
		"max-len":                   [ 2, {
			"code": 80,
			"comments": 120,
			"ignoreTrailingComments": true,
			"ignoreUrls": true,
			"ignoreTemplateLiterals": true,
			"ignoreRegExpLiterals": true
		} ],
		"one-var":                   [ 2, "never" ],

		// Definitions:
		"no-use-before-define":      [ 2, { "functions": false } ],
		"no-unused-vars":            [ 1, { "vars": "all", "args": "after-used", "ignoreRestSiblings": false } ],

		// Use let and const instead of var
		"no-var":                    [ 2 ],

		// Use const over let whenever possible:
		"prefer-const":              [ 1 ],

		// Don't assign a new value to a const:
		"no-const-assign":           [ 2 ],

		// Create objects using myObj = {}, not myObj = new Object()
		"no-new-object":             [ 2 ],

		"complexity":                [ 1, 8 ],

		// Use dot notation when possible (Bad: x = foo["bar"], Good: x = foo.bar )
		"dot-notation":              [ 2 ]
	}
}
