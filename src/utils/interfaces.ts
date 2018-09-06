// Aurora is distributed under the MIT license.

import Entity from "../core/Entity"; // Typing

export interface ComponentConfig {
	data?:           {}|[];
	type?:           string;
	uuid?:           string;
}
export interface EntityConfig {
	components?:     any[];
	name?:           string,
	type?:           string,
	uuid?:           string,
}
export interface SystemConfig {
	componentTypes:  string[]
	fixed?:          boolean,
	name:            string,
	onAddEntity?:    ( entity: Entity ) => void,
	onInit?:         ()                 => void,
	onRemoveEntity?: ( entity: Entity ) => void,
	onUpdate:        ( delta: number )  => void,
	step?:           number,
	methods?:        {}
}
