import { ComponentConfig } from "../utils/interfaces";
/**
 * @module core
 * @classdesc Class representing a component.
 */
export default class Component {
    private _data;
    private _type;
    private _uuid;
    /**
     * @description Create a Component.
     * @param {Object} [config] - Configuration object
     * @param {string} [config.uuid] - Component UUID
     * @param {string} [config.type] - Component type
     * @param {Object} [config.data] - Object containing data for the component
     */
    constructor(config?: ComponentConfig);
    /**
     * @description Get the component's data.
     * @readonly
     * @returns {Object} - The component's data
     */
    /**
    * @description Set the component's data. Note: This method differs from `.mergeData()` in that it completely
    * overwrites any existing data within the component.
    * @param {Object} data - Data object to apply
    * @returns {Object} - The component's updated updated data object
    */
    data: any;
    /**
     * @description Get the component's data as a JSON string.
     * @readonly
     * @returns {string} - The component's data as a JSON string
     */
    readonly json: string;
    /**
     * @description Get the component's type.
     * @readonly
     * @returns {string} - The component's type
     */
    /**
    * @description Set the component's type.
    * @param {string} type - New type for the component
    */
    type: string;
    /**
     * @description Get the component's UUID.
     * @readonly
     * @returns {String} - The component's UUID
     */
    readonly uuid: string;
    /**
     * @description Clone the component.
     * @returns {Component} - New component instance with the same data
     */
    clone(): Component;
    /**
     * @description Copy another component's data, resetting existing data.
     * @param {Component} source - Component to copy from
     */
    copy(source: Component): void;
    /**
     * @description Merge a data object into this component.
     * @param {Object} data - JSON data to apply to the component
     * @returns {(Object|Array)} - Updated data object/array
     */
    mergeData(data: any): any;
}
