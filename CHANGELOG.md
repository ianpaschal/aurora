# Changelog

## 2.1.3
- Fixed: In system methods, `this` is now bound to the system instead of the method. This allows the methods to use system properties such as `this.entityUUIDs`.

## 2.1.2
- Patched security vulnerability by updating `merge` to version 1.2.1.

## 2.1.1
- Patched security vulnerability by removing `parcel-bundler` from dependencies.
- Fixed issue of `eslint --fix` not actually running on any files.

## 2.1.0
- Total overhaul of Aurora with two major focuses:
    - Use TypeScript.
    - Be more of a framework and less of a boilerplate.
