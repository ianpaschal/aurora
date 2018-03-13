# Forge (Engine)
A small entity-component-system game engine for real-time-strategy games. It's also _sort of_ a mod API, but more on that later...

Forge Engine is based on four basic classes:

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

## License
Forge Engine is licensed under the MIT license.
