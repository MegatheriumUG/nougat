ng.module('nougat.engine')
.requires('nougat.system', 'nougat.family')
.defines(function(){
	var compare = function(a, b) {
		if(a.priority == b.priority) return 0;
			return a.priority > b.priority ? 1 : -1;
	};
	ng.Engine = ng.Class.extend({
		game: null,
		entities: [],
		systems: new SortedArray([], compare),
		families: {},
		updating: false,
		init: function(game) {
			this.game = game;
		},
		addEntity: function(entity) {
			if(this.entities[entity.name])
				throw 'The entity name "' + entity.name + '" is already in use by another entity.';
			this.entities[entity.name] = entity;
			entity.componentAdded.add(this._componentAdded, this);
			entity.componentRemoved.add(this._componentRemoved, this);
			for(var key in this.families)
				this.families[key].newEntity(entity);
			for(var key in entity.components) {
				var component = entity.components[key];
				if(component.addedToGame)
					component.addedToGame(this.game);
			}

		},
		removeEntity: function(entity) {
			if(this.entities[entity.name]) {
				entity.componentAdded.remove(this._componentAdded);
				entity.componentRemoved.remove(this._componentRemoved);
				for(var i = 0; i < this.families.length; ++i)
					this.families[i].removeEntity(entity);
				delete this.entities[entity.name];
			}
		},
		clearEntities: function() {
			this.entities = [];
		},
		_componentAdded: function(entity, componentClass) {
			var component = entity.get(componentClass);
			if(component.addedToGame)
				component.addedToGame(this.game);

			for(var key in this.families)
				this.families[key].componentAdded(entity, componentClass);
		},
		_componentRemoved: function(entity, componentClass) {
			for(var key in this.families)
				this.families[key].componentRemoved(entity, componentClass
			);
		},
		addSystem: function(system, priority) {
			system.priority = priority;
			system.engine = this;
			system.addedToEngine(this);
			this.systems.insert(system);
		},
		removeSystem: function(system) {
			this.systems.remove(system);
			system.removedFromEngine(this);
		},
		clearSystems: function() {
			var systems = this.systems;
			this.systems = new SortedArray([], compare);
			for(var i = 0; i < systems.length; ++i) {
				systems[i].removedFromEngine(this)
			}
		},
		/**
			Returns a list with all entites which have the components required by the node class.
		**/
		getEntities: function(nodeClass) {
			if(this.families[nodeClass.className]) return this.families[nodeClass.className].entities;
			var family = this.families[nodeClass.className] = new ng.Family(nodeClass,  this);
			for(var i = 0; i < this.entities.length; ++i)
				family.newEntity(this.entities[i]);
			return family.entities;
		},
		update: function() {
			this.updating = true;
			for(var i = 0; i < this.systems.array.length; ++i) {
				this.systems.array[i].update();
			}
			this.updating = false;
		}
	});
});