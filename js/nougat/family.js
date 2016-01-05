ng.module('nougat.family')
.requires('nougat.entity', 'nougat.node')
.defines(function(){
	ng.Family = ng.Class.extend({
		entities: [],
		node: null,
		engine: null,
		init: function(nodeClass, engine) {
			this.node = new nodeClass();
			this.engine = engine;
			this.components = this.node.components;
		},
		_addIfMatch: function(entity) {
			if(!this.entities.contains(entity)) {
				for(var i = 0; i < this.components.length; ++i) 
					if(!entity.has(this.components[i])) return;
				
				this.entities.push(entity);
			}
		},
		_removeIfMatch: function(entity) {
			if(this.entities.contains(entity)) {
				this.entities.remove(entity);
			}
		},
		newEntity: function(entity) {
			this._addIfMatch(entity);
		},
		removeEntity: function(entity) {
			this._removeIfMatch(entity);
		},
		componentAdded: function(entity, componentName) {
			this._addIfMatch(entity);
		},
		componentRemoved: function(entity, componentName) {
			if(this.components[componentName])
				this._removeIfMatch(entity);
		}

	});
});