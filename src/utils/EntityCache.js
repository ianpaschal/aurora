class EntityCache {
	constructor() {
		this._worldPoints = [];
		this._screenPoints = [];
	}
	addWorldPoint( vec3 ) {
		this._worldPoints.push( vec3 );
	}
	recompute( camera ) {
		// For now, since we don't have a way of listening to camera movements, we
		// will just recompute for all entities.
		this._screenPoints = [];
		const scope = this;
		this._worldPoints.forEach( ( point ) => {
			const proj = point.clone().project( camera );
			if ( proj.x <= 1 && proj.x >= -1 && proj.y <= 1 && proj.y >= -1 ) {
				scope._screenPoints.push( proj );
			}
		});
	}
	getScreenPoints( max, min ) {
		const results = [];
		this._screenPoints.forEach( ( p ) => {
			if ( p.x <= max.x && p.x >= min.x && p.y <= max.y && p.y >= min.y ) {
				results.push( p );
			}
		});
		return results;
	}
}

export default EntityCache;

/*
	tbc = top, bottom, center
	If the camera moves, go through all entities, and if their tbc is in the frustrum, update tbc.
	In the animation system, in an entity moves, also update its tbc. but for what camera?
*/
