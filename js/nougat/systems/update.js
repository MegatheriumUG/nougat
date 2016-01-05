ng.module('nougat.systems.update')
.requires('nougat.system', 'nougat.nodes.update')
.defines(function(){
	ng.Systems.Update = ng.System.extend({
		addedToEngine: function(engine){
			this.engine = engine;
			this.entities = engine.getEntities(ng.Nodes.Update);
		},
		update: function() {
			this.entities = this.engine.getEntities(ng.Nodes.Update);
			for(var i = 0; i < this.entities.length; ++i) {
				this.entities[i].get(ng.Components.Update).update();
			}
		}
	});
});
