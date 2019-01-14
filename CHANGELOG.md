# Changelog

## 2.2.0
- **ADDED:** Use `Entity.dirty` to keep track of entities which have had their component data changed. `Entity.setComponentData()` will automatically set that entity as dirty, while `Engine.cleanEntities()` will set all entities as no longer dirty. When you call that is up to you.
- **ADDED:** Use `Entity.flattened` to get an entity and all of its components as a pure object (vs. class instance). This property is now used internally by `Entity.json` as well.
- **ADDED:** In addition to specifying component type strings to define which components must be present on an entity to be watchable by a system, it is now possible to supply objects to define sets of components which are valid. See the documentation for details.

## 2.1.3
- **FIXED:** In system methods, `this` is now bound to the system instead of the method. This allows the methods to use system properties such as `this.entityUUIDs`.

## 2.1.2
- Patched security vulnerability by updating `merge` to version `1.2.1`.

## 2.1.1
- Patched security vulnerability by removing `parcel-bundler` from dependencies.
- **FIXED:** `eslint --fix` now actually runs on files (it did not previously).

## 2.1.0
- Total overhaul of Aurora with two major focuses:
    - Use TypeScript.
    - Be more of a framework and less of a boilerplate.
