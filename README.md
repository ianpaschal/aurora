# Aurora
A small entity-component-system game engine for real-time-strategy games. It's also _sort of_ a mod API, but more on that later...

Aurora Engine is based on four basic classes:

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
	- Handles the loading of assets using `Three.js` (Geometries, materials, etc.)

## Mod API
> "I read something above that said Aurora Engine is '_sort of_ a mod API'."

That's correct. With Aurora Engine, there's not really a distinction between core content and mods. Because all entities are both represented and saved as JSON (plus whatever other image assets or sounds), it's easy to add new units to the game without actually having to `eval()` any Javascript. This is especially useful for modded multiplayer where the required mods can be safely sent to all players in the game.

Obviously this exempts "systems" from being added as _they_ are the actual executable functions which process a world's entities, but exchanging those should eventually be possible as well as the users' discretion.

Read more on the wiki.

## License
Aurora Engine is licensed under the MIT license.
