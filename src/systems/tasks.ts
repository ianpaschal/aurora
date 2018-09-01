import System from "../core/System";

export default new System({
	name: "tasks",
	fixed: false,
	componentTypes: [
		"tasks"
	],
	methods: {

	},
	init() {
		// Do nothing for now
	},
	add( entity ) {
		// Do nothing for now
	},
	update( time ) {
		// Do nothing for now
	}
});

// /** @description Append an array of tasks to the current task queue.
// 	* @param {Array} tasks - Array of task objects to replace existing tasks.
// 	* @returns {Array} - Updated array of tasks.
// 	*/
// 	appendTasks( tasks ) {
// 		// TODO: Add validation
// 		this._tasks.concat( tasks );
// 		this.setDirty();
// 		return this.tasks;
// 	};

// 	/** @description Insert an array of tasks into the front of the current task
// 		* queue.
// 		* @param {Array} tasks - Array of task objects to replace existing tasks.
// 		* @returns {Array} - Updated array of tasks.
// 		*/
// 	insertTasks( tasks ) {
// 		this._tasks = tasks.concat( this._tasks );
// 		this.tasksDirty = true;
// 		this.setDirty();
// 		return this.tasks;
// 	};

// 	/** @description Advance the current task by one.
// 		* @returns {Array} - Updated array of tasks.
// 		*/
// 	// Advance forward in the task queue:
// 	advanceTasks() {
// 		this._tasks.shift();
// 		this.tasksDirty = true;
// 		this.setDirty();
// 		return this.tasks;
// 	};

// 	/**
// 	 * @description Get the Entity's task list.
// 	 * @readonly
// 	 * @returns {Array} - The Entity's task list
// 	 */
// 	get tasks() {
// 		return this._tasks;
// 	}

// 	/**
// 	 * @description Overwite the current task list with an array tasks.
// 	 * @param {Array} tasks - Array of task objects to replace existing tasks
// 	 * @returns {Array} - Updated array of tasks
// 	 */
// 	set tasks( tasks ) {
// 		// TODO: Add validation
// 		this._tasks = tasks;
// 		this.tasksDirty = true;
// 		this.setDirty();
// 	};

// 	/**
// 	 * @description Get the entity's current task.
// 	 * @readonly
// 	 * @returns {Object} - The entity's current task
// 	 */
// 	get currentTask() {
// 		return this._tasks[ 0 ];
// 	}
