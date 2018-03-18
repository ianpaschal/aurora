# Aurora

<p>
	<a href="https://www.npmjs.com/package/aurora">
		<img src="https://img.shields.io/npm/v/aurora.svg" />
	</a>
	<a href="https://www.npmjs.com/package/aurora">
		<img src="https://img.shields.io/npm/dt/aurora.svg" />
	</a>
	<a href="https://github.com/ianpaschal/aurora/blob/master/LICENSE">
		<img src="https://img.shields.io/github/license/ianpaschal/aurora.svg" />
	</a>
	<a href="https://github.com/ianpaschal/aurora/issues">
		<img src="https://img.shields.io/github/issues-raw/ianpaschal/aurora.svg" />
	</a>
	<a href="https://codeclimate.com/github/ianpaschal/aurora">
		<img src="https://img.shields.io/codeclimate/maintainability/ianpaschal/aurora.svg?" />
	</a>
</p>

Aurora is a small entity-component-system game engine for real-time-strategy games. It's also _sort of_ a mod API, but more on that later...

> Aurora is being developed alongside its intended use case, [Forge](https://github.com/ianpaschal/forge), and still churns quite a bit. There's also lots of test code present which requires refactoring and possible removal, but the basic architecture is stable and usable.

Aurora is based on four basic classes:

- `Engine`
- `Entity`
- `Component`
- `System`

In a nutshell:

- Components are JSON data with some useful helper methods.
- Entities are are arrays of components with some useful helper methods.
- Systems are pre-defined functions which are run each simulation loop and act on a subset of entities who have instances of the relevant components.
- The engine:
	- Tells all systems to update each game loop
	- Handles the creation and destruction of entities and components
	- Handles the loading of assets using `Three.js` (geometries, materials, etc.)

The [wiki](https://github.com/ianpaschal/aurora/wiki) contains more detailed information about the architecture and usage of Aurora and extensive documentation of the different classes and methods available can be found in [`/docs`](https://github.com/ianpaschal/aurora/tree/master/docs) or at [ianpaschal.github.io/aurora](https://ianpaschal.github.io/aurora).


## Mod API
> "I read something above that said Aurora is '_sort of_ a mod API'."

That's correct. With Aurora, there's not really a distinction between core content and mods. Because all entities are both represented and saved as JSON (plus whatever other image assets or sounds), it's easy to add new units to the game without actually having to `eval()` any Javascript. This is especially useful for modded multiplayer where the required mods can be safely sent to all players in the game.

Obviously this exempts "systems" from being added as _they_ are the actual executable functions which process a world's entities, but exchanging those should eventually be possible as well as the users' discretion.

Read more on the [wiki](https://github.com/ianpaschal/aurora/wiki).

## License
Aurora is licensed under the MIT license.
