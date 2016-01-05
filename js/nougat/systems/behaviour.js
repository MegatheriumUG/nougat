ng.module('nougat.systems.behaviour')
.requires('nougat.system', 'nougat.nodes.behaviour')
.defines(function() {
	ng.Systems.Behaviour = ng.System.extend('nougat.systems.behaviour', {
		addedToEngine: function(engine) {
			this.engine = engine;
			this.entities = engine.getEntities(ng.Nodes.Behaviour);
		},
		update: function() {
			this.entities = this.engine.getEntities(ng.Nodes.Behaviour);
			this.entities.for(function(entity) {
				entity.get(ng.Components.Behaviour).update();
			});
		}
	});
});