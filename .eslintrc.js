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
		"array-bracket-spacing":     [ 2, "always" ],
		"arrow-parens":              [ 2, "always" ],
		"arrow-spacing":             [ 2, { "before": true, "after": true } ],
		"brace-style":               [ 2, "stroustrup" ],
		"comma-spacing":             [ 2, { "before": false, "after": true } ],
		"comma-style":               [ 2, "last" ],
		"complexity":                [ 1, 8 ],
		"computed-property-spacing": [ 2, "always" ],
		"dot-notation":              [ 2 ],
		"indent":                    [ 2, "tab", { "SwitchCase": 1 } ],
		"max-len":                   [ 2, { "code": 80, "comments": 120, "tabWidth": 2, "ignoreTrailingComments": true, "ignoreUrls": true, "ignoreTemplateLiterals": true, "ignoreRegExpLiterals": true } ],
		"max-lines":                 [ 2, { "max": 250, "skipBlankLines": true }, { "skipComments": true } ],
		"max-statements":            [ 2, 30 ],
		"no-confusing-arrow":        [ 2, { "allowParens": false } ],
		"no-const-assign":           [ 2 ],
		"no-dupe-class-members":     [ 2 ],
		"no-duplicate-imports":      [ 2 ],
		"no-multiple-empty-lines":   [ 2, { "max": 1, "maxEOF": 0, "maxBOF": 0 } ],
		"no-new-object":             [ 2 ],
		"no-undef":                  [ 2 ],
		"no-unused-vars":            [ 1, { "vars": "all", "args": "after-used", "ignoreRestSiblings": false } ],
		"no-use-before-define":      [ 2, { "functions": false } ],
		"no-useless-constructor":    [ 2 ],
		"no-var":                    [ 2 ],
		"object-curly-spacing":      [ 2, "always" ],
		"one-var":                   [ 2, "never" ],
		"operator-linebreak":        [ 2, "after", { "overrides": { "+": "before" } } ],
		"prefer-arrow-callback":     [ 2 ],
		"prefer-const":              [ 1 ],
		"quotes":                    [ 2, "double" ],
		"semi":                      [ 2, "always" ],
		"space-before-blocks":       [ 2, "always" ],
		"space-in-parens":           [ 2, "always", { "exceptions": [ "{}" ] } ],
		"space-infix-ops":           [ 2 ],
		"template-curly-spacing":    [ 2, "always" ]
	}
}
